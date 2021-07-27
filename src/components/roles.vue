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
        <el-table-column type="expand" width="80">
          <template slot-scope="scope">
            <el-row
              :class="['bdbottom', ia === 0 ? 'bdtop' : '', 'colcenter']"
              v-for="(itema, ia) in scope.row.children"
              :key="itema.id"
            >
              <!-- 一级权限 -->
              <el-col :span="5">
                <el-tag closable @close="removeRolesByid(scope.row,itema.id)">{{ itema.authName }}</el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>
              <el-col :span="19">
                <!-- 二级权限 -->
                <el-row
                  v-for="itemb in itema"
                  :key="itemb.id"
                  :class="['colcenter']"
                >
                  <el-col :span="6">
                    <el-tag closable type="success" @close="removeRolesByid(scope.row,itemb.id)">{{ itemb.authName }}</el-tag
                    ><i class="el-icon-caret-right"></i>
                  </el-col>
                  <el-col :span="18">
                    <el-tag
                      closable
                      type="warning"
                      v-for="itemc in itemb"
                      :key="itemc.id"
                      @close="removeRolesByid(scope.row,itemc.id)"
                      >{{ itemc.authName }}</el-tag
                    >
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <el-table-column
          type="index"
          label="序号"
          width="180"
        ></el-table-column>
        <el-table-column prop="roleName" label="角色名称"></el-table-column>
        <el-table-column prop="roleDesc" label="角色描述"></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button type="primary" icon="el-icon-s-tools" size="mini"
              >编辑</el-button
            >
            <el-button type="danger" icon="el-icon-s-tools" size="mini"
              >删除</el-button
            >
            <el-tooltip
              effect="dark"
              content="分配角色"
              placement="top"
              :enterable="false"
            >
              <el-button type="warning" icon="el-icon-setting" size="mini"
                @click="showRightsDialog(scope.row)">分配角色</el-button
              >
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
    </el-card>


    <!-- 分配角色权限对话框 -->
    <el-dialog title="分配角色权限" :visible.sync="showRightdialogTableVisible" @close="closeRightDialog">
   <el-tree :data="showRightDialogList" :props="treeProps" show-checkbox node-key="id" :default-checked-keys="checkTree" :default-expand-all="true" ref="treeRef"></el-tree>
    <div slot="footer" class="dialog-footer">
    <el-button @click="showRightdialogTableVisible = false">取 消</el-button>
    <el-button type="primary" @click="allotRights">确 定</el-button>
  </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // 角色列表
      rolesList: [],
      showRightdialogTableVisible: false,
      showRightDialogList: [],
    //   树形控件
      treeProps: {
          label: 'authName',
          children: 'children'
      },
      checkTree: [],
      roleId: ''
    };
  },
  created() {
    this.getRolesList();
  },
  methods: {
    async getRolesList() {
      const { data: res } = await this.$http.get("roles");
      console.log(res);
      if (res.meta.status !== 200) return this.$msg.error(res.meta.msg);
      this.rolesList = res.data;
    },

    // 根据ID删除对应的权限
    async removeRolesByid(role, rightId) {
      const conResult = await this.$confirm("此操作将永久删除该文件, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).catch(err => err);
      if(conResult !== 'confirm') return this.$msg.info('取消删除权限');
        // 删除角色对应的权限
        const {data: res} = await this.$http.delete(`roles/${role.id}/rights/${rightId}`);
        if(res.meta.status !== 200) return this.$msg.error(res.meta.msg);
        role.children = res.data;
    },
    // 展示分配权限对话框
    async showRightsDialog(role) {
        this.roleId = role.id;
        const {data: res} = await this.$http.get('rights/tree');
        if(res.meta.status !== 200) return this.$msg.error(res.meta.msg);
        this.showRightDialogList = res.data;
        console.log(res);
        this.getLeafKeys(role, this.checkTree);
        this.showRightdialogTableVisible = true;
    },

    // 通过递归形式获取id，保存在数组中
    getLeafKeys(node, arr) {
        // 不包含child，是三级属性
        if(!node.children) {
            return arr.push(node.id);
        }
        node.children.forEach( ele => {
            this.getLeafKeys(ele, arr);
        })
    },
    closeRightDialog() {
        this.checkTree = [];
    },
    // 点击分配权限确定按钮
    async allotRights(){
        const keys = [
            ...this.$refs.treeRef.getCheckedKeys(),
            ...this.$refs.treeRef.getHalfCheckedNodes()
        ];
        const rids = keys.join(',');
        const {data: res} = await this.$http.post(`roles/${this.roleId}/rights` , {rids});
        if(res.meta.status !== 200) return this.$msg.error(res.meta.msg);
        this.$msg.success(res.meta.msg);
        this.showRightdialogTableVisible = false;
        this.getRolesList();
    }
    
  },
};
</script>

<style lang="sass" scoped>
.el-table
    margin-top: 20px
    .bdbottom
        border-bottom: 1px solid #eee
        margin-bottom: 7px
        padding-bottom: 5px
        padding-top: 5px
    .bdtop
        border-top: 1px solid #eee
    .colcenter
        display: flex
        align-items: center
</style>