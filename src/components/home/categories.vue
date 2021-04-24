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
                <el-button type="primary" @click="addCateDialog">添加分类</el-button>
            </el-row>
            <tree-table :data="catelist" :columns="columns"
            :expand-type="false" :selectable="false" show-index
            index-text="#" border class="treeTable">
                <template slot="isok" slot-scope="scope">
                    <i class="el-icon-success" style="color: lightgreen" v-if="scope.row.cat_deleted === false"></i>
                    <i class="el-icon-error" style="color: red" v-else></i>
                </template>
                <template slot="order" slot-scope="scope">
                    <el-tag type="success" v-if="scope.row.cat_level === 0">一级</el-tag>
                    <el-tag type="info" v-else-if="scope.row.cat_level === 1">二级</el-tag>
                    <el-tag type="warning" v-else>三级</el-tag>
                </template>
                <template slot="opt" slot-scope="scope">
                     <el-button type="primary" icon="el-icon-edit" @click='findCate(scope.row.cat_id)'>编辑</el-button>
                     <el-button type="danger" icon="el-icon-delete" @click="cateDelete(scope.row.cat_id)">删除</el-button>
                </template>
            </tree-table>
            <!-- 分页 -->
            <el-pagination
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
              :current-page="quertInfo.pagenum"
              :page-sizes="[3,5,10,15]"
              :page-size="quertInfo.pagesize"
              layout="total, sizes, prev, pager, next, jumper"
              :total="total">
            </el-pagination>
        </el-card>

        <!-- 添加分类 -->
        <el-dialog
          title="添加分类"
          :visible.sync="addDialogVisibleCate"
          width="50%"
          @close="addCateDialogClosed">
          <el-form :model="ruleForm" :rules="rules" ref="cateRuleFormRefs" label-width="100px" class="demo-ruleForm">
            <el-form-item label="分类名称" prop="cat_name">
              <el-input v-model="ruleForm.cat_name"></el-input>
            </el-form-item>
            <!-- options用来指定数据源 -->
            <el-form-item label="父级分类">
                <el-cascader
                v-model="selectKeys"
                expand-trigger="hover"
                :options="parentCateList"
                :props="cateProps"
                @change="cateHandleChange"
                clearable
                change-on-select></el-cascader>
            </el-form-item>
          </el-form>
          <span slot="footer" class="dialog-footer">
            <el-button @click="addDialogVisibleCate = false">取 消</el-button>
            <el-button type="primary" @click="addCate">确 定</el-button>
          </span>
        </el-dialog>

        <!-- 编辑提交分类 -->
         <el-dialog
          title="编辑分类"
          :visible.sync="editDialogVisibleCate"
          width="50%">
          <el-form :model="editForm" :rules="rules" ref="cateRuleFormRefs" label-width="100px" class="demo-ruleForm">
            <el-form-item label="分类名称" prop="cat_name">
              <el-input v-model="editForm.cat_name"></el-input>
            </el-form-item>
            <!-- options用来指定数据源 -->
                <!-- v-model="selectKeys" -->

            <el-form-item label="父级分类">
                <el-cascader
                prop="cat_pid"
                v-model="editForm.cat_pid"
                :options="parentCateList"
                expand-trigger="hover"
                :props="cateProps"
                @change="cateHandleChange"
                clearable
                change-on-select></el-cascader>
            </el-form-item>
          </el-form>
          <span slot="footer" class="dialog-footer">
            <el-button @click="editDialogVisibleCate = false">取 消</el-button>
            <el-button type="primary" @click="editCate">确 定</el-button>
          </span>
        </el-dialog>
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
                    title: '分类名称',
                    key: 'cat_name'
                }, {
                    title: '是否有效',
                    // 将当前列定义为template模板列
                    type: 'template',
                    // 表示当前这一列使用模板名称
                    template: 'isok'
                },{
                    title: '排序',
                    // 将当前列定义为template模板列
                    type: 'template',
                    // 表示当前这一列使用模板名称
                    template: 'order'
                },{
                    title: '操作',
                    // 将当前列定义为template模板列
                    type: 'template',
                    // 表示当前这一列使用模板名称
                    template: 'opt'
                }
            ],
            quertInfo: {
                type: 3,
                pagenum: 1,
                pagesize: 5
            },
            total: 0,
            addDialogVisibleCate: false,
            editDialogVisibleCate: false,
            ruleForm: {
                cat_name: '',
                cat_pid: 0,
                cat_level: 0
            },
            editForm: {},
            rules: {
                cat_name: [
                  { required: true, message: '请输入活动名称', trigger: 'blur' },
                ],
                
            },
            selectKeys: [],
            // 父级分类的列表
            parentCateList: [],
            cateProps: {
                value: 'cat_id',
                label: 'cat_name',
                children: 'children'
            }
        };
    },
    created() {
        this.getCatelist()
    },
    methods: {
        getCatelist() {
            Http({
                url: '/categories',
                params: this.quertInfo,
                method: 'get'
            }).then(res => {
                this.catelist = res.data.result
                this.total = res.data.total
            })
        },
        // 
        handleSizeChange(newSize) {
            this.quertInfo.pagesize = newSize
            this.getCatelist()
        },
        handleCurrentChange(newPage) {
            this.quertInfo.pagenum = newPage
            this.getCatelist()
        },
        // 获取父级分类的列表
        getParentList() {
            Http({
                url: '/categories',
                params: {
                    type: 2
                },
                method: 'get'
            }).then(res => {
                this.parentCateList = res.data
            })
        },
        // 添加分类
        addCateDialog() {
            this.getParentList()
            this.addDialogVisibleCate = true
        },
        // 选择项发生变化
        cateHandleChange() {
            // console.log(this.selectKeys)
            if(this.selectKeys.length > 0) {
                this.ruleForm.cat_pid = this.selectKeys[
                    this.selectKeys.length - 1
                ];
                this.ruleForm.cat_level = this.selectKeys.length
                return
            } else {
                this.ruleForm.cat_pid = 0;
                this.ruleForm.cat_level = 0
            }
        },
        addCateDialogClosed() {
            // 关闭时清空表单数据
            this.$refs.cateRuleFormRefs.resetFields()
            this.selectKeys = []
            this.ruleForm.cat_level = 0
            this.ruleForm.cat_pid = 0
        },
        addCate() {
            this.$refs.cateRuleFormRefs.validate(valid => {
                if(!valid) return
                Http({
                    url: '/categories',
                    method: 'post',
                    data: this.ruleForm
                }).then(res => {
                    console.log(res)
                    if(res.meta.status !== 201) {
                        this.$message.error('添加分类失败')
                    } 
                    this.$message.success('添加分类成功')
                    this.getCatelist()
                    this.addDialogVisibleCate = false
                    
                })
            })
           
        },
        // 根据id查询分类
        findCate(cateId) {
            this.getParentList()
            
            Http({
                url: `/categories/${cateId}`,
                method: 'get'
            }).then(res => {
                // console.log(res.data.cat_id)
                if(res.meta.status == 200) {
                    this.$message.error('获取失败')
                } 
                this.$message.success('获取成功')
               
                this.editForm = res.data
            })
            this.editDialogVisibleCate = true

            
        },
        // 删除商品分类
        cateDelete(cateId) {
            this.$confirm('确定要删除该角色?', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(()=> {

                Http({
                    url: `/categories/${cateId}`,
                    method: 'delete'
                }).then(res => {
                    console.log(res.meta.status)
                    if (res.meta.status == 200) {
                      this.$message.success("删除商品分类成功");
                      this.getCatelist();
                    } else {
                      this.$message.error("删除商品分类失败");
                    }
                })
            }).catch(() => {
                this.$message({
                  type: "info",
                  message: "已取消删除",
                });
            })
        },
        // 编辑提交分类
        editCate() {

            this.$refs.cateRuleFormRefs.validate(valid => {
                if(!valid) return
                    console.log(this.editForm.cat_name)
                    console.log(this.editForm.cat_pid)


                Http({
                    url: `categories/${this.editForm.cat_id}`,
                    data: {
                        cat_name: this.editForm.cat_name,
                        cat_pid: this.editForm.cat_pid
                    },
                    method: 'put'
                }).then(res => {
                    console.log(res.meta.status)
                    if(res.meta.status == 200) {
                        this.$message.success('编辑分类成功')
                        this.getCatelist()
                    } else {
                        this.$message.error('失败')
                    }
                })
            })
            this.editDialogVisibleCate = false
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
    .treeTable {
        margin: 10px 0;
    }
    .el-cascader {
        width: 100%;
    }
</style>
