import { createStore } from "vuex";
import process from "./process";
const store = createStore({
  state: () => ({
    userInfo:{
      roles:[], //如果包含demo_personal，开启体验模式，前端部分页面功能UI显示会有所调整（目前部分SP内容不显示，生视频模型目前限制为s2pro,480p）
    },
    token:uni.getStorageSync('aigc_token') || '',
  }),
  mutations: {
    login(state, {token}) {
      state.token = token;
      uni.setStorageSync('aigc_token', token);
    },
    logout(state) {
      state.token = '';
      uni.removeStorageSync('aigc_token');
    },
    SET_USER_INFO(state, userInfo) {
      state.userInfo = userInfo;
    },
  },
  actions: {},
  getters: {
    roles(state) {
      return state.userInfo.roles || [];
    },
    permissions(state) {
      return state.userInfo.permissions || [];
    },
  },
  modules: {
    process,
  },
});

export default store;
