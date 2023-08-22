<template>
  <div class="upyun-container">
    <el-row>
      <el-select v-model="upyunConfig.bucketName" disabled style="min-width: 200px"></el-select>
      <el-cascader v-model="activePath" placeholder="请选择目录" :options="pathArr" :props="pathProps" style="min-width: 450px"></el-cascader>
      <el-button type="primary" size="medium" icon="el-icon-search" @click="search">查询</el-button>
      <el-button class="right-item" type="primary" size="medium" icon="el-icon-upload" @click="isDrawerShow=!isDrawerShow">上传</el-button>
    </el-row>
    <el-row v-viewer>
      <div class="image-container" v-for="(file,index) in fileList" :key="index">
        <el-image :src="file.cdn_url" fit="scale-down"></el-image>
        <div class="image-content">
          <div class="info">
            <span>{{ file.name }}</span>
          </div>
          <div class="icons">
            <el-tooltip class="item" effect="dark" content="复制CDN链接" placement="bottom">
              <i class="icon el-icon-link" @click="copy(1,file)"></i>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="复制MD格式" placement="bottom">
              <SvgIcon icon-class="markdown" class-name="icon" @click="copy(2,file)"></SvgIcon>
            </el-tooltip>
            <i class="icon el-icon-delete" @click="delFile(file)"></i>
          </div>
        </div>
      </div>
    </el-row>

    <el-drawer title="上传文件" :visible.sync="isDrawerShow" direction="rtl" size="40%" :wrapperClosable="false" :close-on-press-escape="false">
      <el-row>
        <el-radio v-model="nameType" label="1">使用源文件名</el-radio>
        <el-radio v-model="nameType" label="2">使用UUID文件名</el-radio>
        <el-button size="small" type="primary" icon="el-icon-upload" v-throttle="[submitUpload,`click`,3000]">确定上传</el-button>
      </el-row>
      <el-row>
        当前目录：{{ realPath }}
      </el-row>
      <el-row>
        <el-switch v-model="isCustomPath" active-text="自定义目录"></el-switch>
        <el-input placeholder="例：oldFolder/newFolder/" v-model="customPath" :disabled="!isCustomPath" size="medium" style="margin-top: 10px"></el-input>
      </el-row>
      <el-upload ref="uploadRef" action="" :http-request="upload" drag multiple :file-list="uploadList" list-type="picture" :auto-upload="false">
        <i class="el-icon-upload"></i>
        <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
      </el-upload>
    </el-drawer>
  </div>
</template>

<script>
import SvgIcon from "@/components/SvgIcon";
import {getBucketContents, delFile, upload} from "@/api/upyun";
import {isImgExt} from "@/util/validate";
import {randomUUID} from "@/util/uuid";
import {copy} from "@/util/copy";

export default {
  name: "Upyun",
  components: {SvgIcon},
  data() {
    return {
      upyunConfig: {
        username: '',
        password: '',
        bucketName: '',
        domain: ''
      },
      pathArr: [{value: '', label: '根目录'}],
      activePath: [''],// 默认选中根目录
      pathProps: {
        lazy: true,
        checkStrictly: true,
        lazyLoad: async (node, resolve) => {
          let path = node.path.join('/')
          let nodes = []
          await this.getReposContents(nodes, path)
          resolve(nodes)
        }
      },
      fileList: [],
      isDrawerShow: false,
      nameType: '1',
      uploadList: [],
      isCustomPath: false,
      customPath: '',
    }
  },
  computed: {
    realPath() {
      if (this.isCustomPath) {
        return `/${this.customPath}`
      }
      return `${this.activePath.join('/')}/`
    }
  },
  created() {
    const upyunConfig = localStorage.getItem('upyunConfig')
    if (upyunConfig) {
      this.upyunConfig = JSON.parse(upyunConfig)
    } else {
      this.msgError('请先配置又拍云')
      this.$router.push('/pictureHosting/setting')
    }
  },
  methods: {
    // 换成懒加载
    async getReposContents(arr, path) {
      await getBucketContents(this.upyunConfig.bucketName, path).then(res => {
        res.files.forEach(item => {
          if (item.type === 'folder') {
            // 让所有节点都是非叶子节点
            arr.push({value: item.name, label: item.name, leaf: false})
          }
        })
      })
    },
    search() {
      this.fileList = []
      let path = this.activePath.join('/')
      getBucketContents(this.upyunConfig.bucketName, path).then(res => {
        res.files.forEach(item => {
          if (item.type !== 'folder' && isImgExt(item.name)) {
            item.path = this.imgPath(item)
            item.cdn_url = this.imgCdnUrl(item)
            this.fileList.push(item)
          }
        })
      })
    },
    imgPath(file) {
      let path = this.activePath.join('/')
      path = path.startsWith('/') ? path : `/${path}`
      path = path.endsWith('/') ? path : `${path}/`
      return `${path}${file.name}`
    },
    imgCdnUrl(file) {
      return `${this.upyunConfig.domain}${this.imgPath(file)}`
    },
    copy(type, file) {
      // type 1 cdn link  2 Markdown
      let copyCont = ''
      if (type == 1) {
        copyCont = file.cdn_url
      } else if (type == 2) {
        copyCont = `![${file.name}](${file.cdn_url})`
      }
      copy(copyCont)
      this.msgSuccess('复制成功')
    },
    delFile(file) {
      this.$confirm("此操作将永久删除该文件, 是否删除?", "提示", {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(() => {
        delFile(this.upyunConfig.bucketName, file.path).then(() => {
          this.msgSuccess('删除成功')
          this.search()
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除',
        })
      })
    },
    submitUpload() {
      // https://github.com/ElemeFE/element/issues/12080
      this.uploadList = this.$refs.uploadRef.uploadFiles
      if (this.uploadList.length) {
        // 触发 el-upload 中 http-request 绑定的函数
        this.$refs.uploadRef.submit()
      } else {
        this.msgError('请先选择文件')
      }
    },
    upload(data) {
      let fileName = data.file.name
      if (this.nameType === '2') {
        fileName = randomUUID() + fileName.substr(fileName.lastIndexOf("."))
      }

      upload(this.upyunConfig.bucketName, this.realPath, fileName, data.file).then(() => {
        this.msgSuccess('上传成功')
        data.onSuccess()
      })
    },
  },
}
</script>

<style lang="scss">
.upyun-container {
  .el-select + .el-cascader, .el-cascader + .el-button {
    margin-left: 10px;
  }

  .image-container {
    position: relative;
    width: 200px;
    height: 200px;
    overflow: hidden;
    display: inline-block;
    margin: 0 2px;

    .el-image {
      width: 100%;
      height: 100%;
      z-index: 1;
    }

    .image-content {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;

      .info {
        background: linear-gradient(0deg, transparent, rgba(0, 0, 0, .6));
        position: absolute;
        left: 0;
        right: 0;
        top: 0;
        padding: 6px;
        font-size: 12px;
        color: #fff;
        opacity: 0;
        transition: opacity 0.5s;
        z-index: 2;

        span {
          word-wrap: break-word;
        }
      }

      &::before {
        content: '';
        position: absolute;
        left: 0;
        bottom: 0;
        background-color: rgb(192, 196, 204, 0.5);
        width: 100%;
        height: 0;
        clip-path: polygon(0 100%, 100% 0, 100% 100%);
        transition: 0.3s;
        z-index: 2;
      }
    }

    .icons {
      position: absolute;
      right: 8px;
      bottom: 8px;
      z-index: 2;

      .icon {
        text-decoration: none;
        font-size: 22px;
        margin-left: 20px;
        transform: translateY(80px);
        cursor: pointer;

        &:nth-child(1) {
          transition: transform 0.25s 0.05s, color 0.3s;

          &:hover {
            color: #409EFF;
          }
        }

        &:nth-child(2) {
          transition: transform 0.25s 0.1s, color 0.3s;

          &:hover {
            color: #409EFF;
          }
        }

        &:nth-child(3) {
          transition: transform 0.25s 0.15s, color 0.3s;

          &:hover {
            color: #F56C6C;
          }
        }
      }

      .svg-icon {
        vertical-align: -0.15em;
      }
    }

    &:hover {
      .image-content {
        .info {
          opacity: 1;
          transition-duration: 0.25s;
        }

        &::before {
          height: 80px;
        }
      }

      .icon {
        transform: translateY(0px);
      }

      .svg-icon {
        vertical-align: -0.15em;
      }
    }
  }

  .el-drawer__body {
    margin: 0 20px;
    overflow: auto;

    .el-upload {
      margin-top: 20px;
      width: 100%;
    }

    .el-upload-dragger {
      width: 100%;
    }

    .el-row + .el-row {
      margin-top: 20px;
    }

    .el-switch + .el-button {
      margin-left: 30px;
    }
  }
}
</style>
