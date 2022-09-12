function dateFirstPartToString(date: Date) {
  const year = date.getFullYear().toString();
  const month = date.getMonth().toString().padStart(2, "0");
  const day = date.getDate().toString().padStart(2, "0");

  return `${year}/${month}/${day}`;
}

function dateSecondPartToString(date: Date) {
  const hours = date.getHours().toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");
  const seconds = date.getSeconds().toString().padStart(2, "0");

  return `${hours}:${minutes}:${seconds}`;
}

function dateFullPartsToString(date: Date) {
  return dateFirstPartToString(date) + " - " + dateSecondPartToString(date);
}

export function timestampToString(timestamp: number) {
  const date = new Date(timestamp);

  return dateFullPartsToString(date);
}

export function timestampIsItTodayToString(timestamp: number) {
  const date = new Date(timestamp);
  const today = new Date();

  const same_day = date.toDateString() === today.toDateString();

  return same_day ? dateSecondPartToString(date) : dateFirstPartToString(date);
}
