<!--
 * @Descripttion: 
 * @version: X3版本
 * @Author: 叶志文
 * @Date: 2021-04-20 13:14:01
 * @LastEditors: 叶志文
 * @LastEditTime: 2021-04-20 13:14:10
-->
<template>
    <div>
        <el-breadcrumb separator-class="el-icon-arrow-right">
           <el-breadcrumb-item>首页</el-breadcrumb-item>
           <el-breadcrumb-item>权限管理</el-breadcrumb-item>
           <el-breadcrumb-item>权限列表</el-breadcrumb-item>
        </el-breadcrumb>
        <el-card >
            <el-row>
                <el-col>
                    <el-button type="primary">添加角色</el-button>
                </el-col>
            </el-row>
            <el-table border stripe :data="rightsList">
                <el-table-column type="index" label="#"> 
                </el-table-column>
                <el-table-column label="角色名称" prop="authName"> 
                </el-table-column>
                <el-table-column label="路径" prop="path"> 
                </el-table-column>
                <el-table-column label="权限等级" prop="level"> 
                    <template slot-scope="scope">
                        <el-tag v-if="scope.row.level === '0'">标签一</el-tag>
                        <el-tag type="success" v-if="scope.row.level === '1'">标签二</el-tag>
                        <el-tag type="info" v-if="scope.row.level === '2'">标签三</el-tag>
                    </template>
                </el-table-column>
            </el-table>
        </el-card>
    </div>
</template>

<script>
import Http from "./../../http/index";

export default {
    props: {

    },
    data() {
        return {
            rightsList: []
        };
    },
    created() {
        this.getRightsList()
    },
    methods: {
        getRightsList() {
               Http({
            url: '/rights/list',
        }).then(res => {
            console.log(res.data)
            this.rightsList = res.data
        })
        }
    },
    components: {

    },
};
</script>

<style scoped lang="less">

</style>
