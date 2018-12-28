<template>
  <div class="all">
    <isLoading v-if="isLoading"/>
    <div>
      <transition name="el-zoom-in-center">
        <changeTitle v-if="Tchange" @cancel="mayCancel" @ensure='mayEnsure'/>
      </transition>
      <transition name="el-zoom-in-center">
        <changeContent v-if="conShow" @contentCe="contentCe" @contentEn="contentEn"/>
      </transition>
      <changeImg v-if="imgChange" @cancel="cancelImg" @ensure='enterImg'/>
    </div>

    <div class="box" @mouseover="Mover" @mouseleave="Mleaver">
      <h1 class="title">{{engTitle.value}}</h1>
      <el-button type="text" icon="el-icon-edit"
                 class="btn_1" size="small"
                 @click="changeTitle(null,engTitle)"
                 :class="{hoverShow:hoverShow}"
                 v-if="isShow"
      >编辑

      </el-button>
      <h2 class="title_bottom">{{chiTitle.value}}</h2>
      <el-button type="text" icon="el-icon-edit"
                 class="btn_2" size="small"
                 @click="changeTitle(null,chiTitle)"
                 :class="{hoverShow:hoverShow}"
                 v-if="isShow"
      >编辑
      </el-button>
      <img v-lazy="bgImg.value" :key="bgImg.value" class="img">
      <el-button type="text" icon="el-icon-edit"
                 class="btn_3" size="small"
                 @click="changeImg(null,bgImg)"
                 :class="{hoverShow:hoverShow}"
                 v-if="isShow"
      >编辑
      </el-button>
      <p class="content">{{content.value}}</p>
      <el-button type="text" icon="el-icon-edit"
                 class="btn_4" size="small"
                 @click="changeContent(null,content)"
                 :class="{hoverShow:hoverShow}"
                 v-if="isShow"
      >编辑
      </el-button>
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
      changeImg,

    },
    name: "index",
    data() {
      return {
        Tchange: false,
        conShow: false,
        imgChange: false,
        engTitle: {},
        chiTitle: {},
        bgImg: {},
        content: {},
        isShow: false,
        hoverShow: false,
        isLoading: false,
      }
    },
    methods: {
      getData() {
        this.isLoading = true
        this.$axios.get('/info?pid=k_9').then(res => {
          if (res.data.code == 200) {
            this.engTitle = res.data.data.txt[0]
            this.chiTitle = res.data.data.txt[1]
            this.bgImg = res.data.data.txt[2]
            this.content = res.data.data.txt[3]
            this.isLoading = false
          }
        }).catch(err => {
          console.log(err)
          this.$message.error('请求失败')
          this.isLoading = false
        })
      },
      Mover() {
        this.isShow = true
      },
      Mleaver() {
        this.isShow = false
      },
      getSession() {
        let show = sessionStorage.getItem('hoverShow')
        if (show == 0) {
          this.hoverShow = true
        }
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
    padding-bottom: 120px;
    -webkit-box-sizing: border-box;
    -moz-box-sizing: border-box;
    box-sizing: border-box;
    .box {
      position: relative;
      display: flex;
      flex-direction: column;
      align-items: center;
      -webkit-box-sizing: border-box;
      -moz-box-sizing: border-box;
      box-sizing: border-box;
      .img {
        height: 226px;
        width: 100%;
      }
      .title {
        margin-top: 60px;
        margin-bottom: 30px;
        font-size: 40px;
        color: #292929;
        font-family: "Microsoft YaHei";
      }
      .btn_1 {
        position: absolute;
        top: 90px;
        right: 550px;
      }
      .btn_2 {
        position: absolute;
        top: 150px;
        right: 550px;
      }
      .btn_3 {
        position: absolute;
        top: 220px;
        right: 20px;
        color: #000;
      }
      .btn_4 {
        position: absolute;
        bottom: 50px;
        right: 80px;
      }
      .title_bottom {
        margin-bottom: 54px;
        font-size: 26px;
        color: #454545;
        font-family: "Microsoft YaHei";
        font-weight: 400;
      }
      .content {
        margin-top: 50px;
        text-align: center;
        font-size: 14px;
        color: #292929;
        line-height: 2;
        padding: 0 188px;
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 9;
        -webkit-box-orient: vertical;

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
