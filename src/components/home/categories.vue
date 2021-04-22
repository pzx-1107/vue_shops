<!--
 * @Descripttion: 
 * @version: X3版本
 * @Author: 叶志文
 * @Date: 2021-04-20 13:15:33
 * @LastEditors: 叶志文
 * @LastEditTime: 2021-04-20 13:15:33
-->
<template>
    <div>
        <el-breadcrumb separator-class="el-icon-arrow-right">
           <el-breadcrumb-item>首页</el-breadcrumb-item>
           <el-breadcrumb-item>商品管理</el-breadcrumb-item>
           <el-breadcrumb-item>商品分类</el-breadcrumb-item>
        </el-breadcrumb>
        <!-- 卡片试图 -->
        <el-card>
            <el-row>
                <el-button type="primary">添加分类</el-button>
            </el-row>
            <tree-table :data="catelist" :columns="columns"
            :expand-type="false" :selection-type="false" show-index
            index-text="#" border>
                <!-- <template>
                    <el-row>
                    
                    </el-row>
                </template> -->
            </tree-table>
        </el-card>
    </div>
   
</template>

<script>
import Http from '../../http/index';
export default {
    props: {

    },
    data() {
        return {
            catelist: [],
            columns: [
                {
                    label: '分类名称',
                    prop: 'cat_name'
                }
            ]
        };
    },
    created() {
        this.getCatelist()
    },
    methods: {
        getCatelist() {
            Http({
                url: '/categories',
                method: 'get'
            }).then(res => {
                console.log(res.data)
                this.catelist = res.data
            })
        }
    },
    components: {

    },
};
</script>

<style scoped>
    .el-card {
        margin-top: 10px;
    }
</style>
