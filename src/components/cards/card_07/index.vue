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


    <div class="more W1170" @mouseover="Mover" @mouseleave="Mleaver">
      <h1 class="left">{{titleLeft.value}}</h1>
      <el-button type="text" icon="el-icon-edit"
                 class="btn_1" size="small"
                 @click="changeTitle(null,titleLeft)"
                 :class="{hoverShow:hoverShow}"
                 v-if="isShow"
      >编辑
      </el-button>
      <p class="right">{{titleRight.value}}>></p>
      <el-button type="text" icon="el-icon-edit"
                 class="btn_2" size="small"
                 @click="changeTitle(null,titleRight)"
                 :class="{hoverShow:hoverShow}"
                 v-if="isShow"
      >编辑
      </el-button>
    </div>
    <div class="box W1170" @mouseover="Mover" @mouseleave="Mleaver">
      <div class="item_box" v-for="(item,index) in showData" :key="index" >
        <img v-lazy="item.value.a0" :key="item.value.a0" class="img">
        <el-button type="text" icon="el-icon-edit"
                   class="btn_3" size="small"
                   @click="changeImg(item.id.a0,item.value.a0)"
                   :class="{hoverShow:hoverShow}"
                   v-if="isShow"
        >编辑
        </el-button>
        <div class="bgColor">
          <p class="item_title">{{item.value.a1}}</p>
          <el-button type="text" icon="el-icon-edit"
                     class="btn_4" size="small"
                     @click="changeTitle(item.id.a1,item.value.a1)"
                     :class="{hoverShow:hoverShow}"
                     v-if="isShow"
          >编辑
          </el-button>
          <p class="item_title_1">{{item.value.a2}}</p>
          <el-button type="text" icon="el-icon-edit"
                     class="btn_5" size="small"
                     @click="changeTitle(item.id.a2,item.value.a2)"
                     :class="{hoverShow:hoverShow}"
                     v-if="isShow"
          >编辑
          </el-button>
        </div>
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
        titleLeft: {},
        titleRight: {},
        showData: [],
        isShow: false,
        hoverShow: false,
        isLoading:false
      }
    },
    methods: {
      getData() {
        this.isLoading = true
        this.$axios.get('/info?pid=k_8').then(res => {
          if (res.data.code == 200) {
            this.titleLeft = res.data.data.txt[0]
            this.titleRight = res.data.data.txt[1]
            this.showData = res.data.data.model
            this.isLoading = false
          }
        }).catch(err => {
          this.$message.error('请求失败')
          this.isLoading = false
          console.log(err)
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
    background: #fff;
    height: 390px;
    margin-bottom: 60px;
    .box {
      box-sizing: border-box;
      display: flex;
      justify-content: space-between;
      .item_box {
        box-sizing: border-box;
        width: 280px;
        height: 280px;
        background: #fff;
        position: relative;
        .img {
          width: 100%;
          height: 100%;
        }
        .btn_3 {
          position: absolute;
          top: 0;
          right: 5px;
          color: #000;
        }
        .btn_4 {
          position: absolute;
          top: 5px;
          right: -25px;
        }
        .btn_5 {
          position: absolute;
          top: 30px;
          right: -25px;
        }
        .bgColor {
          width: 80%;
          height: 60px;
          text-align: center;
          position: absolute;
          left: 50%;
          bottom: 20px;
          transform: translate(-50%);
          background: rgba(255, 255, 255, .8);
          .item_title{
            font-size: 14px;
            color: #573318;
            padding: 10px 0;
          }
          .item_title_1{
            font-size: 14px;
            color: #573318;
          }
        }
      }
    }
    .more {
      position: relative;
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 20px 10px;
      .btn_1 {
        position: absolute;
        top: 70px;
        left: 165px;
      }
      .btn_2 {
        position: absolute;
        top: 70px;
        right: 10px;
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
