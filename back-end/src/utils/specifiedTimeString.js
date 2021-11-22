function specifiedTimeString(hour, minute) {
    let adjustedHour = `${hour}`,
      adjustedMinute = `${minute}`;
    if (hour < 10) adjustedHour = "0" + adjustedHour;
    if (minute < 10) adjustedMinute = "0" + adjustedMinute;
    return `${adjustedHour}:${adjustedMinute}`;
  }
  
  module.exports = specifiedTimeString;