import VueCookies from 'vue-cookie'

const index = {
  //写cookies
  setCookie: function (name, value) {
    let days = 7
    VueCookies.set(name, value, {expires: days})
  },
  //读取cookies
  readCookie: function (name) {
    return VueCookies.get(name)
  },
  //删除cookies
  delCookie: function (name) {
    let value = ''
    VueCookies.set(name, value, {expires: -1})
  }
}

export default index
