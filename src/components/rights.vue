<template>
  <div class="rights">
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 内容区域 -->
    <el-card> 
        <el-table :data="rightsList" border>
       		<el-table-column type="index" label="序号" width="60"></el-table-column>
       		<el-table-column prop="authName" label="权限名称"></el-table-column>
       		<el-table-column prop="path" label="路径"></el-table-column>
       		<el-table-column label="权限等级">
				<template slot-scope="scope">

					
					<el-tag v-if="scope.row.level === '0'">一级</el-tag>
					<el-tag v-else-if="scope.row.level === '1'" type="success">二级</el-tag>
					<el-tag type="danger" v-else>三级</el-tag>
					
				</template>
			</el-table-column>
        </el-table>
        
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      rightsList: [],
	  
    };
  },
  methods: {
    async getRightsList() {
		const {data: res} = await this.$http.get('rights/list');
		if(res.meta.status !== 200) return this.$msg.error(res.meta.msg);
		this.rightsList = res.data;
		console.log('shuju',res);
	},
  },
  created() {
    this.getRightsList();
  },
};
</script>

<style>
</style>