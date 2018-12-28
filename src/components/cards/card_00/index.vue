<template>
  <div class="all">
    <isLoading v-if="isLoading"/>
    <div class="content " @mouseover="Mover" @mouseleave="Mleaver">
      <div class="title">
        <h2 style="font-size: 28px;color: #454545">{{title.value}}</h2>
        <p :title="mainContent.value" style="font-family: 'Microsoft YaHei';font-size: 18px;color: #919191">{{mainContent.value}}</p>
        <el-button type="text" icon="el-icon-edit" class="btn_1" :class="{hoverShow:hoverShow}" size="small" @click="changeTitle(null,title)"
                   v-if="isShow"
        >编辑
        </el-button>

        <el-button type="text" icon="el-icon-edit" class="btn_1_1" :class="{hoverShow:hoverShow}" size="small" @click="changeContent(null,mainContent)"
                   v-if="isShow"
        >编辑
        </el-button>
      </div>

      <div class="imgs">
        <div class="imgItem" v-for="(item,index) in showData.model" :key="index">
          <img v-lazy="item.value.a0" :key="item.value.a0" class="img_eve">
          <p  class="item_title">{{item.value.a1}}</p>
          <p style="width: 275px;overflow: hidden;color: #333;margin-top: 10px">{{item.value.a2}}</p>
          <div class="empty_box"></div>
          <el-button type="text" icon="el-icon-edit" class="btn_2"  :class="{hoverShow:hoverShow}"  size="small"
                     @click="changeImg(item.id.a0,item.value.a0)"
                     v-if="isShow"
          >编辑
          </el-button>

          <el-button type="text"
                     icon="el-icon-edit"
                     class="btn_2_2"
                     :class="{hoverShow:hoverShow}"
                     size="small"
                     @click="changeContent(item.id.a1,item.value.a1)"
                     v-if="isShow"
          >编辑
          </el-button>
          <el-button type="text"
                     class="btn_2_3"
                     size="small"
                     :class="{hoverShow:hoverShow}"
                     @click="changeContent(item.id.a2,item.value.a2)"
                     v-if="isShow"
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
    name: "index",
    components: {
      changeTitle,
      changeContent,
      changeImg
    },
    data() {
      return {
        isShow: false,
        Tchange: false,
        conShow: false,
        imgChange: false,
        showData: {},
        title: {},
        mainContent: {},
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
        this.$axios.get('/info?pid=k_1').then(res => {
          this.showData = res.data.data
          this.title = res.data.data.txt[0]
          this.mainContent = res.data.data.txt[1]
          this.isLoading = false
        }).catch(err => {
          this.isLoading = false
          this.$message.error('请求失败')
          // this.$router.push('/')

        })

      },
      getSession() {
        let show = sessionStorage.getItem('hoverShow')
        if (show == 0){
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
        console.log(_id,val)
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
    },
    watch: {}
  }
</script>

<style scoped lang="scss">
  .all {
    transition: all 2s ease;
    .content {
      min-height: 530px;
      box-sizing: border-box;
      .title {
        min-height: 150px;
        text-align: center;
        padding: 0 150px;
        position: relative;
        h2 {
          line-height: 110px;
        }
        p {
          padding: 0 210px;
          text-align: center;
          overflow: hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
        }
        .btn_1 {
          position: absolute;
          bottom: 60px;
          right: 440px;
        }
        .btn_1_1 {
          position: absolute;
          bottom: -35px;
          right: 130px;
        }

      }

      .change {
        width: 60%;
        margin: 0 auto;
      }
      .imgs {
        box-sizing: border-box;
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0 100px;
        margin-top: 50px;
        .imgItem {
          position: relative;
          height: 150px;
          transition: all 1s linear;
          cursor: pointer;
          &:hover{
            .item_title{
              color: #1962af;
            }
            .empty_box{
              background: #1962af;
            }
          }
          .img_eve {
            width: 275px;
            height: 180px;
          }
          .item_title{
            width: 275px;
            overflow: hidden;
            margin-top: 10px
          }
          .empty_box{
            height: 2px;
            width: 275px;
            background: #ccc;
            margin-top: 50px;
            &:hover{
              background: #1962af;
            }
          }
          p {
            text-align: center;
          }
          .btn_2 {
            position: absolute;
            bottom: 125px;
            right: -45px;
          }
          .btn_2_2 {
            position: absolute;
            bottom: -68px;
            right: -15px;
          }
          .btn_2_3 {
            position: absolute;
            bottom: -98px;
            right: -15px;
          }
        }
      }
      .img_change {
        box-sizing: border-box;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        .img_change_1 {
          width: 275px;
          height: 180px;
        }
      }
    }
    .shaow {
      box-shadow: 0 12px 10px #ccc;
    }
  }

  .hoverShow {
    display: none;
  }
  .btnShow{
    display: none;
  }
</style>
