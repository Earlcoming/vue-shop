import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../views/login.vue'
import Home from '../views/home.vue'
Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/login',
    name: 'login',
    component: Login
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

// 路由守卫
router.beforeEach( (to, from, next) => {

	if(to.path === '/login') return next();
	const t = window.sessionStorage.getItem('token');
	console.log(t);
	if(!t) return next({name: 'login'});
	next();
})

export default router
