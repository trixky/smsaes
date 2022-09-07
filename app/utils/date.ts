export function timestampToString(timestamp: number) {
  const date = new Date(timestamp);

  const hours = date.getHours().toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");
  const seconds = date.getSeconds().toString().padStart(2, "0");

  const year = date.getFullYear().toString();
  const month = date.getMonth().toString().padStart(2, "0");
  const day = date.getDay().toString().padStart(2, "0");

  return `${year}/${month}/${day} - ${hours}:${minutes}:${seconds}`;
}
