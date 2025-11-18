export async function sleep(time) {
  return await new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve();
    }, time);
  });
}

/**
 * @template T
 * @param {[T]} array
 */
export function getRandomElement(array) {
  const index = Math.floor(Math.random() * array.length);
  return array[index];
}

/**
 * @template T
 * @param {[T]} array
 */
export function filterDuplicates(array) {
  return [...new Set(array)];
}
