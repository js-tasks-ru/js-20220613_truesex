/**
 * uniq - returns array of uniq values:
 * @param {*[]} arr - the array of primitive values
 * @returns {*[]} - the new array with uniq values
 */
export function uniq(arr) {
    const set = new Set(arr);
    return [...set];
}

console.log(uniq([1, 2, 2, 3, 1, 4])); // [1, 2, 3, 4]
console.log(uniq([]));
console.log(uniq());
