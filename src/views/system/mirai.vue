<template>
  <div class="mirai-container">
    <el-form inline @submit.native.prevent>
      <el-form-item label="QQ号">
        <el-input placeholder="请输入QQ号" v-model="qq" type="number" :clearable="true" size="small" style="min-width: 220px"></el-input>
      </el-form-item>
      <el-form-item label="QQ群号">
        <el-input placeholder="请输入QQ群号" v-model="groupId" type="number" :clearable="true" size="small" style="min-width: 220px"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" size="small" icon="iconfont icon-login" @click="login">登录</el-button>
      </el-form-item>
      <el-form-item>
        <el-button type="danger" size="small" icon="iconfont icon-guanbi" @click="close">退出</el-button>
      </el-form-item>
    </el-form>

    <el-descriptions class="desc" title="登录信息" size="medium" :column="1" :colon="false" border labelClassName="desc-label">
      <template slot="extra">
        <el-button type="warning" size="small" icon="el-icon-refresh" @click="getLoginInfo">刷新</el-button>
      </template>
      <el-descriptions-item label="登录状态">
        <el-tag size="medium" :type="isLogin ? '' : 'info'">{{ isLogin ? '已登录' : '未登录' }}</el-tag>
      </el-descriptions-item>
      <el-descriptions-item label="QQ号">{{ loginQQ }}</el-descriptions-item>
      <el-descriptions-item label="QQ群号">{{ loginGroupId }}</el-descriptions-item>
      <el-descriptions-item label="提示" v-if="hint">{{ hint }}</el-descriptions-item>
      <el-descriptions-item label="登录二维码" v-if="qrcode">
        <el-image :src="qrcode" fit="contain"></el-image>
      </el-descriptions-item>
    </el-descriptions>
  </div>
</template>

<script>
import {login, close, getStatus, getLoginInfo} from "@/api/mirai";

export default {
  name: "Mirai",
  data() {
    return {
      qq: '2106308917',
      groupId: '369116826',
      loginQQ: '',
      loginGroupId: '',
      isLogin: false,
      hint: '',
      qrcode: '',
      statusPollTimer: null,
    }
  },
  created() {
    this.getLoginInfo()
  },
  methods: {
    getLoginInfo() {
      getLoginInfo().then(res => {
        if (res.data.qq === null) {
          this.loginQQ = '无'
          this.loginGroupId = '无'
          this.isLogin = false
          return
        } else {
          this.loginQQ = res.data.qq
          this.loginGroupId = res.data.groupId
          this.isLogin = true
          clearInterval(this.statusPollTimer)
        }
      })
    },
    login() {
      login(this.qq, this.groupId)

      setTimeout(() => {
        this.statusPollTimer = setInterval(() => {
          this.getStatus()
        }, 5000)
      }, 1000)
    },
    getStatus() {
      this.getLoginInfo()
      getStatus().then(res => {
        if (res.data.status === null) {
          return
        }
        this.qrcode = 'data:image/png;base64,' + res.data.qrcode
        switch (res.data.status) {
          case 'WAITING_FOR_SCAN':
            this.hint = '等待扫描二维码中'
            break
          case 'WAITING_FOR_CONFIRM':
            this.hint = '二维码已扫描，请在手机QQ确认登录'
            break
          case 'CANCELLED':
            this.hint = '扫描后取消了登录，将会重新获取二维码'
            break
          case 'TIMEOUT':
            this.hint = '二维码超时，将会重新获取二维码'
            break
          case 'CONFIRMED':
            clearInterval(this.statusPollTimer)
            this.hint = '已确认登录'
            this.qrcode = ''
            this.getLoginInfo()
            break
          case 'CANCEL':
            clearInterval(this.statusPollTimer)
            this.hint = '已取消登录'
            this.qrcode = ''
            this.getLoginInfo()
            break
        }
      })
    },
    close() {
      close().then(res => {
        this.getLoginInfo()
        this.hint = ''
      })
    }
  }
}
</script>

<style lang="scss">
.mirai-container {
  .el-form {
    .iconfont {
      margin-right: 4px;
    }
  }

  .desc {
    width: 500px;
    margin-top: 10px;

    .desc-label {
      width: 20%;
    }
  }
}
</style>
