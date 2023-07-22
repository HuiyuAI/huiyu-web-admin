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
      <el-form-item label="请求UUID">
        <el-input placeholder="请输入请求UUID" v-model="queryInfo.requestUuid" type="text" :clearable="true"
                  @keyup.native.enter="search" @clear="search" size="small" style="min-width: 320px">
        </el-input>
      </el-form-item>
      <el-form-item label="用户ID">
        <el-input placeholder="请输入用户ID" v-model="queryInfo.userId" type="number" :clearable="true"
                  @keyup.native.enter="search" @clear="search" size="small" style="width: 150px">
        </el-input>
      </el-form-item>
      <el-form-item label="任务ID">
        <el-input placeholder="请输入任务ID" v-model="queryInfo.taskId" type="number" :clearable="true"
                  @keyup.native.enter="search" @clear="search" size="small" style="min-width: 220px">
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
      <el-form-item label="任务状态">
        <el-select placeholder="请选择任务状态" v-model="queryInfo.status" :clearable="true"
                   @change="search" size="small" style="width: 150px">
          <el-option :label="item.desc" :value="item.key" v-for="(item,index) in picStatusEnumList" :key="index"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="创建时间">
        <DateTimeRangePicker :date="queryInfoDate" :setDate="setDate"/>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" size="small" icon="el-icon-search" @click="search">搜索</el-button>
      </el-form-item>
    </el-form>

    <el-table :data="picList">
      <el-table-column type="expand">
        <template v-slot="props">
          <el-form label-position="left" class="table-expand">
            <el-form-item label="源图ID">
              <el-link type="primary" href="" :underline="false" @click.prevent="queryId(props.row.parentPicId)">{{ props.row.parentPicId }}</el-link>
            </el-form-item>
            <el-form-item label="参考图ID">
              <span>{{ props.row.referencePicId }}</span>
            </el-form-item>
            <el-form-item label="正向描述词">
              <span>{{ props.row.prompt }}</span>
            </el-form-item>
            <el-form-item label="反向描述词">
              <span>{{ props.row.negativePrompt }}</span>
            </el-form-item>
            <el-form-item label="种子">
              <span>{{ props.row.seed }}</span>
            </el-form-item>
            <el-form-item label="子种子">
              <span>{{ props.row.subseed }}</span>
            </el-form-item>
            <el-form-item label="模型编码">
              <span>{{ props.row.modelCode }}</span>
            </el-form-item>
            <el-form-item label="VAE">
              <span>{{ props.row.vae }}</span>
            </el-form-item>
            <el-form-item label="采样器">
              <span>{{ props.row.samplerName }}</span>
            </el-form-item>
            <el-form-item label="采样步数">
              <span>{{ props.row.steps }}</span>
            </el-form-item>
            <el-form-item label="提示词引导系数">
              <span>{{ props.row.cfg }}</span>
            </el-form-item>
            <el-form-item label="启用高分辨率修复">
              <span>{{ props.row.enableHr }}</span>
            </el-form-item>
            <el-form-item label="高清化算法">
              <span>{{ props.row.hrUpscaler }}</span>
            </el-form-item>
            <el-form-item label="重绘强度">
              <span>{{ props.row.denoisingStrength }}</span>
            </el-form-item>
            <el-form-item label="放大倍数">
              <span>{{ props.row.hrScale }}</span>
            </el-form-item>
            <el-form-item label="是否启用工序三高清化extra">
              <span>{{ props.row.enableExtra }}</span>
            </el-form-item>
            <el-form-item label="高清化extra放大倍数">
              <span>{{ props.row.upscalingResize }}</span>
            </el-form-item>
            <el-form-item label="通用图片描述文本">
              <span>{{ props.row.infotexts }}</span>
            </el-form-item>
            <el-form-item label="扩展脚本参数">
              <span>{{ '\n' + JSON.stringify(JSON.parse(props.row.alwaysonScripts), null, '\t') }}</span>
            </el-form-item>
          </el-form>
        </template>
      </el-table-column>
      <el-table-column label="图片" width="150">
        <template v-slot="scope">
          <el-image :src="scope.row.status === 'GENERATED' ? scope.row.path : ''" fit="contain"></el-image>
        </template>
      </el-table-column>
      <el-table-column label="图片UUID" prop="uuid"></el-table-column>
      <el-table-column label="请求UUID">
        <template v-slot="scope">
          <el-link type="primary" href="" :underline="false" @click.prevent="queryRequestUuid(scope.row.requestUuid)">{{ scope.row.requestUuid }}</el-link>
        </template>
      </el-table-column>
      <el-table-column label="用户ID" width="80">
        <template v-slot="scope">
          <el-link type="primary" href="" :underline="false" @click.prevent="toUser(scope.row.userId)">{{ scope.row.userId }}</el-link>
        </template>
      </el-table-column>
      <el-table-column label="任务ID" width="180">
        <template v-slot="scope">
          <el-link type="primary" href="" :underline="false" @click.prevent="toTask(scope.row.taskId)">{{ scope.row.taskId }}</el-link>
        </template>
      </el-table-column>
      <el-table-column label="模型ID" width="80">
        <template v-slot="scope">
          <el-link type="primary" href="" :underline="false" @click.prevent="toModel(scope.row.modelId)">{{ scope.row.modelId }}</el-link>
        </template>
      </el-table-column>
      <el-table-column label="任务类型" width="120">
        <template v-slot="scope">{{ getTaskTypeDesc(scope.row.type) }}</template>
      </el-table-column>
      <el-table-column label="任务状态" width="80">
        <template v-slot="scope">{{ getPicStatusDesc(scope.row.status) }}</template>
      </el-table-column>
      <el-table-column label="质量" width="100">
        <template v-slot="scope">{{ getImageQualityDesc(scope.row.quality) }}</template>
      </el-table-column>
      <el-table-column label="比例" prop="ratio" width="60"></el-table-column>
      <el-table-column label="宽" prop="width" width="60"></el-table-column>
      <el-table-column label="高" prop="height" width="60"></el-table-column>
      <el-table-column label="创建时间" width="160">
        <template v-slot="scope">{{ scope.row.createTime | dateFormat }}</template>
      </el-table-column>
      <el-table-column label="更新时间" width="160">
        <template v-slot="scope">{{ scope.row.updateTime | dateFormat }}</template>
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
import {getTaskTypeEnum, getPicStatusEnum, getImageQualityEnum} from "@/api/enum";
import {getPicListByQuery} from "@/api/pic";

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
      picList: [],
      taskTypeEnumList: [],
      picStatusEnumList: [],
      imageQualityEnumList: [],
    }
  },
  created() {
    this.$route.query.taskId && (this.queryInfo.id = this.$route.query.taskId)
    this.$route.query.requestUuid && (this.queryInfo.requestUuid = this.$route.query.requestUuid)
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
    getPicStatusDesc() {
      return (status) => {
        return this.picStatusEnumList.find(item => item.key === status).desc
      }
    },
    getImageQualityDesc() {
      return (quality) => {
        return this.imageQualityEnumList.find(item => item.key === quality).desc
      }
    },
  },
  methods: {
    getData() {
      getPicListByQuery(this.queryInfo, this.pageNum, this.pageSize).then(res => {
        this.picList = res.data.records
        this.total = res.data.total
      })
    },
    getEnum() {
      getTaskTypeEnum().then(res => {
        this.taskTypeEnumList = res.data
      })
      getPicStatusEnum().then(res => {
        this.picStatusEnumList = res.data
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
