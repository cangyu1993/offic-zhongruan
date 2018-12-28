<template>
  <div class="all">
    <isLoading v-if="isLoading"/>
    <div class="main W1200" @mouseover="Mover" @mouseleave="Mleaver">
      <div class="logo">
        <img v-lazy="logo.value" :key="logo.value" class="logo_img">
        <el-button type="text" icon="el-icon-edit" :class="{hoverShow:hoverShow}" v-if="isShow" class="btn_1"
                   size="small" @click="changeImg(null,logo)">编辑
        </el-button>
      </div>
      <div class="nav">
        <div class="nav_item" v-for="(item,index) in columnList.info">
          <p class="clearA nav_item_link" style="color: #999;font-size: 16px;" :key="index"
             :class="{'addColor':$route.path === `/${item.id}`}" @click="routerChange(item)"> {{item.name}}</p>
        </div>
      </div>
    </div>
    <changeImg v-if="imgChange" @cancel="cancelImg" @ensure='enterImg'/>
  </div>
</template>

<script>
  import changeImg from '@/components/changeImg'
  import Bus from '@/bus'

  export default {
    name: "index",
    components: {
      changeImg
    },
    props: {
      itemMsg_1: {
        type: Object
      }
    },
    data() {
      return {
        isShow: false,
        dialogVisible: false,
        imgChange: false,
        columnList: {},
        logo: {},
        itemMsg: {},
        labelPosition: 'right',
        hoverShow: false,
        isLoading: false,
        needGet: Bus.$on('barItem', (e) => {
          return e
        })
      }
    },
    methods: {
      getData() {
        this.isLoading = true
        this.$axios.get('/columnlist').then(res => {
          if (res.data.code == 200) {
            this.columnList = res.data.data
            this.logo = res.data.data.logo
            this.isLoading = false
          }else{
            this.isLoading = false
            this.$message.info(res.data.msg)
          }
        }).catch(err=>{
          this.isLoading = false
          this.$message.info('请求失败')
        })
      },

      changeTitle(item) {
        this.itemMsg = item
        this.dialogVisible = true
      },
      getSession() {
        let show = sessionStorage.getItem('hoverShow')
        if (show == 0) {
          this.hoverShow = true
        }
      },

      //路由跳转和关键字修改
      routerChange(item) {
        this.$router.push({path: `/${item.id}`})
        document.title = item.keywords
      },
      Mover() {
        this.isShow = true
      },
      Mleaver() {
        this.isShow = false
      },


      //修改图片
      changeImg(_id, val) {
        if (val.id) {
          this.$store.commit('CHANGE_IMG', val)
          this.imgChange = true
        } else {
          let newObj = {
            id: _id,
            value: val,
            type: '3'
          }
          this.$store.commit('CHANGE_IMG', newObj)
          this.imgChange = true
        }
      },

      cancelImg(val) {
        if (val = 'cancel') {
          this.imgChange = false
        }
      },
      enterImg(val) {
        if (val = 'success') {
          this.getData()
          this.imgChange = false
        }

      },
    },
    created() {
      this.getData()
      this.getSession()
    },
    mounted() {
    },
  }
</script>

<style scoped lang="scss">
  .all {
    box-shadow: 0 2px 12px #ccc;
    background: #fff;
    box-sizing: border-box;
    .main {
      box-sizing: border-box;
      height: 85px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      .logo {
        position: relative;
        .logo_img {
          width: 170px;
          height: 65px;
        }
        .btn_1 {
          position: absolute;
          left: 180px;
          bottom: 0;
        }
      }
      .nav {
        box-sizing: border-box;
        display: flex;
        justify-content: space-between;
        align-items: center;
        .nav_item {
          position: relative;
          margin: 0 75px;
          color: #ccc;
          .nav_item_link:hover {
            color: red !important;
          }
          .btn_2 {
            position: absolute;
            right: -50px;
            bottom: -20px;
          }
        }
      }
    }
  }

  .addColor {
    color: #1962af !important;
  }

  .hoverShow {
    display: none;
  }
</style>
