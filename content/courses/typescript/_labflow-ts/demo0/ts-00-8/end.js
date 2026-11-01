// Plain JavaScript: when does a booking end, in minutes since 00:00?
function endMinute(startMinute, length) {
  return startMinute + length;
}

console.log(endMinute(480, 120));   // 08:00 + 2 hours
console.log(endMinute('480', 120)); // the start came from a form field: a string
