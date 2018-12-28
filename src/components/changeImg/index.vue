<template>
  <div class="all">
    <isLoading v-if="isLoading"/>
    <el-dialog
      title="修改图片"
      :visible.sync="dialogTableVisible"
      width="40%"
      :close-on-click-modal=false
      :modal-append-to-body=false
      @close="cancelTo"
    >
      <div class="img_change">
        <img :src="img.value" :alt="img.value" class="img_change_1">
        <el-switch
          v-model="urlImg"
          active-color="#13ce66"
          inactive-color="#ff4949"
          active-text="本地上传"
          inactive-text="URL上传"
          style="align-self: flex-start"
        >
        </el-switch>
        <p style="align-self: flex-start;margin: 10px 0" v-if="!urlImg">URL</p>
        <el-input v-model="img.value" v-if="!urlImg" placeholder="请输入更改图片的URL"></el-input>
        <base64 v-else style="align-self: flex-start" @getImg='getBase64'/>
      </div>


      <div slot="footer" class="dialog-footer">
        <el-button @click="cancelTo">取 消</el-button>
        <el-button type="primary" @click="ensure">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import base64 from '@/components/base64'

  export default {
    name: "index",
    components: {
      base64
    },
    data() {
      return {
        img: {},
        urlImg: false,
        dialogTableVisible: false,
        isLoading: false,
      }
    },
    methods: {
      //初始阶段从vuex拿到需要修改title数据渲染组件页面，弹窗弹出
      getStateImg() {
        this.img = this.$store.state.img
        this.dialogTableVisible = true
      },

      //取消修改告知父组件关闭弹窗
      cancelTo() {
        this.dialogTableVisible = false
        this.$emit('cancel', 'cancel')
      },

      //确认修改告知父组件并将更改信息传递给父组件关闭弹窗
      ensure() {
        let reg = /^\s*data:([a-z]+\/[a-z0-9-+.]+(;[a-z-]+=[a-z0-9-]+)?)?(;base64)?,([a-z0-9!$&',()*+;=\-._~:@\/?%\s]*?)\s*$/i
        if (this.img.value) {
          if (reg.test(this.img.value)) {
            this.img = {...this.img,type:1}
          }else {
            this.img = {...this.img,type:3}
          }
          this.isLoading = true
          this.$axios.post('/edit', this.img).then(res => {
            if (res.data.code == 200) {
              this.$message.success('修改成功')
              this.$emit('ensure', 'success')
              this.dialogTableVisible = false
              this.isLoading = false
            }else {
              this.isLoading = false
              this.$message.error(res.data.msg)
            }
          }).catch(err=>{
            this.$message.error('修改失败')
            this.isLoading = false
            console.log(err)
          })
        } else {
          this.$message.warning('请提交正确内容')
        }
      },
      getBase64(val) {
        this.img.value = val
      },

    },
    created() {
      this.getStateImg()
    },
  }
</script>

<style scoped lang="scss">
  .all {
    /*position: relative;*/
    /*z-index: 10;*/
    .img_change {
      box-sizing: border-box;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      .img_change_1 {
        width: 275px;
        height: 180px;
        margin-bottom: 10px;
      }
    }
  }

</style>
