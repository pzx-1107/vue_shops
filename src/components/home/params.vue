<!--
 * @Descripttion: 
 * @version: X3版本
 * @Author: 叶志文
 * @Date: 2021-04-20 13:15:00
 * @LastEditors: 叶志文
 * @LastEditTime: 2021-04-24 16:00:15
-->
<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item>首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>分类参数</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-alert
        title="注意：只允许为第三级分类设置相关参数！"
        type="warning"
        show-icon
        :closable="false"
      >
      </el-alert>
      <el-row>
        <span>选择商品分类：</span>
        <el-cascader
          prop="cat_pid"
          v-model="selectedKeys"
          :options="catelist"
          expand-trigger="hover"
          :props="paramsProps"
          @change="handleChange"
          clearable
          change-on-select
        ></el-cascader>
      </el-row>
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="动态参数" name="many">
          <el-button type="primary" size="mini" :disabled="isButton"
            >添加参数</el-button
          >
          <el-table :data="manyData" border style="width: 100%">
            <el-table-column type="expand"> </el-table-column>
            <el-table-column type="index" label="#"> </el-table-column>
            <el-table-column prop="attr_name" label="参数名称">
            </el-table-column>
            <template>
              <el-table-column label="操作">
                <el-button type="primary" icon="el-icon-edit" size="mini"
                  >编辑</el-button
                >
                <el-button type="danger" icon="el-icon-delete" size="mini"
                  >删除</el-button
                >
              </el-table-column>
            </template>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="静态属性" name="only">
          <el-button type="primary" size="mini" :disabled="isButton"
            >添加属性</el-button
          >
          <el-table :data="onlyData" border style="width: 100%">
            <el-table-column type="expand"> </el-table-column>
            <el-table-column type="index" label="#"> </el-table-column>
            <el-table-column prop="attr_name" label="属性名称">
            </el-table-column>
            <template>
              <el-table-column label="操作">
                <el-button type="primary" icon="el-icon-edit" size="mini"
                  >编辑</el-button
                >
                <el-button type="danger" icon="el-icon-delete" size="mini"
                  >删除</el-button
                >
              </el-table-column>
            </template>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-card>
  </div>
</template>

<script>
import Http from "../../http/index";

export default {
  props: {},
  data() {
    return {
      catelist: [],
      selectedKeys: [],
      parentCateList: [],
      // 级联选择框的配置对象
      paramsProps: {
        value: "cat_id",
        label: "cat_name",
        children: "children",
      },
      activeName: "many",
      manyData: [],
      onlyData: [],
    };
  },
  created() {
    this.getCatelist();
  },
  methods: {
    getCatelist() {
      Http({
        url: "/categories",
        method: "get",
      }).then((res) => {
        // console.log(res.data);
        this.catelist = res.data;
      });
    },
    handleChange() {
      if (this.selectedKeys.length !== 3) {
        this.selectedKeys = [];
      }
      Http({
        url: `categories/${this.cateId}/attributes`,
        params: {
          sel: this.activeName,
        },
        method: "get",
      }).then((res) => {
        if (this.activeName === "many") {
          this.manyData = res.data;
        } else {
          this.onlyData = res.data;
        }
      });
    },
    handleClick() {
      console.log(this.activeName);
    },
  },
  computed: {
    isButton() {
      if (this.selectedKeys.length !== 3) {
        return true;
      }
      return false;
    },
    // 当前选中的三级分类
    cateId() {
      if (this.selectedKeys.length === 3) {
        return this.selectedKeys[2];
      }
      return null;
    },
  },
  components: {},
};
</script>

<style scoped>
.el-card {
  margin-top: 10px;
}
.el-row {
  margin: 10px 0;
}
.el-table {
  margin: 10px 0;
}
</style>
