<template>
  <div>

  </div>
</template>

<script>
import {getModelList} from "@/api/model";

export default {
  name: "Model",
  data() {
    return {}
  },
  created() {
    this.getModelList()
  },
  methods: {
    getModelList() {
      getModelList().then(res => {
        console.log(res)
      })
    }
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
