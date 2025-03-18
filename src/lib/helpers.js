export function getTimeRemaining(endTime, start_time) {
  const now = new Date();
  const startTime = parseTime(start_time, now);
  const endTimeDate = parseTime(endTime, now);

  if (now < startTime) return "Not Started";
  if (now >= endTimeDate) return "00:00:00"; // Time over

  const total = endTimeDate - now;
  const hours = Math.floor(total / 1000 / 60 / 60);
  const minutes = Math.floor((total / 1000 / 60) % 60);
  const seconds = Math.floor((total / 1000) % 60);

  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(
    2,
    "0"
  )}:${String(seconds).padStart(2, "0")}`;
}

export function parseTime(timeStr, baseDate) {
  const [time, modifier] = timeStr.split(" ");
  let [hours, minutes] = time.split(":").map(Number);

  if (modifier === "PM" && hours !== 12) hours += 12;
  if (modifier === "AM" && hours === 12) hours = 0;

  const targetDate = new Date(baseDate);
  targetDate.setHours(hours, minutes, 0, 0);

  return targetDate;
}
