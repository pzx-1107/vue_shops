<!--
 * @Descripttion: 
 * @version: X3版本
 * @Author: 叶志文
 * @Date: 2021-04-20 13:16:24
 * @LastEditors: 叶志文
 * @LastEditTime: 2021-04-22 17:41:21
-->
<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item>首页</el-breadcrumb-item>
      <el-breadcrumb-item>订单管理</el-breadcrumb-item>
      <el-breadcrumb-item>订单列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片试图区域 -->
    <div class="card">
      <el-card>
        <el-row>
          <el-col :span="8">
            <el-input placeholder="请输入内容">
              <el-button slot="append" icon="el-icon-search"></el-button>
            </el-input>
          </el-col>
        </el-row>
        <!-- 订单列表数据 -->
        <div class="table">
          <el-table :data="orderList" border stripe>
            <el-table-column type="index" label="#"></el-table-column>
            <el-table-column
              label="订单编号"
              prop="order_number"
              width="220px"
            ></el-table-column>
            <el-table-column
              label="订单价格"
              prop="order_price"
            ></el-table-column>
            <el-table-column label="是否付款" prop="pay_status">
              <template slot-scope="scope">
                <el-tag type="success" v-if="scope.row.pay_status === '1'"
                  >已付款</el-tag
                >
                <el-tag type="danger" v-else>未付款</el-tag>
              </template>
            </el-table-column>
            <el-table-column label="是否发货" prop="is_send"></el-table-column>
            <el-table-column label="下单时间" prop="create_time" width="180px">
              <template slot-scope="scope">
                {{ scope.row.create_time | dataFormat }}
              </template>
            </el-table-column>
            <el-table-column label="操作" width="380px">
              <template slot-scope="scope">
                <el-button
                  type="primary"
                  icon="el-icon-edit"
                  size="mini"
                  @click="showBox"
                ></el-button>
                <el-button
                  type="success"
                  icon="el-icon-location"
                  size="mini"
                  @click="showPregross"
                ></el-button>
                <el-button
                  type="info"
                  icon="el-icon-document-copy"
                  size="mini"
                  @click="Theorderdetails(scope.row.order_id)"
                  >订单详情</el-button
                >
                <el-button
                  type="danger"
                  icon="el-icon-setting"
                  size="mini"
                  @click="modifyOrder(scope.row.order_id)"
                  >修改订单状态</el-button
                >
              </template>
            </el-table-column>
          </el-table>
        </div>
        <!-- 修改地址的对话框 -->
        <el-dialog
          title="提示"
          :visible.sync="addressVisible"
          width="50%"
          @close="addressDialogclosed"
        >
          <el-form
            :model="addressForm"
            :rules="addressFormRules"
            ref="addressFormRef"
            label-width="100px"
          >
            <el-form-item label="省市区/县" prop="address1">
              <el-cascader
                :options="ctdata"
                v-model="addressForm.address1"
              ></el-cascader>
            </el-form-item>
            <el-form-item label="详细地址" prop="address2">
              <el-input v-model="addressForm.address2"></el-input>
            </el-form-item>
          </el-form>
          <span slot="footer" class="dialog-footer">
            <el-button @click="addressVisible = false">取 消</el-button>
            <el-button type="primary" @click="addressVisible = false"
              >确 定</el-button
            >
          </span>
        </el-dialog>
        <!-- 显示物流的对话框 -->
        <el-dialog title="物流进度" :visible.sync="PregrossVisible" width="50%">
          <el-timeline>
            <!-- 时间线 -->
            <el-timeline-item
              v-for="(activity, index) in PregrossInfo"
              :key="index"
              :timestamp="activity.time"
            >
              {{ activity.context }}
            </el-timeline-item>
          </el-timeline>
          <span slot="footer" class="dialog-footer"> </span>
        </el-dialog>
        <!-- 订单详情对话框 -->
        <el-dialog
          title="订单详情"
          :visible.sync="TheorderdetailsVisible"
          width="50%"
        >
          <p>用户ID：{{ this.TheorderdetailsInfo.order_id }}</p>
          <br />
          <p>订单编号：{{ this.TheorderdetailsInfo.order_number }}</p>
          <br />
          <p>用户类型：{{ this.TheorderdetailsInfo.order_fapiao_title }}</p>
          <br />
          <p v-if="this.TheorderdetailsInfo.pay_status === 1">
            是否付款：已付款
          </p>
          <p v-else>是否付款：未付款</p>
          <br />
          <p>是否发货：{{ this.TheorderdetailsInfo.is_send }}</p>
        </el-dialog>
        <!-- 修改订单对话框 -->
        <el-dialog
          title="修改订单状态"
          :visible.sync="modifyOrderVisible"
          width="50%"
          @close="ddDialogclosed"
        >
          <!-- 提示消息 -->
          <el-alert title="是否发货：1:已经发货、0:未发货" type="info"> </el-alert>
           <el-alert title="支付方式：1 支付宝、2 微信、3 银行卡" type="info"> </el-alert>
            <el-alert title="订单价格：只能为数字" type="info"> </el-alert>
          
              <el-alert title="支付状态：1 已付款、0 未付款" type="info"> </el-alert>
          <div class="el_formbox">
            <el-form
              :model="modifyOrderInfo"
              ref="modifyorderRef"
              label-width="100px"
            >
              <el-form-item label="是否发货：">
                <el-input v-model="modifyOrderInfo.is_send"></el-input>
              </el-form-item>
              <el-form-item label="支付方式：">
                <el-input v-model="modifyOrderInfo.order_pay"></el-input>
              </el-form-item>
              <el-form-item label="订单价格：">
                <el-input v-model="modifyOrderInfo.order_price"></el-input>
              </el-form-item>
            
              <el-form-item label="支付状态：">
                <el-input v-model="modifyOrderInfo.pay_status"></el-input>
              </el-form-item>
            </el-form>
          </div>
          <span slot="footer" class="dialog-footer">
            <el-button @click="modifyOrderVisible = false">取 消</el-button>
            <el-button type="primary" @click="modifyOrderTrue">确 定</el-button>
          </span>
        </el-dialog>
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
  </div>
</template>

<script>
import Http from "../../http/index";
import ctdata from "../../http/ctdata";
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
      orderList: [],
      //控制修改地址对话框的显示和隐藏
      addressVisible: false,
      addressForm: {
        address1: [],
        address2: "",
      },
      //修改地址表单验证规则
      addressFormRules: {
        address1: [
          { required: true, message: "请选择省市区/县", trigger: "blur" },
        ],
        address2: [
          { required: true, message: "请填写详细地址", trigger: "blur" },
        ],
      },
      //全国地址
      ctdata,

      //控制物流对话框显示和隐藏
      PregrossVisible: false,
      //保存物流信息
      PregrossInfo: [],
      //控制订单详情对话框显示和隐藏
      TheorderdetailsVisible: false,
      //保存订单详情数据
      TheorderdetailsInfo: {},
      //控制修改订单对话框显示和隐藏
      modifyOrderVisible: false,
      //监听修改订单对话框的数据
      modifyOrderInfo: {
        is_send: "",
        order_pay: "",
        order_price: null,
        pay_status: "",
      },
      //保存修改订单对应id
      order_id: {
        order_id: null,
      },
      //修改订单详情验证规则
    };
  },
  mounted() {
    //调用请求数据
    this.getOderList();
  },
  methods: {
    // 监听pagesize改变的事件
    handleSizeChange(val) {
      this.queryInfo.pagesize = val;
      this.getOderList();
    },
    //监听页码值改变
    handleCurrentChange(val) {
      this.queryInfo.pagenum = val;
      this.getOderList();
    },
    //展示修改地址的对话框
    showBox() {
      this.addressVisible = true;
    },
    //监听地址对话框状态
    addressDialogclosed() {
      //resetFields清空表单
      this.$refs.addressFormRef.resetFields();
    },
    //展示物流信息的对话框，并获取数据
    showPregross() {
      Http({
        url: "/kuaidi/1106975712662",
        method: "get",
      }).then((res) => {
        // console.log(res);
        this.PregrossInfo = res.data.data;
      });
      this.PregrossVisible = true;
    },
    //查看订单详情并显示对话框
    Theorderdetails(order_id) {
      // console.log(order_id);
      Http({
        url: `orders/+${order_id}`,
      }).then((res) => {
        this.TheorderdetailsInfo = res.data;
        // console.log(this.TheorderdetailsInfo);
      });
      this.TheorderdetailsVisible = true;
    },
    //显示对话框并保存对应ID
    modifyOrder(order_id) {
      // console.log(order_id);
      //保存id值
      this.order_id.order_id = order_id;
      // console.log(this.order_id.order_id);
      //显示对话框
      this.modifyOrderVisible = true;
    },
    //修改订单详情
    modifyOrderTrue() {
      this.$refs.modifyorderRef.validate((valid) => {
        if (!valid) {
          return;
        } else {
          this.modifyOrderVisible = false;
          Http({
            url: "orders/" + this.order_id.order_id,
            method: "put",
            data: {
              is_send: this.modifyOrderInfo.is_send,
              order_pay: this.modifyOrderInfo.order_pay,
              order_price: this.modifyOrderInfo.order_price,
              pay_status: this.modifyOrderInfo.pay_status,
            },
          }).then((res) => {
            // console.log(res);
            if (res.meta.status === 201) {
              this.getOderList();
              return this.$message.success(res.meta.msg);
            } else {
              return this.$message.error(res.meta.msg);
            }
          });
        }
      });
    },
    //监听修改订单对话框状态
    ddDialogclosed() {
      this.$refs.modifyorderRef.resetFields();
    },

    //请求数据
    getOderList() {
      Http({
        url: "orders",
        params: this.queryInfo,
        method: "get",
      }).then((res) => {
        // console.log(res);
        if (res.meta.status == 200) {
          //保存数据
          this.orderList = res.data.goods;
          this.total = res.data.total;
          return this.$message.success(res.meta.msg);
        } else {
          return this.$message.error(res.meta.msg);
        }
      });
    },
  },
  components: {},
};
</script>

<style scoped>
.card {
  margin-top: 10px;
}
/* *{
  margin: 0;
  padding: 0;
} */
.table {
  margin-top: 10px;
}
.el-cascader {
  width: 100%;
}
.el_formbox {
  margin-top: 10px;
}
</style>
