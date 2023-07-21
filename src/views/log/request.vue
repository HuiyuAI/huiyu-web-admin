<template>
  <div>
    <el-form inline @submit.native.prevent>
      <el-form-item label="请求ID">
        <el-input placeholder="请输入请求ID" v-model="queryInfo.id" type="number" :clearable="true"
                  @keyup.native.enter="search" @clear="search" size="small" style="min-width: 220px">
        </el-input>
      </el-form-item>
      <el-form-item label="用户ID">
        <el-input placeholder="请输入用户ID" v-model="queryInfo.userId" type="number" :clearable="true"
                  @keyup.native.enter="search" @clear="search" size="small" style="width: 150px">
        </el-input>
      </el-form-item>
      <el-form-item label="IP">
        <el-input placeholder="请输入IP" v-model="queryInfo.ip" type="text" :clearable="true"
                  @keyup.native.enter="search" @clear="search" size="small" style="width: 150px">
        </el-input>
      </el-form-item>
      <el-form-item label="请求方式">
        <el-select placeholder="请选择请求方式" v-model="queryInfo.method" :clearable="true"
                   @change="search" size="small" style="width: 150px">
          <el-option label="GET" value="GET"></el-option>
          <el-option label="POST" value="POST"></el-option>
          <el-option label="PUT" value="PUT"></el-option>
          <el-option label="DELETE" value="DELETE"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="请求URI">
        <el-input placeholder="请输入URI" v-model="queryInfo.uri" type="text" :clearable="true"
                  @keyup.native.enter="search" @clear="search" size="small" style="width: 150px">
        </el-input>
      </el-form-item>
      <el-form-item label="请求耗时大于">
        <el-input placeholder="请输入请求耗时" v-model="queryInfo.elapsedTimeGE" type="number" :clearable="true"
                  @keyup.native.enter="search" @clear="search" size="small" style="width: 150px">
        </el-input>
      </el-form-item>

      <el-form-item label="请求时间">
        <DateTimeRangePicker :date="queryInfoDate" :setDate="setDate"/>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" size="small" icon="el-icon-search" @click="search">搜索</el-button>
      </el-form-item>
    </el-form>

    <el-table :data="logList">
      <el-table-column type="expand">
        <template v-slot="props">
          <el-form label-position="left" class="table-expand">
            <el-form-item label="请求参数">
              <span>{{ props.row.param }}</span>
            </el-form-item>
          </el-form>
        </template>
      </el-table-column>
      <el-table-column label="请求ID" prop="id"></el-table-column>
      <el-table-column label="用户ID" width="80">
        <template v-slot="scope">
          <el-link type="primary" href="" :underline="false" @click.prevent="toUser(scope.row.userId)">{{ scope.row.userId }}</el-link>
        </template>
      </el-table-column>
      <el-table-column label="IP" prop="ip"></el-table-column>
      <el-table-column label="请求方式" prop="method"></el-table-column>
      <el-table-column label="请求接口" prop="uri"></el-table-column>
      <el-table-column label="请求耗时" prop="elapsedTime"></el-table-column>
      <el-table-column label="请求时间" width="160">
        <template v-slot="scope">{{ scope.row.createTime | dateFormat }}</template>
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
import {getRequestLogListByQuery} from "@/api/requestLog";

export default {
  name: "Request",
  components: {DateTimeRangePicker},
  data() {
    return {
      queryInfo: {
        id: null,
        userId: null,
        ip: null,
        method: null,
        uri: null,
        elapsedTimeGE: null,
        createTimeStart: null,
        createTimeEnd: null,
      },
      queryInfoDate: [],
      pageNum: 1,
      pageSize: 10,
      total: 0,
      logList: [],
    }
  },
  created() {
    this.getData()
  },
  methods: {
    getData() {
      if (this.queryInfoDate && this.queryInfoDate.length === 2) {
        this.queryInfo.createTimeStart = this.queryInfoDate[0]
        this.queryInfo.createTimeEnd = this.queryInfoDate[1]
      }
      getRequestLogListByQuery(this.queryInfo, this.pageNum, this.pageSize).then(res => {
        this.logList = res.data.records
        this.total = res.data.total
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
    toUser(userId) {
      this.$router.push({
        path: '/app/user',
        query: {
          userId
        }
      })
    },
  }
}
</script>

<style scoped lang="scss">
.el-button + span {
  margin-left: 10px;
}

.el-form--inline .el-form-item {
  margin-bottom: 0;
}
</style>
