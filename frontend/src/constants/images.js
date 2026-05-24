/** Curated Unsplash imagery — real estate, architecture, interiors */

const u = (id, w = 1200) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=80`;

export const images = {
  hero: u("photo-1600596542815-ffad4c1539a9", 1920),
  listingsHero: u("photo-1600585154526-990dced4db0d", 1920),
  contactHero: u("photo-1600607687939-ce8a6c25118c", 1920),
  auth: u("photo-1600585154340-be6161a56a0c", 1400),
  contact: u("photo-1600607687939-ce8a6c25118c", 900),

  defaultProperty: u("photo-1600596542815-ffad4c1539a9", 800),

  byCategory: {
    HOUSE: u("photo-1600585154526-990dced4db0d", 800),
    APARTMENT: u("photo-1502672260266-1c1ef2d93688", 800),
    VILLA: u("photo-1613490490903-4f7f7e8b8b0e", 800),
    LAND: u("photo-1500382017468-90403ded9475", 800),
    COMMERCIAL: u("photo-1486406146926-c627a92ad1ab", 800),
    OTHER: u("photo-1600047509807-ba8f99d2cd12", 800),
  },

  perfectHouse: u("photo-1600607687643-c7171b42498f", 900),
  neighborhoods: [
    u("photo-1600585154340-be6161a56a0c", 600),
    u("photo-1600566753190-17f0baa4224a", 600),
    u("photo-1600573472592-401b3bdee9b1", 600),
    u("photo-1600047509438-309f581a168f", 600),
  ],
  agents: [
    u("photo-1560250097-0b93528c311a", 400),
    u("photo-1573496359142-b8d87734a5a2", 400),
    u("photo-1472099645785-5658abf4ff4e", 400),
    u("photo-1580489944761-15a19d654956", 400),
  ],
  articles: [
    u("photo-1560518883-ce09059eeffa", 600),
    u("photo-1600585154526-990dced4db0d", 600),
    u("photo-1600047509807-ba8f99d2cd12", 600),
  ],
};

function withCacheBust(url, token) {
  if (!url || !token) return url;
  const sep = url.includes("?") ? "&" : "?";
  return `${url}${sep}v=${encodeURIComponent(String(token))}`;
}

/** Primary listing photo URL — includes a version token so the browser shows updates immediately. */
export function propertyImage(property) {
  const primary =
    property?.images?.find((i) => i.isPrimary) ?? property?.images?.[0];
  const fromDb = primary?.url;
  if (fromDb) {
    const token = primary.id ?? property?.updatedAt ?? primary.url;
    return withCacheBust(fromDb, token);
  }
  return images.byCategory[property?.category] ?? images.defaultProperty;
}

export function propertyImageKey(property) {
  const primary =
    property?.images?.find((i) => i.isPrimary) ?? property?.images?.[0];
  return primary?.id ?? property?.updatedAt ?? property?.id ?? "none";
}

export function propertyImageFallback(property) {
  return images.byCategory[property?.category] ?? images.defaultProperty;
}
