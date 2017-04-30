const cache = {
  getValue(key) {
    return localStorage.getItem(key);
  },
  setValue(key, value) {
    return localStorage.setItem(key, value);
  },
  clear() {
    localStorage.clear();
  }
};

export default cache;
