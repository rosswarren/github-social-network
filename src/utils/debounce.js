export default function debounce(func, wait) {
  let timeout;
  return (...args) => {
    function later() {
      timeout = null;
      func(...args);
    }
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}
