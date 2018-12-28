import Loading from '@/components/isloading'

const loading = {
  install(Vue) {
    if (typeof window !== 'undefined' && window.Vue) {
      Vue = window.Vue
    }
    Vue.component('Loading', Loading)


  }
}
