/**
 * createGetter - creates function getter which allows select value from object
 * @param {string} path - the strings path separated by dot
 * @returns {function} - function-getter which allow get value from object by set path
 */
export function createGetter(path) {
  const arr = path.split('.');
  return (obj) => {
    let res = obj;
    arr.every(value => {
      try {
        res = res[value];
        console.log(`${value} ${res}`);
      } catch (error) {
        res = undefined; //может к примитивному типу обратиться по свойству
      }
      return res !== undefined;
    });
    return res;
  }
}
/*
const product = {
  category: {
    title: "Goods"
  }
}

const getter = createGetter('category.title');

console.log('' + getter(product) + ' ' + product); // Goods*/
