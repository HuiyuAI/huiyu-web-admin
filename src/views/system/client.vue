<template>
  <div>
    <el-form inline>
      <el-form-item label="客户端ID">
        <el-input placeholder="请输入客户端ID" v-model="queryInfo.clientId" :clearable="true"
                  @keyup.native.enter="search" @clear="search" size="small" style="min-width: 200px">
        </el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" size="small" icon="el-icon-search" @click="search">搜索</el-button>
      </el-form-item>
      <el-form-item>
        <el-button type="success" size="small" icon="el-icon-plus" @click="addDialogVisible = true">添加</el-button>
      </el-form-item>
    </el-form>

    <el-table :data="clientList">
      <el-table-column label="客户端ID" prop="clientId"></el-table-column>
      <el-table-column label="客户端密钥" prop="clientSecret"></el-table-column>
      <el-table-column label="域" prop="scope"></el-table-column>
      <el-table-column label="授权方式" prop="authorizedGrantTypes"></el-table-column>
      <el-table-column label="认证令牌时效(秒)" prop="accessTokenValidity" width="150"></el-table-column>
      <el-table-column label="刷新令牌时效(秒)" prop="refreshTokenValidity" width="150"></el-table-column>
      <el-table-column label="自动放行" width="80">
        <template v-slot="scope">
          <el-switch v-model="scope.row.autoapprove" active-value="true" inactive-value="false"
                     @change="clientChanged(scope.row,'autoapprove')"></el-switch>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="200">
        <template v-slot="scope">
          <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditDialog(scope.row)">编辑</el-button>
          <el-button type="danger" icon="el-icon-delete" size="mini" @click="deleteClientById(scope.row.clientId)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!--分页-->
    <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="pageNum"
                   :page-sizes="[10, 20, 30, 50]" :page-size="pageSize" :total="total"
                   layout="total, sizes, prev, pager, next, jumper" background>
    </el-pagination>

    <el-dialog title="新增客户端" width="50%" :visible.sync="addDialogVisible" @close="resetAddForm">
      <!--内容主体-->
      <el-form label-width="150px" @submit.native.prevent :model="addForm" :rules="formRules" ref="addFormRef">
        <el-form-item label="客户端ID" prop="clientId">
          <el-input v-model="addForm.clientId"></el-input>
        </el-form-item>
        <el-form-item label="客户端密钥" prop="clientSecret">
          <el-input v-model="addForm.clientSecret"></el-input>
        </el-form-item>
        <el-form-item label="域" prop="scope">
          <el-input v-model="addForm.scope"></el-input>
        </el-form-item>
        <el-form-item label="授权方式" prop="authorizedGrantTypes">
          <el-input v-model="addForm.authorizedGrantTypes"></el-input>
        </el-form-item>
        <el-form-item label="认证令牌时效(秒)" prop="accessTokenValidity">
          <el-input v-model="addForm.accessTokenValidity" type="number"></el-input>
        </el-form-item>
        <el-form-item label="刷新令牌时效(秒)" prop="refreshTokenValidity">
          <el-input v-model="addForm.refreshTokenValidity" type="number"></el-input>
        </el-form-item>
        <el-form-item label="自动放行" prop="autoapprove">
          <el-switch v-model="addForm.autoapprove" active-value="true" inactive-value="false"></el-switch>
        </el-form-item>
      </el-form>
      <!--底部-->
      <span slot="footer">
        <el-button @click="addDialogVisible=false">取消</el-button>
        <el-button type="primary" @click="submitAdd">保存</el-button>
      </span>
    </el-dialog>

    <el-dialog title="编辑客户端" width="50%" :visible.sync="editDialogVisible" @close="resetEditForm">
      <!--内容主体-->
      <el-form label-width="150px" @submit.native.prevent :model="editForm" :rules="formRules" ref="editFormRef">
        <el-form-item label="客户端ID" prop="clientId">
          <el-input v-model="editForm.clientId" disabled></el-input>
        </el-form-item>
        <el-form-item label="客户端密钥" prop="clientSecret">
          <el-input v-model="editForm.clientSecret"></el-input>
        </el-form-item>
        <el-form-item label="域" prop="scope">
          <el-input v-model="editForm.scope"></el-input>
        </el-form-item>
        <el-form-item label="授权方式" prop="authorizedGrantTypes">
          <el-input v-model="editForm.authorizedGrantTypes"></el-input>
        </el-form-item>
        <el-form-item label="认证令牌时效(秒)" prop="accessTokenValidity">
          <el-input v-model="editForm.accessTokenValidity" type="number"></el-input>
        </el-form-item>
        <el-form-item label="刷新令牌时效(秒)" prop="refreshTokenValidity">
          <el-input v-model="editForm.refreshTokenValidity" type="number"></el-input>
        </el-form-item>
        <el-form-item label="自动放行" prop="autoapprove">
          <el-switch v-model="editForm.autoapprove" active-value="true" inactive-value="false"></el-switch>
        </el-form-item>
      </el-form>
      <!--底部-->
      <span slot="footer">
        <el-button @click="editDialogVisible=false">取消</el-button>
        <el-button type="primary" @click="submitEdit">保存</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {deleteClientById, editClient, addClient, getClientListByQuery} from "@/api/client";

export default {
  name: "Client",
  data() {
    return {
      queryInfo: {
        clientId: null,
      },
      pageNum: 1,
      pageSize: 10,
      total: 0,
      clientList: [],
      addDialogVisible: false,
      editDialogVisible: false,
      addForm: {
        clientId: null,
        clientSecret: null,
        scope: 'all',
        authorizedGrantTypes: null,
        accessTokenValidity: null,
        refreshTokenValidity: null,
        autoapprove: null,
      },
      editForm: {
        clientId: null,
        clientSecret: null,
        scope: null,
        authorizedGrantTypes: null,
        accessTokenValidity: null,
        refreshTokenValidity: null,
        autoapprove: null,
      },
      formRules: {
        clientId: [{required: true, message: '请输入客户端ID', trigger: 'change'}],
        clientSecret: [{required: true, message: '请输入客户端密钥', trigger: 'change'}],
        scope: [{required: true, message: '请输入域', trigger: 'change'}],
        authorizedGrantTypes: [{required: true, message: '请输入授权方式', trigger: 'change'}],
        accessTokenValidity: [{required: true, message: '请输入认证令牌时效(秒)', trigger: 'change'}],
        refreshTokenValidity: [{required: true, message: '请输入刷新令牌时效(秒)', trigger: 'change'}],
        autoapprove: [{required: true, message: '请选择自动放行', trigger: 'change'}],
      },
    }
  },
  created() {
    this.getData()
  },
  methods: {
    getData() {
      getClientListByQuery(this.queryInfo, this.pageNum, this.pageSize).then(res => {
        this.clientList = res.data.records
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
    clientChanged(row, field) {
      const client = {
        clientId: row.clientId,
        [field]: row[field]
      }
      editClient(client).then(res => {
        this.msgSuccess(res.msg)
      })
    },
    showEditDialog(row) {
      this.editForm = (
          ({clientId, clientSecret, scope, authorizedGrantTypes, accessTokenValidity, refreshTokenValidity, autoapprove}) =>
              ({clientId, clientSecret, scope, authorizedGrantTypes, accessTokenValidity, refreshTokenValidity, autoapprove})
      )(row)
      this.editDialogVisible = true
    },
    resetAddForm() {
      this.$refs.addFormRef.resetFields()
    },
    resetEditForm() {
      this.$refs.editFormRef.resetFields()
    },
    submitAdd() {
      this.$refs.addFormRef.validate(valid => {
        if (valid) {
          addClient(this.addForm).then(res => {
            this.addDialogVisible = false
            this.msgSuccess(res.msg)
            this.getData()
          })
        }
      })
    },
    submitEdit() {
      this.$refs.editFormRef.validate(valid => {
        if (valid) {
          editClient(this.editForm).then(res => {
            this.editDialogVisible = false
            this.msgSuccess(res.msg)
            this.getData()
          })
        }
      })
    },
    deleteClientById(clientId) {
      this.$confirm('此操作将永久删除该客户端，是否删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(() => {
        deleteClientById(clientId).then(res => {
          this.msgSuccess(res.msg)
          this.getData()
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
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
