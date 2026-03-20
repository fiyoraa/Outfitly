import "server-only";

const PINTEREST_TIMEOUT_MS = 8000;
const PINTEREST_ENDPOINTS = [
  "https://api.pinterest.com/v5/pins/search",
  "https://api.pinterest.com/v5/search/pins",
];

export type PinterestAttempt = {
  endpoint: string;
  query: string;
  status: number | null;
  ok: boolean;
  imageCount: number;
  error?: string;
};

export type PinterestFetchResult = {
  images: string[];
  debug: {
    tokenConfigured: boolean;
    attempts: PinterestAttempt[];
  };
};

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

const truncate = (value: string, length = 220) => {
  if (value.length <= length) {
    return value;
  }

  return `${value.slice(0, length)}...`;
};

const fetchFromEndpoint = async (
  endpoint: string,
  query: string,
  token: string,
): Promise<{ images: string[]; attempt: PinterestAttempt }> => {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), PINTEREST_TIMEOUT_MS);
  const params = new URLSearchParams({
    query,
    page_size: "10",
  });

  const url = `${endpoint}?${params.toString()}`;

  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
      cache: "no-store",
      signal: controller.signal,
    });

    if (!response.ok) {
      const responseText = truncate(await response.text());

      return {
        images: [],
        attempt: {
          endpoint,
          query,
          status: response.status,
          ok: false,
          imageCount: 0,
          error: `HTTP ${response.status}: ${responseText}`,
        },
      };
    }

    const payload = (await response.json()) as unknown;
    const images = getItems(payload)
      .map(extractImageUrl)
      .filter((imageUrl): imageUrl is string => Boolean(imageUrl));

    return {
      images,
      attempt: {
        endpoint,
        query,
        status: response.status,
        ok: true,
        imageCount: images.length,
      },
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown Pinterest fetch error";

    return {
      images: [],
      attempt: {
        endpoint,
        query,
        status: null,
        ok: false,
        imageCount: 0,
        error: message,
      },
    };
  } finally {
    clearTimeout(timeout);
  }
};

export const fetchPinterestImages = async (
  searchKeyword: string,
  maxImages = 4,
): Promise<PinterestFetchResult> => {
  const token = process.env.PINTEREST_ACCESS_TOKEN;
  const attempts: PinterestAttempt[] = [];

  if (!token) {
    return {
      images: [],
      debug: {
        tokenConfigured: false,
        attempts,
      },
    };
  }

  const imageSet = new Set<string>();
  const queries = buildQueryCandidates(searchKeyword);

  for (const query of queries) {
    for (const endpoint of PINTEREST_ENDPOINTS) {
      const { images, attempt } = await fetchFromEndpoint(endpoint, query, token);
      attempts.push(attempt);

      for (const image of images) {
        imageSet.add(image);
      }

      if (imageSet.size >= maxImages) {
        return {
          images: Array.from(imageSet).slice(0, maxImages),
          debug: {
            tokenConfigured: true,
            attempts,
          },
        };
      }
    }
  }

  if (imageSet.size === 0) {
    console.error("[Pinterest] No images returned", {
      searchKeyword,
      attempts,
    });
  }

  return {
    images: Array.from(imageSet).slice(0, maxImages),
    debug: {
      tokenConfigured: true,
      attempts,
    },
  };
};
