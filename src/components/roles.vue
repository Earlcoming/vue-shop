<template>
  <div class="roles">
       <!-- 面包屑导航 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>角色管理</el-breadcrumb-item>
            <el-breadcrumb-item>角色列表</el-breadcrumb-item>
        </el-breadcrumb>

        <!-- 卡片视图 -->
        <el-card>
            <el-row>
                <el-col>
                    <el-button type="primary">添加角色</el-button>
                </el-col>
            </el-row>
            <el-table :data="rolesList">
       		    <el-table-column type="expand" width="80"></el-table-column>
       		    <el-table-column type="index" label="序号" width="180"></el-table-column>
       		    <el-table-column prop="roleName" label="角色名称"></el-table-column>
       		    <el-table-column prop="roleDesc" label="角色描述"></el-table-column>
       		    <el-table-column  label="操作">
                    <template slot-scope="scope">
                        <el-button type="primary" icon="el-icon-s-tools" size="mini" @click="editRoles(scope.row)">编辑</el-button>
                        <el-button type="danger" icon="el-icon-s-tools" size="mini">删除</el-button>
                        <el-tooltip effect="dark" content="分配角色" placement="top" :enterable="false">
                            <el-button type="warning" icon="el-icon-setting" size="mini">分配角色</el-button>
                        </el-tooltip>
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
            rolesList: []
        }
    },
    created() {
        this.getRolesList();
    },
    methods: {
        async getRolesList() {
            const {data: res} = await this.$http.get('roles');
            console.log(res);
            if(res.meta.status !== 200) return this.$msg.error(res.meta.msg);
            this.rolesList = res.data;
        },
        // 操作角色
        editRoles() {
            
        }
    }
}
</script>

<style lang="sass" scoped>
    .el-table
        margin-top: 20px
</style>