/**
 * listeningTasks 监听任务队列 {type: {pointer, items:[]}}
 * items 监听任务队列项目 {data, extract} data是任务状态数据，extract是页面组件的数据
 */

export default {
  namespaced: true,
  state: () => ({
    listeningTasks: {
      image: {
        pointer:null,
      },
    },
    listenerPointers: {}, // 存放一些杂七杂八如window.addEventListener的指针

  }),
  mutations: {
    REGISTER_TIMER(state,{tagName,interval,extract}){
        state.listeningTasks[tagName] = {
          pointer:interval,
          extract:extract||{},
        }
    },
    CLEAR_TIMER(state,{tagName}){
        clearInterval(state.listeningTasks[tagName].pointer)
    },
    REGISTER_LISTENER(state,{tagName,type,pointer}){
        state.listenerPointers[tagName] = {
          pointer,
          type
        }
    },
    CLEAR_LISTENER(state,{tagName}){
        delete state.listenerPointers[tagName]
    },
  },
  actions: {
  },
  getters: {
  }
};
