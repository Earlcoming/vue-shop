import Vue from 'vue'
import VueRouter from 'vue-router'
// import login from '../views/login.vue'
const login = () => import (/* webpackChunkName: 'login_welcome' */ '../views/login.vue')
const Home = () => import (/* webpackChunkName: 'login_welcome' */ '../views/home.vue')
const Welcome = () => import (/* webpackChunkName: 'login_welcome' */ '../components/welcome.vue')
// import Home from '../views/home.vue'
// import Welcome from '../components/welcome.vue'

const users = () => import (/* webpackChunkName: 'users_rights_roles' */ '../components/user.vue')
const rights = () => import (/* webpackChunkName: 'users_rights_roles' */ '../components/rights.vue')
const roles = () => import (/* webpackChunkName: 'users_rights_roles' */ '../components/roles.vue')

// import users from '../components/user.vue'
// import rights from '../components/rights.vue'
// import roles from '../components/roles.vue'

const goods = () => import (/* webpackChunkName: 'goods' */ '../components/goods.vue')
const categories = () => import (/* webpackChunkName: 'goods' */ '../components/categories.vue')
const params = () => import (/* webpackChunkName: 'goods' */ '../components/params.vue')
const add = () => import (/* webpackChunkName: 'goods' */ '../components/add.vue')

// import goods from '../components/goods.vue'
// import categories from '../components/categories.vue'
// import params from '../components/params.vue'
// import add from '../components/add.vue'
Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
    redirect: '/Welcome' ,
    children: [
      { path: '/Welcome', name: 'Welcome', component: Welcome},
      { path: '/users', name: 'users', component: users},
      { path: '/rights', name: 'rights', component: rights},
      { path: '/roles', name: 'roles', component: roles},
      { path: '/goods', name: 'goods', component: goods},
      { path: '/goods/add', name: 'add', component: add},
      { path: '/categories', name: 'categories', component: categories},
      { path: '/params', name: 'params', component: params},
    ]
  },
  {
    path: '/login',
    name: 'login',
    component: login
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
