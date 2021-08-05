# vue-shop

## 项目预览 [预览](http://211.149.185.82:805/)
### 后端API  [下载](https://gitee.com/wBekvam/vueShop-api-server.git).  [接口API](./api接口文档.md)

### 功能
> 用于电商项目后台用户账户，商品分类、参数、商品添加、订单信息、数据统计等

### 技术栈
- Vue
- Vue-Router
- Element-ui
- Axios
- Echarts

### 项目概述

#### 登录业务流程

1. 登录页面输入用户名和密码
2. 调用登录接口验证用户名和密码
3. 返回数据，拿到返回的token保存并跳转到主页

##### 登录业务相关技术点

1. 通过sesion在服务端端记录状态值
2. 再通过token在客户端保存状态值(不允许跨域使用)
3. 路由守卫
	> 如果用户没有登录，但是直接通过url连接访问页面，需要重新进入登录进行登录
	
#### 主页

##### 通过接口获取菜单数据
> 通过axios请求拦截器添加token，保证登录用户的权限
	```js
	axios.interceptors.request.use( config => {
		config.headers.Authorization  = window.sessionStorage.getItem
		('token');
		return config;
	})
	```

#### 用户管理

##### 用户权限管理

> 通过用户权限的分配，来控制不同用户拥有不同的权限

#### 商品分类管理

> 用户商品在购物时，进行快速的查找


### 项目依赖
1. 开发依赖
- axios 发送请求
- echarts 图表
- element-ui  element-ui组件
- lodash js工具库
- vue-table-width-grid 树形菜单
- vue-qull-editor 富文本编辑器

2. 生产依赖
- babel  es6语法转换
- lass/lass-loader lass语法
- babel-plugin-transform-remove-console => 移除console插件


### 项目优化

- **为开发模式和生产模式配置不同的打包入口文件**

> 在vue.config.js中创建chainWebpack节点来为不同的模块分配不同的入口文件

```js
module.exports = {
	chainWebpack: config => {
		config.when(process.env.NODE_ENV == 'production', config => {
			config.entry('app').clear().add('./scr/main-prod.js')
		});
		config.when(process.env.NODE_ENV == 'development', config => {
			config.entry('app').clear().add('./scr/main-dev.js')
		});
	}
}
```


- **使用第三方CDN**
> 通过externals 忽略需要打包的资源，替换成第三方CDN
1.步骤1  在vue.config.js中添加externals
```js
module.exports = {
    chainWebpack: config => {
        config.when(process.env.NODE_ENV === 'production', config => {
            config.entry('app').clear().add('./src/main-prod.js')
            // 在vue.config.js如下配置
            config.set('externals', {
                vue: 'Vue',
                'vue-router': 'VueRouter',
                axios: 'axios',
                lodash: '_',
                echarts: 'echarts',
                'vue-quill-editor': 'VueQuillEditor'
            })
        })
        config.when(process.env.NODE_ENV === 'development', config => {
            config.entry('app').clear().add('./src/main-dev.js')
        })
    }
}
```

2. 步骤2 在publuc/index.html文件头部添加cdn

```js
 <script src="https://cdn.bootcss.com/vue/2.6.10/vue.min.js"></script>
//  cdn等等
```

- ** 路由懒加载 **
