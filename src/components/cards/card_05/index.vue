<template>
  <div class="all">
    <isLoading v-if="isLoading"/>
    <div>
      <div>
        <transition name="el-zoom-in-center">
          <changeTitle v-if="Tchange" @cancel="mayCancel" @ensure='mayEnsure'/>
        </transition>
        <transition name="el-zoom-in-center">
          <changeContent v-if="conShow" @contentCe="contentCe" @contentEn="contentEn"/>
        </transition>
        <changeImg v-if="imgChange" @cancel="cancelImg" @ensure='enterImg'/>
      </div>
    </div>


    <div class="all_box W1170">
      <div class="box_item" v-for="(item,index) in showData.model" :key="index" @mouseover="Mover(index)"
           @mouseleave="Mleaver(index)">
        <h3 class="title">{{item.value.a0}}</h3>
        <el-button type="text"
                   icon="el-icon-edit"
                   class="btn_1"
                   size="small"
                   @click="changeTitle(item.id.a0,item.value.a0)"
                   v-show="isShow"
                   :class="{hoverShow:hoverShow}"
        >编辑
        </el-button>
        <div class="empty">
          <span class="left"></span>
          <span class="right"></span>
        </div>
        <p class="content">{{item.value.a1}}</p>
        <el-button type="text"
                   icon="el-icon-edit"
                   class="btn_2"
                   size="small"
                   @click="changeContent(item.id.a1,item.value.a1)"
                   :class="{hoverShow:hoverShow}"
                   v-show="isShow"
        >编辑
        </el-button>
      </div>
    </div>


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
    data() {
      return {
        Tchange: false,
        conShow: false,
        imgChange: false,
        showData: {},
        isShow: false,
        hoverShow: false,
        isLoading:false
      }
    },
    methods: {
      getData() {
        this.isLoading = true
        this.$axios.get('/info?pid=k_5').then(res => {
          if (res.data.code == 200) {
            this.showData = res.data.data
            this.isLoading = false
          }
        }).catch(err => {
          this.$message.error('请求失败')
          // this.$router.push('/')
          this.isLoading = false
        })

      },
      getSession() {
        let show = sessionStorage.getItem('hoverShow')
        if (show == 0) {
          this.hoverShow = true
        }
      },
      Mover(index) {
        this.isShow = true
      },
      Mleaver() {
        this.isShow = false
      },

      //使用vuex传值封装组件修改内容
      //将修改的标题放置在vuex的title字段中
      changeTitle(_id, val) {
        if (val.id) {
          this.Tchange = true
          this.$store.commit('CHANGE_TITLE', val)
        } else {
          let newObj = {
            id: _id,
            value: val,
            type: '3'
          }
          this.Tchange = true
          this.$store.commit('CHANGE_TITLE', newObj)
        }
      },

      //用户取消修改告知父组件关闭弹窗
      mayCancel(val) {
        if (val = 'cancel') {
          this.getData()
          this.Tchange = false
        }
      },

      //用户确认修改向服务器发送修改字段并重新从服务器拿去数据
      mayEnsure(val) {
        if (val = 'success') {
          this.getData()
          this.Tchange = false
        }
      },


      //修改内容
      changeContent(_id, val) {
        // console.log(_id, val)
        if (val.id) {
          this.$store.commit('CHANGE_CONTENT', val)
          this.conShow = true
        } else {
          let newObj = {
            id: _id,
            value: val,
            type: '3',
          }
          this.$store.commit('CHANGE_CONTENT', newObj)
          this.conShow = true
        }
      },

      contentCe(val) {
        if (val = 'cancel') {
          this.getData()
          this.conShow = false
        }
      },
      //用户确认修改向服务器发送修改字段并重新从服务器拿去数据
      contentEn(val) {
        if (val = 'success') {
          this.getData()
          this.conShow = false
        }
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
    }
  }
</script>

<style scoped lang="scss">
  .all {
    background: #F6F6F6;
    height: 606px;
    /*margin-top: 82px;*/
    .all_box {
      -webkit-box-sizing: border-box;
      -moz-box-sizing: border-box;
      box-sizing: border-box;
      height: 100%;
      display: flex;
      justify-content: space-between;
      align-items: center;
      .box_item {
        position: relative;
        -webkit-box-sizing: border-box;
        -moz-box-sizing: border-box;
        box-sizing: border-box;
        width: 280px;
        height: 380px;
        display: flex;
        flex-direction: column;
        align-items: center;
        background: #1863AF;
        border-radius: 4px;
        .content {
          line-height: 1.5;
          font-size: 14px;
          margin-top: 30px;
          padding: 0 20px;
          overflow: hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-line-clamp: 8;
          -webkit-box-orient: vertical;
          text-align: center;
          color: #EBEBDE;
        }
        .title {
          margin-top: 50px;
          margin-bottom: 16px;
          color: #EBEBDE;
        }
        .btn_1 {
          position: absolute;
          top: 60px;
          right: 40px;
        }
        .btn_2 {
          position: absolute;
          top: 300px;
          right: 10px;
        }
        .empty {
          display: flex;
          .left {
            height: 5px;
            width: 10px;
            border-radius: 6px;
            background: #fff;
          }
          .right {
            height: 5px;
            width: 30px;
            margin-left: 10px;
            border-radius: 6px;
            background: #fff;
          }
        }
      }
    }
  }

  .shaow {
    box-shadow: 0 12px 6px #ccc;
  }

  .hoverShow {
    display: none;
  }
</style>
