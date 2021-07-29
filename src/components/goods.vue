<template>
    <div class="goods">
        <!-- 面包屑导航 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>商品管理</el-breadcrumb-item>
            <el-breadcrumb-item>商品列表</el-breadcrumb-item>
        </el-breadcrumb>
        <!-- 内容区域 -->
        <el-card> 
			<el-row :gutter="20">
				<el-col :span="8">
					<el-input placeholder="请输入内容" v-model="seachKeys">
						<el-button slot="append" icon="el-icon-search"></el-button>
					</el-input>
				</el-col>
				<el-col :span="4">
					<el-button type="primary">添加商品</el-button>
				</el-col>
			</el-row>
			<el-table :data="goodsList" border>
				<el-table-column type="index" label="序号" width="60"></el-table-column>
				<el-table-column prop="goods_name" label="商品名称"></el-table-column>
				<el-table-column prop="goods_price" label="商品价格(元)" width="150"></el-table-column>
				<el-table-column prop="goods_weight" label="商品重量(千克)" width="150"></el-table-column>
				<el-table-column label="创建时间" width="200">
					<template slot-scope="scope">
						{{scope.row.add_time}}
					</template>
				</el-table-column>
				<el-table-column label="操作" width="200">
					<template>
						插槽
					</template>	
				</el-table-column>
			</el-table>
			<el-pagination
				background
				:page-sizes="[goodsParams.pagesize, 200, 300, 400]"
				:page-size="goodsParams.pagesize"
				:current-page="goodsParams.pagenum"
				@current-change="goodsCurrentChange"
				layout="total, sizes, prev, pager, next, jumper"
				:total="total">
			</el-pagination>
		</el-card>
    </div>
</template>

<script>
export default {
    data() {
        return {
			// 商品列表
			goodsList: [],
			goodsParams: {
				query: "",
				pagenum: 1,
				pagesize: 5
			},
			total: 0,
			seachKeys: '',
		};
    },
    components: {},
    methods: {
		async getGoodsList() {
			const {data: res} = await this.$http.get('goods', {params: this.goodsParams});
			if(res.meta.status !== 200) return this.$msg.error(res.meta.msg);
			console.log(res);
			this.total = res.data.total;
			this.goodsList = res.data.goods;
			this.$msg.success(res.meta.msg);
		},
		goodsCurrentChange() {
		},
	},
    created() {
		this.getGoodsList();
	},
};
</script>

<style lang='sass' scoped>
.el-row,.el-table
	margin-bottom: 20px
.el-pagination
	text-align: center
</style>