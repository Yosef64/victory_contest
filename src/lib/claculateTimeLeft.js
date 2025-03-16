export function calculateTimeLeft(startTime, endTime) {
  const today = new Date().toDateString();
  const startDateTime = new Date(`${today} ${startTime}`);
  const endDateTime = new Date(`${today} ${endTime}`);

  if (isNaN(startDateTime) || isNaN(endDateTime)) {
    throw new Error("Invalid time format. Use e.g., '06:30 PM'");
  }

  const diff = endDateTime - startDateTime;
  return Math.max(diff, 0);
}
