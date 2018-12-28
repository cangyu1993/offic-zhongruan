<template>
  <div class="all">
    <div class="keep_dis">
      <headers v-if="show" @barChange="barChange"/>
      <columnList :itemMsg_1="itemMsg" v-if="refrach"/>
    </div>
    <div class="pages">
      <div class="topBox"></div>
      <router-view />
    </div>
    <footers/>
  </div>
</template>
<script>
  import columnList from '@/components/columnlist'
  import headers from '@/components/headers'
  import footers from '@/components/footer'
  import cookie from '@/cookie'

  export default {
    components: {columnList, headers, footers},
    name: "index",
    data() {
      return {
        show: true,
        keep_disHeight: '',
        itemMsg:{},
        refrach:true
      }
    },
    methods: {
      barChange(e){
        this.itemMsg = e
        // this.$router.go(0)
        this.refrach = false
        setTimeout(()=>{
          this.refrach = true
        },400)
      },

      //通过cookie判断是否显示登陆状态和动态赋予嵌套路由的距离上高度
      getMsg() {
        let username = cookie.readCookie('username')
        let password = cookie.readCookie('password')
        if (username && password) {
          this.show = true
          sessionStorage.setItem('hoverShow', 1)
          // this.$store.commit('ISLOADING',this.isShow)
        } else {
          this.show = false
          sessionStorage.setItem('hoverShow', 0)
          // this.$store.commit('ISLOADING',this.isShow)
        }
      },
      changeHeight() {
        this.keep_disHeight = document.querySelector('.keep_dis').offsetHeight
        let topBox = document.querySelector('.topBox')
        topBox.style.height = this.keep_disHeight + 'px'
      }
    },
    created() {
      this.getMsg()
    },
    mounted() {
      this.changeHeight()
    }
  }
</script>

<style scoped lang="scss">
  .all {
    .keep_dis {
      position: fixed;
      top: 0;
      right: 0;
      left: 0;
      z-index: 998;
    }
  }
</style>
