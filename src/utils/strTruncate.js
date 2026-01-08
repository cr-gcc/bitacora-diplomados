export function truncate(
  text,
  limit = 50,
  points = true,
  { ellipsis = "…", preserveWords = false } = {}
) {
  if (text === null || text === undefined) return "";
  const str = String(text);
  if (str.length <= limit) return str;
  if (!preserveWords) {
    if (points) {
      return str.slice(0, limit).trimEnd() + ellipsis;
    }
    else {
      return str.slice(0, limit).trimEnd();
    }
  }

  const truncated = str.slice(0, limit);
  const lastSpace = truncated.lastIndexOf(" ");
  if (lastSpace === -1) {
    if (points) {
      return truncated.trimEnd() + ellipsis;
    }
    else {
      return truncated.trimEnd();
    }
  }
  if (points) {
    return truncated.slice(0, lastSpace).trimEnd() + ellipsis;
  }
  else {
    return truncated.slice(0, lastSpace).trimEnd();
  }
}
