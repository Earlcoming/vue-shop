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

		   <el-tabs v-model="activeName" @tab-click="tabClick">
           		<!-- 添加动态参数 -->
				<el-tab-pane label="动态参数" name="many">
					<el-button type="primary" size="mini" :disabled="isDisabled" @click="showmanyAttr">添加参数</el-button>
					<el-table :data="attributesList" style="width: 100%" border>
						<el-table-column type="expand">
							<template slot-scope='scope'>
								{{scope.row}}
								<el-button size="mini">+ New Tag</el-button>
							</template>
						</el-table-column>
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
				<!-- 添加静态属性 -->
				<el-tab-pane label="静态属性" name="only">
					<el-button type="primary" size="mini" :disabled="isDisabled" @click="showmanyAttr">添加属性</el-button>
					<el-table :data="attributesList" style="width: 100%" border>
						<el-table-column type="expand">
							<template slot-scope='scope'>
								{{scope.row}}
								<el-button size="mini">+ New Tag</el-button>
							</template>
						</el-table-column>
						<el-table-column type="index" label="序号" width="60"></el-table-column>
						<el-table-column prop="attr_name" label="属性名称"></el-table-column>
						<el-table-column label="操作">
							<template slot-scope="scope">
								<el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditDialog(scope.row)">编辑</el-button>
								<el-button type="danger" icon="el-icon-delete" size="mini" @click="deleteAttributes(scope.row)">删除</el-button>
							</template>
						</el-table-column>
					</el-table>
				</el-tab-pane>
			</el-tabs>

		
		
        </el-card>

		<!-- 修改参数对话框 -->
		<el-dialog
		:title="'修改'+ getTitleText"
		:visible.sync="editDialogVisible"
		width="50%">
			<el-form ref="manyFormRef" :model="editManyForm" :rules="manyRules" label-width="80px">
				<el-form-item :label="'动态' + getTitleText" prop="attr_name">
					<el-input v-model="editManyForm.attr_name"></el-input>
				</el-form-item>
			</el-form>
			<span slot="footer">
				<el-button @click="editDialogVisible = false">取 消</el-button>
				<el-button type="primary" @click="editAttr">确 定</el-button>
			</span>
		</el-dialog>

		<!-- 添加动态参数对话框 -->
		<el-dialog
		:title="'添加' + getTitleText"
		:visible.sync="addAttrDialogVisible"
		width="50%">
			<el-form ref="addAttrform" :rules="addAttrformRules" :model="manyForm" label-width="80px">
				<el-form-item :label="'静态' + getTitleText" prop="attr_name">
					<el-input v-model="manyForm.attr_name"></el-input>
				</el-form-item>
			</el-form>
			
			<span slot="footer" class="dialog-footer">
				<el-button @click="addAttrDialogVisible = false">取 消</el-button>
				<el-button type="primary" @click="addAttr('addAttrform', 'addAttrDialogVisible')">确 定</el-button>
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
					 { required: true, message: '请填写参数', trigger: 'blur' }
				]
			},
			

			// 添加动态参数
			addAttrDialogVisible: false,
			addAttrformRules: {
				attr_name: [
					{ required: true, message: '请填写动态参数', trigger: 'blur' }
				]
			},
			showAttrs: [],

			// 修改参数
			editManyForm: [],
			
			
        };
    },
	computed: {
		// 商品分类选择是三级，开启添加商品参数，否则禁用
		isDisabled () {
			if(this.cascaderValue.length === 3) {
				return false;
			}
			return true;
		},
		getTitleText() {
			if(this.activeName === 'mony') {
				return '参数';
			}else{
				return '属性'
			}
		}
		
		
	},
    components: {},
    methods: {
		// 修改商品分类参数触发函数
        async changeCateAttribute() {
			if(this.cascaderValue.length < 3) {
				this.cascaderValue = [];
				this.attributesList = [];
				return;
			} ; 
			this.manyForm.cat_id = this.cascaderValue[this.cascaderValue.length - 1];
			const {data: res} = await this.$http.get('categories/' + this.manyForm.cat_id + '/attributes',  {
				params: { sel: this.activeName}
			});
			if (res.meta.status !== 200) return this.$message.error(res.meta.msg);
            this.attributesList = res.data;
            this.$message.success(res.meta.msg);
		},
		// 获取商品分类
        async getCateList() {
            const { data: res } = await this.$http.get("categories");
            if (res.meta.status !== 200) return this.$message.error(res.meta.msg);
            this.cateList = res.data;
            this.$message.success(res.meta.msg);
        },
		// tab点击
		tabClick() {
			this.changeCateAttribute();
		},
		// 显示编辑参数对话框
		async showEditDialog(attr) {
			const {data: res} = await this.$http.get('categories/'+attr.cat_id+'/attributes/' + attr.attr_id, { attr_sel: attr.attr_sel } );
			if(res.meta.status !== 200) return this.$message.error(res.meta.msg);
			this.editManyForm = res.data;
			this.editDialogVisible = true;
		},
		// 关闭编辑参数对话框
		
		// 修改参数
		editAttr() {
			this.$refs.manyFormRef.validate( async valid => {
				if(!valid) return;
				const {data: res} = await this.$http.put('categories/' + this.editManyForm.cat_id + '/attributes/' + this.editManyForm.attr_id, {
					attr_name: this.editManyForm.attr_name,
					attr_sel: this.editManyForm.attr_sel
				});
				if(res.meta.status !== 200) return this.$message.error(res.meta.msg);
				this.$message.success(res.meta.msg);
				this.changeCateAttribute();
				this.editDialogVisible = false;
			})

		},
		
		// 添加参数
		addAttr( ref, dia) {
			this.$refs[ref].validate(async valid => {
				if(!valid) return;
				const {data: res} = await this.$http.post('categories/' + this.manyForm.cat_id +'/attributes', { 
					attr_name: this.manyForm.attr_name,
					attr_sel: this.activeName
				});
				if(res.meta.status !== 201) return this.$message.error(res.meta.msg);
				console.log(res);
				this.$message.success(res.meta.msg);
				this.changeCateAttribute();
				this.manyForm.attr_name = '';
				this[dia] = false;
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
			if(res.meta.status !== 200) return this.$message.error(res.meta.msg);
			this.changeCateAttribute();
			this.$message.success(res.meta.msg);
		},
		// 添加动态参数
		showmanyAttr() {
			this.addAttrDialogVisible = true;
		},
		
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