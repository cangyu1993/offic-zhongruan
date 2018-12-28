if (this.form.username && this.form.password) {
  this.loading = true
  this.$axios.post('/login', this.form).then(res => {
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
    this.$message.error('请求失败，请联系后台管理员')
    this.loading = false
  })
} else {
  this.$message.info('请输入账号密码')
}
