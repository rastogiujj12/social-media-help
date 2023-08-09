const state = {
    // isSidebarOpen: false, 
    // navbarTitle: '',
    isLoading:false,
    // view1progress:100,
    // view2progress:100,
    // view3progress:100,
    // view4progress:100,
}

const getters = {
    // isSidebarOpen(state) {
    //     return state.isSidebarOpen; 
    // },

    // navbarTitle(state) {
    //     return state.navbarTitle; 
    // }, 
    isLoading(state){
        return state.isLoading;
    },
    // view1progress(state){
    //     return state.view1progress;
    // },
    // view2progress(state){
    //     return state.view2progress;
    // },
    // view3progress(state){
    //     return state.view3progress;
    // },
    // view4progress(state){
    //     return state.view4progress;
    // },
}


const mutations = {
    // toggleSidebar(state) {
    //     state.isSidebarOpen = !state.isSidebarOpen; 
    // },

    // changeTitle(state, title) {
    //     state.navbarTitle = title; 
    // },
    setIsLoading(state, value){
        state.isLoading = value;
    },
    // setView1Progress(state, progress){
    //     state.view1progress = progress;
    // },
    // setView2Progress(state, progress){
    //     state.view2progress = progress;
    // },
    // setView3Progress(state, progress){
    //     state.view3progress = progress;
    // },
    // setView4Progress(state, progress){
    //     state.view4progress = progress;
    // }
}
const actions = {
    // toggleSidebar({ commit }) {
    //     commit('toggleSidebar')
    // },

    // changeTitle({ commit }, title ){
    //     commit('changeTitle', title)
    // },
    setIsLoading({commit}, {value}){
        commit('setIsLoading', value)
    },
    // setView1Progress({commit}, progress){
    //     commit("setView1Progress", progress)
    // },
    // setView2Progress({commit}, progress){
    //     commit("setView2Progress", progress)
    // },
    // setView3Progress({commit}, progress){
    //     commit("setView3Progress", progress)
    // },
    // setView4Progress({commit}, progress){
    //     commit("setView4Progress", progress)
    // }
}

export default {
    state, 
    getters, 
    mutations, 
    actions, 
}