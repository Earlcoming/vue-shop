<template>
	<div class="orders">
		<!-- 面包屑导航 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>订单管理</el-breadcrumb-item>
            <el-breadcrumb-item>订单列表</el-breadcrumb-item>
        </el-breadcrumb>

		<!-- 内容区域 -->
        <el-card> 
			<el-row>
				<el-col :span="6">
					<!-- 搜索 -->
					<el-input placeholder="请输入内容" v-model="orderParams.query" class="input-with-select" clearable>
						<el-button slot="append" icon="el-icon-search" @click="searchOrder"></el-button>
					</el-input>
				</el-col>
			</el-row>

			<el-table :data="orderList.goods" style="100%" border>
				<el-table-column type="index" label="序号" width="80"></el-table-column>
				<el-table-column prop="order_number" label="订单编号"></el-table-column>
				<el-table-column prop="order_price" label="订单价格" width="90"></el-table-column>
				<el-table-column label="是否付款" width="90">
					<template slot-scope="scope">
						<el-tag type="danger" v-if="scope.row.order_pay === '0'">未付款</el-tag>
						<el-tag type="success" v-else>已付款</el-tag>
					</template>
				</el-table-column>
				<el-table-column prop="is_send" label="是否发货" width="90"></el-table-column>
				<el-table-column prop="create_time" label="下单时间" width="200">
					<template slot-scope='scope'>
						{{scope.row.create_time | dataFormat}}
					</template>					
				</el-table-column>
				<el-table-column prop="prop" label="操作" width="150">
					<template slot-scope="scope">
						<el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditDialog(scope.row.order_id)"></el-button>
						<el-button type="success" icon="el-icon-location" size="mini"></el-button>
					</template>
				</el-table-column>
			</el-table>
			
			<!-- 分页 -->
			<el-pagination :total="orderList.total" 				
				@size-change="handleSizeChange"
				@current-change="handleCurrentChange"
				:current-page="orderParams.pagenum"
				:page-sizes="[5, 10, 20, 30]"
				:page-size="orderParams.pagesize" layout="total, sizes, prev, pager, next, jumper">
			 </el-pagination>
		</el-card>

		<!-- 修改地址dialog -->
		<el-dialog
		title="修改地址"
		:visible.sync="editDialogVisible"
		width="50%">
		<el-form ref="editFormRef" :model="formList" :rules="editFormRules" label-width="120px">
			<el-form-item label="省市区/县" prop="prince">
				<el-cascader
					v-model="formList.prince"
					:options="options"
					@change="handleChange">
				</el-cascader>
			</el-form-item>
			<el-form-item label="详细地址" prop="add">
				<el-input v-model="formList.add"></el-input>
			</el-form-item>
		</el-form>
		<span slot="footer" class="dialog-footer">
			<el-button @click="editDialogVisible = false">取 消</el-button>
			<el-button type="primary" @click="addPrince">确 定</el-button>
		</span>
		</el-dialog>

		<!--  -->
	</div>
</template>

<script>
import { regionData, CodeToText } from 'element-china-area-data'
export default {
	name: '',
	data() {
		return {
			value: '',
			orderList: [],
			// 订单配置项
			orderParams: {
				query: '',
				pagenum: 1,
				pagesize: 5,
				user_id:'',
				pay_status:'',
				is_send:'',
				order_fapiao_title:'',
				order_fapiao_company: '',
				order_fapiao_content: '',
				consignee_addr:''
			},
			// 修改地址dialog
			editDialogVisible: false,
			formList: {},
			cascaderKeys: '',
			options: regionData,
			selectedOptions: [],
			editFormRules: {
				add: [
					{required: true, message: '请输入地址', trigger: 'blur'}
				],
				prince: [
					{required: true, message: '请选择市区/县', trigger: 'blur'}
				]
			}
			
		}
	},
	
	methods: {
		// 获取订单列表
		async getOrderList() {
			const {data: res} = await this.$http.get('orders', {params: this.orderParams});
			if(res.meta.status !== 200) return this.$message.error(res.meta.msg);
			this.orderList = res.data;
			console.log(res, regionData, 'orderList：' ,this.orderList);
		},
		// 搜索
		searchOrder () {
			this.getOrderList();
		},
		// 查看物流
		deleteOrder() {
			
		},
		handleChange(value) {
			console.log(value)
 			console.log(CodeToText[this.selectedOptions[0]])
		},
		// 显示修改地址dialog
		showEditDialog(id) {

			this.editDialogVisible = true;
		},
		addPrince() {
			this.$refs.editFormRef.validate(valid=> {
				if(!valid) return;
				this.editDialogVisible = false;
			});
		},

		// 分页
		handleSizeChange(size) {
			this.orderParams.pagesize = size;
			this.getOrderList();
		},
		handleCurrentChange(current) {
			this.orderParams.pagenum = current;
			this.getOrderList();
		}
	},
	created() {
		this.getOrderList();
	},
}
</script>

<style lang='sass' scoped>
.el-cascader
	width: 100%
.el-table
	margin: 30px 0
.el-pagination
	text-align: center
</style>