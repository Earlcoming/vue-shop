<template>
    <el-container class="home-container">
        <!-- 头部 -->
        <el-header class="home-header">
            <div class="logo">电商后台管理</div>
            <el-button type="info" @click="logout">退出登录</el-button>
        </el-header>
        <el-container>
            <!-- 侧边 -->
            <el-aside :width="isMenu ? '64px' : '200px'">
				<div class="toggle-button" @click="isCollapse">|||</div>
                <el-col>
                    <el-menu
                        class="el-menu-home"
                        background-color="#333744"
                        text-color="#fff"
                        active-text-color="#409eff"
                        unique-opened
						:collapse="isMenu"
						:collapse-transition="false"
						router
						:default-active="navStatus"
                    >
					<!-- 
						router 开启路由模式，点击子类跳转到对应的index值，设置index值即可
						collapse-transition 是否开启折叠动画
						unique-opened 是否只保持一个子菜单的展开
						 -->
						 <!-- 二级菜单 -->
                        <el-submenu v-for="item in menuList" :key="item.id" :index="'/' + item.path" >
                            <template slot="title">
                                <i :class="iconObj[item.id]"></i>
                                <span>{{item.authName}}</span>
                            </template>
							<el-menu-item :index="'/' + itemChild.path" v-for="itemChild in item.children" :key="itemChild.id" @click="saveNavStatue('/' + itemChild.path)">
                                <i class="el-icon-menu"></i>{{itemChild.authName}}</el-menu-item>
                        </el-submenu>
						
                    </el-menu>
                </el-col>
            </el-aside>
            <!-- 主体 -->
            <el-main>
				<router-view></router-view>
			</el-main>
        </el-container>
    </el-container>
</template>

<script>
export default {
	data () {
		return {
			// 左侧菜单数据
			menuList: '',
            iconObj: {
                '125' : 'el-icon-s-custom',
                '103' : 'el-icon-s-tools',
                '101' : 'el-icon-s-goods',
                '102' : 'el-icon-s-order',
                '145' : 'el-icon-s-data',
            },
			isMenu: false,
			navStatus: ''
		}
	},
    methods: {
        logout() {
            window.sessionStorage.clear("token");
            this.$router.push({ name: "login" });
        },
        
		async getMenuList() {
			const {data: res} = await this.$http.get('menus');
            // console.log(res);
			if(res.meta.status !== 200) return this.$msg.error(res.meta.msg);
			this.menuList = res.data;
		},
		isCollapse (){
			this.isMenu = !this.isMenu;
		},
		// 保存激活链接的状态
		saveNavStatue(active){
			this.navStatus = active;
			window.sessionStorage.setItem('navStatus' , this.navStatus);
		},
    },
	created() {
		this.getMenuList();
		this.navStatus = window.sessionStorage.getItem('navStatus')
	},

};
</script>

<style lang="sass">
.home-container
	height: 100%
	.el-header
		background-color: #373d41
		color: #fff
		&.home-header
			display: flex
			justify-content: space-between
			align-items: center
			padding: 0 15px
	.el-aside
		background-color: #333744
		color: #fff
		.el-menu
			border-right: none
		.toggle-button
			background-color: #484e60
			padding: 5px 0
			letter-spacing: 0.2em
			text-align: center
			cursor: pointer
			font-size: 14px
	.el-main
		background-color: #eaedf1
.el-breadcrumb
	margin-bottom: 20px
	font-size: 13px

</style>