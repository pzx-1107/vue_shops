<!--
 * @Descripttion: 
 * @version: X3版本
 * @Author: 叶志文
 * @Date: 2021-04-20 13:15:00
 * @LastEditors: 叶志文
 * @LastEditTime: 2021-04-20 13:15:04
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
        :closable="false">
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
          change-on-select></el-cascader>
      </el-row>
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="动态参数" name="many">
          <el-button type="primary" size="mini" :disabled="isButton"
          @click="addParamsdialogVisible=true"
            >添加参数</el-button>
          <el-table :data="manyData" border style="width: 100%">
            <el-table-column type="expand"> 
              <template slot-scope="scope">
                <el-tag v-for="(item, i) in scope.row.attr_vals" :key="i" closable
                @close="handleClose(i,scope.row)">{{item}}</el-tag>

                <el-input
                  class="input-new-tag"
                  v-if="scope.row.inputVisible"
                  v-model="scope.row.inputValue"
                  ref="saveTagInput"
                  size="medium"
                  @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)">
                </el-input>
                <el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+ New Tag</el-button>
              </template>
            </el-table-column>
            <el-table-column type="index" label="#"> </el-table-column>
            <el-table-column prop="attr_name" label="参数名称">
            </el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button type="primary" icon="el-icon-edit" size="mini" @click="findParams(scope.row.attr_id)">编辑</el-button>
                <el-button type="danger" icon="el-icon-delete" size="mini" @click="removeParams(scope.row.attr_id)">删除</el-button>
              </template>
            </el-table-column>
           
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="静态属性" name="only">
          <el-button type="primary" size="mini" :disabled="isButton"
             @click="addParamsdialogVisible=true">添加属性</el-button>
          <el-table :data="onlyData" border style="width: 100%">
            <el-table-column type="expand">
               <template slot-scope="scope">
                <el-tag v-for="(item, i) in scope.row.attr_vals" :key="i" closable
                @close="handleClose(i,scope.row)">{{item}}</el-tag>

                <el-input
                  class="input-new-tag"
                  v-if="scope.row.inputVisible"
                  v-model="scope.row.inputValue"
                  ref="saveTagInput"
                  size="medium"
                  @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)">
                </el-input>
                <el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+ New Tag</el-button>
              </template>
            </el-table-column>
            <el-table-column type="index" label="#"> </el-table-column>
            <el-table-column prop="attr_name" label="属性名称">
            </el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button type="primary" icon="el-icon-edit" size="mini" @click="findParams(scope.row.attr_id)">编辑</el-button>
                <el-button type="danger" icon="el-icon-delete" size="mini" @click="removeParams(scope.row.attr_id)">删除</el-button>
              </template>
            </el-table-column>
           
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-card>
    <!-- 添加动态参数 -->
    <el-dialog
      :title=" '添加' + titleText"
      :visible.sync="addParamsdialogVisible"
      width="50%"
      @close="addParamsClosed">
      <el-form :model="ruleForm" :rules="rulesForm" ref="ruleFormRef" label-width="100px" class="demo-ruleForm">
        <el-form-item :label="titleText" prop="attr_name">
          <el-input v-model="ruleForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addParamsdialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addParams">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 修改静态属性 -->
    <el-dialog
      :title=" '修改' + titleText"
      :visible.sync="editParamsdialogVisible"
      width="50%"
      @close="editParamsClosed">
      <el-form :model="editForm" :rules="rulesForm" ref="editFormRef" label-width="100px" class="demo-ruleForm">
        <el-form-item :label="titleText" prop="attr_name">
          <el-input v-model="editForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editParamsdialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editParams">确 定</el-button>
      </span>
    </el-dialog>
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
        addParamsdialogVisible: false,
        ruleForm: {
            attr_name: ''
        },
        rulesForm: {
            attr_name: [
                { required: true, message: '请输入参数名称', trigger: 'blur' },
                { min: 1, max: 6, message: '长度在 3 到 6 个字符', trigger: 'blur' }
                
            ]
        },
        editForm: {},
        editParamsdialogVisible: false,
       
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
        console.log(res.data);
        this.catelist = res.data;
      });
    },

    // 获取得到的数据

    getCurrentList() {
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
        res.data.forEach(item => {
          item.attr_vals = item.attr_vals ? item.attr_vals.split(' ') : []
          item.inputVisible = false;
          item.inputValue = ''
        })
        if (this.activeName === "many") {
          this.manyData = res.data;
        } else {
          this.onlyData = res.data;
        }
      });
    },

    handleChange() {
        this.getCurrentList();
    },
    handleClick() {
        this.getCurrentList()
      console.log(this.activeName);
    },
    removeParams(attr_id) {
        this.$confirm('确定要删除该权限?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(()=> {
            Http({
                url: `/categories/${this.cateId}/attributes/${attr_id}`,
                method: 'delete'
            }).then(res => {
                if (res.meta.status == 200) {
                  this.$message.success("删除角色成功");
                  this.getCurrentList()
                } else {
                  this.$message.error("删除角色失败");
                }
            })
        }).catch(() => {
            this.$message({
              type: "info",
              message: "已取消删除",
            });
        })
    },
    // 添加动态参数
    addParams() {
        this.$refs.ruleFormRef.validate(valid => {
            if(!valid) return
            Http({
                url: `categories/${this.cateId}/attributes`,
                method: 'post',
                data: {
                    attr_name: this.ruleForm.attr_name,
                    attr_sel: this.activeName
                }
            }).then(res => {
                this.$message.success('添加成功')
                this.getCurrentList()

            })
        })
        this.addParamsdialogVisible = false
    },
    findParams(attr_id) {
        Http({
            url: `categories/${this.cateId}/attributes/${attr_id}`,
            method: 'get'
        }).then(res => {
            if(res.meta.status == 200) {
                this.$message.success('获取参数成功')
                this.editParamsdialogVisible = true;
                this.editForm = res.data
            }
        })
    },
    editParams(attr_id) {
        this.$refs.editFormRef.validate(valid => {
            if(valid) {
                Http({
                    url: `categories/${this.cateId}/attributes/${this.editForm.attr_id}`,
                    data: {
                        attr_name: this.editForm.attr_name,
                        attr_sel: this.activeName
                    },
                    method: 'put'
                }).then(res => {
                    if(res.meta.status == 200) {
                        this.$message.success('更新成功')
                        this.getCurrentList()
                        this.editParamsdialogVisible = false
                    }
                })
            }
        })
    },
    addParamsClosed() {
        this.$refs.ruleFormRef.resetFields()
    },
    editParamsClosed() {
        this.$refs.editFormRef.resetFields()
    },

    // tag切换
    handleClose(tag) {
      this.dynamicTags.splice(this.dynamicTags.indexOf(tag), 1);
    },
    showInput(row) {
      row.inputVisible = true;
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus();
      });
    },
    handleInputConfirm(row) {
      if (row.inputValue.trim().length === 0) {
        row.inputVisible = false;
        row.inputValue = '';
        return
      }
      row.attr_vals.push(row.inputValue.trim())
      row.inputValue = ''
      row.inputVisible = false
      // 发起请求，保存操作
      this.saveAttrVals(row)
    },

    saveAttrVals(row) {
      Http({
        url: `categories/${this.cateId}/attributes/${row.attr_id}`,
        method: 'put',
        data: {
          attr_name: row.attr_name,
          attr_sel: row.attr_sel,
          attr_vals: row.attr_vals.join(' ')
        }
      }).then(res => {
        console.log(res.meta.status)
        if (res.meta.status == 200) {
          this.$message.success('修改参数项成功')
          this.getCurrentList()
          return
        }
        this.$message.error('修改参数项失败！')
        
      })
    },

    handleClose(i, row) {
      row.attr_vals.splice(i, 1)
      this.saveAttrVals(row)
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
    // 动态计算标题文本
    titleText() {
        if(this.activeName === 'many') {
            return '动态参数'
        } else {
            return '静态属性'
        }
    }
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
.el-tag {
  margin: 10px;
}
  .el-tag + .el-tag {
    margin-left: 10px;
  }
  .button-new-tag {
    margin-left: 10px;
    height: 32px;
    line-height: 30px;
    padding-top: 0;
    padding-bottom: 0;
  }
  .input-new-tag {
    width: 90px;
    margin-left: 10px;
    vertical-align: bottom;
  }
</style>
