<template>
  <div class="main">
    <isLoading v-if="isLoading"/>
    <div class="all W1200">
      <h2 class="title">XXX官网修改系统</h2>
      <div class="changeView">
        <router-link to="/1" class="pc clearA" :class="{'addcolor':$route.path ==='/'}">
          <i class="iconfont icon-diannao"></i> 电脑版
        </router-link>
        <router-link to="/phone" class="phone clearA" :class="{'addcolor':$route.name === 'phone'}">
          <i class="iconfont icon-shouji"></i>手机版
        </router-link>
      </div>
      <div class="set">
        <p @click="netSet" style="color: #999">网站设置</p>
        <p style="color: #999" @click="setTabBar">栏目设置</p>
      </div>
      <div class="user_ima">
        <img v-lazy="userMsg.avatar" :key="userMsg.avatar" class="avatar">
        <el-dropdown>
           <span class="el-dropdown-link" style="font-size: 16px;color: #999">{{userMsg.userName}}
             <i class="el-icon-arrow-down el-icon--right"></i>
           </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item @click.native="changePassword">修改密码</el-dropdown-item>
            <el-dropdown-item @click.native="logout">退出登录</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
    </div>

    <el-dialog
      title="修改密码"
      :visible.sync="dialogVisible"
      width="40%"
      :close-on-click-modal=false
      :modal-append-to-body='false'
    >
      <el-form :label-position="labelPosition" label-width="80px" :model="form"
               ref="form"
               @submit.native.prevent
               :rules="addRules"
               size="small"
               :hide-required-asterisk="request"
      >
        <el-form-item label="当前密码" label-width="120px" prop="oldpassword">
          <el-input v-model="form.oldpassword" type="password"></el-input>
        </el-form-item>
        <el-form-item label="新密码" label-width="120px" prop="newpassword">
          <el-input v-model="form.newpassword" type="password"></el-input>
        </el-form-item>
        <el-form-item label="新密码确认" label-width="120px" prop="againInput">
          <el-input v-model="form.againInput" type="password"></el-input>
        </el-form-item>
      </el-form>


      <span slot="footer" class="dialog-footer">
    <el-button @click="dialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="changePassword('form')">确 定</el-button>
  </span>
    </el-dialog>

    <el-dialog
      title="网站设置"
      :visible.sync="dialogVisible_1"
      width="40%"
      :close-on-click-modal=false
      :modal-append-to-body='false'
      @close='cancelTodo'
    >
      <el-form :label-position="labelPosition" :model="netMsg"  ref="netMsg"  :rules="netSetRules" size="mini" @submit.native.prevent>
        <el-form-item label="网站名称" label-width="130px" prop="webname">
          <el-input v-model="netMsg.webname" clearable></el-input>
        </el-form-item>
        <el-form-item label="网站简介" label-width="130px" prop="description">
          <el-input v-model="netMsg.description" type="textarea" :rows="5" clearable></el-input>
        </el-form-item>
        <el-form-item label="版权信息" label-width="130px" prop="copyright">
          <el-input v-model="netMsg.copyright" clearable></el-input>
        </el-form-item>
        <el-form-item label="主页SEO关键字" label-width="130px" prop="seo">
          <el-input v-model="netMsg.seo" clearable></el-input>
        </el-form-item>
        <el-form-item label="备案信息" label-width="130px" prop="record">
          <el-input v-model="netMsg.record" clearable></el-input>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
    <el-button @click="cancelTodo">取 消</el-button>
    <el-button type="primary" @click="submitForm('netMsg')">确 定</el-button>
  </span>
    </el-dialog>


    <el-dialog
      title="栏目设置"
      :visible.sync="dialogVisible_3"
      :close-on-click-modal=false
      :modal-append-to-body='false'
      width="60%"
      @open='openDialog'
      @close="handleCancel"
    >
      <div class="tabBarbox">
        <div class="bar_title">
          <p v-for="(item,index) in columnList.info"
             :key="index" class="bar_item_title"
             :class="{'active':current===index}"
             @click="justDo(item,index)"
          >{{item.name}}</p>
        </div>
        <div class="bar_detail">
          <el-form :label-position="labelPosition" :rules="rules" ref="barItem" label-width="100px" :model="barItem">
            <el-form-item label="名称" prop="name">
              <el-input v-model="barItem.name" clearable></el-input>
            </el-form-item>
            <el-form-item label="标题" prop="title">
              <el-input v-model="barItem.title" clearable></el-input>
            </el-form-item>
            <el-form-item label="关键字" prop="keywords">
              <el-input v-model="barItem.keywords" clearable></el-input>
            </el-form-item>
          </el-form>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
    <el-button @click="handleCancel">取 消</el-button>
    <el-button type="primary" @click="handleClick">确 定</el-button>
   </span>
    </el-dialog>

  </div>
</template>

<script>
  import cookie from '@/cookie'
  import Bus from '@/bus'
  import Cookies from 'vue-cookie'

  export default {
    name: "index",
    data() {
      let password = (rule, value, callback) => {
        let reg = /^(?![\d]+$)(?![a-zA-Z]+$)(?![^\da-zA-Z]+$).{6,20}$/
        if (!reg.test(value)) {
          callback(new Error('请输入6-20位字符，数字、字母、标点符号（除空格），至少包含以上2种，区分大小写'))
        } else {
          callback()
        }
      }
      return {
        userMsg: {
          avatar: '',
          userName: ''
        },
        request: true,
        isLoading: false,
        dialogVisible: false,
        dialogVisible_1: false,
        dialogVisible_3: false,
        labelPosition: 'left',
        form: {
          oldpassword: '',
          newpassword: '',
          againInput: '',
        },
        netMsg: {
          id: 1,
          webname: '',
          description: '',
          copyright: '',
          seo: '',
          record: ''
        },
        columnList: {},
        addRules: {
          oldpassword: [
            {required: true, message: '请输入原密码', trigger: 'blur'},
          ],
          newpassword: [
            {required: true, message: '请输入新密码!', trigger: 'blur'},
            {validator: password, trigger: 'blur'}
          ],
          againInput:[
            {required: true, message: '请再次输入新密码', trigger: 'blur'}
          ]
        },
        current: 0,
        barItem: {},
        rules: {
          name: [
            {required: true, message: '请输入需要修改的栏目名称', trigger: 'change'},
            {min: 2, max: 10, trigger: 'change', message: '栏目名称为5个汉字或10个字母'}
          ],
          title: [
            {required: true, message: '请输入需要修改标题', trigger: 'change'},
            {min: 2, max: 10, trigger: 'change', message: '标题名称为5个汉字或10个字母'}
          ],
          keywords: [
            {required: true, message: '请输入关键字', trigger: 'change'},
            {min: 2, max: 50, trigger: 'change', message: '不超过25个汉字或50个英文字母'}
          ]
        },
        netSetRules: {
          webname: [
            {required: true, message: '请输入网站名称', trigger: 'change'},
            {min: 0, max: 30, message: '网站名称为长度不超过30个字符，汉字、数字、字母、标点符号', trigger: 'change'}
          ],
          description: [
            {required: true, message: '请输入网站简介', trigger: 'change'},
            {min: 0, max: 300, message: '网站简介为长度不超过300个字符，汉字、数字、字母、标点符号', trigger: 'change'}
          ],
          copyright: [
            {required: true, message: '请输入版权信息', trigger: 'change'},
            {min: 0, max: 50, message: '版权信息为长度不超过50个字符，汉字、数字、字母、标点符号', trigger: 'change'}
          ],
          seo: [
            {required: true, message: '请输入seo关键字', trigger: 'change'},
            {min: 0, max: 50, message: '主页seo关键字为长度不超过50个字符，汉字、数字、字母、标点符号', trigger: 'change'}
          ],
          record: [
            {required: true, message: '请输入版权信息', trigger: 'change'},
            {min: 0, max: 50, message: '备案信息为长度不超过50个字符，汉字、数字、字母、标点符号', trigger: 'change'}
          ],
        }
      }
    },
    methods: {
      //获取用户信息
      getUser() {
        this.isLoading = true
        this.userMsg.userName = cookie.readCookie('username')
        if (cookie.readCookie('avatar')) {
          this.userMsg.avatar = cookie.readCookie('avatar')
          this.isLoading = false
        } else {
          this.userMsg.avatar = 'https://img2.woyaogexing.com/2017/07/21/8402aa621422d977!400x400_big.jpg'
        }
      },
      justDo(item, index) {
        this.current = index
        this.barItem = item
      },
      openDialog() {
        this.current = 0
        this.barItem = this.columnList.info[0]

      },
      getData() {
        this.isLoading = true
        this.$axios.get('/columnlist').then(res=>{
          if (res.data.code == 200){
            this.columnList = res.data.data
            this.isLoading = false
            if (this.current === 0) {
              this.barItem = res.data.data.info[0]
            }
            this.isLoading = false
          }
        }).catch(err=>{
          this.isLoading = false
        })
      },
      handleCancel() {
        this.dialogVisible_3 = false
        this.getData()
      },
      handleClick() {
        if (0 < this.barItem.name.length <= 10 && 0 < this.barItem.keywords.length <= 50) {
          this.isLoading = true
          this.$axios.post('/columnedit', this.barItem).then(res => {
            if (res.data.code == 200) {
              this.$message.success('修改成功')
              this.dialogVisible_3 = false
              this.$emit('barChange', this.barItem)
              this.isLoading = false
            }else {
              this.isLoading = false
              this.$message.error(res.data.msg)
            }
          }).catch(err => {
            this.isLoading = false
            this.$message.error('请求失败')
          })
        } else {
          this.$message.warning('*字段为必填字段，且栏目名称为5个汉字或10个字母,关键字不超过25个汉字或50个英文字母')
        }

      },
      setTabBar() {
        this.dialogVisible_3 = true
      },
      cancelTodo() {
        this.dialogVisible_1 = false
        this.openGetData()
      },
      //退出登录清空cookie缓存
      logout() {
        this.$confirm('此操作将退出登录, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          //清空cookie类容
          this.$axios.post('/logout').then(res => {
            if (res.data.code == 200) {
              cookie.delCookie('username')
              Cookies.delete('username')
              cookie.delCookie('password')
              Cookies.delete('password')
              cookie.delCookie('avatar')
              cookie.delCookie('expiretime')
              sessionStorage.removeItem('token')
              console.log('username=>', cookie.readCookie('username'), 'password=>', cookie.readCookie('password'))
              // document.title = 'XXX网站管理系统'
              this.$message({
                type: 'success',
                message: '退出登陆成功!'
              });
            }
            this.$router.go(0)
          }).catch(err => {
            cookie.delCookie('username')
            Cookies.delete('username')
            cookie.delCookie('password')
            Cookies.delete('password')
            cookie.delCookie('avatar')
            cookie.delCookie('expiretime')
            sessionStorage.removeItem('token')
            setTimeout(() => {
              this.$router.go(0)
            }, 1000)
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消'
          });
        });
      },
      //修改密码

      changePassword(formName) {
        this.dialogVisible = true
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.modifyPassword()
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },
      modifyPassword() {
        if (this.form.againInput === this.form.newpassword) {
          this.$axios.post('/modifypassword', this.form).then(res => {
            if (res.data.code == 200) {
              this.$message.success('修改密码成功')
              this.dialogVisible = false
            } else {
              this.$message.error('修改密码失败，请重试')
            }
          }).catch(err=>{
            this.$message.error('请求失败，请重新登陆')
          })
        } else {
          this.$message.warning('输入新密码密码不一致，请重新输入')
        }
      },

      netSet() {
        this.dialogVisible_1 = true
      },

      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.saveNetMsg()
          } else {
            this.$message.info('缺少必要字段')
            return false;
          }
        });
      },

      //修改网站信息请求
      async saveNetMsg() {
        try {
          let res = await this.$axios.post('/webedit', this.netMsg)
          if (res.data.code == 200) {
            this.$message.success('更改网站信息成功')
            this.dialogVisible_1 = false
            if (this.netMsg.seo) {
              document.title = this.netMsg.seo
            }
          } else {
            this.$message.error('更改失败，请重试')
          }
        } catch (err) {
          console.log(err)
        }
      },
      //打开弹窗请求网站信息
      openGetData() {
        this.$axios.get('/webinfo').then(res=>{
          if (res.data.code == 200) {
            this.netMsg = res.data.data
            if (this.netMsg.seo) {
              document.title = this.netMsg.seo
            }
            Bus.$emit('busData', this.netMsg)
          } else {
            this.$message.error('请求失败')
          }
        }).catch(err=>{
          this.$message.error('请求失败')
        })
      }
    },
    created() {
      this.getUser()
      this.openGetData()
      this.getData()
    }
  }
</script>

<style scoped lang="scss">
  .main {
    background: #EEEEEE;
    box-sizing: border-box;
    .all {
      opacity: 1;
      box-sizing: border-box;
      height: 120px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      .title {
        font-family: "Helvetica Neue", Helvetica, "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "微软雅黑", Arial, sans-serif;
        font-size: 24px;
        color: #333;
      }
      .changeView {
        display: flex;
        .pc {
          width: 120px;
          text-align: center;
          border-right: 1px solid #ccc;
          &:hover {
            color: peru;
          }
        }
        .phone {
          width: 120px;
          text-align: center;
          &:hover {
            color: peru;
          }
        }
      }
      .set {
        display: flex;
        p {
          padding: 0 40px;
          cursor: pointer;
          &:hover {
            color: peru;
          }
        }
      }
      .user_ima {
        display: flex;
        align-items: center;
        .avatar {
          width: 60px;
          height: 60px;
          border-radius: 50%;
          margin-right: 10px;
        }
      }
    }
    .tabBarbox {
      display: flex;
      justify-content: space-between;
      .bar_title {
        width: 30%;
        border-right: 1px solid #ccc;
        .bar_item_title {
          width: 160px;
          height: 52px;
          text-align: center;
          line-height: 52px;
          background: #EEEEEE;
          margin-top: 2px;
          border-radius: 4px;
          cursor: pointer;
          transition: all .5s ease;
          &:hover {
            background: rgba(24, 99, 175, .2);
          }
        }
      }
      .bar_detail {
        width: 60%;
      }
    }
  }

  .active {
    background-color: #1863AF !important;
    color: #fff;
    transform: scale(1.1);
    box-shadow: 5px 5px 10px 1px;
  }
  .addcolor{
    color: peru !important;
  }
</style>
