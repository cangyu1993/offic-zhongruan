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


    <div class="box W1200">
      <div class="item_three">
        <div style="width: 400px;height: 600px;background: #F6F6F6;">
          <el-carousel height="600px" arrow="never" :interval="1500">
            <el-carousel-item v-for="(item,index) in showData" :key="index" class="swper">
              <h2 class="swper_1">{{ item.value.a0 }}</h2>
              <el-button type="text" icon="el-icon-edit"
                         class="btn_1" size="small"
                         @click="changeTitle(item.id.a0,item.value.a0)"
                         :class="{hoverShow:hoverShow}"
                         v-if="isShow"
              >编辑

              </el-button>
              <h3 class="swper_2">{{ item.value.a1 }}</h3>
              <el-button type="text" icon="el-icon-edit"
                         class="btn_2" size="small"
                         @click="changeTitle(item.id.a1,item.value.a1)"
                         :class="{hoverShow:hoverShow}"
                         v-if="isShow"
              >编辑
              </el-button>
              <p class="swper_3">{{ item.value.a2 }}</p>
              <el-button type="text" icon="el-icon-edit"
                         class="btn_3" size="small"
                         @click="changeContent(item.id.a2,item.value.a2)"
                         :class="{hoverShow:hoverShow}"
                         v-if="isShow"
              >编辑
              </el-button>
            </el-carousel-item>
          </el-carousel>
        </div>
        <div class="imgItem">
          <img v-lazy="img_0.value"
               :key="img_0.value"
               style="width: 400px;height: 600px;background: palegoldenrod;"
          >
          <el-button type="text" icon="el-icon-edit"
                     class="btn_4" size="small"
                     @click="changeImg(null,img_0)"
                     :class="{hoverShow:hoverShow}"
                     v-if="isShow"
          >编辑
          </el-button>
        </div>
        <div class="imgItem">
          <img v-lazy="img_1.value"
               :key="img_1.value"
               style="width: 400px;height: 600px;background: oldlace;"
          >
          <el-button type="text" icon="el-icon-edit"
                     class="btn_5" size="small"
                     @click="changeImg(null,img_1)"
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
    data() {
      return {
        Tchange: false,
        conShow: false,
        imgChange: false,
        img_0: {},
        img_1: {},
        showData: [],
        isShow: false,
        hoverShow: false,
        isLoading:false
      }
    },
    methods: {
      getData() {
        this.isLoading = true
        this.$axios.get('/info?pid=k_10').then(res => {
          if (res.data.code == 200) {
            this.img_0 = res.data.data.txt[0]
            this.img_1 = res.data.data.txt[1]
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
    height: 610px;
    .box {
      position: relative;
      .item_three {
        box-sizing: border-box;
        display: flex;
        justify-content: flex-start;
        .swper {
          box-sizing: border-box;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          .swper_1 {
            margin-bottom: 20px;
          }
          .btn_1 {
            position: absolute;
            top: 230px;
            left: 275px;
          }
          .btn_2 {
            position: absolute;
            top: 300px;
            left: 350px;
          }
          .btn_3 {
            position: absolute;
            top: 390px;
            left: 350px;
          }
          .swper_2 {
            margin-bottom: 20px;
          }
          .swper_3 {
            padding: 0 20px;
            text-align: center;
          }
        }
        .btn_4 {
          position: absolute;
          top: 10px;
          left: 720px;
          color: #000;
        }
        .btn_5 {
          position: absolute;
          top: 10px;
          left: 1130px;
          color: #000;
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
