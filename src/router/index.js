import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../views/login.vue'
import Home from '../views/home.vue'
import Welcome from '../components/welcome.vue'
import Users from '../components/user.vue'
import Rights from '../components/rights.vue'
import Roles from '../components/roles.vue'
Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
    redirect: '/Welcome' ,
    children: [
      { path: '/Welcome', name: 'Welcome', component: Welcome},
      { path: '/users', name: 'users', component: Users},
      { path: '/rights', name: 'rights', component: Rights},
      { path: '/roles', name: 'roles', component: Roles},
    ]
  },
  {
    path: '/login',
    name: 'login',
    component: Login
  },
  
  
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
	if(!t) return next({name: 'login'});
	next();
})

export default router
