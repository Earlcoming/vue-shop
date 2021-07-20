<template>
    <div class="login_container">
        <div class="login_text">
            <el-form :model="loginForm">
                <el-form-item>
                    <el-input v-model="loginForm.username" placeholder="请输入用户名"></el-input>
                </el-form-item>
				<el-form-item>
                    <el-input type="password" v-model="loginForm.password" placeholder="请输入密码"></el-input>
                </el-form-item>
				 <el-form-item>
					<el-button type="primary" @click="login()">登录</el-button>
					<el-button @click="reset()">重置</el-button>
				</el-form-item>
            </el-form>
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
				password: []
			}
        };
    },
    components: {},
	methods: {
		reset() {

		},
		login() {

		}
	}
};
</script>

<style lang='sass' scoped>
</style>