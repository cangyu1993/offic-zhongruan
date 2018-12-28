<template>
  <div class="all"  >
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




     <div class="all_box W1170">
       <div class="item_box" v-for="(item,index) in showData.model" :key="index"  @mouseover="Mover(index)" @mouseleave="Mleaver(index)">
         <img v-lazy="item.value.a0" :key="item.value.a0" alt="item.value.a0" class="img">
         <el-button type="text"
                    icon="el-icon-edit"
                    class="btn_1"
                    size="small"
                    @click="changeImg(item.id.a0,item.value.a0)"
                    v-show="isShow"
                    :class="{hoverShow:hoverShow}"
         >编辑
         </el-button>
         <h3 class="title">{{item.value.a1}}</h3>
         <el-button type="text"
                    icon="el-icon-edit"
                    class="btn_2"
                    size="small"
                    @click="changeTitle(item.id.a1,item.value.a1)"
                    v-show="isShow"
                    :class="{hoverShow:hoverShow}"
         >编辑

         </el-button>
         <p class="content">{{item.value.a2}}</p>
         <el-button type="text"
                    icon="el-icon-edit"
                    class="btn_3"
                    size="small"
                    @click="changeContent(item.id.a2,item.value.a2)"
                    v-show="isShow"
                    :class="{hoverShow:hoverShow}"
         >编辑
         </el-button>
         <el-button type="info" round class="btn">点击进入</el-button>
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
    data(){
      return{
        Tchange: false,
        conShow: false,
        imgChange: false,
        isShow:false,
        showData:{},
        hoverShow: false,
        isLoading:false
      }
    },
    methods:{
      //请求文字标题接口
      getData() {
        this.isLoading = true
        this.$axios.get('/info?pid=k_4').then(res => {
          if (res.data.code == 200) {
            this.showData = res.data.data
            this.isLoading = false
          }
        }).catch(err => {
          this.$message.error('请求失败')
          this.isLoading = false
          // this.$router.push('/')
        })

      },
      Mover(index) {
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
    /*background: #ccc;*/
    height: 600px;

    .all_box{
      height: 100%;
      box-sizing: border-box;
      display: flex;
      justify-content: space-between;
      .item_box{
        position: relative;
        -webkit-box-sizing: border-box;
        -moz-box-sizing: border-box;
        box-sizing: border-box;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        .img{
          width: 85px;
          height: 85px;
          border-radius: 50%;
        }
        .btn_1{
          position: absolute;
          top: 210px;
          right: 115px;
        }
        .btn_2{
          position: absolute;
          top: 275px;
          right: 30px;
        }
        .btn_3{
          position: absolute;
          top: 360px;
          right: 40px;
        }
        .title{
          margin-top: 40px;
          margin-bottom: 20px;
          font-weight: 100;
        }
        .content{
          overflow: hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          padding: 0 20px;
          color: #cfcfcf;
        }
        .btn{
          margin-top: 54px;
          width: 150px;
          box-shadow: 0 5px 10px #ccc;
          &:active{
            background: #2b2d2a;
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
