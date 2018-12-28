import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    title: {
      id: '',
      value: ''
    },
    content: {
      id: '',
      value: ''
    },
    img: {
      id: '',
      value: ''
    },
    token: '',
    keyWords: false,
    ticket: {}
  },
  mutations: {
    'CHANGE_TITLE'(state, payload) {
      state.title = payload
    },
    'CHANGE_CONTENT'(state, payload) {
      state.content = payload
    },
    'CHANGE_IMG'(state, payload) {
      state.img = payload
    },
    'SAVE_TOKEN'(state, payload) {
      state.token = payload
    },
    'KEY_WORDS'(state, payload) {
      state.keyWords = payload
    },
    'SAVE_TICKED'(state, payload) {
      state.ticket = payload
    }

  },
  actions: {}
})

export default store
