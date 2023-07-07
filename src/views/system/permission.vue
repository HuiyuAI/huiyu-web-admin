<template>
  <div>
    <el-form inline>
      <el-form-item label="角色">
        <el-select placeholder="请选择角色" v-model="queryInfo.role" :clearable="true"
                   @change="search" size="small" style="width: 150px">
          <el-option :label="item.label" :value="item.roleName" v-for="(item,index) in roleList" :key="index"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="权限名称">
        <el-input placeholder="请输入权限名称" v-model="queryInfo.name" :clearable="true"
                  @keyup.native.enter="search" @clear="search" size="small" style="min-width: 200px">
        </el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" size="small" icon="el-icon-search" @click="search">搜索</el-button>
      </el-form-item>
      <el-form-item>
        <el-button type="success" size="small" icon="el-icon-plus" @click="addDialogVisible = true">添加</el-button>
      </el-form-item>
      <el-form-item>
        <el-button type="warning" size="small" icon="el-icon-refresh" @click="refreshRules">刷新权限缓存</el-button>
      </el-form-item>
    </el-form>

    <el-table :data="rulesList">
      <el-table-column label="排序" prop="orderId" width="50"></el-table-column>
      <el-table-column label="权限名称" prop="name" width="300"></el-table-column>
      <el-table-column label="URL规则" prop="urlPerm"></el-table-column>
      <el-table-column label="角色" prop="role">
        <template v-slot="scope">
          {{ convertRoleList(scope.row.role) }}
        </template>
      </el-table-column>
      <el-table-column label="操作" width="200">
        <template v-slot="scope">
          <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditDialog(scope.row)">编辑</el-button>
          <el-button type="danger" icon="el-icon-delete" size="mini" @click="deletePermById(scope.row.id)">删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <!--分页-->
    <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="pageNum"
                   :page-sizes="[10, 20, 30, 50]" :page-size="pageSize" :total="total"
                   layout="total, sizes, prev, pager, next, jumper" background>
    </el-pagination>

    <el-dialog title="新增规则" width="40%" :visible.sync="addDialogVisible" @close="resetAddForm">
      <!--内容主体-->
      <el-form label-width="100px" @submit.native.prevent :model="addForm" :rules="formRules" ref="addFormRef">
        <el-form-item label="排序" prop="orderId">
          <el-input-number v-model="addForm.orderId"></el-input-number>
        </el-form-item>
        <el-form-item label="权限名称" prop="name">
          <el-input v-model="addForm.name"></el-input>
        </el-form-item>
        <el-form-item label="URL规则" prop="urlPerm">
          <el-input v-model="addForm.urlPerm"></el-input>
        </el-form-item>
        <el-form-item label="角色" prop="role">
          <el-checkbox-group v-model="addForm.role">
            <el-checkbox :label="role.roleName" v-for="(role,index) in roleList" :key="index">{{ role.label }}</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
      </el-form>
      <!--底部-->
      <span slot="footer">
        <el-button @click="addDialogVisible=false">取消</el-button>
        <el-button type="primary" @click="submitAdd">保存</el-button>
      </span>
    </el-dialog>

    <el-dialog title="编辑规则" width="40%" :visible.sync="editDialogVisible" @close="resetEditForm">
      <!--内容主体-->
      <el-form label-width="100px" @submit.native.prevent :model="editForm" :rules="formRules" ref="editFormRef">
        <el-form-item label="排序" prop="orderId">
          <el-input-number v-model="editForm.orderId"></el-input-number>
        </el-form-item>
        <el-form-item label="权限名称" prop="name">
          <el-input v-model="editForm.name"></el-input>
        </el-form-item>
        <el-form-item label="URL规则" prop="urlPerm">
          <el-input v-model="editForm.urlPerm"></el-input>
        </el-form-item>
        <el-form-item label="角色" prop="role">
          <el-checkbox-group v-model="editForm.role">
            <el-checkbox :label="role.roleName" v-for="(role,index) in roleList" :key="index">{{ role.label }}</el-checkbox>
          </el-checkbox-group>
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
import roleList from "@/common/roleList";
import {getPermissionListByQuery, addPermission, editPermission, deletePermissionById, refreshPermRolesRules} from "@/api/permission";

export default {
  name: "Permission",
  data() {
    return {
      roleList,
      queryInfo: {
        name: null,
        role: null,
      },
      pageNum: 1,
      pageSize: 10,
      total: 0,
      rulesList: [],
      addDialogVisible: false,
      editDialogVisible: false,
      addForm: {
        orderId: 0,
        name: null,
        urlPerm: null,
        role: [],
      },
      editForm: {
        orderId: 0,
        name: null,
        urlPerm: null,
        role: [],
      },
      formRules: {
        orderId: [{required: true, message: '请输入排序', trigger: 'change'}],
        name: [{required: true, message: '请输入权限名称', trigger: 'change'}],
        urlPerm: [{required: true, message: '请输入URL规则', trigger: 'change'}],
        role: [{required: true, message: '请选择角色', trigger: 'change'}],
      },
    }
  },
  created() {
    this.getData()
  },
  methods: {
    getData() {
      getPermissionListByQuery(this.queryInfo, this.pageNum, this.pageSize).then(res => {
        this.rulesList = res.data.records
        this.total = res.data.total
      })
    },
    convertRoleList(roleStr) {
      return roleStr.split(',').map(role => {
        return this.roleList.find(item => item.roleName === role).label
      }).toString()
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
    showEditDialog(row) {
      this.editForm = {...row}
      this.editForm.role = this.editForm.role.split(',')
      this.editDialogVisible = true
    },
    submitAdd() {
      this.$refs.addFormRef.validate(valid => {
        if (valid) {
          this.addForm.role = this.addForm.role.toString()
          addPermission(this.addForm).then(res => {
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
          this.editForm.role = this.editForm.role.toString()
          editPermission(this.editForm).then(res => {
            this.editDialogVisible = false
            this.msgSuccess(res.msg)
            this.getData()
          })
        }
      })
    },
    resetAddForm() {
      this.$refs.addFormRef.resetFields()
    },
    resetEditForm() {
      this.$refs.editFormRef.resetFields()
    },
    deletePermById(id) {
      this.$confirm('此操作将永久删除该规则，是否删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(() => {
        deletePermissionById(id).then(res => {
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
    refreshRules() {
      refreshPermRolesRules().then(res => {
        this.msgSuccess(res.msg)
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
