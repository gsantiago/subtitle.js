function repeatString(string: string, times: number) {
  var repeatedString = "";
  while (times > 0) {
    repeatedString += string;
    times--;
  }
  return repeatedString;
}

function padStart(str: string, targetLength: number, padString: string) {
  targetLength = targetLength >> 0; //truncate if number or convert non-number to 0;
  padString = String(typeof padString !== "undefined" ? padString : " ");
  if (str.length > targetLength) {
    return String(str);
  } else {
    targetLength = targetLength - str.length;
    if (targetLength > padString.length) {
      padString += repeatString(padString, targetLength / padString.length); //append to original to ensure we are longer than needed
    }
    return padString.slice(0, targetLength) + String(str);
  }
}
/**
 * @public
 */
export const padLeft = (value: number, length = 2): string =>
  padStart(value.toString(), length, "0");
