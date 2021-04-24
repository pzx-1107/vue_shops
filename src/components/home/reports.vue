<!--
 * @Descripttion: 
 * @version: X3版本
 * @Author: 叶志文
 * @Date: 2021-04-20 13:17:16
 * @LastEditors: 叶志文
 * @LastEditTime: 2021-04-24 16:00:54
-->
<template>
    <div>
        <div class="pilot">
        <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>数据统计</el-breadcrumb-item>
        <el-breadcrumb-item>数据列表</el-breadcrumb-item>
        </el-breadcrumb>
        </div>
      <el-card>
        <div id="main"></div>
      </el-card>

    </div>
</template>

<script>
import * as echarts from "echarts"
import {num_axios} from "../../http/reports"
export default {
    props: {

    },
    data() {
        return {

        };
    },
    methods: {

    },
    components: {

    },
    mounted(){
      num_axios().then(res=>{
        //   console.log(res);
            var chartDom = document.getElementById('main');
            var myChart = echarts.init(chartDom);
            var option;
            option = {
            title: {
                text: '用户来源'
            },
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'cross',
                    label: {
                        backgroundColor: '#E9EEF3'
                    }
                }
            },
            legend: {
                data:res.data.legend.data
            },
            toolbox: {
                feature: {
                    saveAsImage: {}
                }
            },
            grid: {
                left: '3%',
                right: '4%',
                bottom: '3%',
                containLabel: true
            },
            xAxis: [
                {
                    type: 'category',
                    boundaryGap: false,
                    data:res.data.xAxis[0].data
                }
            ],
            yAxis: [
                {
                    type: 'value'
                }
            ],
            series:res.data.series
        };

        option && myChart.setOption(option);

      })
    }
};
</script>

<style scoped lang="less">
.pilot{
    margin-bottom:20px;
}
el-card{
    background-color: #fff;
}
#main{
    width:1200px;
    height:500px;
    box-sizing: border-box;
}


</style>