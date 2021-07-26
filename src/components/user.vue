<template>
    <div>
        <!-- 面包屑导航 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>用户管理</el-breadcrumb-item>
            <el-breadcrumb-item>用户列表</el-breadcrumb-item>
        </el-breadcrumb>

        <!-- 内容区域 -->
        <el-card>
            <!-- 搜索 -->
            <el-row :gutter="20">
                <el-col :span="8">
                    <el-input
                        placeholder="请输入内容"
                        class="input-with-select"
                        clearable
                        @clear="clearInput"
                        v-model="userInfo.query"
                    >
                        <el-button
                            slot="append"
                            icon="el-icon-search"
                            @click="searchHandle"
                        ></el-button>
                    </el-input>
                </el-col>
                <el-col :span="4">
                    <el-button type="primary" @click="dialogVisible = true"
                        >添加用户</el-button
                    >
                </el-col>
            </el-row>

            <!-- 用户列表区域 -->
            <el-table :data="userList" style="width: 100%" border stripe>
                <el-table-column
                    type="index"
                    label="序号"
                    width="60px"
                ></el-table-column>
                <el-table-column prop="username" label="姓名"></el-table-column>
                <el-table-column prop="email" label="邮箱"></el-table-column>
                <el-table-column prop="mobile" label="电话"></el-table-column>
                <el-table-column
                    prop="role_name"
                    label="角色"
                ></el-table-column>
                <el-table-column label="状态">
                    <template slot-scope="scope">
                        <el-switch
                            v-model="scope.row.mg_state"
                            @change="switchChange(scope.row)"
                        ></el-switch>
                    </template>
                </el-table-column>
                <el-table-column label="操作">
                    <template slot-scope="scope">
                        
                        <el-button
                            type="primary"
                            icon="el-icon-edit"
                            circle
                            size="mini"
                            @click="editedDialog(scope.row)"
                        ></el-button>
                        <el-button
                            type="danger"
                            icon="el-icon-delete"
                            circle
                            size="mini"
							@click="deleteDialog(scope.row)"
                        ></el-button>

                        <el-tooltip
                            class="item"
                            effect="dark"
                            content="分配角色"
                            placement="top"
                            :enterable="false"
                        >
                            <el-button
                                type="warning"
                                icon="el-icon-setting"
                                circle
                                size="mini"
								@click="assignRoles(scope.row)"
                            ></el-button>
                        </el-tooltip>
                    </template>
                </el-table-column>
            </el-table>

            <!-- 分页器 -->
            <el-pagination
                @size-change="changeSizeChange"
                @current-change="changeCurrentChange"
                :current-page="userInfo.pagenum"
                :page-size="userInfo.pagesize"
                :page-sizes="[userInfo.pagesize, 10, 20, 50]"
                background
                layout="total, sizes, prev, pager, next, jumper"
                :total="total"
            >
            </el-pagination>
        </el-card>

        <!-- 添加用户的对话框 -->
        <el-dialog
            title="添加用户"
            :visible.sync="dialogVisible"
            width="30%"
            @close="closeDialog"
        >
            <el-form
                :model="addForm"
                :rules="addFormRules"
                ref="addFromRef"
                label-width="70px"
            >
                <el-form-item label="用户名" prop="username">
                    <el-input v-model="addForm.username"></el-input>
                </el-form-item>
                <el-form-item label="密码" prop="password">
                    <el-input
                        v-model="addForm.password"
                        type="password"
                    ></el-input>
                </el-form-item>
                <el-form-item label="邮箱" prop="email">
                    <el-input v-model="addForm.email"></el-input>
                </el-form-item>
                <el-form-item label="手机" prop="mobile">
                    <el-input v-model="addForm.mobile"></el-input>
                </el-form-item>
            </el-form>

            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="addUser">确 定</el-button>
            </span>
        </el-dialog>

        <!-- 修改用户信息 -->
        <el-dialog
            title="修改用户"
            :visible.sync="editedDialogVisible"
            width="30%"
            @close="closeEditedDialog"
        >
            <el-form
                :model="ueseList"
                :rules="editUserRules"
                ref="editUserRef"
                label-width="70px"
            >
                <el-form-item label="用户名" prop="username">
                    <el-input v-model="ueseList.username" disabled></el-input>
                </el-form-item>
                <el-form-item label="邮箱" prop="email">
                    <el-input v-model="ueseList.email"></el-input>
                </el-form-item>
                <el-form-item label="手机" prop="mobile">
                    <el-input v-model="ueseList.mobile"></el-input>
                </el-form-item>
            </el-form>

            <span slot="footer" class="dialog-footer">
                <el-button @click="editedDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="addUserInfo">确 定</el-button>
            </span>
        </el-dialog>

		<!-- 删除用户 -->
		<el-dialog title="提示"
		width="30%"
		 :visible.sync="closeDialogVisible"
		>
			<span><i class="el-icon-warning"></i> 确定删除改用户吗</span>
			<span slot="footer" class="dialog-footer">
                <el-button @click="closeDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="closeDialogVisible = false">确 定</el-button>
            </span>
		</el-dialog>
    </div>
</template>

<script>
export default {
    data() {
        //   自定义校验规则
        var checkEmail = (rule, value, cb) => {
            if (value === "") {
                return cb(new Error("邮箱不能为空"));
            }
            const regEmail =
                /^[A-Za-z0-9\u4e00-\u9fa5]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/g;
            const regResult = regEmail.test(value);
            if (regResult) {
                return cb();
            }
            cb(new Error("邮箱格式错误"));
        };
        var checkMobile = (rule, value, cb) => {
            if (value === "") {
                return cb(new Error("手机号不能为空"));
            }
            const regMobile =
                /^(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\d{8}$/g;
            const regResult = regMobile.test(value);
            if (regResult) {
                return cb();
            }
            cb(new Error("手机号格式错误"));
        };
        return {
            // 获取用户列表
            userInfo: {
                query: "",
                pagenum: 1,
                pagesize: 5,
            },
            userList: [],
            total: 0,
            // 控制对话框
            dialogVisible: false,
            //   添加用户表达
            addForm: {
                username: "",
                password: "",
                email: "",
                mobile: "",
            },
            //  修改用户的对话框
            editedDialogVisible: false,
			// 用户信息
			ueseList: [],

			// 删除用户
			closeDialogVisible: false,
            addFormRules: {
                username: [
                    {
                        required: true,
                        message: "请输入用户名",
                        trigger: "blur",
                    },
                    {
                        min: 3,
                        max: 10,
                        message: "用户名长度在3-10个字符",
                        trigger: "blur",
                    },
                ],
                password: [
                    { required: true, message: "请输入密码", trigger: "blur" },
                    {
                        min: 5,
                        max: 15,
                        message: "用户名长度在5-15个字符",
                        trigger: "blur",
                    },
                ],
                email: [
                    { required: true, message: "请输入邮箱", trigger: "blur" },
                    { validator: checkEmail, trigger: "blur" },
                ],
                mobile: [
                    {
                        required: true,
                        message: "请输入手机号码",
                        trigger: "blur",
                    },
                    { validator: checkMobile, trigger: "blur" },
                ],
            },
			editUserRules: {
				email: [
                    { required: true, message: "请输入邮箱", trigger: "blur" },
                    { validator: checkEmail, trigger: "blur" },
                ],
                mobile: [
                    {
                        required: true,
                        message: "请输入手机号码",
                        trigger: "blur",
                    },
                    { validator: checkMobile, trigger: "blur" },
                ],
			}
        };
    },
    methods: {
        async getUserList() {
            const { data: res } = await this.$http.get("users", {
                params: this.userInfo,
            });
            if (res.meta.status !== 200) return this.$msg.error(res.meta.msg);
            this.userList = res.data.users;
            this.total = res.data.total;
            this.$msg.success(res.meta.msg);
            console.log(res.data);
        },
        changeSizeChange(newSize) {
            const oldSize = this.userInfo.pagesize;
            if (oldSize != newSize) {
                this.userInfo.pagesize = newSize;
                this.getUserList();
            }
        },
        changeCurrentChange(pageSize) {
            const oldPage = this.userInfo.pagenum;
            if (oldPage != pageSize) {
                this.userInfo.pagenum = pageSize;
                this.getUserList();
            }
        },
        async switchChange(userinfo) {
            const { data: res } = await this.$http.put(
                `users/${userinfo.id}/state/${userinfo.mg_state}`
            );
            if (res.meta.status !== 200) return this.$msg.error(res.meta.msg);
            this.$msg.success(res.meta.msg);
        },
        searchHandle() {
            this.getUserList();
        },
        clearInput() {
            this.userInfo.query = "";
            this.getUserList();
        },
        // 关闭对话框
        closeDialog() {
            this.$refs.addFromRef.resetFields();
        },
        // 表单预校验
        addUser() {
            this.$refs.addFromRef.validate(async (flag) => {
                if (!flag) return;
                const { data: res } = await this.$http.post(
                    "users",
                    this.addForm
                );
                // console.log(res);
                if (res.meta.status !== 201)
                    return this.$msg.error(res.meta.msg);
                this.$msg.success(res.meta.msg);
                this.dialogVisible = false;
                // 添加完成重新刷新用户列表
                this.getUserList();
            });
        },
        // 修改用户
        editedDialog(userinfo) {
			this.ueseList = userinfo;
			this.editedDialogVisible = true;
        },
		// 修改用户表单预校验
		addUserInfo() {
			this.$refs.editUserRef.validate( async flag => {
				if(!flag) return;
				const {email, mobile, id:userid} = this.ueseList;
				const {data: res} = await this.$http.put(`users/${userid}`, {
					email,
					mobile
				} );
				if(res.meta.status !== 200) return this.$msg.error(res.meta.msg);
				this.$msg.success(res.meta.msg);
				this.editedDialogVisible = false;
			})
		},
		// 关闭修改用户对话框
		closeEditedDialog() {
			// 置空表单
			this.$refs.editUserRef.resetFields();
		},

		// 删除用户
		async deleteDialog(userInfo) {
			
			
			
			// this.closeDialogVisible = true;
			// const {data: res} = await this.$http.delete(`users/${userInfo.id}`);
			// if(res.meta.status !== 200) return this.$msg.error(res.meta.msg);
			// this.$msg.success(res.meta.msg);
			// this.getUserList();
		},

		// 分配角色
		assignRoles (userInfo) {
			console.log(userInfo);
		}
    },
    created() {
        this.getUserList();
    },
};
</script>

<style lang="sass" scoped>
.el-table
	margin-top: 15px
.el-pagination
	text-align: center
	margin-top: 15px
.el-icon-warning
	color: orange
</style>