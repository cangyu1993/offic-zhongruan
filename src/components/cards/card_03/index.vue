<template>
  <div class="all"  @mouseover="Mover" @mouseleave="Mleaver">
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
    <div class="card">
      <img v-lazy="bg.value"  :key="bg.value" class="img_bg">
      <el-button type="text" icon="el-icon-edit"
                 class="btn_bg" size="small"
                 @click="changeImg(null,bg)"
                 :class="{hoverShow:hoverShow}"
                 v-if="isShow"
      >编辑
      </el-button>
      <div class="main_content">
        <h1 class="main_title" >{{title.value}}</h1>
        <el-button type="text" icon="el-icon-edit"
                   class="btn_1" size="small"
                   @click="changeTitle(null,title)"
                   :class="{hoverShow:hoverShow}"
                   v-if="isShow"
        >编辑
        </el-button>
        <p :title="content.value" class="main_content_d">{{content.value}}</p>
        <el-button type="text" icon="el-icon-edit"
                   class="btn_2" size="small"
                   @click="changeContent(null,content)"
                   :class="{hoverShow:hoverShow}"
                   v-if="isShow"
        >编辑
        </el-button>
        <p class="more">{{more.value}}</p>
        <el-button type="text" icon="el-icon-edit"
                   class="btn_3" size="small"
                   @click="changeTitle(null,more)"
                   :class="{hoverShow:hoverShow}"
                   v-if="isShow"
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
        isShow: false,
        hoverShow: false,
        bg:{},
        title:{},
        content:{},
        more:{},
        isLoading:false,
      }
    },
    methods: {
      getData() {
        this.isLoading = true
        this.$axios.get('/info?pid=k_7').then(res => {
          if (res.data.code == 200) {
            this.bg = res.data.data.txt[0]
            this.title = res.data.data.txt[1]
            this.content = res.data.data.txt[2]
            this.more = res.data.data.txt[3]
            this.isLoading = false
          }
        }).catch(err=>{
          this.$message.error('请求失败')
          this.isLoading = false
          console.log(err)
        })
      },
      getSession() {
        let show = sessionStorage.getItem('hoverShow')
        if (show == 0){
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
    height: 500px;
    .card {
      position: relative;
      width: 100%;
      height: 100%;
      .img_bg {
        width: 100%;
        height: 100%;
        vertical-align: middle;
        position: absolute;
        top: 0;
        right: 0;
        left: 0;
        z-index: -1;
      }
      .btn_bg {
        position: absolute;
        right: 10px;
        top: 10px;
        color: #000;
      }
      .main_content{
        width: 750px;
        height: 260px;
        background: rgba(246,246,246,.95);
        border-radius: 4px;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
      }
      .btn_1{
        position: absolute;
        top: 55px;
        right: 115px;
      }
      .btn_2{
        position: absolute;
        top: 145px;
        right: 115px;
      }
      .btn_3{
        position: absolute;
        top: 220px;
        right: 115px;
      }
    }
    .main_content{
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      box-sizing: border-box;
      .main_title{
        color: #454545;
        font-size: 30px;
        text-align: center;
        margin-bottom: 30px;
      }
      .main_content_d{
        color: #949494;
        font-size: 14px;
        font-family: "Microsoft YaHei";
        padding: 0 125px;
        text-align: center;
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
      }
      .more{
        border-bottom: 2px solid #000;
        margin-top: 20px;
        font-size: 14px;
        color: #2f2f2f;
        padding: 10px 30px;
        cursor: pointer;
        &:hover{
          color: red;
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
