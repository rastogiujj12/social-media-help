import AxiosService from '../../../Services/AxiosService'
import { ToastProgrammatic as Toast } from 'buefy'

import router from '../../../router';
const state = {
    authToken: null, // Store this in LocalStorage
    userId: null,
    userData:null,
};

const getters = {
    isAuthenticated(state) {
        return !!state.authToken;
    },
    userData(state) {
        return state.userData;
    }
}

const mutations = {
    setAuth(state, token) {
        state.authToken = token;
        // console.log("auth token set", state.authToken);
        // state.userId = userData.userId;
    },

    clearAuth(state) {
        state.authToken = null;
        state.userId = null;
        state.userData = null;
    },

    setUser(state, userData) {
        state.userData = userData
    },
    updateUser(state, userData) {
        for (let prop in userData) {
            state.userData[prop] = userData[prop]
        }
    }

};

const actions = {
    // signup({ dispatch }, authData) {
    //     AxiosService.post('/signup', authData).then(({ id, error, msg }) => {
    //         if (!error) {
    //             router.replace('/login')
    //             dispatch('login', { email: authData.email, password: authData.password })
    //             Toast.open({
    //                 duration: 5000,
    //                 message: 'Account created successfully',
    //                 type: 'is-success'
    //             })
    //         }
    //         else if (error) {
    //             Toast.open({
    //                 duration: 5000,
    //                 message: msg,
    //                 type: 'is-danger'
    //             })
    //         }
    //     })
    // },

    login({ commit, dispatch }, { email, password }) {
        dispatch('setIsLoading',{value:true})
        AxiosService.post('/login', { email, password }).then(({ token, userData, error }) => {
            dispatch('setIsLoading',{value:false})
            if (token) {
                //do something
                localStorage.setItem("Authorization", token);
                console.log("token", token)
                commit('setAuth', token)
                commit('setUser', userData)
                AxiosService.updateAuthHeaders(token);

                // dispatch("getUser");
                // router.go()
                // dispatch('autoLogin')
            }
            else {
                Toast.open({
                    duration: 2000,
                    message: 'Invalid email or password',
                    type: 'is-danger'
                })
            }
        });
    },
    logout({ commit }) {
        commit('clearAuth')
        AxiosService.updateAuthHeaders('')
        localStorage.removeItem('Authorization')
        localStorage.removeItem('expiresAt')

        router.go() // or push ??
    },

    autoLogin({ commit, dispatch }) {
        return new Promise(async (resolve, reject) => {
            
            let token = localStorage.getItem("Authorization");
            console.log("called autologin", token)
            AxiosService.updateAuthHeaders(token);
            // let token = chrome.storage.sync.get(['Authorization']);

            if (token) {
                let user = await AxiosService.get('/autoLogin');
                if(user.login){
                    commit("setAuth", token);
                    localStorage.setItem("Authorization", token);
                    // chrome.storage.sync.set({Authorization: token});
                    dispatch("getUser");
                    // console.log("router", router);
                    // router.replace('/dashboard')
                    return resolve({ login: true });
                }
                else{
                    // dispatch("logout");
                    return resolve({ login: false });
                }
            } else {
                // dispatch("logout");
                return resolve({ login: false });
            }
        });
    },

    getUser({
        commit,
        rootState: {
            Auth: { authToken },
        },
    }) {
        // console.log("get user", authToken);
        if (authToken) {
            AxiosService.get('/getUser').then((data) => {
                if (!data.user) {
                    localStorage.removeItem("Authorization");
                    // router.push("/login");
                } else commit("setUser", data.user);
            });
        }
    },


    updateUser({ commit, rootState: { Auth: { userId } } }, { userObj }) {
        if (userId) {
            AuthService.updateUser(userId, userObj).then(({ updateUser, error, data }) => {
                if (error) {
                    console.log(error);
                    Toast.open({
                        duration: 2000,
                        message: 'Some error occured, Please try again',
                        type: 'is-danger'
                    })
                } else {
                    commit('updateUser', updateUser)
                    Toast.open({
                        duration: 2000,
                        message: 'Values Updated',
                        type: 'is-success'
                    })
                }
            })
        }
    },

    getSignedUrl({ commit }, { uploadType }) {
        return new Promise((resolve, reject) => {
            AuthService.getSignedUrl(uploadType).then(({ getPresignedURL }) => {
                if (getPresignedURL) return resolve(getPresignedURL);
            })
        });
    }


};

export default {
    state,
    getters,
    mutations,
    actions,
};
