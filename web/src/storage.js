const STORAGE_KEY='ltr'
export default {
  get: function (STORAGEKEY) {
    return JSON.parse(window.localStorage.getItem(STORAGE_KEY) || '')
  },
  set: function (data) {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
  }
}
