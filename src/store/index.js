import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)
import request from '@/utils/request'

export default new Vuex.Store({
  state: {
    userId: '',
    userData: {}
  },
  mutations: {
    Set_userID(state, userId) {
      window.sessionStorage.setItem('userId', userId)
      state.userId = userId
    },
    Set_userData(state, userData) {
      state.userData = userData
    }
  },
  actions: {
    setUserId({ commit }, payload) {
      if (!payload) {
        payload = window.sessionStorage.getItem('userId')
        commit('Set_userID', payload)
      }
      return request({
        url: '/getUserInfo',
        method: 'post',
        data: {
          userId: payload
        }
      }).then(res => {
        commit('Set_userData', res.data)
      })
    },
  },
  modules: {
  }
})
