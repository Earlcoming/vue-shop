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
					<el-input placeholder="请输入内容" v-model="goodsParams.query" clearable>
						<el-button slot="append" icon="el-icon-search" @click="getGoodsList"></el-button>
					</el-input>
				</el-col>
				<el-col :span="4">
					<el-button type="primary" @click="addGoods">添加商品</el-button>
				</el-col>
			</el-row>
			<el-table :data="goodsList" border>
				<el-table-column type="index" label="序号" width="60"></el-table-column>
				<el-table-column prop="goods_name" label="商品名称"></el-table-column>
				<el-table-column prop="goods_price" label="商品价格(元)" width="150"></el-table-column>
				<el-table-column prop="goods_weight" label="商品重量(千克)" width="150"></el-table-column>
				<el-table-column label="创建时间" width="200">
					<template slot-scope="scope">
						{{scope.row.upd_time | dataFormat}}
					</template>
				</el-table-column>
				<el-table-column label="操作" width="200">
					<template slot-scope="scope">
						<el-button type="primary" icon="el-icon-edit" size="mini">编辑</el-button>
						<el-button type="danger" icon="el-icon-delete" size="mini" @click="deleteGoods(scope.row.goods_id)">删除</el-button>
					</template>	
				</el-table-column>
			</el-table>
			<!-- 分页 -->
			<el-pagination
				background
				:page-sizes="[5, 10, 20, 30]"
				:page-size="goodsParams.pagesize"
				:current-page="goodsParams.pagenum"
				@current-change="goodsCurrentChange"
				@size-change="goodsSizeChange"
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
		// 获取商品列表
		async getGoodsList() {
			const {data: res} = await this.$http.get('goods', {params: this.goodsParams});
			if(res.meta.status !== 200) return this.$msg.error(res.meta.msg);
			console.log(res);
			this.total = res.data.total;
			this.goodsList = res.data.goods;
			this.$msg.success(res.meta.msg);
		},
		goodsCurrentChange(page) {
			this.goodsParams.pagenum = page;
			this.getGoodsList();
		},
		goodsSizeChange(size) {
			this.goodsParams.pagesize = size;
			this.getGoodsList();
		},
		// 删除商品
		async deleteGoods(id) {
			const {data: res} = await this.$http.delete('goods/' + id);
			console.log(res);
			if(res.meta.status !== 200) return this.$msg.error(res.meta.msg);
			this.goodsList();
			this.$msg.success(res.meta.msg);
		},
		addGoods() {
			this.$router.push({name: 'add'})
		}

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