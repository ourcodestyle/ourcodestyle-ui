const WindowLocalStorage = window.localStorage

const Storage = {
  namespace: "ourcodestyle",

  get(key) {
    return WindowLocalStorage.getItem(this.buildKey(key))
  },

  set(key, value) {
    WindowLocalStorage.setItem(this.buildKey(key), value)
  },

  remove(key) {
    WindowLocalStorage.removeItem(this.buildKey(key))
  },

  getObject(key) {
    return JSON.parse(this.get(key))
  },

  setObject(key, value) {
    this.set(key, JSON.stringify(value))
  },

  deleteObject(key) {
    this.remove(key)
  },

  buildKey(key) {
    return this.namespace + '.' + key
  }

}

export default Storage