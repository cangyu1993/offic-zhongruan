<template>
  <div class="all" @mouseover="Mover" @mouseleave="Mleaver">
    <isLoading v-if="isLoading"/>
    <div class="box W1175">
      <div class="title_two">
        <h2 class="title_0">{{title_1.value}}</h2>
        <h2 class="title_1">{{title_2.value}}</h2>
      </div>
      <div class="content">
        <p>{{mainContent.value}}</p>
        <el-button type="text"
                   icon="el-icon-edit"
                   class="btn_content"
                   size="small"
                   @click="changeContent(null,mainContent)"
                   v-if="isShow"
                   :class="{hoverShow:hoverShow}"
        >编辑
        </el-button>
      </div>
      <el-button type="text"
                 icon="el-icon-edit"
                 class="btn_1"
                 size="small"
                 @click="changeTitle(null,title_1)"
                 v-if="isShow"
                 :class="{hoverShow:hoverShow}"
      >编辑
      </el-button>
      <el-button type="text"
                 icon="el-icon-edit"
                 class="btn_1_1"
                 size="small"
                 @click="changeTitle(null,title_2)"
                 v-if="isShow"
                 :class="{hoverShow:hoverShow}"
      >编辑
      </el-button>
    </div>


    <div class="model_three W1175">
      <div class="box_three" v-for="(item,index) in showData.model" :key="index">
        <div>
          <img v-lazy="item.value.a1" :key="item.value.a1" :alt="item.value.a1" class="img">
          <el-button type="text"
                     icon="el-icon-edit"
                     class="btn_img"
                     size="small"
                     @click="changeImg(item.id.a1,item.value.a1)"
                     v-if="isShow"
                     :class="{hoverShow:hoverShow}"
          >编辑
          </el-button>
        </div>
        <div class="item_content">
          <h3 class="item_title">{{item.value.a0}}</h3>
          <p class="item_data" :title="item.value.a2">{{item.value.a2}}</p>
          <el-button type="text"
                     icon="el-icon-edit"
                     class="btn_title"
                     size="small"
                     @click="changeTitle(item.id.a0,item.value.a0)"
                     v-if="isShow"
                     :class="{hoverShow:hoverShow}"
          >编辑
          </el-button>
          <el-button type="text"
                     icon="el-icon-edit"
                     class="btn_content_1"
                     size="small"
                     @click="changeContent(item.id.a2,item.value.a2)"
                     v-if="isShow"
                     :class="{hoverShow:hoverShow}"
          >编辑
          </el-button>
        </div>
      </div>
    </div>

    <transition name="el-zoom-in-center">
      <changeTitle v-if="Tchange" @cancel="mayCancel" @ensure='mayEnsure'/>
    </transition>

    <transition name="el-zoom-in-center">
      <changeContent v-if="conShow" @contentCe="contentCe" @contentEn="contentEn"/>
    </transition>


    <changeImg v-if="imgChange" @cancel="cancelImg" @ensure='enterImg'/>


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
        isShow: false,
        dialogTableVisible: false,
        dialogTableVisible_1: false,
        imgShow: false,
        Tchange: false,
        conShow: false,
        imgChange: false,
        showData: {},
        title_1: {},
        title_2: {},
        mainContent: {},
        hoverShow: false,
        isLoading : false,
      }
    },
    methods: {
      //请求文字标题接口
      getData() {
        this.isLoading = true
        this.$axios.get('/info?pid=k_3').then(res => {
          if (res.data.code == 200) {
            this.showData = res.data.data
            this.title_1 = res.data.data.txt[0]
            this.title_2 = res.data.data.txt[1]
            this.mainContent = res.data.data.txt[2]
            this.isLoading = false
          }
        }).catch(err => {
          this.isLoading = false
          this.$message.error('请求失败')
          // this.$router.push('/')
        })

      },
      getSession() {
        let show = sessionStorage.getItem('hoverShow')
        if (show == 0) {
          this.hoverShow = true
        }
      },
      Mover() {
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
    /*margin-top: 80px;*/
    width: 100%;
    background: #eef3fb;
    height: 460px;
    box-sizing: border-box;
    .box {
      position: relative;
      padding-top: 60px;
      .title_two {
        display: flex;
        justify-content: center;
        .title_0{
          font-size: 28px;
        }
        .title_1 {
          margin-left: 10px;
          color: #1962af;
        }
      }
      .content {
        position: relative;
        margin-top: 40px;
        color: #919191;
        font-size: 16px;
        padding: 0 140px;
        text-align: center;
        line-height: 1.5;
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 3;
        -webkit-box-orient: vertical;
        .btn_content {
          position: absolute;
          bottom: -5px;
          right: 170px;
        }
      }
      .btn_1 {
        position: absolute;
        top: 90px;
        right: 640px;
      }
      .btn_1_1 {
        position: absolute;
        top: 90px;
        right: 320px;
      }
    }
    .model_three {
      box-sizing: border-box;
      margin-top: 80px;
      position: relative;
      display: flex;
      justify-content: space-between;
      .box_three {
        width: 360px;
        height: 190px;
        display: flex;
        justify-content: flex-start;
        .img {
          position: relative;
          width: 50px;
          height: 50px;
          border-radius: 50%;
          flex-shrink: 0;
        }

        .item_content {
          margin-left: 10px;
          position: relative;
          .item_title {
            font-size: 18px;
            color: #434343;
          }
          .item_data {
            color: #949494;
            font-size: 14px;
            line-height: 1.5;
            margin-top: 10px;
            overflow: hidden;
            text-overflow: ellipsis;
            display: -webkit-box;
            -webkit-line-clamp: 6;
            -webkit-box-orient: vertical;
          }
          .btn_title {
            position: absolute;
            bottom: 155px;
            right: 130px;
          }
          .btn_content_1 {
            position: absolute;
            bottom: 45px;
            right: 0;
          }
        }
        .btn_2 {
          position: absolute;
          top: 10px;
          right: 10px;
          z-index: 998;
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
