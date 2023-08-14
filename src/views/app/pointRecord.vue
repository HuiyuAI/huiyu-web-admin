<template>
  <div>
    <el-form inline @submit.native.prevent>
      <el-form-item label="流水ID">
        <el-input placeholder="请输入流水ID" v-model="queryInfo.id" type="number" :clearable="true"
                  @keyup.native.enter="search" @clear="search" size="small" style="min-width: 220px">
        </el-input>
      </el-form-item>
      <el-form-item label="请求UUID">
        <el-input placeholder="请输入请求UUID" v-model="queryInfo.requestUuid" type="text" :clearable="true"
                  @keyup.native.enter="search" @clear="search" size="small" style="width: 320px">
        </el-input>
      </el-form-item>
      <el-form-item label="用户ID">
        <el-input placeholder="请输入用户ID" v-model="queryInfo.userId" type="number" :clearable="true"
                  @keyup.native.enter="search" @clear="search" size="small" style="width: 150px">
        </el-input>
      </el-form-item>

      <el-form-item label="积分类型">
        <el-select placeholder="请选择积分类型" v-model="queryInfo.pointType" :clearable="true"
                   @change="search" size="small" style="width: 150px">
          <el-option :label="item.desc" :value="item.key" v-for="(item,index) in pointTypeEnumList" :key="index"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="类型">
        <el-select placeholder="请选择类型" v-model="queryInfo.operationType" :clearable="true"
                   @change="search" size="small" style="width: 150px">
          <el-option :label="item.desc" :value="item.key" v-for="(item,index) in pointOperationTypeEnumList" :key="index"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="来源">
        <el-select placeholder="请选择来源" v-model="queryInfo.operationSource" :clearable="true"
                   @change="search" size="small" style="width: 150px">
          <el-option :label="item.desc" :value="item.key" v-for="(item,index) in pointOperationSourceEnumList" :key="index"></el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="请求时间">
        <DateTimeRangePicker :date="queryInfoDate" :setDate="setDate"/>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" size="small" icon="el-icon-search" @click="search">搜索</el-button>
      </el-form-item>
    </el-form>

    <el-table :data="recordList">
      <el-table-column label="流水ID" prop="id" width="180"></el-table-column>
      <el-table-column label="请求UUID">
        <template v-slot="scope">
          <el-link type="primary" href="" :underline="false" @click.prevent="queryRequestUuid(scope.row.requestUuid)">{{ scope.row.requestUuid }}</el-link>
        </template>
      </el-table-column>
      <el-table-column label="用户ID">
        <template v-slot="scope">
          <el-link type="primary" href="" :underline="false" @click.prevent="toUser(scope.row.userId)">{{ scope.row.userId }}</el-link>
        </template>
      </el-table-column>
      <el-table-column label="积分">
        <template v-slot="scope">
          <el-tag v-if="scope.row.operationType === 'REDUCE'" size="medium" type="success">{{ '-' + scope.row.num }}</el-tag>
          <el-tag v-else size="medium" type="danger">{{ '+' + scope.row.num }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="积分类型">
        <template v-slot="scope">{{ getPointTypeDesc(scope.row.pointType) }}</template>
      </el-table-column>
      <el-table-column label="来源">
        <template v-slot="scope">{{ getOperationSourceDesc(scope.row.operationSource) }}</template>
      </el-table-column>
      <el-table-column label="创建时间" width="160">
        <template v-slot="scope">{{ scope.row.createTime | dateFormat }}</template>
      </el-table-column>
      <el-table-column label="操作" width="120">
        <template v-slot="scope">
          <el-button type="warning" icon="el-icon-view" size="mini" @click="toTaskByRequestUuid(scope.row.requestUuid)">查看任务</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!--分页-->
    <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="queryInfo.pageNum"
                   :page-sizes="[10, 50, 100, 200]" :page-size="queryInfo.pageSize" :total="total"
                   layout="total, sizes, prev, pager, next, jumper" background>
    </el-pagination>
  </div>
</template>

<script>
import DateTimeRangePicker from "@/components/DateTimeRangePicker";
import {getPointRecordListByQuery} from "@/api/pointRecord";
import {getPointOperationTypeEnum, getPointOperationSourceEnum, getPointTypeEnum} from "@/api/enum";

export default {
  name: "PointRecord",
  components: {DateTimeRangePicker},
  data() {
    return {
      queryInfo: {
        id: null,
        requestUuid: null,
        userId: null,
        taskId: null,
        operationType: null,
        operationSource: null,
        pointType: null,
        createTimeStart: null,
        createTimeEnd: null,
      },
      queryInfoDate: [],
      pageNum: 1,
      pageSize: 10,
      total: 0,
      recordList: [],
      pointOperationTypeEnumList: [],
      pointOperationSourceEnumList: [],
      pointTypeEnumList: [],
    }
  },
  created() {
    this.$route.query.requestUuid && (this.queryInfo.requestUuid = this.$route.query.requestUuid)
    this.getData()
    this.getEnum()
  },
  computed: {
    getOperationSourceDesc() {
      return (operationSource) => {
        return this.pointOperationSourceEnumList.find(item => item.key === operationSource).desc
      }
    },
    getPointTypeDesc() {
      return (pointType) => {
        return this.pointTypeEnumList.find(item => item.key === pointType).desc
      }
    },
  },
  methods: {
    getData() {
      getPointRecordListByQuery(this.queryInfo, this.pageNum, this.pageSize).then(res => {
        this.recordList = res.data.records
        this.total = res.data.total
      })
    },
    getEnum() {
      getPointOperationTypeEnum().then(res => {
        this.pointOperationTypeEnumList = res.data
      })
      getPointOperationSourceEnum().then(res => {
        this.pointOperationSourceEnumList = res.data
      })
      getPointTypeEnum().then(res => {
        this.pointTypeEnumList = res.data
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
    toUser(userId) {
      this.$router.push({
        path: '/app/user',
        query: {
          userId
        }
      })
    },
    toTaskByRequestUuid(requestUuid) {
      this.$router.push({
        path: '/app/task',
        query: {
          requestUuid
        }
      })
    },
  }
}
</script>

<style scoped>
.el-button + span {
  margin-left: 10px;
}

.el-form--inline .el-form-item {
  margin-bottom: 0;
}
</style>
