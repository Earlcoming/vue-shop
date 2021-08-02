import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './plugins/element.js'
import axios from 'axios'
// tree- gird
import ZkTable from 'vue-table-with-tree-grid'

// 富文本编辑器
import VueQuillEditor from 'vue-quill-editor'
import 'quill/dist/quill.core.css' // import styles
import 'quill/dist/quill.snow.css' // for snow theme
import 'quill/dist/quill.bubble.css' // for bubble theme



Vue.use(VueQuillEditor, /* { default global options } */)

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

Vue.filter('dataFormat', originVal => {
	const dt = new Date(originVal);
	const Y = dt.getFullYear();
	const M = (dt.getMonth() + 1 + '').padStart(2, '0');
	const D = (dt.getDate() + '').padStart(2, '0');

	const hh = (dt.getHours() + '').padStart(2, '0');
	const mm = (dt.getMinutes() + '').padStart(2, '0');
	const ss = (dt.getSeconds() + '').padStart(2, '0');
	return `${Y}-${M}-${D} ${hh}:${mm}:${ss}`;
})

new Vue({
	router,
	store,
	render: h => h(App)
}).$mount('#app');