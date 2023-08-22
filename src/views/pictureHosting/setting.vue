<template>
  <div>
    <el-card>
      <div slot="header">
        <span>又拍云存储配置</span>
      </div>
      <el-form :model="upyunConfig" label-width="100px">
        <el-form-item label="操作员名称">
          <el-input v-model="upyunConfig.username"></el-input>
        </el-form-item>
        <el-form-item label="操作员密码">
          <el-input v-model="upyunConfig.password"></el-input>
        </el-form-item>
        <el-form-item label="存储空间名">
          <el-input v-model="upyunConfig.bucketName"></el-input>
        </el-form-item>
        <el-form-item label="CDN访问域名">
          <el-input v-model="upyunConfig.domain"></el-input>
        </el-form-item>
        <el-button type="primary" size="medium" icon="el-icon-check" :disabled="!isUpyunSave" @click="saveUpyun(true)">保存配置</el-button>
        <el-button type="info" size="medium" icon="el-icon-close" @click="saveUpyun(false)">清除配置</el-button>
      </el-form>
    </el-card>
  </div>
</template>

<script>
export default {
  name: "Setting",
  data() {
    return {
      upyunConfig: {
        username: '',
        password: '',
        bucketName: '',
        domain: ''
      },
    }
  },
  computed: {
    isUpyunSave() {
      return this.upyunConfig.username && this.upyunConfig.password && this.upyunConfig.bucketName && this.upyunConfig.domain
    },
  },
  created() {
    const upyunConfig = localStorage.getItem('upyunConfig')
    if (upyunConfig) {
      this.upyunConfig = JSON.parse(upyunConfig)
    }
  },
  methods: {
    saveUpyun(save) {
      if (save) {
        localStorage.setItem('upyunToken', btoa(`${this.upyunConfig.username}:${this.upyunConfig.password}`))
        localStorage.setItem('upyunConfig', JSON.stringify(this.upyunConfig))
        this.msgSuccess('保存成功')
      } else {
        localStorage.removeItem('upyunConfig')
        this.msgSuccess('清除成功')
      }
    },
  },
}
</script>

<style scoped>
.el-alert + .el-row, .el-row + .el-row {
  margin-top: 20px;
}

.el-avatar {
  vertical-align: middle;
  margin-right: 15px;
}

.middle {
  vertical-align: middle;
}

.el-card {
  width: 50%;
}

.el-card + .el-card {
  margin-top: 20px;
}
</style>
