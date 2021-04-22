<!--
 * @Descripttion: 
 * @version: X3版本
 * @Author: 叶志文
 * @Date: 2021-04-20 09:36:59
 * @LastEditors: 叶志文
 * @LastEditTime: 2021-04-20 12:29:54
-->
<template>
  <div class="home-wrap">
    <el-container>
      <!-- 头部 -->
      <el-header height="50px"
        >电商后台管理系统
        <el-button type="info" size="small" @click="clear">退出</el-button>
      </el-header>
      <el-container>
        <!-- 左侧导航 -->
        <el-aside :width="isCollapse ? '64px' : '200px'">
          <div class="header_icon" @click="toggleCollapse">
            |&nbsp;|&nbsp;|
          </div>
          <el-menu
            :uniqueOpened="true"
            default-active="2"
            class="el-menu-vertical-demo"
            background-color="#333744"
            text-color="#fff"
            :collapse-transition="false"
            active-text-color="#ffd04b"
            :router="true"
            :collapse="isCollapse"
          >
            <el-submenu
              :index="index.toString()"
              v-for="(item, index) in left_nav"
              :key="index"
            >
              <template #title>
                <div @click="r_tex(item.authName)">
                  <i :class="iconsObj[index]"></i>
                  <span>{{ item.authName }}</span>
                </div>
              </template>
              <el-menu-item
                :route="{ path: '/home/' + item.path }"
                :index="String(item.id)"
                @click="r_texs(item.authName)"
                v-for="(item, index) in item.children"
                :key="index"
              >
                <i class="el-icon-menu"></i>
                {{ item.authName }}
              </el-menu-item>
            </el-submenu>
          </el-menu>
        </el-aside>
        <!-- 内容区域 -->
        <el-main>
          <router-view>
         

          </router-view>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
import Http from "../http/index"
export default {
  props: {},
  data() {
    return {
      left_nav: null,
      tex: "",
      texs: "",
      isShow: false,
      iconsObj: [
        'el-icon-user-solid',
        'el-icon-menu',
        'el-icon-postcard',
        'el-icon-s-order',
        'el-icon-s-data'
      ],
      isCollapse: false
    };
  },
  mounted() {
      //侧边栏数据请求
  Http({
        url: '/menus',
        method: 'get',
  }).then(res=>{
    
    this.left_nav = res.data;
  })
  },
  methods: {
      // 退出
        clear(){
          // 清空token
          window.sessionStorage.clear();
          this.$router.replace('/')
        },
        // 点击首页 跳转+刷新页面
        flush(){

          location.reload()
        },
        // 一级路由的值
        r_tex(v){
          this.tex=v;
          this.isShow = false;
        },
        // 二级路由的值
        r_texs(v){
        this.isShow = true;
        this.texs=v;
        },
        toggleCollapse() {
          this.isCollapse = !this.isCollapse
        }
  },
  components: {},
};
</script>

<style scoped lang="less">
.home-wrap {
  height: 100%;
  .el-container {
    height: 100%;
    .el-header {
      font-size: 18px;
      color: #fff;
      background-color: #373d41;
      padding: 10px 5px 10px 20px;
      overflow: hidden;
      .el-button {
        float: right;
        vertical-align: middle;
      }
    }
  }
  .header_icon {
    background-color: #4a5064;
    height: 25px;
    text-align: center;
    font-size: 20px;
    line-height: 25px;
    color: #fff;
    padding: 5px 0;
  }
  .el-aside {
    background-color: #333744;
  }
  .el-main {
    background-color: #eaedf1;
    .el-breadcrumb {
      padding-bottom: 10px;
    }
  }
}
</style>
