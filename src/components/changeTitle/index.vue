<template>
  <div>
    <isLoading v-if="isLoading"/>
    <el-dialog title="修改标题" :visible.sync="dialogTableVisible"
               :close-on-click-modal=false
               :modal-append-to-body='false'
               @close="cancelTo"
    >
      <el-input type="text" placeholder="请输入标题" v-model="title.value" style="margin-bottom: 20px"></el-input>
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
        title: {},
        dialogTableVisible: false,
        isLoading: false,
      }
    },
    methods: {
      //初始阶段从vuex拿到需要修改title数据渲染组件页面，弹窗弹出
      getTitle() {
        this.title = this.$store.state.title
        if (this.title) {
          this.dialogTableVisible = true
        }
      },

      //取消修改告知父组件关闭弹窗
      cancelTo() {
        this.$emit('cancel', 'cancel')
        this.dialogTableVisible = false
      },

      //确认修改告知父组件并将更改信息传递给父组件关闭弹窗
      ensure() {
        if (this.title && this.title.value.length <= 50) {
          this.isLoading = true
          this.$axios.post('/edit', this.title).then(res => {
            if (res.data.code == 200) {
              this.$emit('ensure', 'success')
              this.$message.success('修改成功')
              this.dialogTableVisible = false
              this.isLoading = false
            } else {
              this.isLoading = false
              this.$message.error(res.data.msg)
            }
          }).catch(err => {
            this.isLoading = false
            this.$message.error('修改失败，请重试')
            console.log(err)
          })
        } else {
          this.$message.warning('标题长度不超过25个汉字或50个英文字母')
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
