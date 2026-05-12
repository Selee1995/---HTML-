const baseUrl = import.meta.env.BASE_URL;

export function withBasePath(path: string) {
  const normalizedBase = baseUrl.endsWith("/") ? baseUrl : `${baseUrl}/`;
  const normalizedPath = path.replace(/^\/+/, "");

  return normalizedPath ? `${normalizedBase}${normalizedPath}` : normalizedBase;
}
