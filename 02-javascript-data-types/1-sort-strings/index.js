/**
 * sortStrings - sorts array of string by two criteria "asc" or "desc"
 * @param {string[]} arr - the array of strings
 * @param {string} [param="asc"] param - the sorting type "asc" or "desc"
 * @returns {string[]}
 */
export function sortStrings(arr, param = 'asc') {
    const arrClone = arr.slice(0);
    const sortOptions = {sensitivity: 'case', caseFirst: 'upper'};
    const sortLocal = ['ru-RU', 'en-EN'];
    let sortOrder = 1;
    if (param === 'desc') {
        sortOptions.caseFirst = 'lower';
        sortOrder = -1;   
    }
    arrClone.sort((a, b) => a.localeCompare(b, sortLocal, sortOptions)*sortOrder);
    return arrClone;
}

