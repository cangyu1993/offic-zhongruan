<template>
  <div>
    <isLoading v-if="isLoading"/>
    <div class="all" @mouseover="Mover" @mouseleave="Mleaver">
      <el-row>
        <el-col :span="20">
          <el-row>
            <h2 class="title">{{form.title}}</h2>
          </el-row>
          <el-row>
            <el-col :span="10"><p class="phone">电话：{{form.phone}}</p></el-col>
            <el-col :span="10"><p class="phone">商务合作：{{form.business}}</p></el-col>
          </el-row>
          <el-row>
            <el-col :span="10"><p class="phone">邮箱：{{form.email}}</p></el-col>
            <el-col :span="10"><p class="phone">渠道合作：{{form.channel}}</p></el-col>
          </el-row>
          <el-row>
            <el-col :span="3">
              <div class="weibo"><i class="iconfont icon-weibo"></i> <span>官方微博 ></span></div>
            </el-col>
          </el-row>

        </el-col>
        <el-col :span="4">
          <el-row>
            <img v-lazy="form.wechatCode" :key="form.wechatCode" class="img">
          </el-row>
          <el-row>
            <el-col :span="15">
              <p class="right_item">微信扫码关注</p>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="15">
              <p class="right_item">{{form.wechatTitle}}</p>
            </el-col>
          </el-row>
        </el-col>
      </el-row>
      <el-button type="text" icon="el-icon-edit"
                 class="btn" size="small"
                 @click="changeMsg"
                 :class="{hoverShow:hoverShow}"
                 v-if="isShow"
      >编辑
      </el-button>
    </div>
    <div class="all_bottom">
      <el-row>
        <el-col :span="12">
          <p class="content fontAlign">{{busData.record ? busData.record:'京ICP11017824号-4'}}</p>
        </el-col>
        <el-col :span="12">
          <p class="content" style="padding-left: 10px;font-size: 10px;">{{busData.copyright ?
            busData.copyright:'网络文化经营许可证京网文[2016]6173-844号'}}</p>
        </el-col>
      </el-row>
    </div>

    <el-dialog
      title="修改信息"
      :visible.sync="dialogVisible"
      width="50%"
      @close="cancel"
    >
      <el-form :label-position="labelPosition" :rules="addrules" :model="form" ref="form" size="mini">
        <el-form-item label="联系我们:" prop="title" label-width="90px">
          <el-input v-model="form.title" clearable></el-input>
        </el-form-item>
        <el-form-item label="电话:" prop="phone" label-width="90px">
          <el-input v-model="form.phone" clearable></el-input>
        </el-form-item>
        <el-form-item label="邮箱:" prop="email" label-width="90px">
          <el-input v-model="form.email" clearable></el-input>
        </el-form-item>
        <el-form-item label="商务合作:" prop="business" label-width="90px">
          <el-input v-model="form.business" clearable></el-input>
        </el-form-item>
        <el-form-item label="渠道合作:" prop="channel" label-width="90px">
          <el-input v-model="form.channel" clearable></el-input>
        </el-form-item>
        <el-form-item label="微信:" prop="wechatTitle" label-width="90px">
          <el-input v-model="form.wechatTitle" clearable></el-input>
        </el-form-item>
        <el-form-item label="微信二维码:" label-width="100px">
          <div class="img_change">
            <img :src="form.wechatCode" style="width: 100px;height: 100px;">
            <el-switch
              v-model="urlImg"
              active-color="#13ce66"
              inactive-color="#ff4949"
              active-text="本地上传"
              inactive-text="URL上传"
              style="display: block"
            >
            </el-switch>
            <p style="align-self: flex-start;margin: 10px 0" v-if="!urlImg">URL</p>
            <el-input v-model="form.wechatCode" v-if="!urlImg" placeholder="请输入更改图片的URL" clearable></el-input>
            <base64 v-else style="align-self: flex-start" @getImg='getBase64'/>
          </div>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
    <el-button @click="cancel">取 消</el-button>
    <el-button type="primary" @click="submitForm('form')">确 定</el-button>
  </span>
    </el-dialog>
  </div>
</template>

<script>
  import Bus from '@/bus'
  import base64 from '@/components/base64'

  export default {
    name: "index",
    components: {
      base64
    },
    data() {
      // let phone = (rule, value, callback) => {
      //   let reg = /^1(3|4|5|7|8)\d{9}$/
      //   if (!reg.test(value)) {
      //     callback(new Error('请输入符合规则的电话号码'))
      //   } else {
      //     callback()
      //   }
      // }
      let email = (rule, value, callback) => {
        let reg = /^\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z0-9]+$/
        if (!reg.test(value)) {
          callback(new Error('请输入正确规则的邮箱'))
        } else {
          callback()
        }
      }
      return {
        busData: {},
        dialogVisible: false,
        labelPosition: 'left',
        urlImg: false,
        isShow: false,
        hoverShow: false,
        isLoading: false,
        form: {
          id: 1,
          admin_id: 1,
          title: "联系我们",
          phone: "40088888888",
          email: "88888888@163.com",
          business: "18888888888",
          channel: "400000000",
          wechatCode: "http://js.tuguaishou.com/image/wechat_qrcode/2.jpg",
          wechatTitle: "微信公众号",
        },
        addrules: {
          title: [
            {required: true, message: '请输入必填字段', trigger: 'blur'},
            {min: 0, max: 10, message: '请输入符合规则长度字段', trigger: 'blur'},
          ],
          phone: [
            {required: true, message: '请输入必填字段', trigger: 'blur'},
            {max: 13, message: '请输入必填字段', trigger: 'blur'},
            // {validator: phone, trigger: 'blur', message: '请确认输入正确格式的号码'}
          ],
          email: [
            {required: true, message: '请输入必填字段', trigger: 'blur'},
            {validator: email, trigger: 'blur', message: '请确认输入正确格式的邮箱'}
          ],
          business: [
            {required: true, message: '请输入必填字段', trigger: 'blur'},
          ],
          channel: [
            {required: true, message: '请输入必填字段', trigger: 'blur'},
          ],
          wechatTitle: [
            {required: true, message: '请输入必填字段', trigger: 'blur'},
          ],
        }
      }
    },
    methods: {
      getData() {
        setTimeout(() => {
          Bus.$on('busData', (e) => {
            this.busData = e
          })
        }, 100)
      },
      async openGetData() {
        try {
          let res = await this.$axios.get('/webinfo')
          if (res.data.code == 200) {
            this.busData = res.data.data
          } else {
            this.$message.error(res.data.msg)
          }
        } catch (err) {
          this.$message.error('请求失败')
        }
      },
      getMsg() {
        this.isLoading = true
        this.$axios.get('/footerinfo').then(res => {
          this.form = res.data.data
          this.isLoading = false
        }).catch(err => {
          this.isLoading = false
          this.$message.error('更新失败')
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
      cancel() {
        this.dialogVisible = false
        this.getMsg()
      },
      changeMsg() {
        this.dialogVisible = true
      },
      getBase64(e) {
        this.form.wechatCode = e
      },

      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.enterMsgTo()
          } else {
            this.$message.info('缺少必要字段')
            return false;
          }
        });
      },

      enterMsgTo() {
        this.isLoading = true
        this.$axios.post('/footeredit', this.form).then(res => {
          if (res.data.code == 200) {
            this.dialogVisible = false
            this.$message.success('修改成功')
            this.getMsg()
            this.isLoading = false
          } else {
            this.isLoading = false
            this.$message.error(res.data.msg)
          }
        }).catch(err => {
          this.isLoading = false
          this.$message.error('请求失败')
          this.dialogVisible = false
        })
      }
    },
    created() {
      this.getData()
      this.getMsg()
      this.getSession()
      this.openGetData()
    }
  }
</script>

<style scoped lang="scss">
  .all {
    background: #30343d;
    height: 255px;
    width: 100%;
    box-sizing: border-box;
    padding: 0 150px;
    border-bottom: 1px solid #42494F;
    position: relative;
    .btn {
      position: absolute;
      top: 20px;
      right: 30px;
    }
    .title {
      color: #F5F8FA;
      margin: 40px 0;
    }
    .phone {
      color: #A6ADB2;
      margin-bottom: 30px;
      font-size: 16px;
      color: rgba(255, 255, 255, .5);
    }
    .weibo {
      color: #F5F8FA;
      cursor: pointer;
      &:hover {
        color: red;
      }
    }
    .img {
      width: 125px;
      height: 125px;
      margin-top: 40px;
    }
    .right_item {
      color: #F5F8FA;
      font-size: 14px;
      margin: 5px 0;
      text-align: center;
    }
  }

  .all_bottom {
    padding: 0 150px;
    background: #2F363C;
    border-bottom: 1px solid #42494F;
    .content {
      color: #A6ADB2;
      padding: 10px 0;
      font-size: 14px;
    }
    .fontAlign {
      font-size: 10px;
      text-align: right;
      padding-right: 10px;
    }

  }

  .hoverShow {
    display: none;
  }
</style>
