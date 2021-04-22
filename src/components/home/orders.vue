<!--
 * @Descripttion: 
 * @version: X3版本
 * @Author: 叶志文
 * @Date: 2021-04-20 13:16:24
 * @LastEditors: 叶志文
 * @LastEditTime: 2021-04-22 10:09:13
-->
<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item>首页</el-breadcrumb-item>
      <el-breadcrumb-item>订单管理</el-breadcrumb-item>
      <el-breadcrumb-item>订单列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片试图区域 -->
    <el-card>
      <el-row>
        <el-col :span="8">
          <el-input placeholder="请输入内容" >
            <el-button slot="append" icon="el-icon-search"></el-button>
          </el-input>
        </el-col>
      </el-row>
    </el-card>
  </div>
</template>

<script>
import Http from "../../http/index"
export default {
  props: {},
  data() {
    return {
        queryInfo:{
            query:"",
            pagenum:1,
            pagesize:10,
        }
    };
  },
  mounted(){
      this.getOderList()
  },
  methods: {
      getOderList(){
          Http({
              url:'orders',
              params:this.queryInfo,
               method: 'get',
          }).then(res=>{
              console.log(res);
          })
      }
  },
  components: {},
};
</script>

<style scoped lang="less">
</style>
