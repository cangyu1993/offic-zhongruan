<template>
  <div>
    <isLoading v-if="isLoading"/>
    <el-dialog title="修改内容" :visible.sync="dialogTableVisible"
               :close-on-click-modal=false
               :modal-append-to-body='false'
               @close="cancelTo"
    >
      <el-input type="textarea" :rows="4" placeholder="请输入内容" v-model="content.value"
                style="margin-bottom: 20px"></el-input>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancelTo">取 消</el-button>
        <el-button type="primary" @click="ensure">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>

  export default {
    name: "index",
    data() {
      return {
        content: {},
        dialogTableVisible: false,
        isLoading: false,
      }
    },
    methods: {
      //初始阶段从vuex拿到需要修改content数据渲染组件页面，弹窗弹出
      getTitle() {
        this.content = this.$store.state.content
        if (this.content.value) {
          this.dialogTableVisible = true
        }
      },

      //取消修改告知父组件关闭弹窗
      cancelTo() {
        this.dialogTableVisible = false
        this.$emit('contentCe', 'cancel')
      },

      //确认修改告知父组件并将更改信息传递给父组件关闭弹窗
      ensure() {
        if (this.content && 0 < this.content.value.length <= 1000) {
          this.isLoading = true
          this.$axios.post('/edit', this.content).then(res => {
            if (res.data.code == 200) {
              this.$message.success('修改成功')
              this.$emit('contentEn', 'success')
              this.dialogTableVisible = false
              this.isLoading =  false
            }else {
              this.isLoading = false
              this.$message.error(res.data.msg)
            }
            this.conShow = false
          }).catch(err => {
            this.$message.error('请求失败')
            this.$emit('contentEn', 'success')
            this.isLoading =  false
          })
        } else {
          this.$message.warning('长度不超过500个汉字或1000个英文字母')
        }
      }

    },
    created() {
      this.getTitle()
    },
    watch: {}
  }
</script>

<style scoped>

</style>
