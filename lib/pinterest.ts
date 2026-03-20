import "server-only";

const PINTEREST_TIMEOUT_MS = 8000;
const PINTEREST_ENDPOINTS = [
  "https://api.pinterest.com/v5/pins/search",
  "https://api.pinterest.com/v5/search/pins",
];

const clean = (value: string) => value.trim().replace(/\s+/g, " ");

const buildQueryCandidates = (searchKeyword: string): string[] => {
  const primary = clean(searchKeyword);

  if (!primary) {
    return ["outfit fashion"];
  }

  const withoutGender = clean(primary.replace(/\b(men|women)\b/gi, ""));

  return Array.from(
    new Set(
      [primary, `${primary} style`, withoutGender, `${withoutGender} outfit`]
        .map((item) => clean(item))
        .filter(Boolean),
    ),
  );
};

const isRecord = (value: unknown): value is Record<string, unknown> => {
  return typeof value === "object" && value !== null;
};

const readUrlFromImagesObject = (images: unknown): string | undefined => {
  if (!isRecord(images)) {
    return undefined;
  }

  for (const value of Object.values(images)) {
    if (isRecord(value) && typeof value.url === "string" && value.url.length > 0) {
      return value.url;
    }
  }

  return undefined;
};

const extractImageUrl = (pin: unknown): string | undefined => {
  if (!isRecord(pin)) {
    return undefined;
  }

  if (typeof pin.image_original_url === "string" && pin.image_original_url.length > 0) {
    return pin.image_original_url;
  }

  const fromMedia = isRecord(pin.media) ? readUrlFromImagesObject(pin.media.images) : undefined;
  if (fromMedia) {
    return fromMedia;
  }

  const fromImages = readUrlFromImagesObject(pin.images);
  if (fromImages) {
    return fromImages;
  }

  return undefined;
};

const getItems = (payload: unknown): unknown[] => {
  if (!isRecord(payload)) {
    return [];
  }

  if (Array.isArray(payload.items)) {
    return payload.items;
  }

  if (Array.isArray(payload.data)) {
    return payload.data;
  }

  return [];
};

const fetchFromEndpoint = async (
  endpoint: string,
  query: string,
  token: string,
): Promise<string[]> => {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), PINTEREST_TIMEOUT_MS);
  const params = new URLSearchParams({
    query,
    page_size: "10",
  });

  const url = `${endpoint}?${params.toString()}`;

  const response = await fetch(url, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
    },
    cache: "no-store",
    signal: controller.signal,
  }).finally(() => {
    clearTimeout(timeout);
  });

  if (!response.ok) {
    return [];
  }

  const payload = (await response.json()) as unknown;

  return getItems(payload)
    .map(extractImageUrl)
    .filter((imageUrl): imageUrl is string => Boolean(imageUrl));
};

export const fetchPinterestImages = async (
  searchKeyword: string,
  maxImages = 4,
): Promise<string[]> => {
  const token = process.env.PINTEREST_ACCESS_TOKEN;

  if (!token) {
    return [];
  }

  const imageSet = new Set<string>();
  const queries = buildQueryCandidates(searchKeyword);

  for (const query of queries) {
    for (const endpoint of PINTEREST_ENDPOINTS) {
      const images = await fetchFromEndpoint(endpoint, query, token);

      for (const image of images) {
        imageSet.add(image);
      }

      if (imageSet.size >= maxImages) {
        return Array.from(imageSet).slice(0, maxImages);
      }
    }
  }

  return Array.from(imageSet).slice(0, maxImages);
};
