<template>
  <div class="pic-container">
    <el-form inline @submit.native.prevent>
      <el-form-item label="图片ID">
        <el-input placeholder="请输入图片ID" v-model="queryInfo.id" type="number" :clearable="true"
                  @keyup.native.enter="search" @clear="search" size="small" style="min-width: 220px">
        </el-input>
      </el-form-item>
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
      <el-form-item label="任务类型">
        <el-select placeholder="请选择任务类型" v-model="queryInfo.type" :clearable="true"
                   @change="search" size="small" style="width: 150px">
          <el-option :label="item.desc" :value="item.key" v-for="(item,index) in taskTypeEnumList" :key="index"></el-option>
        </el-select>
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
          </el-form>
        </template>
      </el-table-column>
      <el-table-column label="图片" width="150">
        <template v-slot="scope">
          <el-image :src="scope.row.pic.path" fit="contain"></el-image>
        </template>
      </el-table-column>
      <el-table-column label="图片UUID" prop="picShare.uuid"></el-table-column>
      <el-table-column label="用户ID" width="80">
        <template v-slot="scope">
          <el-link type="primary" href="" :underline="false" @click.prevent="toUser(scope.row.picShare.userId)">{{ scope.row.picShare.userId }}</el-link>
        </template>
      </el-table-column>
      <el-table-column label="模型ID" width="80">
        <template v-slot="scope">
          <el-link type="primary" href="" :underline="false" @click.prevent="toModel(scope.row.modelId)">{{ scope.row.modelId }}</el-link>
        </template>
      </el-table-column>
      <el-table-column label="任务类型" width="120">
        <template v-slot="scope">{{ getTaskTypeDesc(scope.row.pic.type) }}</template>
      </el-table-column>
      <el-table-column label="任务状态" width="120">
        <template v-slot="scope">
          <el-tag size="medium" effect="dark" :type="getPicShareStatusColor(scope.row.picShare.status)">{{ getPicShareStatusDesc(scope.row.picShare.status) }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="质量" width="100">
        <template v-slot="scope">{{ getImageQualityDesc(scope.row.pic.quality) }}</template>
      </el-table-column>
      <el-table-column label="比例" prop="pic.ratio" width="60"></el-table-column>
      <el-table-column label="宽" prop="pic.width" width="60"></el-table-column>
      <el-table-column label="高" prop="pic.height" width="60"></el-table-column>
      <el-table-column label="标题" prop="picShare.title"></el-table-column>
      <el-table-column label="点击量" prop="picShare.hits"></el-table-column>
      <el-table-column label="点赞量" prop="picShare.like_count"></el-table-column>
      <el-table-column label="画同款次数" prop="picShare.draw_count"></el-table-column>

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
      <el-table-column label="操作" width="120">
        <template v-slot="scope">
          <el-button type="warning" icon="el-icon-view" size="mini" @click="toPointRecordByRequestUuid(scope.row.requestUuid)">积分流水</el-button>
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
import {getPicShareListByQuery} from "@/api/share";

export default {
  name: "Pic",
  components: {DateTimeRangePicker},
  data() {
    return {
      queryInfo: {
        id: null,
        uuid: null,
        requestUuid: null,
        userId: null,
        taskId: null,
        modelId: null,
        type: null,
        status: null,
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
    queryRequestUuid(requestUuid) {
      this.queryInfo.requestUuid = requestUuid
      this.search()
    },
    queryId(id) {
      this.queryInfo.id = id
      this.search()
    },
    toUser(userId) {
      this.$router.push({
        path: '/app/user',
        query: {
          userId
        }
      })
    },
    toTask(taskId) {
      this.$router.push({
        path: '/app/task',
        query: {
          taskId
        }
      })
    },
    toModel(modelId) {
      this.$router.push({
        path: '/app/model',
        query: {
          modelId
        }
      })
    },
    toPointRecordByRequestUuid(requestUuid) {
      this.$router.push({
        path: '/app/pointRecord',
        query: {
          requestUuid
        }
      })
    },
  }
}
</script>

<style lang="scss">
.pic-container {
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
