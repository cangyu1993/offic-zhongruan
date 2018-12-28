<template>
  <div class="all" @mouseover="Mover" @mouseleave="Mleaver">
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
    <div class="font">
      <h1 class="title">{{title.value}}</h1>
      <el-button type="text" icon="el-icon-edit" class="btn_title" :class="{hoverShow:hoverShow}" size="small"
                 @click="changeTitle(null,title)" v-if="isShow">
        编辑
      </el-button>
      <p class="content">{{content.value}}</p>
      <el-button type="text" icon="el-icon-edit" class="btn_content" :class="{hoverShow:hoverShow}" size="small"
                 @click="changeContent(null,content)" v-if="isShow">
        编辑
      </el-button>
    </div>

    <div class="imgs">
      <div class="img_item" v-for="(item,index) in showData.model" :key="index">
        <img v-lazy="item.value.a0" :key="item.value.a0" class="img">
        <el-button type="text" icon="el-icon-edit" class="btn_1"  size="small"
                   :class="{hoverShow:hoverShow}"
                   v-if="isShow"
                   @click="changeImg(item.id.a0,item.value.a0)">
          编辑
        </el-button>
        <p class="img_title">{{item.value.a1}}</p>
        <el-button type="text" icon="el-icon-edit" class="btn_2"  size="small"
                   :class="{hoverShow:hoverShow}"
                   v-if="isShow"
                   @click="changeTitle(item.id.a1,item.value.a1)"
        >
          编辑
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
        isShow: false,
        showData: {},
        title: {},
        content: {},
        hoverShow: false,
        isLoading:false
      }
    },
    methods: {
      Mover() {
        this.isShow = true
      },
      Mleaver() {
        this.isShow = false
      },
      getData() {
        this.isLoading = true
        this.$axios.get('/info?pid=k_6').then(res => {
          if (res.data.code == 200) {
            this.showData = res.data.data
            this.title = res.data.data.txt[0]
            this.content = res.data.data.txt[1]
            this.isLoading = false
          }
        }).catch(err => {
          this.isLoading = false
          this.$message.error('请求失败')
          console.log(err)
        })
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
    box-sizing: border-box;
    height: 650px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    .font {
      position: relative;
      .title {
        font-size: 28px;
        text-align: center;
        padding-top: 30px;
        padding-bottom: 30px;
        color: #454545;
      }
      .btn_title {
        position: absolute;
        top: 80px;
        right: 390px;
      }
      .content {
        padding: 0 270px;
        font-size: 14px;
        color: #454545;
        text-align: center;
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 3;
        -webkit-box-orient: vertical;
      }
      .btn_content {
        position: absolute;
        top: 180px;
        right: 230px;
      }
    }
    .imgs {
      margin-top: 60px;
      display: flex;
      justify-content: flex-start;
      .img_item {
        position: relative;
        .img {
          width: 350px;
          height: 350px;
          flex-shrink: 0;
          vertical-align: middle;
        }
        .btn_1{
          position: absolute;
          top: 1px;
          right: 1px;
          color: #000;
        }
        .btn_2{
          position: absolute;
          top: 325px;
          right: 175px;
        }
        .img_title {
          width: 200px;
          height: 40px;
          text-align: center;
          line-height: 40px;
          position: absolute;
          left: 0;
          bottom: 0;
          color: #fff;
          font-size: 14px;
          font-family: "Microsoft YaHei";
          background: rgba(0, 0, 0, 0.66);
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
