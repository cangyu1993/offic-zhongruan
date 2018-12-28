<template>
  <label class="label">
    <i class="el-icon-plus icon_upload"></i>
    <input type="file" style="display: none" @change="getImg">
  </label>
</template>

<script>

  export default {
    name: "index",
    data() {
      return {
        token: ''
      }
    },
    methods: {
      // 图片本地转base64
      getImg(event){
        let file = event.target.files[0]
        // console.log(file.size)
        if (parseInt(file.size) >3145728 ) {
          this.$message.error('上传照片不能超过3M!');
        }else {
          let render = new FileReader()
          render.readAsDataURL(file)
          render.onload = (e) => {
            let imgCodes = e.target.result
            this.$emit('getImg',imgCodes)
          }
        }
        event.target.value = ''
      }
    },
    created() {}
  }
</script>

<style scoped lang="scss">
  .label {
    width: 100px;
    height: 100px;
    border: 1px solid #ccc;
    border-radius: 4px;
    cursor: pointer;
    margin-top: 10px;
    display: flex;
    justify-content: center;
    align-items: center;
    &:hover {
      border: 1px dashed skyblue;
    }
    .el-icon-plus {
      font-size: 14px;
      padding: 35px;
    }
  }
</style>
