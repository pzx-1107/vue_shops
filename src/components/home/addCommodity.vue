<!--
 * @Descripttion: 
 * @version: X3版本
 * @Author: 叶志文
 * @Date: 2021-04-23 14:14:59
 * @LastEditors: 叶志文
 * @LastEditTime: 2021-04-24 11:23:20
-->
<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item>首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>添加商品 </el-breadcrumb-item>
    </el-breadcrumb>
    <div class="add">
      <el-card>
        <!-- 警示信息 -->
        <el-alert
          title="添加商品信息"
          type="info"
          center
          :closable="false"
          show-icon
        >
        </el-alert>
        <!-- 进度条 -->
        <div class="bar">
          <el-steps
            align-center
            :active="activeIndex - 0"
            finish-status="success"
          >
            <el-step title="基本信息"></el-step>
            <el-step title="商品参数"></el-step>
            <el-step title="商品属性"></el-step>
            <el-step title="商品图片"></el-step>
            <el-step title="商品内容"></el-step>
            <el-step title="完成"></el-step>
          </el-steps>
        </div>
        <el-form
          :model="addcommForm"
          :rules="addcommrules"
          ref="addcommRef"
          label-width="100px"
          label-position="top"
        >
          <el-tabs
            v-model="activeIndex"
            :tab-position="'left'"
            :before-leave="beforeTab"
            @tab-click="tabClicked"
          >
            <el-tab-pane label="基本信息" name="0">
              <el-form-item label="商品名称" prop="goods_name">
                <el-input v-model="addcommForm.goods_name"></el-input>
              </el-form-item>
              <el-form-item label="商品价格" prop="goods_price">
                <el-input
                  v-model="addcommForm.goods_price"
                  type="number"
                ></el-input>
              </el-form-item>
              <el-form-item label="商品重量" prop="goods_weight">
                <el-input
                  v-model="addcommForm.goods_weight"
                  type="number"
                ></el-input>
              </el-form-item>
              <el-form-item label="商品数量" prop="goods_number">
                <el-input
                  v-model="addcommForm.goods_number"
                  type="number"
                ></el-input>
              </el-form-item>
              <el-form-item label="商品分类" prop="goods_cat">
                <el-cascader
                  v-model="addcommForm.goods_cat"
                  :options="catelist"
                  :props="cateProps"
                  expandTrigger="hover"
                  @change="handleChange"
                >
                </el-cascader>
              </el-form-item>
            </el-tab-pane>
            <el-tab-pane label="商品参数" name="1">
              <!-- 渲染参数表单区域 -->
              <!-- 将保存的商品参数manyTabDate循环遍历 -->
              <el-form-item
                :label="item.attr_name"
                v-for="item in manyTabDate"
                :key="item.attr_id"
              >
                <!-- 复选框 -->
                <el-checkbox-group v-model="item.attr_vals">
                  <el-checkbox
                    :label="cb"
                    border
                    v-for="(cb, index) in item.attr_vals"
                    :key="index"
                  ></el-checkbox>
                </el-checkbox-group>
              </el-form-item>
            </el-tab-pane>
            <el-tab-pane label="商品属性" name="2">
              <!-- 商品属性 -->
              <el-form-item
                :label="item.attr_name"
                v-for="item in onlyTabDate"
                :key="item.attr_id"
              >
                <el-input v-model="item.attr_vals"></el-input>
              </el-form-item>
            </el-tab-pane>
            <el-tab-pane label="商品图片" name="3">
              <!-- 商品图片 -->
              <!-- action	必选参数，上传的地址 -->
              <!--  :on-preview="handlePreview" 用来处理图片预览事件（用不上） -->
              <!--  :on-remove="handleRemove"  点击x触发 -->
              <el-upload
                class="upload-demo"
                action="http://192.168.1.22:8888/api/private/v1/upload"
                :on-remove="handleRemove"
                :on-preview="handlePreview"
                :on-success="imgOk"
                :headers="headersObj"
                list-type="picture"
              >
                <el-button size="small" type="primary">点击上传</el-button>
              </el-upload>
            </el-tab-pane>
            <el-tab-pane label="商品内容" name="4">
              <!-- //富文本编辑器 -->
              <quill-editor v-model="addcommForm.goods_introduce">
                
              </quill-editor>
              <!-- 添加商品按钮 -->
              <el-button type="primary" class="button" @click="add">添加商品</el-button>
            </el-tab-pane>
          </el-tabs>
        </el-form>
      </el-card>
    </div>
       <!-- 预览图片的对话框 -->
      <el-dialog title="图片预览" :visible.sync="ImgVisible" width="50%">
        <img :src="previewUrl" alt="" class="img" />
        </el-dialog>
  </div>
</template>

<script>
import _ from "lodash"
import Http from "../../http/index";
export default {
  props: {},
  data() {
    return {
      activeIndex: "0",
      // 添加商品表单数据对象
      addcommForm: {
        goods_name: "",
        goods_price: 0,
        goods_weight: 0,
        goods_number: 0,
        //商品所属的分类数组
        goods_cat: [],
        //图片上传成功时的临时路径
        pics: [],
       //富文本编辑器双向绑定数据(商品详情描述)
        goods_introduce:"",
        //处理过的动态参数和静态属性
        attrs:[]
      },
      //添加商品表单验证规则
      addcommrules: {
        goods_name: [
          { required: true, message: "请输入商品名称", trigger: "blur" },
        ],
        goods_price: [
          { required: true, message: "请输入商品价格", trigger: "blur" },
        ],
        goods_number: [
          { required: true, message: "请输入商品数量", trigger: "blur" },
        ],
        goods_weight: [
          { required: true, message: "请输入商品重量", trigger: "blur" },
        ],
        goods_cat: [
          { required: true, message: "请选择商品分类", trigger: "blur" },
        ],
      },
      //保存商品分类数据
      catelist: [],
      //代表级联选择器的配置项
      cateProps: {
        //看到的哪个属性
        label: "cat_name",
        //选中的哪个属性
        value: "cat_id",
        children: "children",
      },
      //保存商品参数数据
      manyTabDate: [],
      //保存商品属性数据
      onlyTabDate: [],
      //上传图片请求时添加的请求头
      headersObj: {
        Authorization: window.sessionStorage.getItem("token"),
      },
      //保存预览图片的url地址
      previewUrl: "",
      //控制预览图片对话框显示和隐藏
      ImgVisible: false,

   
     
    };
  },
  methods: {
    //获取商品分类数数据
    getCatelist() {
      Http({
        url: "categories",
      }).then((res) => {
        this.catelist = res.data;
        // console.log(this.catelist);
      });
    },
    //级联选择器选中项变化，会触发这个函数
    handleChange() {
      if (this.addcommForm.goods_cat.length !== 3) {
        this.addcommForm.goods_cat = [];
        return this.$message.error("只能选择三级分类");
      }
    },
    //activeName即将进入的标签名
    //oldactiveName即将离开的标签名
    beforeTab(activeName, oldactiveName) {
      // 判断即将离开的name是否为0并且判断选项长度是否为3
      if (oldactiveName === "0" && this.addcommForm.goods_cat.length !== 3) {
        this.$message.error("请先选择商品分类");
        return false;
      }
    },
    //点击标签页时触发的函数
    tabClicked() {
      //如果标签页下标是1 访问的是动态参数面板
      if (this.activeIndex === "1") {
        Http({
          url: `categories/${this.cateID}/attributes`,
          params: {
            sel: "many",
          },
        }).then((res) => {
          //  console.log(res.data);
          res.data.forEach((item) => {
            //三元判断，判断attr_vals是否等于0，如果等于0返回空的数组，否者返回分割后的
            item.attr_vals =
              item.attr_vals.length === 0 ? [] : item.attr_vals.split(",");
            //   console.log(item.attr_vals)
          });
          //保存商品参数数据
          this.manyTabDate = res.data;
          if (this.manyTabDate.length === 0) {
            return this.$message.error("此商品参数无");
          }
        });
        //如果标签页下标是2 访问的是商品属性面板
      } else if (this.activeIndex === "2") {
        Http({
          url: `categories/${this.cateID}/attributes`,
          params: {
            sel: "only",
          },
        }).then((res) => {
          //保存商品属性数据
          this.onlyTabDate = res.data;
          //   console.log(this.onlyTabDate);
          if (this.onlyTabDate.length === 0) {
            return this.$message.error("此商品属性无");
          }
        });
      }
    },
    //预览图片操作
    handlePreview(file) {
      console.log(file);
      this.previewUrl =file.response.data.url;
      this.ImgVisible = true;
    },
    // 处理移除图片操作/同时要删除对应临时图片路径
    // <!--  :on-remove="handleRemove"  点击x触发 -->
    handleRemove(file) {
      // 获取将要删除的图片临时路径
      //当前要移除的临时图片路径
      const filePath = file.response.data.tmp_path;
      // 找到pics数组中对应图片的索引值
      //findindex方法中形参代表数组pics中的每一项
      //如果形参下面的pics属性正好等于要移除的临时图片路径的时候
      //调用splice删除数组对应下标的第一项
      const index = this.addcommForm.pics.findIndex((a) => a.pics === filePath);
      // 调用splice方法，把图片信息对象移除
      this.addcommForm.pics.splice(index, 1);
      // console.log(this.addcommForm);
    },
    //文件上传成功时触发
    imgOk(res) {
      // console.log(res);
      // 拼接得到一个图片信息对象
      // 将图片信息对象push到pics数组中
      if (res.meta.status == 200) {
        //pics是个数组把得到的变为对象再push在数组中
        const picsInfo = { pics: res.data.tmp_path };
        this.addcommForm.pics.push(picsInfo);
        console.log(this.addcommForm);
        return this.$message.success(res.meta.msg);
      }
    },

    //添加商品的处理函数
    add(){
      this.$refs.addcommRef.validate((valid)=>{
        if(!valid){
          return this.$message.error('需填写必要的表单项')
        }else{
          //转为字符串之前的做一次深拷贝，因为级联选择器规定goods_cat只能为一个数组格式
          //loadsh库cloneDeep方法
          //将数组转为字符串
         const cbaddcommForm= _.cloneDeep(this.addcommForm)
       cbaddcommForm.goods_cat=cbaddcommForm.goods_cat.join(',')
      //处理动态参数
      this.manyTabDate.forEach(item=>{
        const newInfo={
          attr_id:item.attr_id,
          attr_value:item.attr_vals.join(' '),
        }
        this.addcommForm.attrs.push(newInfo)
      })
      //处理静态属性
     this.onlyTabDate.forEach(item=>{
        const newInfo={
          attr_id:item.attr_id,
          attr_value:item.attr_vals,
        }
        this.addcommForm.attrs.push(newInfo)
      })
      //把addcommForm.attrs赋值给拷贝过的cbaddcommForm.attrs  数据提交时提交的是cbaddcommForm
    cbaddcommForm.attrs=this.addcommForm.attrs
    console.log(cbaddcommForm);
       //发送添加商品请求
       Http({
         url:'goods',
         method:'post',
         data:cbaddcommForm,
       }).then(res=>{
        //  console.log(res)
        if(res.meta.status===201){
           this.$router.push('/home/goods')
          return this.$message.success(res.meta.msg)
        }
       })
        }
      })
    }
  },
  //计算属性
  computed: {
    cateID() {
      //如果goods_cat长度为3.那么返回数组下标为2的
      if (this.addcommForm.goods_cat.length === 3) {
        return this.addcommForm.goods_cat[2];
      }
      return null;
    },
  },
  mounted() {
    this.getCatelist();
  },
  components: {},
};
</script>

<style scoped lang="less">
.add,
.bar {
  margin-top: 10px;
}
.el-tabs {
  margin-top: 15px;
}
.el-dialog__body{
  height: 100%;
}
.img {
 width: 100%;
}
.button{
  margin-top: 10px;
}

</style>
