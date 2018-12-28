<template>
  <div class="all">
    <div class="box">
      <h1 class="title">xxx网站管理系统</h1>
      <el-form ref="form"
               :model="form"
               label-width="80px"
               @submit.native.prevent
               :rules="addRules"
               size="small"
               :label-position="labelPosition"
               :hide-required-asterisk="request"
      >
        <el-form-item label="用户名" prop="username">
          <el-input v-model="form.username" clearable placeholder="请输入账号.."></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="form.password" type="password" clearable placeholder="请输入密码.."></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary"
                     @click="submitForm('form')"
                     class="btn"
                     :loading="loading"
          >立即登陆
          </el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
  import imgCat from '@/components/catimg'
  import cookie from '@/cookie'

  export default {
    name: "index",
    components: {
      imgCat
    },
    data() {
      let username = (rule, value, callback) => {
        let reg = /^[A-Za-z0-9]{5,25}$/
        if (!reg.test(value)) {
          callback(new Error('账号必须是由5-25位数字和字母组合'))
        } else {
          callback()
        }
      }
      let password = (rule, value, callback) => {
        let reg = /^(?![\d]+$)(?![a-zA-Z]+$)(?![^\da-zA-Z]+$).{6,20}$/
        if (!reg.test(value)) {
          callback(new Error('请输入6-20位字符，数字、字母、标点符号（除空格），至少包含以上2种，区分大小写'))
        } else {
          callback()
        }
      }
      return {
        request: true,
        labelPosition: 'top',
        form: {
          username: '',
          password: '',
          // needTicket: '',
        },
        verificationCode_f: '1234',
        loading: false,
        addRules: {
          username: [
            {required: true, message: '请输入账号', trigger: 'blur'},
            {validator: username, trigger: 'blur'}
          ],
          password: [
            {required: true, message: '请输入密码', trigger: 'blur'},
            {validator: password, trigger: 'blur'}
          ],
        },
        needTicket:{}
      }
    },
    methods: {
      //验证表单，正确则通过
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.onSubmit()
          } else {
            this.$message.info('缺少必要信息')
            return false;
          }
        });
      },
      //腾讯验证码验证登陆
      onSubmit() {
        var vm = this
        let appId = '2044074713'
        let captcha1 = new TencentCaptcha(appId, function (res) {
          vm.needTicket = res
          if (vm.needTicket.ticket){
            vm.loginToPage()
          }
        });
        captcha1.show()
      },

      //登陆

      loginToPage() {
        this.loading = true
        this.form = {...this.form,...this.needTicket}
        this.$axios.post('/login', this.form).then(res => {
          console.log(res)
          if (res.data.code == 200) {
            this.$message.success('登陆成功')
            this.loading = false


            //清除原有token存入新token
            sessionStorage.removeItem('token')
            sessionStorage.setItem('token', res.data.data.token)
            //清除原有username存入新username
            cookie.delCookie('username')
            cookie.setCookie('username', res.data.data.username)
            //清除原有avatar存入新avatar
            cookie.delCookie('avatar')
            cookie.setCookie('avatar', res.data.data.avatar)
            //清除原有expiretime存入新expiretime
            cookie.delCookie('expiretime')
            cookie.setCookie('expiretime', res.data.data.expiretime)
            //清除原有密码存入新密码
            cookie.delCookie('password')
            cookie.setCookie('password', this.form.password)

            this.$store.commit('SAVE_TOKEN', res.data.data.token)
            setTimeout(() => {
              this.$router.push('/1')
            }, 1000)
          } else {
            this.$message.error(res.data.msg)
          }
        }).catch(err => {
          console.log(err)
          this.$message.error('请求失败，确认密码是否正确')
          this.loading = false
        })
      },

      // 自动登陆
      isLoading() {
        let username = cookie.readCookie('username')
        let password = cookie.readCookie('password')
        if (username && password) {
          this.form.username = username
          this.form.password = password
          this.loginToPage()
        }
      },
      randomNum(val) {
        this.verificationCode_f = val
      }
    }
    ,
    watch: {}
    ,
    mounted() {
      this.isLoading()
    }
  }
</script>

<style scoped lang="scss">
  .all {
    height: 100vh;
    overflow: hidden;
    background-size: 100% 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    box-sizing: border-box;
    -webkit-backface-visibility: hidden;
    -webkit-transform-style: preserve-3d;
    animation: bgImg 3s linear 0s infinite alternate;
    .box {
      width: 450px;
      box-sizing: border-box;
      background: rgba(0, 0, 0, .2);
      border-radius: 4px;
      padding: 20px 30px;
      .title {
        text-align: center;
        color: #fff;
      }
      .changeLength {
        width: 60%;
      }
      /deep/ .el-form-item__content {
        height: 40px;
      }
      .btn {
        display: block;
        width: 100%;
        margin: 5px auto;
      }
      /deep/ .el-input__inner {
        background-color: rgba(0, 0, 0, .1);
        border-top: none;
        border-right: none;
        border-left: none;
        border-radius: 0;
        color: #fff;
      }
      /deep/ .el-form-item__label {
        color: #fff;
      }
      /deep/ .el-form-item__error {
        color: #fff;
      }
    }
  }

  @keyframes bgImg {
    0% {
      background: url("../../assets/login-bg/b-1-city.jpg") no-repeat;
      background-size: 100% 100%
    }
    100% {
      background: url("../../assets/login-bg/b-2-view.jpg") no-repeat;
      background-size: 100% 100%
    }
  }
</style>
