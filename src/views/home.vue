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
                <el-col :span="12">
                    <h5>自定义颜色</h5>
                    <el-menu
                        class="el-menu-vertical-demo"
                        @open="handleOpen"
                        @close="handleClose"
                        background-color="#333744"
                        text-color="#fff"
                        active-text-color="#409eff"
                    >
                        <el-submenu index="1">
                            <template slot="title">
                                <i class="el-icon-location"></i>
                                <span>导航一</span>
                            </template>
							<el-menu-item index="1-1">选项1</el-menu-item>
							<el-menu-item index="1-2">选项2</el-menu-item>
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