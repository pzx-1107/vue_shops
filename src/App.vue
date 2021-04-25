<!--
 * @Descripttion: 
 * @version: X3版本
 * @Author: 叶志文
 * @Date: 2021-04-17 14:35:55
 * @LastEditors: 叶志文
 * @LastEditTime: 2021-04-24 15:55:36
-->
<template>
  <div id="app">
     <div v-title data-title="电商后台管理系统"></div>
    <router-view/>
  </div>
</template>

<style>
*{
  margin: 0;padding: 0;
}
html,body,#app{
  height: 100%;
  width: 100%;
}
</style>
