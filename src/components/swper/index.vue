<template>
  <div @mouseover="Mover" @mouseleave="Mleaver">
    <el-carousel trigger="hover" height="450px" :interval='2000' class="swper">
      <el-carousel-item v-for="(item,index) in imgList" :key="index">
        <img v-lazy="item.value" :key="item.value" class="img">
        <div class="btns" :class="{hoverShow:hoverShow}">
          <el-button type="text" class="btn_1" size="small" v-if="isShow" @click="changeImg(null,item)">修改</el-button>
          <!--<el-button type="text" class="btn_1" size="small" v-if="isShow" @click="addImg">新增</el-button>-->
        </div>
      </el-carousel-item>
    </el-carousel>

    <changeImg v-if="imgChange" @cancel="cancelImg" @ensure='enterImg'/>
  </div>
</template>

<script>
  import changeImg from '@/components/changeImg'

  export default {
    name: "index",
    components: {
      changeImg
    },
    data() {
      return {
        imgList: [],
        imgChange: false,
        isShow: false,
        hoverShow: false,
      }
    },
    methods: {
      async getData() {
        try {
          let res = await this.$axios.get('/info?pid=k_2')
          this.imgList = res.data.data.txt.splice(0,4)
        } catch (err) {
          console.log(err)
          this.$message.error('请求失败')
        }
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
      addImg() {
        let lth = this.imgList.length
        let newId = this.imgList.slice(lth - 1, lth)[0].id + 1
        let data = {
          pid: 'k_2',
          id: newId,
          type: '3',
          value: '',
          modeltype: '1'
        }
        this.changeImg(null, data)
      },

      //修改图片
      changeImg(_id, val) {
        // console.log(val)
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
    }
  }
</script>

<style scoped lang="scss">
  .swper {
    position: relative;
    .el-carousel__item {
      .img {
        width: 100%;
        height: 100%;
        cursor: pointer;
        /*display: block;*/
      }
      .btns {
        position: absolute;
        top: 10px;
        right: 10px;
      }
    }

  }

  .hoverShow {
    display: none;
  }

  /deep/ .is-active{
    color: #1962af;
    /*background: #1962af;*/
  }

</style>
