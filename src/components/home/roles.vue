<!--
 * @Descripttion: 
 * @version: X3版本
 * @Author: 叶志文
 * @Date: 2021-04-20 13:13:01
 * @LastEditors: 叶志文
 * @LastEditTime: 2021-04-23 10:49:32
-->
<template>
    <div>
        <el-breadcrumb separator-class="el-icon-arrow-right">
           <el-breadcrumb-item>首页</el-breadcrumb-item>
           <el-breadcrumb-item>权限管理</el-breadcrumb-item>
           <el-breadcrumb-item>角色列表</el-breadcrumb-item>
        </el-breadcrumb>
        <!-- 卡片试图区域 -->
        <el-card >
            <el-row>
                <el-col>
                    <el-button type="primary" @click="addDialogVisible = true ">添加角色</el-button>
                </el-col>
            </el-row>
            <!-- 角色列表 -->
            <el-table border stripe :data="rolesList">
                <el-table-column type="expand"> 
                    <template slot-scope="scope">
                        <el-row :class="['el-bottom',index === 0 ? 'el-top' : '', 'vcenter' ]" v-for="(ite,index) in scope.row.children" :key="ite.id">
                            <!-- 渲染一级权限 -->
                            <el-col :span="5">
                                <el-tag closable @close="deleteAuth(scope.row,ite.id)">{{ite.authName}}</el-tag>
                                <i class="el-icon-caret-right"></i>

                            </el-col>
                            <!-- 渲染二级和三级权限 -->
                            <el-col :span="19">
                                <el-row :class="[i === 0 ? '' : 'el-top', 'vcenter' ]" v-for="(ite1,i) in ite.children" :key="ite1.id">
                                    <!-- 二级权限 -->
                                    <el-col :span="6">
                                        <el-tag closable type="success" @close="deleteAuth(scope.row,ite1.id)">{{ite1.authName}}</el-tag>
                                        <i class="el-icon-caret-right"></i>

                                    </el-col>
                                    <!-- 三级权限 -->
                                    <el-col :span="18">
                                        <el-tag closable type="warning" 
                                        v-for="ite2 in ite1.children" :key="ite2.id"
                                        @close="deleteAuth(scope.row,ite2.id)">{{ite2.authName}}</el-tag>
                                        <i class="el-icon-caret-right"></i>
                                    </el-col>
                                </el-row>
                            </el-col>
                        </el-row>
                    </template>
                </el-table-column>
                <el-table-column type="index"> 
                </el-table-column>
                <el-table-column label="角色名称" prop="roleName"> 
                </el-table-column>
                <el-table-column label="角色描述" prop="roleDesc"> 
                </el-table-column>
                <el-table-column label="操作"> 
                    <template slot-scope="scope">
                        <el-button type="primary" icon="el-icon-edit" @click="findRoles(scope.row.id)">编辑</el-button>
                        <el-button type="danger" icon="el-icon-delete" @click="deleteRoles(scope.row.id)">删除</el-button>
                        <el-button type="warning" icon="el-icon-star-off" @click="showDialogRole(scope.row)">分配权限</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </el-card>

        <!-- 添加角色区 -->
        <el-dialog  :visible.sync="addDialogVisible" title="添加角色">
            <el-form :model="roleForm" :rules="rules" ref="roleFormRef" label-width="100px" class="demo-ruleForm">
                <el-form-item label="角色名称" prop="roleName">
                  <el-input v-model="roleForm.roleName"></el-input>
                </el-form-item>
                <el-form-item label="角色描述" prop="roleDesc">
                  <el-input v-model="roleForm.roleDesc"></el-input>
                </el-form-item>
                <el-form-item>
                   <el-button @click="addDialogVisible = false">取 消</el-button>
                   <el-button type="primary" @click="addRoles">确 定</el-button>
                </el-form-item>
            </el-form>
        </el-dialog>
        <!-- 编辑提交角色 -->

         <el-dialog  :visible.sync="editDialogVisible" title="编辑角色">
            <el-form :model="editForm" :rules="editRules" ref="editFormRef" label-width="100px" class="demo-ruleForm">
                <el-form-item label="角色名称" prop="roleName">
                  <el-input v-model="editForm.roleName"></el-input>
                </el-form-item>
                <el-form-item label="角色描述" prop="roleDesc">
                  <el-input v-model="editForm.roleDesc"></el-input>
                </el-form-item>
                <el-form-item>
                   <el-button @click="editDialogVisible = false">取 消</el-button>
                   <el-button type="primary" @click="editRoles">确 定</el-button>
                </el-form-item>
            </el-form>
        </el-dialog>
        <!-- 分配权限 -->
        <el-dialog
          title="分配权限"
          :visible.sync="showDialogVisible"
          width="50%"
          @close="showDialogClose">
          <el-tree
            :data="rightsList"
            show-checkbox
            default-expand-all
            node-key="id"
            ref="treeRefs"
            :default-checked-keys="defKeys"
            :props="defaultProps">
          </el-tree>
          <span slot="footer" class="dialog-footer">
            <el-button @click="showDialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="allotRights">确 定</el-button>
          </span>
        </el-dialog>
    </div>
</template>

<script>
import Http from "./../../http/index";

export default {
    props: {

    },
    data() {
        return {
            rolesList: [],
            rightsList: [],
            defKeys: [],
            addDialogVisible: false,
            editDialogVisible: false,
            showDialogVisible: false,
            roleForm: {
                roleName: '',
                roleDesc: '',
            },
            editForm: {},
            editRules: {
                roleName: [
                  { required: true, message: '请输入角色名称', trigger: 'blur' },
                  { min: 1, max: 12, message: '长度在 1 到 12 个字符', trigger: 'blur' }
                ],
                roleDesc: [
                  { required: true, message: '请输入角色描述', trigger: 'blur' },
                  { min: 1, max: 20, message: '长度在 1 到 20 个字符', trigger: 'blur' }
                ],  
            },
            rules: {
                roleName: [
                  { required: true, message: '请输入角色名称', trigger: 'blur' },
                  { min: 1, max: 6, message: '长度在 3 到 6 个字符', trigger: 'blur' }
                ],
                roleDesc: [
                  { required: true, message: '请输入角色描述', trigger: 'blur' },
                  { min: 1, max: 6, message: '长度在 3 到 6 个字符', trigger: 'blur' }
                ],

            },
            defaultProps: {
              children: 'children',
              label: 'authName'
            },
            roleId: '',
            keys: []
        }
    },
    created() {
        this.getRolseList()
    },
    methods: {
        getRolseList() {
            Http({
                url: '/roles',
                }).then(res => {
                    // console.log(res.data)
                    this.rolesList = res.data
                    // console.log(this.rolesList)

                })
        },
        // 删除
        deleteAuth(role,rightId) {
            this.$confirm('确定要删除该权限?', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(()=> {

                Http({
                    url: `/roles/${role.id}/rights/${rightId}`,
                    method: 'delete'
                }).then(res => {
                    if (res.meta.status == 200) {
                      this.$message.success("删除角色成功");
                      this.getRolseList();
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
        // 添加角色
        addRoles() {
           this.$refs.roleFormRef.validate(valid => {
               if(!valid) return

               Http({
                   url: '/roles',
                   data: {
                       roleName: this.roleForm.roleName,
                       roleDesc: this.roleForm.roleDesc
                   },
                   method: 'post'
               }).then(res => {
                   if (res.meta.status == 201) {
                      this.$message.success("添加角色成功");
                      this.getRolseList();
                    } else {
                      this.$message.error("添加角色失败");
                    }
               })
           })
            this.roleForm.roleName = "",
            this.roleForm.roleDesc = ""
            this.addDialogVisible = false;
        },
        deleteRoles(id) {
            // console.log(this.roleForm.id)
            
            this.$confirm('确定要删除该角色?', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(()=> {

                Http({
                    url: `/roles/${id}`,
                    method: 'delete'
                }).then(res => {
                    if (res.meta.status == 200) {
                      this.$message.success("删除角色成功");
                      this.getRolseList();
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
        findRoles(id) {
            Http({
                url: `/roles/${id}`,
                method: 'get'
            }).then(res => {
                if(res.meta.status == 200) {
                    this.$message.success("查询角色成功");
                } else{
                    this.$message.error("查询角色失败");

                }
            this.editForm = res.data

            })
            this.editDialogVisible = true

        },
        // 编辑
        editRoles() {
            this.$refs.editFormRef.validate(valid => {
               if(valid) { 

                    Http({
                        url: `/roles/${this.editForm.roleId}`,
                        data: {
                            roleName: this.editForm.roleName,
                            roleDesc: this.editForm.roleDesc
                        },
                        method: 'put'
                    }).then(res => {
                        if (res.meta.status == 200) {
                           this.editDialogVisible = false
                           this.$message.success("编辑角色成功");
                           this.getRolseList();
                         } else {
                           this.$message.error("编辑角色失败");
                         }
                    })
               }
            })
            
        },
        // 分配权限
        showDialogRole(role) {
            this.roleId = role.id
            Http({
                url: '/rights/tree',
                method: 'get'
            }).then(res => {
                if(res.meta.status !== 200) {
                    this.$message.error("获取权限失败");
                }
                    this.rightsList = res.data
                    this.showDialogVisible = true
                    this.getLeafKeys(role,this.defKeys)
                
            })
        },
        // 使用递归形式获取角色下的三级权限id，保存到defKeys中
        getLeafKeys(node,arr) {
            if(!node.children) {
                return arr.push(node.id)
            }
            node.children.forEach(item => {
                this.getLeafKeys(item,arr)
            })
        },
        showDialogClose() {
            this.defKeys = []
        },
        allotRights() {
            this.keys = [
                ...this.$refs.treeRefs.getCheckedKeys(),
                ...this.$refs.treeRefs.getHalfCheckedKeys(),
            ]
            const idStr = this.keys.join(',')
            Http({
                url: `/roles/${this.roleId}/rights`,
                //  {rids: idStr}
                method: 'post'
            }).then(res => {
                // console.log(res.meta.status)
                if (res.meta.status !== 200) {
                    return this.$message.error('分配权限失败！')
                }
                  this.$message.success('分配权限成功！')
                  this.getRolseList()
                  this.setRightsDialogVisible = false
            })
        }
    },

    components: {},
};
</script>

<style scoped lang="less">
    .el-card {
        margin-top: 10px;
    }
    .el-table {
        margin-top: 10px;
     
    }
    .vcenter{
        display: flex;
        align-items: center;
    }
    .el-top {
        border-bottom: 1px solid #eee;
    }
    .el-bottom {
        border-bottom: 1px solid #eee;
    }
    .el-tag {
        margin: 10px;
    }
</style>
