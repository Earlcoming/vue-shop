<template>
    <div class="login_container">
        <div class="login_content">
            <div class="login_achor">
                <img src="../assets/logo.png" alt="" />
            </div>
            <div class="login_con">
                <el-form :model="loginForm" ref="loginFormRef" label-width="0">
                    <!-- 用户名 -->
                    <el-form-item prop="username">
                        <el-input
                            v-model="loginForm.username"
                            placeholder="请输入用户名"
							prefix-icon="el-icon-user"
                        ></el-input>
                    </el-form-item>
                    <!-- 密码 -->
                    <el-form-item prop="password">
                        <el-input
                            type="password"
                            v-model="loginForm.password"
                            placeholder="请输入密码"
							prefix-icon="el-icon-lock"
                        ></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="login">登录</el-button >
                        <el-button type="Info" @click="reset">重置</el-button>
                    </el-form-item>
                </el-form>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: "",
    data() {
        return {
            loginForm: {
                username: "admin",
                password: 123456,
            },
            rules: {
				username: [{min: 1, max: 20, message: '登录名请控制在20字以内', trigger: 'blur'}],
                password: [{min: 4, max: 16, trigger: 'blur'}],
            },
        };
    },
    components: {},
    methods: {
		login() {
			console.log(this.$refs.loginFormRef)
		},
        reset() {
			
		},
        
    },
};
</script>

<style lang='sass' scoped>
.login_container
	height: 100vh
	background-color: #2b4b6b
	display: flex
	justify-content: center
	align-items: center
.login_content
	position: relative
	width: 500px
	height: 300px
	background-color: #fff
	border-radius: 5px
	box-shadow: 0 0 8px 3px rgba(0,0,0,.1)
.login_achor
	position: absolute
	width: 150px
	height: 150px
	z-index: 9
	left: 50%
	top: 0
	transform: translate(-50%, -50%)
	box-shadow: 0 0 8px 2px rgba(0,0,0,.1)
	background-color: #fff
	overflow: hidden
	border-radius: 50%
	padding: 8px
	img
		width: 98%
		border-radius: 50%
		background-color: #f5f5f5

.login_con
	position: absolute
	left: 50%
	top: 60%
	transform: translate(-50%, -50%)
	width: 80%
</style>