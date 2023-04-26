export const formatDateTimeDisplay = (dateTime: Date) => {
  const year = String(dateTime.getFullYear());
  const month = String(dateTime.getMonth() + 1).padStart(2, "0");
  const date = String(dateTime.getDate()).padStart(2, "0");
  const hour = String(dateTime.getHours()).padStart(2, "0");
  const minute = String(dateTime.getMinutes()).padStart(2, "0");
  return `${year}-${month}-${date} ${hour}:${minute}`;
};

export const formatDateTimeInput = (dateTime: Date) => {
  const year = String(dateTime.getFullYear());
  const month = String(dateTime.getMonth() + 1).padStart(2, "0");
  const date = String(dateTime.getDate()).padStart(2, "0");
  const hour = String(dateTime.getHours()).padStart(2, "0");
  const minute = String(dateTime.getMinutes()).padStart(2, "0");
  return `${year}-${month}-${date}T${hour}:${minute}`;
};

export const formatDateTimeStore = (dateTimeString: string) => {
  return `${dateTimeString}:00+09:00`;
};
