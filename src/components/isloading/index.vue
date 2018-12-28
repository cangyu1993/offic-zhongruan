<template>
  <div class="loading">
    <i class="iconfont icon-loading1 turnZ"></i> <span>数据加载中...</span>
  </div>
</template>

<script>
  export default {
    name: "index",
    props:{
      show: {
        type:Boolean,
        default:false,
      }
    }
  }
</script>

<style scoped lang="scss">
  .loading {
    position: fixed;
    top: 0;
    bottom: 0;
    right: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 996;
    background-color: rgba(0, 0, 0, .01);
    display: flex;
    justify-content: center;
    align-items: center;
    .turnZ {
      font-size: 30px;
      color: #1962af;
      animation: loading 1.2s ease 0s infinite normal;
    }
  }

  @keyframes loading {
    0% {
      transform: rotateZ(0)
    }
    100% {
      transform: rotateZ(360deg)
    }
  }
</style>
