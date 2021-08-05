<template>
    <div class="reports">
        <!-- 面包屑导航 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>数据统计</el-breadcrumb-item>
            <el-breadcrumb-item>数据报表</el-breadcrumb-item>
        </el-breadcrumb>

        <!-- 内容区域 -->
        <el-card>
            <div id="main" style="width: 600px;height:400px;"></div>
        </el-card>
    </div>
</template>

<script>
import * as echarts from "echarts";
import _ from 'lodash'

export default {
    name: "",
    data() {
        return {};
    },
    components: {},
    methods: {},
    created() {},
    // 实例化完成 可以获取dom
    async mounted() {
        var myChart = echarts.init(document.getElementById("main"));
        const {data: res} = await this.$http.get("reports/type/1");
        // 指定图表的配置项和数据
		if(res.meta.status !== 200) return;
		
        var option = {
            title: {
                text: "用户来源",
            },
            tooltip: {
                trigger: "axis",
                axisPointer: {
                    type: "cross",
                    label: {
                        backgroundColor: "#E9EEF3",
                    },
                },
            },
            grid: {
                left: "3%",
                right: "4%",
                bottom: "3%",
                containLabel: true,
            },
            xAxis: [
                {
                    boundaryGap: false,
                },
            ],
            yAxis: [
                {
                    type: "value",
                },
            ],
        };
		const newOptions = _.merge(res.data, option);
        // 使用刚指定的配置项和数据显示图表。
        myChart.setOption(newOptions);
    },
};
</script>

<style lang='sass' scoped>
</style>