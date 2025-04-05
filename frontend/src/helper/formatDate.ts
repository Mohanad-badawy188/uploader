let options = {};
export const formatDate = (
  date: Date | string,
  NoHours = false,
  onlyHours = false
) => {
  const time = new Date(date);
  if (NoHours) {
    options = {
      year: "numeric",
      month: "short",
      day: "numeric",
    };
  } else {
    if (onlyHours) {
      options = {
        hour: "numeric",
        minute: "numeric",
        // second: "numeric",
        hour12: true,
      };
    } else {
      options = {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "numeric",
        minute: "numeric",
        // second: "numeric",
        hour12: true,
      };
    }
  }

  return new Intl.DateTimeFormat("en-GB", options).format(time);
};
