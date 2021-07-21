<template>
  <div class="login_container">
    <div class="login_content">
      <div class="login_achor">
        <img src="../assets/logo.png" alt="" />
      </div>
      <div class="login_con">
        <el-form
          :model="loginForm"
          :rules="loginFromRules"
          ref="loginFormRef"
          label-width="0"
        >
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
            <el-button type="primary" @click="login">登录</el-button>
            <el-button type="Info" @click="resetForm">重置</el-button>
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
      // 登录表单对象
      loginForm: {
        username: "admin",
        password: '123456',
      },
      // 表单的验证规则
      loginFromRules: {
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          { min: 1, max: 25, message: "长度在 1 到 25 个字符", trigger: "blur" },
        ],
        password: [
            { required: true, message: '请输入密码', trigger: 'blur' },
            { min: 6, max: 16, message: '长度在 6 到 15 个字符', trigger: 'blur' }
        ],
      },
    };
  },
  components: {},
  methods: {
    login() {
        this.$refs.loginFormRef.validate(async flag => {
            console.log(flag);
            if(!flag) return;
            const {data: res} = await this.$http.post('login', this.loginForm);
            if(res.meta.status !== 200) return this.$msg.error(res.meta.msg);
            this.$msg.success(res.meta.msg);
            // console.log(res);
            window.sessionStorage.setItem('token', res.data.token);
            this.$router.push({name: 'Home'});
        })
    },
    resetForm() {
        this.$refs.loginFormRef.resetFields();
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