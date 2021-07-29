import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './plugins/element.js'
import axios from 'axios'
import ZkTable from 'vue-table-with-tree-grid'

Vue.config.productionTip = false


Vue.component('tree-table', ZkTable)

axios.defaults.baseURL = 'http://timemeetyou.com:8889/api/private/v1/'
axios.interceptors.request.use(config => {
	config.headers.Authorization = window.sessionStorage.getItem('token');
	return config;
}, error =>{
	return Promise.reject(error);
});
Vue.prototype.$http = axios;

new Vue({
	router,
	store,
	render: h => h(App)
}).$mount('#app');