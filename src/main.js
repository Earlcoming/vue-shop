import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './plugins/element.js'
import axios from 'axios'

Vue.config.productionTip = false

axios.defaults.baseURL = 'http://timemeetyou.com:8889/api/private/v1/'
axios.interceptors.request.use(config => {
	config.headers.Authorization = window.sessionStorage.getItem('token');
	return config;
}, error =>{
	return Promise.reject(error);
});
Vue.prototype.$http = axios;

axios.get('users', {
	pagenum: 1,
	pagesize: 10
}).then(data => {
	console.log(data);
});

new Vue({
	router,
	store,
	render: h => h(App)
}).$mount('#app');