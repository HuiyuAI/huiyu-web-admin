<template>
  <div>
    <el-form inline>
      <el-form-item label="角色">
        <el-select v-model="queryInfo.role" placeholder="请选择角色" :clearable="true" @change="search" size="small" style="width: 150px">
          <el-option :label="item.label" :value="item.code" v-for="(item,index) in roleList" :key="index"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="用户ID">
        <el-input placeholder="请输入用户ID" v-model="queryInfo.userId" type="number" :clearable="true"
                  @keyup.native.enter="search" @clear="search" size="small" style="min-width: 150px">
        </el-input>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" size="small" icon="el-icon-search" @click="search">搜索</el-button>
      </el-form-item>
      <el-form-item>
        <el-button type="success" size="small" icon="el-icon-plus" @click="showAddDialog">添加</el-button>
      </el-form-item>
    </el-form>

    <el-table :data="userList">
      <el-table-column label="头像" width="70">
        <template v-slot="scope">
          <el-avatar shape="square" :size="50" fit="contain" :src="scope.row.avatar"></el-avatar>
        </template>
      </el-table-column>
      <el-table-column label="用户ID" prop="userId" width="80"></el-table-column>
      <el-table-column label="OPENID" prop="openid" show-overflow-tooltip></el-table-column>
      <el-table-column label="用户名" prop="username"></el-table-column>
      <el-table-column label="昵称" prop="nickname"></el-table-column>
      <el-table-column label="性别" prop="gender" width="50">
        <template v-slot="scope">
          <i class="el-icon-male" style="color: dodgerblue" v-if="scope.row.gender === 0"></i>
          <i class="el-icon-female" style="color: red" v-else-if="scope.row.gender === 1"></i>
          <span v-else>未知</span>
        </template>
      </el-table-column>
      <el-table-column label="积分" prop="point" width="80"></el-table-column>
      <el-table-column label="等级" prop="level" width="50"></el-table-column>
      <el-table-column label="图片数" width="70">
        <template v-slot="scope">
          <el-link type="primary" @click="toPic(scope.row.userId)">{{ scope.row.picCount }}</el-link>
        </template>
      </el-table-column>
      <el-table-column label="角色" prop="role" width="90">
        <template v-slot="scope">
          {{ roleList.find(item => item.code === scope.row.role).label }}
        </template>
      </el-table-column>
      <el-table-column label="状态" width="80">
        <template v-slot="scope">
          <el-switch v-model="scope.row.enabled" disabled inactive-color="#ff4949"></el-switch>
        </template>
      </el-table-column>
      <el-table-column label="注册时间" width="160">
        <template v-slot="scope">{{ scope.row.createTime | dateFormat }}</template>
      </el-table-column>
      <el-table-column label="操作" width="100">
        <template v-slot="scope">
          <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditDialog(scope.row)">编辑</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!--分页-->
    <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="pageNum"
                   :page-sizes="[10, 50, 100, 200]" :page-size="pageSize" :total="total"
                   layout="total, sizes, prev, pager, next, jumper" background>
    </el-pagination>

    <el-dialog title="编辑用户" width="50%" :visible.sync="editDialogVisible" :close-on-click-modal="false" :close-on-press-escape="false">
      <!--内容主体-->
      <el-form label-width="80px" @submit.native.prevent>
        <el-row>
          <el-col :span="12">
            <el-form-item label="用户ID" prop="userId">
              <el-input v-model="editForm.userId" disabled></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="昵称" prop="nickname">
              <el-input v-model="editForm.nickname"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="用户名" prop="username">
              <el-input v-model="editForm.username"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="密码" prop="password">
              <el-input v-model="editForm.password"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="性别" prop="gender">
              <el-radio-group v-model="editForm.gender">
                <el-radio :label="0">男</el-radio>
                <el-radio :label="1">女</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="启用">
              <el-switch v-model="editForm.enabled" inactive-color="#ff4949"></el-switch>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="角色" prop="role">
          <el-radio-group v-model="editForm.role">
            <el-radio :label="role.code" v-for="(role,index) in roleList" :key="index">{{ role.label }}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-row>
          <el-col :span="12">
            <el-form-item label="积分" prop="point">
              <el-input v-model="editForm.point" type="number"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="等级" prop="level">
              <el-input v-model="editForm.level" type="number"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="头像URL" prop="avatar">
          <el-input v-model="editForm.avatar"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="phone">
          <el-input v-model="editForm.phone"></el-input>
        </el-form-item>
      </el-form>
      <!--底部-->
      <span slot="footer">
				<el-button @click="editDialogVisible=false">取消</el-button>
				<el-button type="primary" @click="submitEdit">保存</el-button>
			</span>
    </el-dialog>

    <el-dialog title="新增用户" width="50%" :visible.sync="addDialogVisible" :close-on-click-modal="false" :close-on-press-escape="false">
      <!--内容主体-->
      <el-form label-width="80px" @submit.native.prevent :model="addForm" :rules="addFormRules" ref="addFormRef">
        <el-row>
          <el-col :span="12">
            <el-form-item label="用户ID" prop="userId">
              <el-input v-model="addForm.userId" disabled></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="昵称" prop="nickname">
              <el-input v-model="addForm.nickname"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="用户名" prop="username">
              <el-input v-model="addForm.username"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="密码" prop="password">
              <el-input v-model="addForm.password"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="性别" prop="gender">
              <el-radio-group v-model="addForm.gender">
                <el-radio :label="0">男</el-radio>
                <el-radio :label="1">女</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="启用">
              <el-switch v-model="addForm.enabled" inactive-color="#ff4949"></el-switch>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="角色" prop="role">
          <el-radio-group v-model="addForm.role">
            <el-radio :label="role.code" v-for="(role,index) in roleList" :key="index" :disabled="role.code==='ROLE_USER'">{{ role.label }}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-row>
          <el-col :span="12">
            <el-form-item label="积分" prop="point">
              <el-input v-model="addForm.point" type="number"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="等级" prop="level">
              <el-input v-model="addForm.level" type="number"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="头像URL" prop="avatar">
          <el-input v-model="addForm.avatar"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="phone">
          <el-input v-model="addForm.phone"></el-input>
        </el-form-item>
      </el-form>
      <!--底部-->
      <span slot="footer">
				<el-button @click="addDialogVisible=false">取消</el-button>
				<el-button type="primary" @click="submitAdd">保存</el-button>
			</span>
    </el-dialog>
  </div>
</template>

<script>
import roleList from "@/common/roleList";
import {getUserListByQuery, addUser, updateUser} from "@/api/user";

export default {
  name: "User",
  data() {
    return {
      roleList,
      queryInfo: {
        userId: null,
        role: null,
      },
      pageNum: 1,
      pageSize: 10,
      total: 0,
      userList: [],
      editDialogVisible: false,
      addDialogVisible: false,
      editForm: {
        userId: null,
        username: null,
        nickname: null,
        password: null,
        role: null,
        avatar: null,
        gender: 0,
        phone: null,
        point: 0,
        level: 0,
        enabled: false,
      },
      addForm: {
        userId: null,
        username: null,
        nickname: null,
        password: null,
        role: 'ROLE_ROOT',
        avatar: null,
        gender: 0,
        phone: null,
        point: 0,
        level: 0,
        enabled: false,
      },
      addFormRules: {
        username: [{required: true, message: '请输入用户名', trigger: 'change'}],
        nickname: [{required: true, message: '请输入昵称', trigger: 'change'}],
        password: [{required: true, message: '请输入密码', trigger: 'change'}],
        role: [{required: true, message: '请选择角色', trigger: 'change'}],
        avatar: [{required: true, message: '请输入头像URL', trigger: 'change'}],
        gender: [{required: true, message: '请选择性别', trigger: 'change'}],
      },
    }
  },
  created() {
    this.$route.query.userId && (this.queryInfo.userId = this.$route.query.userId)
    this.getData()
  },
  methods: {
    getData() {
      getUserListByQuery(this.queryInfo, this.pageNum, this.pageSize).then(res => {
        this.userList = res.data.records
        this.total = res.data.total
      })
    },
    search() {
      this.pageNum = 1
      this.pageSize = 50
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
      this.editForm.userId = row.userId
      this.editForm.username = row.username
      this.editForm.nickname = row.nickname
      this.editForm.password = null
      this.editForm.role = row.role
      this.editForm.avatar = row.avatar
      this.editForm.gender = row.gender
      this.editForm.phone = row.phone
      this.editForm.point = row.point
      this.editForm.level = row.level
      this.editForm.enabled = row.enabled
      this.editDialogVisible = true
    },
    submitEdit() {
      updateUser(this.editForm).then(res => {
        this.editDialogVisible = false
        this.msgSuccess(res.msg)
        this.getData()
      })
    },
    showAddDialog() {
      this.addForm.avatar = `https://picsum.photos/id/${Math.floor(Math.random() * 200)}/200`
      this.addDialogVisible = true
    },
    submitAdd() {
      this.$refs.addFormRef.validate(valid => {
        if (valid) {
          addUser(this.addForm).then(res => {
            this.addDialogVisible = false
            this.resetAddForm()
            this.msgSuccess(res.msg)
            this.getData()
          })
        }
      })
    },
    resetAddForm() {
      this.$refs.addFormRef.resetFields()
    },
    toPic(userId) {
      this.$router.push({
        path: '/app/pic',
        query: {
          userId
        }
      })
    },
  },
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
