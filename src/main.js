import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './plugins/element.js'
import axios from 'axios'

Vue.config.productionTip = false

axios.defaults.baseURL = 'https://test.qhhz.xyz:8888/api/private/v1/'
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