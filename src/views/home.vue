<template>
    <el-container class="home-container">
        <!-- 头部 -->
        <el-header class="home-header">
            <div class="logo">电商后台管理</div>
            <el-button type="info" @click="logout">退出登录</el-button>
        </el-header>
        <el-container>
            <!-- 侧边 -->
            <el-aside width="200px">
                <el-col>
                    <el-menu
                        class="el-menu-vertical-demo"
                        @open="handleOpen"
                        @close="handleClose"
                        background-color="#333744"
                        text-color="#fff"
                        active-text-color="#409eff"
                    >
                        <el-submenu v-for="item in menuList" :key="item.id" :index="item.id + ''">
                            <template slot="title">
                                <i class="el-icon-location"></i>
                                <span>{{item.authName}}</span>
                            </template>
							<el-menu-item index="1-1" v-for="itemChild in item.children" :key="itemChild.id">{{itemChild.authName}}</el-menu-item>
                        </el-submenu>
						
                    </el-menu>
                </el-col>
            </el-aside>
            <!-- 主体 -->
            <el-main>Main</el-main>
        </el-container>
    </el-container>
</template>

<script>
export default {
	data () {
		return {
			// 左侧菜单数据
			menuList: ''
		}
	},
    methods: {
        logout() {
            window.sessionStorage.clear("token");
            this.$router.push({ name: "login" });
        },
        handleOpen(key, keyPath) {
            console.log(key, keyPath);
        },
        handleClose(key, keyPath) {
            console.log(key, keyPath);
        },
		async getMenuList() {
			const {data: res} = await this.$http.get('menus');
			console.log(res.data)
			if(res.meta.status !== 200) return this.$msg.error(res.meta.msg);
			this.menuList = res.data
		},
    },
	created() {
		this.getMenuList();
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
	.el-main
		background-color: #eaedf1
</style>