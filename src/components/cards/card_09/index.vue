<template>
  <div class="all W1170" @mouseover="Mover" @mouseleave="Mleaver">
    <isLoading v-if="isLoading"/>
    <h1 class="title">{{title.value}}</h1>
    <el-button type="text" icon="el-icon-edit"
               class="btn_1" size="small"
               @click="changeTitle(null,title)"
               :class="{hoverShow:hoverShow}"
               v-if="isShow"
    >编辑
    </el-button>
    <div class="some_box">
      <div class="box" v-for="(item,index) in showData" :key="index">
        <img v-lazy="item.value.a0" :key="item.value.a0" class="img">
        <el-button type="text" icon="el-icon-edit"
                   class="btn_2" size="small"
                   @click="changeImg(item.id.a0,item.value.a0)"
                   :class="{hoverShow:hoverShow}"
                   v-if="isShow"
        >编辑
        </el-button>
        <h2 class="img_title">{{item.value.a1}}</h2>
        <el-button type="text" icon="el-icon-edit"
                   class="btn_3" size="small"
                   @click="changeTitle(item.id.a1,item.value.a1)"
                   :class="{hoverShow:hoverShow}"
                   v-if="isShow"
        >编辑
        </el-button>
        <p class="more">{{item.value.a2}}</p>
        <el-button type="text" icon="el-icon-edit"
                   class="btn_4" size="small"
                   @click="changeTitle(item.id.a2,item.value.a2)"
                   :class="{hoverShow:hoverShow}"
                   v-if="isShow"
        >编辑
        </el-button>
      </div>
    </div>

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
    data(){
      return{
        img:{},
        Tchange: false,
        conShow: false,
        imgChange: false,
        title:{},
        showData:[],
        isShow: false,
        hoverShow: false,
        isLoading: false,
      }
    },
    methods:{
      getData() {
        this.isLoading = true
        this.$axios.get('/info?pid=k_11').then(res => {
          if (res.data.code == 200) {
            this.title = res.data.data.txt[0]
            this.showData = res.data.data.model
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
    created(){
      this.getData()
      this.getSession()
    }
  }
</script>

<style scoped lang="scss">
  .all {
    position: relative;
    box-sizing: border-box;
    /*margin-top: 82px;*/
    height: 640px;
    .title{
      padding-top: 110px;
      margin-bottom: 35px;
      text-align: center;
    }
    .btn_1{
      position: absolute;
      top: 135px;
      right: 250px;
    }
    .some_box{
      display: flex;
      justify-content: space-between;
      .box{
        position: relative;
        width: 545px;
        height: 350px;
        background: #fff;
        border-radius: 4px;
        overflow: hidden;
        border: 1px solid rgba(204,204,204,.2);
        .img{
          width: 100%;
          height: 250px;
          border-bottom: 1px solid rgba(204,204,204,.4);
        }
        .img_title{
          overflow: hidden;
          margin-top: 30px;
          margin-left: 30px;
        }
        .more{
          float: right;
          margin-right: 30px;
          color: #ccc;
        }
        .btn_2{
          position: absolute;
          top: 10px;
          right: 20px;
          color: #000;
        }
        .btn_3{
          position: absolute;
          bottom: 10px;
          left: 240px;
        }
        .btn_4{
          position: absolute;
          bottom: -5px;
          right: 40px;
        }
      }
    }
  }
  .hoverShow {
    display: none;
  }
</style>
