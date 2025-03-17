// Helper function to convert 12-hour format time (like '10:45 PM') to a Date object
function convertTo24HourFormat(timeString) {
  const [time, modifier] = timeString.split(" ");
  let [hours, minutes] = time.split(":").map(Number);

  if (modifier === "PM" && hours !== 12) {
    hours += 12; // Convert PM time to 24-hour format
  }

  if (modifier === "AM" && hours === 12) {
    hours = 0; // Handle 12:00 AM as 00:00
  }

  return new Date(new Date().setHours(hours, minutes, 0, 0)); // Set the current date with the calculated time
}

export function calculateTimeLeft(startTime) {
  const contestStartTime = convertTo24HourFormat(startTime);
  const currentTime = new Date(); // Get the current time

  // Calculate the time difference in milliseconds
  const timeLeft = contestStartTime - currentTime;

  return timeLeft;
}

// Function to format the remaining time in hours:minutes:seconds
export function formatTime(ms) {
  const totalSeconds = Math.floor(ms / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return `${hours.toString().padStart(2, "0")}:${minutes
    .toString()
    .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
}
