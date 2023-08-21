<template>
  <div class="share-container">
    <el-form inline @submit.native.prevent>
      <el-form-item label="图片UUID">
        <el-input placeholder="请输入图片UUID" v-model="queryInfo.uuid" type="text" :clearable="true"
                  @keyup.native.enter="search" @clear="search" size="small" style="min-width: 320px">
        </el-input>
      </el-form-item>
      <el-form-item label="用户ID">
        <el-input placeholder="请输入用户ID" v-model="queryInfo.userId" type="number" :clearable="true"
                  @keyup.native.enter="search" @clear="search" size="small" style="width: 150px">
        </el-input>
      </el-form-item>
      <el-form-item label="模型ID">
        <el-input placeholder="请输入模型ID" v-model="queryInfo.modelId" type="number" :clearable="true"
                  @keyup.native.enter="search" @clear="search" size="small" style="width: 150px">
        </el-input>
      </el-form-item>
      <el-form-item label="审核状态">
        <el-select placeholder="请选择任务状态" v-model="queryInfo.status" :clearable="true"
                   @change="search" size="small" style="width: 150px">
          <el-option :label="item.desc" :value="item.key" v-for="(item,index) in picShareStatusEnumList" :key="index"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="投稿时间">
        <DateTimeRangePicker :date="queryInfoDate" :setDate="setDate"/>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" size="small" icon="el-icon-search" @click="search">搜索</el-button>
      </el-form-item>
    </el-form>

    <el-table :data="picShareList">
      <el-table-column type="expand">
        <template v-slot="props">
          <el-form label-position="left" class="table-expand">
            <el-form-item label="正向描述词">
              <span>{{ props.row.pic.prompt }}</span>
            </el-form-item>
            <el-form-item label="反向描述词">
              <span>{{ props.row.pic.negativePrompt }}</span>
            </el-form-item>
            <el-form-item label="正向描述词英文翻译">
              <span>{{ props.row.pic.translatedPrompt }}</span>
            </el-form-item>
            <el-form-item label="反向描述词英文翻译">
              <span>{{ props.row.pic.translatedNegativePrompt }}</span>
            </el-form-item>
            <el-form-item label="宽">
              <span>{{ props.row.pic.width }}</span>
            </el-form-item>
            <el-form-item label="高">
              <span>{{ props.row.pic.height }}</span>
            </el-form-item>
          </el-form>
        </template>
      </el-table-column>
      <el-table-column label="图片" width="150">
        <template v-slot="scope">
          <el-image :src="scope.row.pic.path" fit="contain"></el-image>
        </template>
      </el-table-column>
      <el-table-column label="图片UUID">
        <template v-slot="scope">
          <el-link type="primary" href="" :underline="false" @click.prevent="toPic(scope.row.picShare.picId)">{{ scope.row.picShare.uuid }}</el-link>
        </template>
      </el-table-column>
      <el-table-column label="用户头像" width="80">
        <template v-slot="scope">
          <el-avatar shape="square" :size="50" fit="contain" :src="scope.row.user.avatar"></el-avatar>
        </template>
      </el-table-column>
      <el-table-column label="用户昵称" width="80">
        <template v-slot="scope">
          <el-link type="primary" href="" :underline="false" @click.prevent="queryUserId(scope.row.picShare.userId)">{{ scope.row.user.nickname }}</el-link>
        </template>
      </el-table-column>
      <el-table-column label="标题" prop="picShare.title"></el-table-column>
      <el-table-column label="模型名称" width="80">
        <template v-slot="scope">
          <el-link type="primary" href="" :underline="false" @click.prevent="queryModelId(scope.row.model.id)">{{ scope.row.model.name }}</el-link>
        </template>
      </el-table-column>
      <el-table-column label="任务类型" width="120">
        <template v-slot="scope">{{ getTaskTypeDesc(scope.row.pic.type) }}</template>
      </el-table-column>
      <el-table-column label="质量" width="100">
        <template v-slot="scope">{{ getImageQualityDesc(scope.row.pic.quality) }}</template>
      </el-table-column>
      <el-table-column label="比例" prop="pic.ratio" width="60"></el-table-column>
      <el-table-column label="用户删除" width="80">
        <template v-slot="scope">
          <el-tag size="medium" effect="dark" :type="scope.row.pic.isUserDelete ? 'danger' : ''">{{ scope.row.pic.isUserDelete ? '已删除' : '正常' }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="点击量" prop="picShare.hits" width="80"></el-table-column>
      <el-table-column label="点赞量" prop="picShare.likeCount" width="80"></el-table-column>
      <el-table-column label="画同款" prop="picShare.drawCount" width="80"></el-table-column>
      <el-table-column label="审核状态" width="120">
        <template v-slot="scope">
          <el-tag size="medium" effect="dark" :type="getPicShareStatusColor(scope.row.picShare.status)">{{ getPicShareStatusDesc(scope.row.picShare.status) }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="图片创建" width="160">
        <template v-slot="scope">{{ scope.row.pic.createTime | dateFormat }}</template>
      </el-table-column>
      <el-table-column label="图片更新" width="160">
        <template v-slot="scope">{{ scope.row.pic.updateTime | dateFormat }}</template>
      </el-table-column>
      <el-table-column label="投稿时间" width="160">
        <template v-slot="scope">{{ scope.row.picShare.createTime | dateFormat }}</template>
      </el-table-column>
      <el-table-column label="审核时间" width="160">
        <template v-slot="scope">{{ scope.row.picShare.auditTime | dateFormat }}</template>
      </el-table-column>
      <el-table-column label="操作" width="200">
        <template v-slot="scope">
          <div v-if="scope.row.picShare.status === 'AUDITING'">
            <el-button type="primary" icon="el-icon-check" size="mini" @click="audit(scope.row.picShare.picId, 'PUBLIC')">通过</el-button>
            <el-button type="danger" icon="el-icon-close" size="mini" @click="audit(scope.row.picShare.picId, 'REJECT')">拒绝</el-button>
          </div>
          <div v-if="['PUBLIC', 'REJECT'].includes(scope.row.picShare.status)">
            <el-button type="warning" icon="el-icon-refresh-left" size="mini" @click="reAudit(scope.row.picShare.picId)">重新审核</el-button>
          </div>
        </template>
      </el-table-column>
    </el-table>

    <!--分页-->
    <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="pageNum"
                   :page-sizes="[10, 50, 100, 200]" :page-size="pageSize" :total="total"
                   layout="total, sizes, prev, pager, next, jumper" background>
    </el-pagination>
  </div>
</template>

<script>
import DateTimeRangePicker from "@/components/DateTimeRangePicker";
import {getTaskTypeEnum, getPicShareStatusEnum, getImageQualityEnum} from "@/api/enum";
import {getPicShareListByQuery, audit, reAudit} from "@/api/share";

export default {
  name: "Pic",
  components: {DateTimeRangePicker},
  data() {
    return {
      queryInfo: {
        uuid: null,
        userId: null,
        modelId: null,
        status: 'AUDITING',
        createTimeStart: null,
        createTimeEnd: null,
      },
      queryInfoDate: [],
      pageNum: 1,
      pageSize: 10,
      total: 0,
      picShareList: [],
      taskTypeEnumList: [],
      picShareStatusEnumList: [],
      imageQualityEnumList: [],
    }
  },
  created() {
    this.$route.query.userId && (this.queryInfo.userId = this.$route.query.userId)
    this.getData()
    this.getEnum()
  },
  computed: {
    getTaskTypeDesc() {
      return (type) => {
        return this.taskTypeEnumList.find(item => item.key === type).desc
      }
    },
    getPicShareStatusDesc() {
      return (status) => {
        return this.picShareStatusEnumList.find(item => item.key === status).desc
      }
    },
    getImageQualityDesc() {
      return (quality) => {
        return this.imageQualityEnumList.find(item => item.key === quality).desc
      }
    },
    getPicShareStatusColor() {
      return (status) => {
        switch (status) {
          case 'AUDITING':
            return 'warning'
          case 'PUBLIC':
            return ''
          case 'REJECT':
            return 'danger'
          default:
            return 'info'
        }
      }
    },
  },
  methods: {
    getData() {
      getPicShareListByQuery(this.queryInfo, this.pageNum, this.pageSize).then(res => {
        this.picShareList = res.data.records
        this.total = res.data.total
      })
    },
    getEnum() {
      getTaskTypeEnum().then(res => {
        this.taskTypeEnumList = res.data
      })
      getPicShareStatusEnum().then(res => {
        this.picShareStatusEnumList = res.data
      })
      getImageQualityEnum().then(res => {
        this.imageQualityEnumList = res.data
      })
    },
    search() {
      this.pageNum = 1
      this.getData()
    },
    //监听 pageSize 改变事件
    handleSizeChange(newSize) {
      this.pageSize = newSize
      this.getData()
    },
    //监听页码改变的事件
    handleCurrentChange(newPage) {
      this.pageNum = newPage
      this.getData()
    },
    setDate(value) {
      this.queryInfoDate = value
      if (this.queryInfoDate) {
        this.queryInfo.createTimeStart = this.queryInfoDate[0]
        this.queryInfo.createTimeEnd = this.queryInfoDate[1]
      } else {
        this.queryInfo.createTimeStart = null
        this.queryInfo.createTimeEnd = null
      }
    },
    toPic(picId) {
      this.$router.push({
        path: '/app/pic',
        query: {
          picId
        }
      })
    },
    queryUserId(userId) {
      this.queryInfo.userId = userId
      this.search()
    },
    queryModelId(modelId) {
      this.queryInfo.modelId = modelId
      this.search()
    },
    audit(picId, status) {
      audit([picId], status).then(res => {
        this.msgSuccess('审核成功')
        this.getData()
      })
    },
    reAudit(picId) {
      reAudit([picId]).then(res => {
        this.msgSuccess('重新审核成功')
        this.getData()
      })
    },
  }
}
</script>

<style lang="scss">
.share-container {
  .el-button + span {
    margin-left: 10px;
  }

  .el-form--inline .el-form-item {
    margin-bottom: 0;
  }

  .el-table .table-expand .el-form-item:last-of-type {
    label {
      line-height: 1.5;
    }

    .el-form-item__content {
      line-height: 1.5;
    }

    span {
      white-space: pre-wrap;
    }
  }

  .el-table__expanded-cell[class*=cell] {
    padding: 20px 50px;
  }
}
</style>
