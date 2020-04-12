import Vue from 'vue'
import Vuex from 'vuex'
import { setToken,removeAll,setLocalUserInfo,getLocalUserInfo,getToken } from '../utils/auth'
import Api from '../api'

Vue.use(Vuex)

const store = new Vuex.Store({
    state:{
        userInfo:'',
        token:'',
        webSocket:{
            rid:'',
            socket:''
        }
    },
    getters:{
        foo(state){
            return "￥" + state.token 
        }
        //调用方式store.getters.foo
        // `拼接${state.xx}字符`
    },
    mutations:{
        setUserInfo(state,v){
            state.userInfo = v
        },
        setStateToken(state,v){
            state.token = v
        },
        setWebSocket(state,v){
            state.webSocket = v
        }
    },
    actions:{
        foo({commit},e){
            commit("foo",e)
        },
        init({commit}){
            return new Promise((resolve) => {
                commit('setStateToken',getToken())
                commit('setUserInfo',JSON.parse(getLocalUserInfo()))
                resolve()
            })
        },
        login({commit},e){
            return new Promise((resolve,reject) => {
                Api.login(e.account,e.password).then((res)=>{
                    let ret = res.data;
                    commit('setStateToken',ret.data.token)
                    commit('setUserInfo',ret.data.user)
                    setToken(ret.data.token)
                    setLocalUserInfo(JSON.stringify(ret.data.user))
                    resolve()
                }).catch(error=>{
                    reject(error)
                })
            })
        },
        logout({commit}){
            return new Promise(resolve => {
                commit('setStateToken',null)
                commit('setUserInfo',null)
                removeAll()
                resolve()
            })
        },
        register({commit},e){
            return new Promise((resolve,reject)=>{
                Api.register(e).then(()=>{
                    commit('')
                }).catch(error=>{
                    reject(error)
                })
                resolve()
            })
        },
        sendCode({commit},account){
            return new Promise((resolve,reject)=>{
                Api.sendCode(account).then(()=>{
                    commit('')
                }).catch(error=>{
                    reject(error)
                })
                resolve()
            })
        }
    }

})

export default store