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
                    <el-button type="primary" @click="addUser"
                        >添加角色</el-button
                    >
                </el-col>
            </el-row>
            <el-table :data="rolesList">
                <el-table-column type="expand" width="80">
                    <template slot-scope="scope">
                        <el-row
                            :class="[
                                'bdbottom',
                                ia === 0 ? 'bdtop' : '',
                                'colcenter',
                            ]"
                            v-for="(itema, ia) in scope.row.children"
                            :key="itema.id"
                        >
                            <!-- 一级权限 -->
                            <el-col :span="5">
                                <el-tag
                                    closable
                                    @close="
                                        removeRolesByid(scope.row, itema.id)
                                    "
                                    >{{ itema.authName }}</el-tag
                                >
                                <i class="el-icon-caret-right"></i>
                            </el-col>
                            <el-col :span="19">
                                <!-- 二级权限 -->
                                <el-row
                                    v-for="itemb in itema.children"
                                    :key="itemb.id"
                                    :class="['colcenter']"
                                >
                                    <el-col :span="6">
                                        <el-tag
                                            closable
                                            type="success"
                                            @close="
                                                removeRolesByid(
                                                    scope.row,
                                                    itemb.id
                                                )
                                            "
                                            >{{ itemb.authName }}</el-tag
                                        ><i class="el-icon-caret-right"></i>
                                    </el-col>
                                    <el-col :span="18">
                                        <el-tag
                                            class="sanjiTag"
                                            closable
                                            type="warning"
                                            v-for="itemc in itemb.children"
                                            :key="itemc.id"
                                            @close="
                                                removeRolesByid(
                                                    scope.row,
                                                    itemc.id
                                                )
                                            "
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
                <el-table-column
                    prop="roleName"
                    label="角色名称"
                ></el-table-column>
                <el-table-column
                    prop="roleDesc"
                    label="角色描述"
                ></el-table-column>
                <el-table-column label="操作">
                    <template slot-scope="scope">
                        <el-button
                            type="primary"
                            icon="el-icon-s-tools"
                            size="mini"
                            @click="editUser(scope.row.id)"
                            >编辑</el-button
                        >
                        <el-button
                            type="danger"
                            icon="el-icon-s-tools"
                            size="mini"
                            @click="deleteUser(scope.row.id)"
                            >删除</el-button
                        >
                        <el-tooltip
                            effect="dark"
                            content="分配角色"
                            placement="top"
                            :enterable="false"
                        >
                            <el-button
                                type="warning"
                                icon="el-icon-setting"
                                size="mini"
                                @click="showRightsDialog(scope.row)"
                                >分配角色</el-button
                            >
                        </el-tooltip>
                    </template>
                </el-table-column>
            </el-table>
        </el-card>

        <!-- 添加角色 -->
        <el-dialog title="添加角色" :visible.sync="addRightsDialogUserVisible">
            <el-form
                :model="addFrom"
                ref="addFormRef"
                :rules="addUserFromRules"
                label-width="80px"
                label-position="right"
            >
                <el-form-item label="角色名称" prop="roleName">
                    <el-input v-model="addFrom.roleName"></el-input>
                </el-form-item>
                <el-form-item label="角色描述">
                    <el-input v-model="addFrom.roleDesc"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="addRightsDialogUserVisible = false"
                    >取 消</el-button
                >
                <el-button type="primary" @click="addUserFrom">确 定</el-button>
            </div>
        </el-dialog>

        <!-- 编辑角色 -->
        <el-dialog title="编辑角色" :visible.sync="editRightsDialogUserVisible">
            <el-form
                :model="editFrom"
                ref="editFormRef"
                :rules="addUserFromRules"
                label-width="80px"
                label-position="right"
            >
                <el-form-item label="角色名称" prop="roleName">
                    <el-input v-model="editFrom.roleName"></el-input>
                </el-form-item>
                <el-form-item label="角色描述">
                    <el-input v-model="editFrom.roleDesc"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="editRightsDialogUserVisible = false"
                    >取 消</el-button
                >
                <el-button type="primary" @click="editUserFrom"
                    >确 定</el-button
                >
            </div>
        </el-dialog>

        <!-- 分配角色权限对话框 -->
        <el-dialog
            title="分配角色权限"
            :visible.sync="showRightdialogTableVisible"
            @close="closeRightDialog"
        >
            <el-tree
                :data="showRightDialogList"
                :props="treeProps"
                show-checkbox
                node-key="id"
                :default-checked-keys="checkTree"
                :default-expand-all="true"
                ref="treeRef"
            ></el-tree>
            <div slot="footer" class="dialog-footer">
                <el-button @click="showRightdialogTableVisible = false"
                    >取 消</el-button
                >
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
                label: "authName",
                children: "children",
            },
            checkTree: [],
            roleId: "",

            //   添加角色 flag
            addRightsDialogUserVisible: false,
            addFrom: {
                roleName: "",
                roleDesc: "",
            },
            addUserFromRules: {
                roleName: [
                    {
                        required: true,
                        message: "请输入角色名称",
                        trigger: "blur",
                    },
                ],
            },
            // 编辑角色
            editRightsDialogUserVisible: false,
            editFrom: {},
        };
    },
    created() {
        this.getRolesList();
    },
    methods: {
        async getRolesList() {
            const { data: res } = await this.$http.get("roles");
            //   console.log(res);
            if (res.meta.status !== 200) return this.$message.error(res.meta.msg);
            this.rolesList = res.data;
        },
        // 添加角色
        addUser() {
            this.addRightsDialogUserVisible = true;
        },
        addUserFrom() {
            this.$refs.addFormRef.validate(async (valid) => {
                if (!valid) return;
                const { data: res } = await this.$http.post(
                    "roles",
                    this.addFrom
                );
                if (res.meta.status !== 201)
                    return this.$message.error(res.meta.msg);
                this.addRightsDialogUserVisible = false;
                this.getRolesList();
                this.$message.success(res.meta.msg);
            });
        },
        // 编辑角色
        async editUser(id) {
            const { data: res } = await this.$http.get("roles/" + id);
            if (res.meta.status !== 200) return this.$message.error(res.meta.msg);
            this.$message.success(res.meta.msg);
            this.editFrom = res.data;
            console.log(this.editFrom);
            this.editRightsDialogUserVisible = true;
        },
        editUserFrom() {
            console.log(this.editFrom.roleId);
            this.$refs.editFormRef.validate(async (valid) => {
                if (!valid) return;
                const { data: res } = await this.$http.put(
                    `roles/${this.editFrom.roleId}`,
                    this.editFrom
                );
                if (res.meta.status !== 200)
                    return this.$message.error(res.meta.msg);
                this.editRightsDialogUserVisible = false;
                this.getRolesList();
                this.$message.success(res.meta.msg);
            });
        },
        // 删除角色
        async deleteUser(id) {
            const confirmResult = await this.$confirm(
                "确定删除该角色吗",
                "提示",
                {
                    confirmButtonText: "确定",
                    cancelButtonText: "取消",
                    type: "warning",
                }
            ).catch((err) => err);
            if (confirmResult !== "confirm")
                return this.$message.info("用户取消了删除");
            const { data: res } = await this.$http.delete("roles/" + id);
            if (res.meta.status !== 200) return this.$message.error(res.meta.msg);
            this.getRolesList();
            this.$message.success(res.meta.msg);
        },

        // 根据ID删除对应的权限
        async removeRolesByid(role, rightId) {
            const conResult = await this.$confirm(
                "此操作将永久删除该文件, 是否继续?",
                "提示",
                {
                    confirmButtonText: "确定",
                    cancelButtonText: "取消",
                    type: "warning",
                }
            ).catch((err) => err);
            if (conResult !== "confirm") return this.$message.info("取消删除权限");
            // 删除角色对应的权限
            const { data: res } = await this.$http.delete(
                `roles/${role.id}/rights/${rightId}`
            );
            if (res.meta.status !== 200) return this.$message.error(res.meta.msg);
            role.children = res.data;
        },
        // 展示分配权限对话框
        async showRightsDialog(role) {
            this.roleId = role.id;
            const { data: res } = await this.$http.get("rights/tree");
            if (res.meta.status !== 200) return this.$message.error(res.meta.msg);
            this.showRightDialogList = res.data;
            console.log(res);
            this.getLeafKeys(role, this.checkTree);
            this.showRightdialogTableVisible = true;
        },

        // 通过递归形式获取id，保存在数组中
        getLeafKeys(node, arr) {
            // 不包含child，是三级属性
            if (!node.children) {
                return arr.push(node.id);
            }
            node.children.forEach((ele) => {
                this.getLeafKeys(ele, arr);
            });
        },
        closeRightDialog() {
            this.checkTree = [];
        },
        // 点击分配权限确定按钮
        async allotRights() {
            const keys = [
                ...this.$refs.treeRef.getCheckedKeys(),
                ...this.$refs.treeRef.getHalfCheckedKeys(),
            ];
            const rids = keys.join(",");
            const { data: res } = await this.$http.post(
                `roles/${this.roleId}/rights`,
                { rids }
            );
            if (res.meta.status !== 200) return this.$message.error(res.meta.msg);
            this.$message.success(res.meta.msg);
            this.showRightdialogTableVisible = false;
            this.getRolesList();
        },
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
.sanjiTag
	margin-right: 5px
	margin-bottom: 5px
</style>