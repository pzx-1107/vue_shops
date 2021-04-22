<!--
 * @Descripttion: 
 * @version: X3版本
 * @Author: 叶志文
 * @Date: 2021-04-14 14:14:06
 * @LastEditors: 叶志文
 * @LastEditTime: 2021-04-20 12:29:03
-->
<template>
  <div id="app">
    <div class="login">
      <div class="login1"><img src="../assets/logo.png" alt="" /></div>
      <el-form
        :model="ruleForm"
        :rules="rules"
        ref="ruleForm"
        class="demo-ruleForm"
      >
        <el-form-item prop="name">
          <el-input
            v-model="ruleForm.name"
            prefix-icon="el-icon-user-solid"
          ></el-input>
        </el-form-item>
        <el-form-item prop="pass">
          <el-input
            v-model="ruleForm.pass"
            show-password
            prefix-icon="el-icon-lock"
          ></el-input>
        </el-form-item>
        <el-form-item class="btns">
          <el-button type="primary" @click="submitForm('ruleForm')"
            >登录</el-button
          >
          <el-button @click="resetForm('ruleForm')">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import Http from "../http/index";
export default {
  props: {},
  data() {
    return {
      ruleForm: {
        name: "admin",
        pass: "123456",
      },
      rules: {
        name: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          { min: 3, max: 6, message: "长度在 3 到 6 个字符", trigger: "blur" },
        ],
        pass: [
          { required: true, message: "请输入密码", trigger: "blur" },
          {
            min: 5,
            max: 11,
            message: "长度在 5 到 11 个字符",
            trigger: "blur",
          },
        ],
      },
    };
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          Http({
            url: "/login",
            data: {
              username: this.ruleForm.name,
              password: this.ruleForm.pass,
            },
            method: "post",
          }).then((res) => {
            console.log(res);
            this.$message({
              message: res.meta.msg, //提示消息
              type: "success", //成功类型
              druation: 1000, //消失时间
              //   onClose, 参数为被关闭的 message 实例
              onClose: () => {
                if (res.meta.status == 200) {
                 sessionStorage.setItem("token", res.data.token);
                  this.$router.replace("/home");
                }
              },
            });
          });
        } else {
          return false;
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
  },
  components: {},
};
</script>

<style scoped lang="less">
  #app {
    position: relative;
    width: 100%;
    height: 100%;
    background-color: #2b4b6b;
    .login {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 45%;
      height: 300px;
      background-color: #fff;
      border-radius: 10px;
      // padding: 0 20px;
      .login1 {
        width: 100px;
        height: 100px;
        position: absolute;
        left: 50%;
        transform: translate(-50%, -50%);
        background-color: #eee;
        border-radius: 50%;
        border: 10px solid #fff;
        box-shadow: 0 0 15px #ccc;
        img {
          width: 100%;
          border-radius: 50%;
        }
      }
      .el-form{
        position: absolute;
        top: 60%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 92%;
        background-color: #fff;

        .btns {
          display: flex;
          justify-content: flex-end;
        }
      }
    }
     
  }

</style>
