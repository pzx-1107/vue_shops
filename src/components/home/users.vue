<!--
 * @Descripttion: 
 * @version: X3版本
 * @Author: 叶志文
 * @Date: 2021-04-20 12:30:52
 * @LastEditors: 叶志文
 * @LastEditTime: 2021-04-23 10:09:26
-->
<template>
  <div id="users">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item>首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- //搜索添加 -->
    <div class="search">
      <el-input placeholder="请输入内容" v-model="queryInfo.Id" class="input"  @keyup.enter.native="serachId" @clear="fn" clearable>
        <el-button slot="append" icon="el-icon-search" @click="serachId" >
        </el-button>
      </el-input>
      <el-button
        type="primary"
        style="margin-left: 20px"
        @click="addshow = true"
        >添加用户</el-button
      >
    </div>
    <template>
      <el-card>
        <el-table :data="userlist" border style="width: 100%">
          <el-table-column fixed prop="id" label="#" width="70">
          </el-table-column>
          <el-table-column prop="username" label="姓名" width="170">
          </el-table-column>
          <el-table-column prop="email" label="邮箱" width="170">
          </el-table-column>
          <el-table-column prop="mobile" label="电话" width="170">
          </el-table-column>
          <el-table-column prop="role_name" label="角色" width="170">
          </el-table-column>
          <el-table-column label="状态" width="170">
            <!-- 状态按钮 -->
            <template slot-scope="scope">
              <el-switch
                v-model="scope.row.mg_state"
                active-color="blue"
                inactive-color="#ff4949"
                @change="userstateChange(scope.row)"
              >
              </el-switch>
            </template>
          </el-table-column>
          <el-table-column fixed="right" label="操作" width="300">
            <template slot-scope="scope">
              <!-- 操作按钮 -->
              <el-button
                type="primary"
                icon="el-icon-edit"
                size="mini"
                @click="amendusers(scope.row.id)"
              ></el-button>
              <el-button
                type="danger"
                icon="el-icon-delete"
                size="mini"
                @click="remove(scope.row.id)"
              ></el-button>
              <el-button
                type="warning"
                icon="el-icon-s-tools"
                size="mini"
                @click="assignRoles(scope.row)"
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
    </template>
    <!-- 添加用户的对话框 -->
    <el-dialog
      title="添加用户"
      :visible.sync="addshow"
      width="50%"
      @close="addClose"
    >
      <!-- 内容主题区域 -->
      <el-form
        :model="addForm"
        :rules="addFormrules"
        ref="addFormRef"
        label-width="70px"
      >
        <el-form-item label="用户名" prop="username">
          <el-input v-model="addForm.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="addForm.password"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="addForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
          <el-input v-model="addForm.mobile"></el-input>
        </el-form-item>
      </el-form>

      <!-- 对话框底部按钮区域 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="addshow = false">取 消</el-button>
        <el-button type="primary" @click="addusers">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 修改用户信息 -->
    <el-dialog title="修改用户" :visible.sync="amendshow" width="50%">
      <!-- 内容主题区域 -->
      <el-form
        :model="amendForm"
        :rules="amendFormrules"
        ref="amendFormRef"
        label-width="70px"
      >
        <el-form-item label="用户名">
          <el-input v-model="amendForm.username" disabled></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="amendForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
          <el-input v-model="amendForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <!-- 对话框底部按钮区域 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="amendshow = false">取 消</el-button>
        <el-button type="primary" @click="xiougai">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 分配角色区域 -->
    <el-dialog
      title="分配角色"
      :visible.sync="setRoleDialogVisible"
      width="50%"
    >
      <div>
        <p>当前的用户：{{ userInfo.username }}</p>
        <p>当前的角色：{{ userInfo.role_name }}</p>
        <p>
          分配新的角色：
          <el-select v-model="selectedRoleid" placeholder="请选择">
            <el-option
              v-for="item in rolesList"
              :key="item.id"
              :label="item.roleName"
              :value="item.id"
            >
            </el-option>
          </el-select>
        </p>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="setRoleDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveRoleInfo">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>       

<script>
import Http from "./../../http/index";
import {
  usersList,
  usersListAdd,
  mg_state_alter,
  usersIdSearch,
  amendUsers,
  removeUsers,
  assignRole,
} from "../../http/users";
export default {
  props: {},
  data() {
    //自定义验证规则
    //邮箱
    let checkEmail = (rule, value, cb) => {
      const regEmail = /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/;
      if (regEmail.test(value)) {
        return cb();
      }
      cb(new Error("请输入正确的邮箱"));
    };
    //手机号

    let checkmobile = (rule, value, cb) => {
      const regEmail = /^(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\d{8}$/;
      if (regEmail.test(value)) {
        return cb();
      }
      cb(new Error("请输入正确的手机号"));
    };

    return {
      addshow: false, //控制添加用户对话框显示和隐藏
      amendshow: false, //控制修改用户对话框显示和隐藏
      mg_state: null,
      //数据值
      userlist: [],
      total: 0,
      //获取用户列表的参数对象
      queryInfo: {
        query: "",
        //当前页数
        pagenum: 1,
        //id
        Id: null,
        //当前每页显示得数据
        pagesize: 8,
      },
      // 添加用户
      addForm: {
        username: "",
        password: "",
        email: "",
        mobile: "",
      },
      //添加表单验证规则
      addFormrules: {
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          { min: 3, max: 5, message: "长度在 3 到 5 个字符", trigger: "blur" },
        ],
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          {
            min: 5,
            max: 12,
            message: "长度在 5 到 12 个字符",
            trigger: "blur",
          },
        ],
        email: [
          { required: true, message: "请输入邮箱", trigger: "blur" },
          { validator: checkEmail, trigger: "blur" },
        ],
        mobile: [
          { required: true, message: "请输入手机号", trigger: "blur" },
          { validator: checkmobile, trigger: "blur" },
        ],
      },
      // 修改用户所有的信息
      amendForm: {
        id: "",
        role_id: null,
        username: "",
        email: "",
        mobile: "",
      },
      //添加表单验证规则
      amendFormrules: {
        email: [
          { required: true, message: "请输入邮箱", trigger: "blur" },
          { validator: checkEmail, trigger: "blur" },
        ],
        mobile: [
          { required: true, message: "请输入手机号", trigger: "blur" },
          { validator: checkmobile, trigger: "blur" },
        ],
      },
      //控制分配角色对话框的显示和隐藏
      setRoleDialogVisible: false,
      //需要被分配角色得用户信息
      userInfo: {},
      //所有角色得数据列表
      rolesList: [],
      // 已选中的角色id
      selectedRoleid: "",
    };
  },
  methods: {
    // 监听pagesize改变的事件
    handleSizeChange(val) {
      this.queryInfo.pagesize = val;
      this.fn();
    },
    //监听页码值改变
    handleCurrentChange(val) {
      this.queryInfo.pagenum = val;
      this.fn();
    },
    //监听switch开关状态
    userstateChange(userInfo) {
      // console.log(userInfo);
      //调用状态二次封装请求
      mg_state_alter(`users/${userInfo.id}/state/${userInfo.mg_state}`).then(
        (res) => {
          // console.log(res);
          if (res.meta.status !== 200) {
            userInfo.mg_state = !userInfo.mg_state;
            return this.$message.error(res.meta.msg);
          } else {
            return this.$message.success(res.meta.msg);
          }
        }
      );
    },
    //根据id查找
    serachId() {
      usersIdSearch(`users/${this.queryInfo.Id}`).then((res) => {
        // console.log(res);
        if (res.meta.status !== 200) {
          return this.$message.error(res.meta.msg);
        } else {
          // console.log(this.amendusername);
          this.userlist = [];
          this.userlist.push(res.data);
          //  console.log(this.userlist);
          return this.$message.success(res.meta.msg);
        }
      });
    },
    //表单预处理函数&&添加用户
    addusers() {
      this.$refs.addFormRef.validate((valid) => {
        if (!valid) {
          return;
        } else {
          usersListAdd(this.addForm).then((res) => {
            // console.log(res);
            this.addshow = false;
            this.userlist.push(res.data);
            this.fn();
            return this.$message.success(res.meta.msg);
          });
        }
      });
    },
    //监听添加用户表单状态
    addClose() {
      this.$refs.addFormRef.resetFields();
    },
    //表单预处理函数&&修改用户
    amendusers(id) {
      // console.log(id);
      this.amendshow = true;
      usersIdSearch("users/" + id).then((res) => {
        // console.log(res);
        if ((res.data.status = 200)) {
          this.amendForm = res.data;
          return this.$message.success(res.meta.msg);
        } else {
          return this.$message.error(res.meta.msg);
        }
      });
    },
    xiougai() {
      this.$refs.amendFormRef.validate((valid) => {
        if (!valid) {
          return;
        }
        this.amendshow = false;
        amendUsers("users/" + this.amendForm.id, {
          email: this.amendForm.email,
          mobile: this.amendForm.mobile,
        }).then((res) => {
          if (res.meta.status == 200) {
            this.fn();
            this.$message.success(res.meta.msg);
          }else{
             this.$message.error(res.meta.msg);
          }
        });
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
        removeUsers("users/" + id).then((res) => {
          if (res.meta.status === 200) {
            this.fn();
            return this.$message.success(res.meta.msg);
          } else {
            return this.$message.error(res.meta.msg);
          }
        });
      }
    },

    //根据id为用户分配角色
    assignRoles(userInfo) {
      this.userInfo = userInfo;
      //在展示对话框之前，获取所有角色得列表
      Http({
        url: "/roles",
      }).then((res) => {
        // console.log(res.data)
        this.rolesList = res.data;
        // console.log(this.rolesList)
      });
      this.setRoleDialogVisible = true;
    },
    //点击确定按钮分配角色
    saveRoleInfo() {
      if (!this.selectedRoleid) {
        return this.$message.error("请选择要分配得角色");
      } else {
        assignRole(`users/+${this.userInfo.id}/role`, {
          rid: this.selectedRoleid,
        }).then((res) => {
          //  console.log(res);
          if (res.meta.status !== 200) {
            return this.$message.error(res.meta.msg);
          } else {
            this.setRoleDialogVisible = false;
            this.fn();
            return this.$message.success(res.meta.msg);
          }
        });
      }
    },

    fn() {
      //用户数据列表请求
      usersList(this.queryInfo).then((res) => {
        // console.log(res);
        if (res.meta.status !== 200) {
          return false;
        } else {
          this.userlist = res.data.users;
          this.total = res.data.total;
          this.mg_state = res.data.mg_state;
          this.total = res.data.total;
          this.Id = res.data.id;
        }
      });
    },
  },
  components: {},
  mounted() {
    this.fn();
  },
};
</script>

<style scoped lang="less">
.search {
  width: 50%;
  height: 50px;
  margin-top: 10px;
  .input {
    width: 60%;
  }
}
</style>