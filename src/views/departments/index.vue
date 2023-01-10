<template>
  <div v-loading="loading" class="container">
    <div class="app">
      <el-card class="tree-card">
        <!-- 顶部公司区域 -->
        <my-tree-item :tree-node="company" :is-root="true" @addDepts="handleAddDepts" />
        <!-- 树形架构区域 -->
        <el-tree :data="departs" :props="defaultProps" default-expand-all>
          <!-- 在el-tree中通过slot-scope循环出来组件 -->
          <!-- 注意props传值 -->
          <my-tree-item slot-scope="{ data }" :tree-node="data" @delDepts="getDepartsInfo" @addDepts="handleAddDepts" @editDepts="handleEditDepts" />
        </el-tree>
        <my-dialog ref="dialogRef" :dialog-visible.sync="dialogVisible" :tree-node="node" @updateDepts="getDepartsInfo" />
      </el-card>
    </div>
  </div>
</template>

<script>
import Tree from './components/tree'
import { getDepartsInfo } from '@/api/departs'
import { transList } from '@/utils'
import Dialog from './components/dialog.vue'
export default {
  components: {
    'my-tree-item': Tree,
    'my-dialog': Dialog
  },
  data() {
    return {
      company: {},
      departs: [],
      defaultProps: {
        children: 'children',
        label: 'name'
      },
      dialogVisible: false,
      node: null,
      loading: false
    }
  },
  created() {
    this.getDepartsInfo()
  },
  methods: {
    async getDepartsInfo() {
      this.loading = true
      const result = await getDepartsInfo()
      this.departs = transList(result.depts, '')
      // 这里一定要设置company的id属性，属于顶级的id
      this.company = { name: result.companyName, manager: '负责人', id: '' }
      this.loading = false
    },
    handleAddDepts(node) {
      this.dialogVisible = true
      this.node = node // 接收子组件传递过来的部门数据
    },
    handleEditDepts(node) {
      this.dialogVisible = true
      this.node = node
      // 调用一样的dialog组件，要回填数据，在哪里调用接口？
      this.$refs.dialogRef.getDeptsDetail(node.id)
    }
  }
}
</script>

<style lang="scss" scoped>
.tree-card {
  padding: 30px 140px;
  font-size: 14px;
}
</style>
