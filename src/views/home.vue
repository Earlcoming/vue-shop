<template>
  <div class="home">
	  <el-button type="info" @click="logout">退出登录</el-button>
  </div>
</template>

<script>
export default {
	methods: {
		logout () {
			window.sessionStorage.clear('token');
			this.$router.push({name: 'login'})
		}
	}
}
</script>

<style>

</style>