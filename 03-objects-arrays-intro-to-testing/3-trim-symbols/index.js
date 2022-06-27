/**
 * trimSymbols - removes consecutive identical symbols if they quantity bigger that size
 * @param {string} string - the initial string
 * @param {number} size - the allowed size of consecutive identical symbols
 * @returns {string} - the new string without extra symbols according passed size
 */
export function trimSymbols(string, size) {

  const arr = [...string];
  let curSymbol = '';
  let curMatches = 1;

  arr.forEach((value, id, arr) => {
    if (curSymbol === value) {
      curMatches += 1;
    } else {
      curMatches = 1;
      curSymbol = value;
    }
    if (size < curMatches) {
      arr[id] = '';
    }
  });

  return arr.join('');

}
