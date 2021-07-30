<template>
    <div class="params">
        <!-- 面包屑导航 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>商品管理</el-breadcrumb-item>
            <el-breadcrumb-item>参数列表</el-breadcrumb-item>
        </el-breadcrumb>

        <!-- 产品参数 -->
        <el-card>
            <el-alert
                title="注意：商品参数只有三级分类可以添加!"
                type="warning"
                show-icon
                :closable="false"
            ></el-alert>
			<div class="my-4">
				<span>请选择商品分类:</span>
					<el-cascader
					v-model="cascaderValue"
					:options="cateList"
					:props="{ expandTrigger: 'hover', ...cateProp }"
					@change="changeCateAttribute"
					size="medium"
				></el-cascader>
			</div>

           <!-- 添加动态参数 -->
		   <el-tabs v-model="activeName" @tab-click="tabClick">
				<el-tab-pane label="动态参数" name="many">
					<el-button type="primary" size="mini" :disabled="buttonFlag" @click="showmanyAttr">添加参数</el-button>
					<el-table :data="attributesList" style="width: 100%" border>
						<el-table-column type="expand"></el-table-column>
						<el-table-column type="index" label="序号" width="60"></el-table-column>
						<el-table-column prop="attr_name" label="参数名称"></el-table-column>
						<el-table-column label="操作">
							<template slot-scope="scope">
								<el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditDialog(scope.row)">编辑</el-button>
								<el-button type="danger" icon="el-icon-delete" size="mini" @click="deleteAttributes(scope.row)">删除</el-button>
							</template>
						</el-table-column>
					</el-table>
				</el-tab-pane>
			</el-tabs>

			<!-- 添加静态属性 -->
		   <!-- <el-tabs v-model="activeName" @tab-click="tabClick">
				<el-tab-pane label="动态参数" name="many">
					<el-button type="primary" size="mini">添加参数</el-button>
					<el-table :data="attributesList" style="width: 100%" border>
						<el-table-column type="expand"></el-table-column>
						<el-table-column type="index" label="序号" width="60"></el-table-column>
						<el-table-column prop="attr_name" label="参数名称"></el-table-column>
						<el-table-column label="操作">
							<template slot-scope="scope">
								<el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditDialog(scope.row)">编辑</el-button>
								<el-button type="danger" icon="el-icon-delete" size="mini" @click="deleteAttributes(scope.row)">删除</el-button>
							</template>
						</el-table-column>
					</el-table>

				</el-tab-pane>
				<el-tab-pane label="静态属性" name="only">静态参数</el-tab-pane>
			</el-tabs> -->

        </el-card>

		<!-- 修改参数对话框 -->
		<el-dialog
		title="修改参数"
		:visible.sync="editDialogVisible"
		width="50%">
			<el-form ref="manyFormRef" :model="manyForm" :rules="manyRules" label-width="80px">
				<el-form-item label="动态参数" prop="attr_name">
					<el-input v-model="manyForm.attr_name"></el-input>
				</el-form-item>
			</el-form>
			<span slot="footer">
				<el-button @click="editDialogVisible = false">取 消</el-button>
				<el-button type="primary" @click="addAttr('many')">确 定</el-button>
			</span>
		</el-dialog>

    </div>
</template>

<script>
export default {
    name: "",
    data() {
        return {
			// 参数数字存放值
            cascaderValue: [],
			// 分类列表
            cateList: [],
			// 分类props参数
            cateProp: {
                value: "cat_id",
                label: "cat_name",
                children: "children",
            },
			// 分类id
			cateId: '',
			// 默认动态
			sel: 'many',
			// 参数列表
			attributesList: [],
			activeName: 'many',
			// 按钮默认状态
			buttonFlag: true,
			editDialogVisible: false,

			// 动态参数
			manyForm: {},
			manyRules: {
				attr_name: [
					 { required: true, message: '请填写动态参数', trigger: 'blur' }
				]
			},

			
        };
    },
    components: {},
    methods: {
		// 修改商品分类参数触发函数
        async changeCateAttribute() {
			if(this.cascaderValue.length >=3) { this.cateId = this.cascaderValue[this.cascaderValue.length - 1]};
			const {data: res} = await this.$http.get('categories/' + this.cateId + '/attributes',  {
				params: { sel: this.sel}
			});
			if (res.meta.status !== 200) return this.$msg.error(res.meta.msg);
            this.attributesList = res.data;
			this.buttonFlag = false;
			console.log('change',this.attributesList);
            this.$msg.success(res.meta.msg);
		},
		// 获取商品分类
        async getCateList() {
            const { data: res } = await this.$http.get("categories");
            if (res.meta.status !== 200) return this.$msg.error(res.meta.msg);
            this.cateList = res.data;
            this.$msg.success(res.meta.msg);
        },
		// tab点击
		tabClick() {
			console.log(tab, event)
		},
		// 显示编辑参数对话框
		showEditDialog(manyFrom) {
			this.manyForm = manyFrom;
			console.log(this.manyForm);
			this.editDialogVisible = true;
		},
		// 添加参数
		addAttr(type) {
			this.$refs.manyFormRef.validate(async valid => {
				if(!valid) return;
				const {data: res} = await this.$http.post('categories/' + this.manyForm.cat_id +'/attributes', { 
					attr_name: this.manyForm.attr_name,
					attr_sel: type
				});
				if(res.meta.status !== 201) return this.$msg.error(res.meta.msg);
				this.editDialogVisible = false;
				this.$msg.success(res.meta.msg);
			})
		},
		// 删除参数
		async deleteAttributes(manyForm) {
			const confirmResult = await this.$confirm('此操作将永久删除该项！', '提示', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning'
			}).catch(e=>e);
			if(confirmResult === 'cancel') return this.$meg.info('取消删除了');
			const {data: res} = await this.$http.delete('categories/'+ manyForm.cat_id +'/attributes/' + manyForm.attr_id );
			if(res.meta.status !== 200) return this.$msg.error(res.meta.msg);
			this.changeCateAttribute();
			this.$msg.success(res.meta.msg);
			
		},
		// 添加动态参数
		showmanyAttr() {
			
		}
    },
    created() {
        this.getCateList();
    },
};
</script>

<style lang='sass' scoped>
span
	margin-right: 15px
	font-size: 14px
	margin-right: 10px
.my-4
	margin-top: 15px
	margin-bottom: 15px
.el-cascader
	min-width: 300px
.el-table
	margin-top: 20px
</style>