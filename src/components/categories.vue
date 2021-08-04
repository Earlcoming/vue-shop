<template>
    <div class="categories">
        <!-- 面包屑导航 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>商品管理</el-breadcrumb-item>
            <el-breadcrumb-item>商品分类</el-breadcrumb-item>
        </el-breadcrumb>

        <!-- 内容区域 -->
        <el-card>
            <el-row>
                <el-col :span="12">
                    <el-button
                        type="primary"
                        @click="addCate"
                    >添加分类</el-button>
                </el-col>
            </el-row>

            <!-- 商品分类列表 -->
            <tree-table
                :data="cateList"
                :columns="columns"
                :selection-type="false"
                :expand-type="false"
                show-index
                border
            >
                <template
                    slot="isOkey"
                    slot-scope="scope"
                >
                    <i
                        class="el-icon-success"
                        style="color: #67c23a"
                        v-if="!scope.row.cat_deleted"
                    ></i>
                    <i
                        class="el-icon-error icon_check"
                        style="#red;"
                        v-else
                    ></i>
                </template>
                <template
                    slot="level"
                    slot-scope="scope"
                >
                    <el-tag v-if="scope.row.cat_level === 0">一级</el-tag>
                    <el-tag
                        type="success"
                        v-else-if="scope.row.cat_level === 1"
                    >二级</el-tag>
                    <el-tag
                        type="danger"
                        v-else
                    >三级</el-tag>
                </template>
                <template
                    slot="edit"
                    slot-scope="scope"
                >
                    <el-button
                        type="primary"
                        icon="el-icon-edit"
                        size="mini"
                        @click="editShow(scope.row.cat_id)"
                    >编辑</el-button>
                    <el-button
                        type="danger"
                        icon="el-icon-delete"
                        size="mini"
                        @click="deleteCate(scope.row.cat_id)"
                    >删除</el-button>
                </template>
            </tree-table>

            <!-- 分页 -->
            <el-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="cateInfo.pagenum"
                :page-sizes="[5, 10, 20, 30]"
                :page-size="cateInfo.pagesize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="cateInfo.total"
            >
            </el-pagination>

        </el-card>

        <!-- 分类编辑对话框 -->
        <el-dialog
            title="编辑分类"
            :visible.sync="editDialogVisible"
            width="30%"
            ref="ediaFormRef"
            :rules="rules"
        >
            <el-form
                ref="form"
                :model="editForm"
                label-width="80px"
            >
                <el-form-item
                    label="分类名称"
                    prop="name"
                >
                    <el-input v-model="editForm.cat_name"></el-input>
                </el-form-item>
            </el-form>
            <span
                slot="footer"
                class="dialog-footer"
            >
                <el-button @click="editDialogVisible = false">取 消</el-button>
                <el-button
                    type="primary"
                    @click="editDialog"
                >确 定</el-button>
            </span>
        </el-dialog>

        <!-- 添加分类对话框 -->
        <el-dialog
            title="添加分类"
            :visible.sync="addCateDialogVisible"
            width="50%"
            @close="closeCateDialog"
        >
            <el-form
                ref="addCateForm"
                :rules="addCateRules"
                :model="addCateForm"
                label-width="120px"
                
            >
                <el-form-item label="分类名称" prop="cat_name">
                    <el-input v-model="addCateForm.cat_name"></el-input>
                </el-form-item>
                <el-form-item label="父级分类">
                    <el-cascader
                    v-model="cateParentsKeys"
                    :options="catePatentsList"
                    :props="{ expandTrigger: 'hover',checkStrictly: true,emitPath: true, ...cascaderProps }"
                    clearable
                    @change="cateChange"></el-cascader>
                </el-form-item>
            </el-form>
           
            <span
                slot="footer"
                class="dialog-footer"
            >
                <el-button @click="addCateDialogVisible = false">取 消</el-button>
                <el-button
                    type="primary"
                    @click="addCateProps"
                >确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

        
<script>
export default {
    name: "",
    data() {
        return {
            cateList: [],
            cateInfo: {
                type: "",
                pagenum: 1,
                pagesize: 5,
                total: 0,
            },
            columns: [
                {
                    label: "分类名称",
                    prop: "cat_name",
                },
                {
                    label: "是否有效",
                    template: "isOkey",
                    type: "template",
                },
                {
                    lebel: "层级",
                    template: "level",
                    type: "template",
                },
                {
                    label: "操作",
                    template: "edit",
                    type: "template",
                },
            ],
            // 编辑商品
            editDialogVisible: false,
            editForm: {
                cat_name: "",
            },
            rules: {
                name: [
                    {
                        required: true,
                        message: "请输入分类名称",
                        trigger: "blur",
                    },
                ],
            },
            // 添加分类
            addCateDialogVisible: false,
            addCateForm: {
                cat_name: '',
                // 默认分类父级为一级分类
                cat_pid: 0,
                // 默认分类等级1级分类
                cat_level: 0
            },
            addCateRules: {
                cat_name: [
                     { required: true, message: '请输入分类名称', trigger: 'blur' },
                ]
            },
            // 父级分类列表
            catePatentsList: [],
            cateParentsKeys: [],
           
            // 指定级别选择项
            cascaderProps: {
                value: 'cat_id',
                label: 'cat_name',
                children: 'children'
            }

        };
    },
    created() {
        this.getCateList();
    },
    methods: {
        // 获取商品分类数据
        async getCateList() {
            const { data: res } = await this.$http.get("categories", {
                params: this.cateInfo,
            });
            if (res.meta.status !== 200) return this.$message.error(res.meta.msg);
            this.cateList = res.data.result;
            this.cateInfo.total = res.data.total;
        },
        // 分类编辑
        async editShow(cat_id) {
            console.log(cat_id);
            const { data: res } = await this.$http.get("categories/" + cat_id);
            if (res.meta.status !== 200) return this.$message.error(res.meta.msg);
            this.editForm = res.data;
            this.$message.success(res.meta.msg);
            this.editDialogVisible = true;
        },
        // 分类编辑 dialog
        editDialog() {
            this.$refs.ediaFormRef.validate(async (valid) => {
                if (!valid) return;
                const { data: res } = await this.$http.put(
                    "categories/" + this.editForm.cat_id,
                    { params: this.editForm.cat_name }
                );
                if (res.meta.status) return this.$message.error(res.meta.msg);
                this.$message.success(res.meta.msg);
            });
        },
        // 删除分类
        async deleteCate(id) {
            const confirmResult = await this.$confirm(
                "确定删除该分类吗?",
                "提示",
                {
                    confirmButtonText: "确定",
                    cancelButtonText: "取消",
                    type: "warning",
                }
            ).catch((e) => e);
            if (confirmResult === "cancel")
                return this.$message.info("取消删除该分类了");
            const { data: res } = await this.$http.delete("categories/" + id);
            if (res.meta.status !== 200) return this.$message.error(res.meta.msg);
            this.getCateList();
            this.$message.success(res.meta.msg);
        },
        // 分页
        handleSizeChange(pagesize) {
            this.cateInfo.pagesize = pagesize;
            this.getCateList();
        },
        handleCurrentChange(pagenum) {
            this.cateInfo.pagenum = pagenum;
            this.getCateList();
        },
        // 添加分类
        async getCatePartentList() {
            const {data: res} = await this.$http.get('categories', {params: {type: 2}});
            if(res.meta.status !== 201) return this.$message.error(res.meta.msg);
            this.catePatentsList = res.data;
        },
        addCate() {
            this.getCatePartentList();
            this.addCateDialogVisible = true;
        },
        cateChange() {
            this.addCateForm;
            console.log(this.cateParentsKeys);

            if(this.cateParentsKeys.length > 0){
            // 当前分类id
            this.addCateForm.cat_pid = this.cateParentsKeys[this.cateParentsKeys.length - 1];
            // 当前分类等级
            this.addCateForm.cat_level = this.cateParentsKeys.length;
            }else{
                this.addCateForm.cat_pid = 0;
                this.addCateForm.cat_level = 0;
            }
            
        },
        // 关闭添加分类对话框
        closeCateDialog() {
            this.addCateForm.cat_level = 0;
            this.addCateForm.cat_pid = 0;
            this.cateParentsKeys = [];
            this.addCateDialogVisible = false;
        },
        // 点击添加分类确定按钮
        addCateProps() {
            console.log( 'addCateForm',this.addCateForm);
            this.$refs.addCateForm.validate( async valid => {
                if(!valid) return;
                const {data: res} = await this.$http.post('categories',  this.addCateForm);
                console.log('fenlei', res);
                if(res.meta.status !== 200) return this.$message.error(res.meta.msg);
                this.$message.success(res.meta.msg);
                this.addCateDialogVisible = false;
            })

        }
    },
};
</script>

<style lang='sass' scoped>
.el-row
    margin-bottom: 20px
.icon_check
    border-radius: 50%
    background-color: #67C23A
    color: #fff
.el-pagination
    text-align: center
    margin-top: 20px
.el-cascader
    width: 100%
</style>