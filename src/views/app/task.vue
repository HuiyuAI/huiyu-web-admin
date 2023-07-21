<template>
  <div class="task-container">
    <el-form inline @submit.native.prevent>
      <el-form-item label="任务ID">
        <el-input placeholder="请输入任务ID" v-model="queryInfo.id" type="number" :clearable="true"
                  @keyup.native.enter="search" @clear="search" size="small" style="min-width: 220px">
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
      <el-form-item label="任务类型">
        <el-select placeholder="请选择任务类型" v-model="queryInfo.type" :clearable="true"
                   @change="search" size="small" style="width: 150px">
          <el-option :label="item.desc" :value="item.key" v-for="(item,index) in taskTypeEnumList" :key="index"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="任务状态">
        <el-select placeholder="请选择任务状态" v-model="queryInfo.status" :clearable="true"
                   @change="search" size="small" style="width: 150px">
          <el-option :label="item.desc" :value="item.key" v-for="(item,index) in taskStatusEnumList" :key="index"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="创建时间">
        <DateTimeRangePicker :date="queryInfoDate" :setDate="setDate"/>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" size="small" icon="el-icon-search" @click="search">搜索</el-button>
      </el-form-item>
    </el-form>

    <el-table :data="taskList">
      <el-table-column type="expand">
        <template v-slot="props">
          <el-form label-position="left" class="table-expand">
            <el-form-item label="SD请求体">
              <span>{{ '\n' + JSON.stringify(JSON.parse(props.row.body), null, '\t') }}</span>
            </el-form-item>
          </el-form>
        </template>
      </el-table-column>
      <el-table-column label="任务ID" prop="id"></el-table-column>
      <el-table-column label="请求UUID" prop="requestUuid"></el-table-column>
      <el-table-column label="用户ID" prop="userId" width="80"></el-table-column>
      <el-table-column label="任务类型">
        <template v-slot="scope">{{ getTaskTypeDesc(scope.row.type) }}</template>
      </el-table-column>
      <el-table-column label="任务状态">
        <template v-slot="scope">{{ getTaskStatusDesc(scope.row.status) }}</template>
      </el-table-column>
      <el-table-column label="消耗积分" prop="point" width="80"></el-table-column>
      <el-table-column label="执行源" prop="execSource" width="100"></el-table-column>
      <el-table-column label="创建时间" width="160">
        <template v-slot="scope">{{ scope.row.createTime | dateFormat }}</template>
      </el-table-column>
      <el-table-column label="更新时间" width="160">
        <template v-slot="scope">{{ scope.row.updateTime | dateFormat }}</template>
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
import {getTaskListByQuery} from "@/api/task";
import {getTaskStatusEnum, getTaskTypeEnum} from "@/api/enum";

export default {
  name: "Task",
  components: {DateTimeRangePicker},
  data() {
    return {
      queryInfo: {
        id: null,
        requestUuid: null,
        userId: null,
        type: null,
        status: null,
        createTimeStart: null,
        createTimeEnd: null,
      },
      queryInfoDate: [],
      pageNum: 1,
      pageSize: 10,
      total: 0,
      taskList: [],
      taskTypeEnumList: [],
      taskStatusEnumList: [],
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
    getTaskStatusDesc() {
      return (status) => {
        return this.taskStatusEnumList.find(item => item.key === status).desc
      }
    },
  },
  methods: {
    getData() {
      if (this.queryInfoDate && this.queryInfoDate.length === 2) {
        this.queryInfo.createTimeStart = this.queryInfoDate[0]
        this.queryInfo.createTimeEnd = this.queryInfoDate[1]
      }
      getTaskListByQuery(this.queryInfo, this.pageNum, this.pageSize).then(res => {
        this.taskList = res.data.records
        this.total = res.data.total
      })
    },
    getEnum() {
      getTaskTypeEnum().then(res => {
        this.taskTypeEnumList = res.data
      })
      getTaskStatusEnum().then(res => {
        this.taskStatusEnumList = res.data
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
    },
  }
}
</script>

<style lang="scss">
.task-container {
  .el-button + span {
    margin-left: 10px;
  }

  .el-form--inline .el-form-item {
    margin-bottom: 0;
  }

  .el-table .table-expand .el-form-item {
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
}
</style>
