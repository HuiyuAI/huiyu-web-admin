<template>
  <div>
    <el-form inline>
      <el-form-item label="分类">
        <el-select placeholder="请选择分类" v-model="queryInfo.category" :clearable="true"
                   @change="search" size="small" style="width: 150px">
          <el-option :label="item" :value="item" v-for="(item,index) in categoryList" :key="index"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="模型名称">
        <el-input placeholder="请输入模型名称" v-model="queryInfo.name" :clearable="true"
                  @keyup.native.enter="search" @clear="search" size="small" style="min-width: 200px">
        </el-input>
      </el-form-item>
      <el-form-item label="模型ID">
        <el-input placeholder="请输入模型ID" v-model="queryInfo.id" :clearable="true"
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

    <el-table :data="modelList">
      <el-table-column label="排序" prop="priority" width="50"></el-table-column>
      <el-table-column label="模型ID" prop="id" width="80"></el-table-column>
      <el-table-column label="封面" width="150">
        <template v-slot="scope">
          <el-image :src="scope.row.coverUrl" fit="scontain"></el-image>
        </template>
      </el-table-column>
      <el-table-column label="名称" prop="name" width="100"></el-table-column>
      <el-table-column label="分类" prop="category" width="80"></el-table-column>
      <el-table-column label="描述" prop="description" show-overflow-tooltip></el-table-column>
      <el-table-column label="编码" prop="code" show-overflow-tooltip></el-table-column>
      <el-table-column label="VAE" prop="vae" show-overflow-tooltip></el-table-column>
      <el-table-column label="采样器" prop="sampler"></el-table-column>
      <el-table-column label="高清化算法" prop="hrUpscaler"></el-table-column>
      <el-table-column label="默认正向描述词" prop="defaultPrompt" show-overflow-tooltip></el-table-column>
      <el-table-column label="默认反向描述词" prop="defaultNegativePrompt" show-overflow-tooltip></el-table-column>
      <el-table-column label="LoRA" prop="lora" show-overflow-tooltip></el-table-column>
      <el-table-column label="启用" width="80">
        <template v-slot="scope">
          <el-switch v-model="scope.row.enabled" active-value="1" inactive-value="0"
                     @change="modelChanged(scope.row,'enabled')"></el-switch>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" width="160">
        <template v-slot="scope">{{ scope.row.createTime | dateFormat }}</template>
      </el-table-column>
      <el-table-column label="更新时间" width="160">
        <template v-slot="scope">{{ scope.row.updateTime | dateFormat }}</template>
      </el-table-column>
      <el-table-column label="操作" width="200">
        <template v-slot="scope">
          <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditDialog(scope.row)">编辑</el-button>
          <el-button type="danger" icon="el-icon-delete" size="mini" @click="deleteById(scope.row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!--分页-->
    <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="pageNum"
                   :page-sizes="[10, 50, 100, 200]" :page-size="pageSize" :total="total"
                   layout="total, sizes, prev, pager, next, jumper" background>
    </el-pagination>

    <el-dialog title="新增模型" width="50%" :visible.sync="addDialogVisible" :close-on-click-modal="false" :close-on-press-escape="false">
      <!--内容主体-->
      <el-form label-width="130px" @submit.native.prevent :model="addForm" :rules="formRules" ref="addFormRef">
        <el-form-item label="排序" prop="priority">
          <el-input-number v-model="addForm.priority"></el-input-number>
        </el-form-item>
        <el-row>
          <el-col :span="12">
            <el-form-item label="模型名称" prop="name">
              <el-input v-model="addForm.name"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="模型分类" prop="category">
              <el-input v-model="addForm.category"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="模型描述" prop="description">
          <el-input v-model="addForm.description"></el-input>
        </el-form-item>
        <el-form-item label="封面图片URL" prop="coverUrl">
          <el-input v-model="addForm.coverUrl"></el-input>
        </el-form-item>
        <el-row>
          <el-col :span="12">
            <el-form-item label="模型编码" prop="code">
              <el-input v-model="addForm.code"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="首选VAE" prop="vae">
              <el-input v-model="addForm.vae"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="首选采样器" prop="sampler">
              <el-input v-model="addForm.sampler"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="首选高清化算法" prop="hrUpscaler">
              <el-input v-model="addForm.hrUpscaler"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="默认正向描述词" prop="defaultPrompt">
              <el-input v-model="addForm.defaultPrompt"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="默认反向描述词" prop="defaultNegativePrompt">
              <el-input v-model="addForm.defaultNegativePrompt"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="搭配LoRA" prop="lora">
          <el-input v-model="addForm.lora"></el-input>
        </el-form-item>
      </el-form>
      <!--底部-->
      <span slot="footer">
        <el-button @click="addDialogVisible=false">取消</el-button>
        <el-button type="primary" @click="submitAdd">保存</el-button>
      </span>
    </el-dialog>
    <el-dialog title="编辑模型" width="50%" :visible.sync="editDialogVisible" @close="resetEditForm" :close-on-click-modal="false" :close-on-press-escape="false">
      <!--内容主体-->
      <el-form label-width="130px" @submit.native.prevent :model="editForm" :rules="formRules" ref="editFormRef">
        <el-form-item label="排序" prop="priority">
          <el-input-number v-model="editForm.priority"></el-input-number>
        </el-form-item>
        <el-row>
          <el-col :span="12">
            <el-form-item label="模型名称" prop="name">
              <el-input v-model="editForm.name"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="模型分类" prop="category">
              <el-input v-model="editForm.category"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="模型描述" prop="description">
          <el-input v-model="editForm.description"></el-input>
        </el-form-item>
        <el-form-item label="封面图片URL" prop="coverUrl">
          <el-input v-model="editForm.coverUrl"></el-input>
        </el-form-item>
        <el-row>
          <el-col :span="12">
            <el-form-item label="模型编码" prop="code">
              <el-input v-model="editForm.code"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="首选VAE" prop="vae">
              <el-input v-model="editForm.vae"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="首选采样器" prop="sampler">
              <el-input v-model="editForm.sampler"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="首选高清化算法" prop="hrUpscaler">
              <el-input v-model="editForm.hrUpscaler"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="默认正向描述词" prop="defaultPrompt">
              <el-input v-model="editForm.defaultPrompt"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="默认反向描述词" prop="defaultNegativePrompt">
              <el-input v-model="editForm.defaultNegativePrompt"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="搭配LoRA" prop="lora">
          <el-input v-model="editForm.lora"></el-input>
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
import {getModelListByQuery, getModelCategoryList, addModel, updateModelBatchById, deleteModelByIds} from "@/api/model";

export default {
  name: "Model",
  data() {
    return {
      queryInfo: {
        id: null,
        name: null,
        category: null,
      },
      pageNum: 1,
      pageSize: 10,
      total: 0,
      modelList: [],
      categoryList: [],
      addDialogVisible: false,
      editDialogVisible: false,
      addForm: {
        priority: 0,
        name: '',
        category: '',
        description: '',
        coverUrl: '',
        code: '',
        vae: '',
        sampler: '',
        hrUpscaler: '',
        defaultPrompt: '',
        defaultNegativePrompt: '',
        lora: '',
      },
      editForm: {
        priority: 0,
        name: '',
        category: '',
        description: '',
        coverUrl: '',
        code: '',
        vae: '',
        sampler: '',
        hrUpscaler: '',
        defaultPrompt: '',
        defaultNegativePrompt: '',
        lora: '',
      },
      formRules: {
        priority: [{required: true, message: '请输入排序', trigger: 'change'}],
        name: [{required: true, message: '请输入模型名称', trigger: 'change'}],
        category: [{required: true, message: '请输入模型分类', trigger: 'change'}],
        description: [{required: true, message: '请输入模型描述', trigger: 'change'}],
        coverUrl: [{required: true, message: '请输入封面图片URL', trigger: 'change'}],
        code: [{required: true, message: '请输入模型编码', trigger: 'change'}],
        vae: [{required: true, message: '请输入首选VAE', trigger: 'change'}],
        sampler: [{required: true, message: '请输入首选采样器', trigger: 'change'}],
        hrUpscaler: [{required: true, message: '请输入首选高清化算法', trigger: 'change'}],
      },
    }
  },
  created() {
    this.$route.query.modelId && (this.queryInfo.id = this.$route.query.modelId)
    this.getData()
  },
  methods: {
    getData() {
      getModelListByQuery(this.queryInfo, this.pageNum, this.pageSize).then(res => {
        this.modelList = res.data.records
        this.total = res.data.total

        this.modelList.forEach(item => {
          item.enabled = item.enabled.toString()
        })
      })
      getModelCategoryList().then(res => {
        this.categoryList = res.data
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
    modelChanged(row, field) {
      const model = {
        id: row.id,
        [field]: row[field]
      }
      updateModelBatchById([model]).then(res => {
        this.msgSuccess(res.msg)
      })
    },
    showEditDialog(row) {
      this.editForm = {...row}
      this.editDialogVisible = true
    },
    submitAdd() {
      this.$refs.addFormRef.validate(valid => {
        if (valid) {
          addModel(this.addForm).then(res => {
            this.addDialogVisible = false
            this.msgSuccess(res.msg)
            this.getData()
            this.resetAddForm()
          })
        }
      })
    },
    submitEdit() {
      this.$refs.editFormRef.validate(valid => {
        if (valid) {
          updateModelBatchById([this.editForm]).then(res => {
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
    deleteById(id) {
      this.$confirm('此操作将永久删除该模型，是否删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(() => {
        deleteModelByIds([id]).then(res => {
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
