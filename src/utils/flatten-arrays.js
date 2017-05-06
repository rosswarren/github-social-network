export default function flattenArrays(arrays) {
  return arrays.reduce((a, b) => a.concat(b));
}
