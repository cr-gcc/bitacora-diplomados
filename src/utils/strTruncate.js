export function truncate(
  text,
  limit = 50,
  { ellipsis = "…", preserveWords = false } = {}
) {
  if (text === null || text === undefined) return "";
  const str = String(text);
  if (str.length <= limit) return str;
  if (!preserveWords) return str.slice(0, limit).trimEnd() + ellipsis;

  const truncated = str.slice(0, limit);
  const lastSpace = truncated.lastIndexOf(" ");
  if (lastSpace === -1) return truncated.trimEnd() + ellipsis;
  return truncated.slice(0, lastSpace).trimEnd() + ellipsis;
}
