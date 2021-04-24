<!--
 * @Descripttion: 
 * @version: X3版本
 * @Author: 叶志文
 * @Date: 2021-04-20 13:14:29
 * @LastEditors: 叶志文
 * @LastEditTime: 2021-04-24 14:11:51
-->
<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item>首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>
    <div style="margin-top: 10px">
      <el-input placeholder="请输入关键字" v-model="queryInfo.query" clearable class="input" @keyup.enter.native="getGoodsList" @clear="getGoodsList">
        <el-button slot="append" icon="el-icon-search" @click="getGoodsList"> </el-button>
      </el-input>
      <el-button type="primary" style="margin-left: 20px" @click="goAddcommodity">添加商品</el-button>
    </div>
    <div class="table">
        <el-card>
      <el-table :data="goodsList" border stripe>
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column
          label="商品名称"
          width="700px"
          prop="goods_name"
        ></el-table-column>
        <el-table-column
          label="商品价格(元)"
          prop="goods_price"
          width="105px"
        ></el-table-column>
        <el-table-column
          label="商品重量"
          prop="goods_weight"
          width="100px"
        ></el-table-column>
        <el-table-column label="创建时间" prop="add_time">
          <template slot-scope="scope">
            {{ scope.row.add_time | dataFormat }}
          </template>
        </el-table-column>
        <!-- ///////////////// -->
        <!-- 操作按钮 -->
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click="amend(scope.row.goods_id)"
            ></el-button>
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              @click="remove(scope.row.goods_id)"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>
        <!-- 分页器 -->
    <!-- 分页区域  size-change 一页显示多少数据   current-change页码值改变 
       :current-page="list.pagenum" 当前的页数 
     :page-sizes  设置每页显示的条数的选项 
       layout 页面的结构 total 共多少条 -->
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="queryInfo.pagenum"
      :page-sizes="[2, 5, 10, 15]"
      :page-size="queryInfo.pagesize"
      layout="total, sizes, prev, pager, next, jumper"  
      :total="total"
    >
    </el-pagination>
        </el-card>
    </div>
    <el-dialog title="编辑商品" :visible.sync="amendshow" width="50%">
      <el-form :model="amendForm" ref="amendFormRef" label-width="70px">
        <el-form-item label="商品名称">
          <el-input v-model="amendForm.goods_name"></el-input>
        </el-form-item>
        <el-form-item label="商品价格">
          <el-input v-model="amendForm.goods_price" type="number"></el-input>
        </el-form-item>
        <el-form-item label="商品数量">
          <el-input v-model="amendForm.goods_number" type="number"></el-input>
        </el-form-item>
        <el-form-item label="商品重量">
          <el-input v-model="amendForm.goods_weight" type="number"></el-input>
        </el-form-item>
      </el-form>
      <!-- 对话框底部按钮区域 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="amendshow = false">取 消</el-button>
        <el-button type="primary" @click="amendGoods">确 定</el-button>
      </span>
    </el-dialog>
  
  </div>
</template>

<script>
import {removeUsers} from "../../http/users"
import Http from "../../http/index";
export default {
  props: {},
  data() {
    return {
      queryInfo: {
        query: "",
        pagenum: 1,
        pagesize: 10,
      },
      //总数居条数
      total: 0,
      //订单列表数据
      goodsList: [],
      // 修改商品的信息
      amendForm: {
        goods_name: "",
        goods_price: null,
        goods_number: null,
        goods_weight: null,
      },
      //每个商品ID
      goods_id: null,
      //控制修改商品信息对话框显示和隐藏
      amendshow: false,
    };
  },
  methods: {
    // 监听pagesize改变的事件
    handleSizeChange(val) {
      this.queryInfo.pagesize = val;
      this.getGoodsList();
    },
    //监听页码值改变
    handleCurrentChange(val) {
      this.queryInfo.pagenum = val;
      this.getGoodsList();
    },
    // 点击让修改商品对话框显示,并保存对应商品ID
    amend(goods_id) {
      this.amendshow = true;
      this.goods_id = goods_id;
      // console.log(this.goods_id)
    },
    //点击确定发送请求
    amendGoods() {
      this.$refs.amendFormRef.validate((valid) => {
        if (!valid) {
          return;
        } else {
          // console.log(this.amendForm);
          Http({
            url: "goods/" + this.goods_id,
            data: {
              goods_name:this.amendForm.goods_name,
              goods_price:this.amendForm.goods_price,
              goods_number:this.amendForm.goods_number,
              goods_weight:this.amendForm.goods_weight,
            },
            method: "put",
          }).then((res) => {
            console.log(res);
          });
          this.amendshow = false;
        }
      });
    },


    //根据id删除用户信息
    async remove(id) {
      // console.log(id);
      //弹框提示
      let confirmResult = await this.$confirm(
        "此操作将删除该数据, 是否继续?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      ).catch((err) => err);
      // console.log(confirmResult);
      if (confirmResult !== "confirm") {
        return this.$message.info("已取消删除");
      } else {
        // url作为参数，所以可以复用此二次封装代码
        removeUsers("goods/" + id).then((res) => {
          if (res.meta.status === 200) {
            this.getGoodsList();
            return this.$message.success(res.meta.msg);
          } else {
            return this.$message.error(res.meta.msg);
          }
        });
      }
    },

  //点击添加商品跳转路由
  goAddcommodity(){
    this.$router.push('/goods/addCommodity')
  },


    //请求数据
    getGoodsList() {
      Http({
        url: "goods",
        params: this.queryInfo,
        method: "get",
      }).then((res) => {
        // console.log(res);
        if (res.meta.status == 200) {
          //保存数据
          this.goodsList = res.data.goods;
          this.total = res.data.total;
          // return this.$message.success(res.meta.msg);
        } else {
          return this.$message.error(res.meta.msg);
        }
      });
    },
  },
  components: {},
  mounted() {
    this.getGoodsList();
  },
};
</script>

<style scoped lang="less">
.input {
  width: 30%;
}
.table {
  margin-top: 10px;
}
</style>
