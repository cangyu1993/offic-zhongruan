<template>
  <div class="all"  :class="{'shaow':isShow}" @mouseover="Mover" @mouseleave="Mleaver">
    <div>
      <transition name="fade_t">
        <changeTitle v-if="comShow" @cancel="mayCancel" @ensure='mayEnsure'/>
      </transition>
      <transition name="fade_c">
        <changeContent v-if="conShow" @contentCe="contentCe" @contentEn="contentEn"/>
      </transition>
      <transition name="fade">
        <changeImg v-if="imgChange" @cancel="cancelImg" @ensure='enterImg'/>
      </transition>
    </div>
    66666
  </div>
</template>

<script>
  import changeTitle from '@/components/changeTitle'
  import changeContent from '@/components/changeContent'
  import changeImg from '@/components/changeImg'

  export default {
    components: {
      changeTitle,
      changeContent,
      changeImg
    },
    name: "index",
    data(){
      return{
        comShow: false,
        conShow: false,
        imgChange: false,
        isShow: false,
        img: [],
        headerTitle: {},
      }
    },
    methods:{
      //使用vuex传值封装组件修改内容

      //将修改的标题放置在vuex的title字段中
      changeTitle(item) {
        if (item.title) {
          this.comShow = true
          this.$store.commit('CHANGE_TITLE', item.title)
        }
      },

      //用户取消修改告知父组件重新从服务器拿去数据
      mayCancel(val) {
        if (val = 'cancel') {
          this.comShow = false
          // this.getNews()
          // this.getImg()
        }
      },

      //用户确认修改向服务器发送修改字段并重新从服务器拿去数据
      mayEnsure(val) {
        console.log(val)
        this.comShow = false
      },


      //修改内容
      needChange(val) {
        // console.log(val)
        this.$store.commit('CHANGE_CONTENT', val)
        this.conShow = true
      },

      contentCe(val) {
        if (val = 'cancel') {
          this.conShow = false
        }
      },
      //用户确认修改向服务器发送修改字段并重新从服务器拿去数据
      contentEn(val) {
        // console.log(val)
        this.conShow = false
      },

      //修改图片
      changeImg(val) {
        // console.log(val)
        this.$store.commit('CHANGE_IMG', val)
        this.imgChange = true
      },
      cancelImg(val) {
        if (val = 'cancel') {
          this.imgChange = false
        }
      },
      enterImg(val) {
        // console.log(val)
        this.imgChange = false
        this.getNews()
        this.getImg()
      },
      async getNews() {
        let data = await this.$axios.get('/allnews?page=1&size=10')
        this.headerTitle = data.data.data[0]
      },
      async getImg() {
        let data = await this.$axios.get('/swiper?page=1&size=4&status=1')
        this.img = data.data.data.splice(0, 3)
      },
      Mover() {
        this.isShow = true
      },
      Mleaver() {
        this.isShow = false
      },
    },
    created() {
      this.getNews()
      this.getImg()
    }
  }
</script>

<style scoped lang="scss">
  .all {
    background: #ccc;
    height: 606px;
    margin-top: 82px;
    .fade-enter-active, .fade-leave-active {
      transition: all 0.6s ease;
    }
    .fade-enter, .fade-leave-to {
      /*opacity: 0;*/
      transform: translateX(2000px);
    }
    .fade_t-enter-active, .fade_t-leave-active {
      transition: all 0.6s ease;
    }
    .fade_t-enter, .fade_t-leave-to {
      /*opacity: 0;*/
      transform: translateX(-2000px);
    }
    .fade_c-enter-active, .fade_c-leave-active {
      transition: all 0.6s ease;
    }
    .fade_c-enter, .fade_c-leave-to {
      /*opacity: 0;*/
      transform: translateY(2000px);
    }
  }
  .shaow {
    box-shadow: 0 12px 6px #ccc;
  }
</style>
