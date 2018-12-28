<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style>
  /*重置页面样式*/
  * {
    margin: 0;
    padding: 0;
  }
  /*清除a标签默认样式*/
  .clear_line {
    text-decoration: none;
    color: #000
  }

  /*宽度1170px,居中*/
  .W1170 {
    width: 1170px;
    margin: 0 auto;
  }
  .W1175{
    width: 1175px;
    margin: 0 auto;
  }
  .W1200{
    width: 1200px;
    margin: 0 auto;
  }
  .clearfix:after{
    display: block;
    content: "";
    clear: both;
    height: 0;
  }
  .clearA{
    text-decoration:none;
    color:#333;
    cursor: pointer;
  }
</style>
