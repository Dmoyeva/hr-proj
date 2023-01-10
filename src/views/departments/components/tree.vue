<template>
  <el-row type="flex" justify="space-between" align="middle" style="height: 40px;width: 100%">
    <span>{{ treeNode.name }}</span>
    <el-col :span="4" justify="end">
      <el-row type="flex">
        <el-col>{{ treeNode.manager }}</el-col>
        <el-col>
          <el-dropdown @command="handleCommand">
            <span class="el-dropdown-link">
              操作<i class="el-icon-arrow-down" />
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="add">添加子部门</el-dropdown-item>
              <el-dropdown-item v-if="!isRoot" command="edit">查看部门</el-dropdown-item>
              <el-dropdown-item v-if="!isRoot" command="delete">删除部门</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </el-col>
      </el-row>
    </el-col>
  </el-row>
</template>

<script>
import { delDeptsById } from '@/api/departs'
export default {
  props: {
    treeNode: {
      type: Object,
      required: true
    },
    isRoot: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    handleCommand(command) {
      if (command === 'add') {
        this.$emit('addDepts', this.treeNode)
      } else if (command === 'edit') {
        this.$emit('editDepts', this.treeNode)
      } else {
        this.$confirm('您确认删除此部门吗').then(() => {
          return delDeptsById(this.treeNode.id)
        }).then(() => {
          this.$emit('delDepts', this.treeNode.id)
          this.$message.success('删除成功')
        }).catch(() => {
          this.$message.error('已取消操作')
        })
      }
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
