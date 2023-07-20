<template>
  <div class="task-container">
    <el-form inline @submit.native.prevent>
      <el-form-item label="用户ID">
        <el-input placeholder="请输入用户ID" v-model="queryInfo.userId" type="number" :clearable="true"
                  @keyup.native.enter="search" @clear="search" size="small" style="min-width: 150px">
        </el-input>
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
      <el-table-column label="任务类型" prop="type"></el-table-column>
      <el-table-column label="任务状态" prop="status"></el-table-column>
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
import {getTaskListByQuery} from "@/api/task";

export default {
  name: "Task",
  data() {
    return {
      queryInfo: {
        userId: null,
      },
      pageNum: 1,
      pageSize: 10,
      total: 0,
      taskList: [],
    }
  },
  created() {
    this.$route.query.userId && (this.queryInfo.userId = this.$route.query.userId)
    this.getData()
  },
  methods: {
    getData() {
      getTaskListByQuery(this.queryInfo, this.pageNum, this.pageSize).then(res => {
        this.taskList = res.data.records
        this.total = res.data.total
      })
    },
    search() {
      this.pageNum = 1
      this.pageSize = 10
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
