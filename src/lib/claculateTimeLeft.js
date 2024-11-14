export function calculateTimeLeft(startTime, endTime) {
  const now = new Date(startTime);
  const target = new Date(endTime);
  const diff = target - now;
  return Math.max(diff); // Ensure it doesn't go negative
}
