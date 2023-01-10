<template>
  <div class="container">
    <div class="app">
      <el-card>
        <el-tabs>
          <el-tab-pane label="角色管理">
            <el-row style="height: 40px; margin-top: 20px;" align="middle">
              <el-button type="primary" size="small" icon="el-icon-plus" @click="isDialogShow = true">新增角色</el-button>
            </el-row>
            <el-table border :data="rolesList">
              <el-table-column align="center" type="index" label="序号" width="120" />
              <el-table-column prop="name" align="center" label="角色名" width="240" />
              <el-table-column prop="description" align="center" label="描述" />
              <el-table-column align="center" label="操作">
                <template slot-scope="{ row }">
                  <el-button size="small" type="success">分配权限</el-button>
                  <el-button size="small" type="primary" @click="handleEdit(row)">修改</el-button>
                  <el-button size="small" type="danger" @click="handleRemove(row)">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
            <el-row type="flex" justify="center">
              <el-col :span="8">
                <el-pagination
                  layout="prev, pager, next"
                  :total="queryInfo.total"
                  :page-size="queryInfo.pagesize"
                  :current-page="queryInfo.page"
                  @current-change="pageChange"
                />
              </el-col>
            </el-row>
          </el-tab-pane>
          <!-- 公司信息部分 -->
          <el-tab-pane label="公司信息">
            <el-alert title="更改公司信息将导致重新审批，请谨慎操作" type="warning" show-icon :closable="false" />
            <el-card class="info-card">
              <el-form label-width="120px">
                <el-form-item style="width: 500px" label="企业名称">
                  <el-input v-model="companyInfo.name" disabled />
                </el-form-item>
                <el-form-item style="width: 500px" label="公司地址">
                  <el-input v-model="companyInfo.companyAddress" disabled />
                </el-form-item>
                <el-form-item style="width: 500px" label="公司电话">
                  <el-input v-model="companyInfo.companyPhone" disabled />
                </el-form-item>
                <el-form-item style="width: 500px" label="邮箱">
                  <el-input v-model="companyInfo.mailbox" disabled />
                </el-form-item>
                <el-form-item style="width: 500px" label="备注">
                  <el-input v-model="companyInfo.remarks" disabled type="textarea" :rows="3" resize="none" />
                </el-form-item>
              </el-form>
            </el-card>
          </el-tab-pane>
        </el-tabs>
      </el-card>
      <el-dialog :visible="isDialogShow" :title="`${dialogTitle}角色`" center @close="handleCancel" @closed="handleClosed">
        <el-form ref="formRef" :model="roleInfo" label-width="80px" :rules="rules">
          <el-form-item label="角色名称" prop="name">
            <el-input v-model="roleInfo.name" />
          </el-form-item>
          <el-form-item label="角色描述">
            <el-input v-model="roleInfo.description" />
          </el-form-item>
        </el-form>
        <!-- <el-row slot="footer" type="flex" justify="center">
          <el-col :span="8"> -->
        <span slot="footer">
          <el-button type="primary" size="small" @click="handleSubmit">确认</el-button>
          <el-button type="plain" size="small" @click="handleCancel">取消</el-button>
        </span>
        <!-- </el-col>
        </el-row> -->
      </el-dialog>
    </div>
  </div>
</template>

<script>
import { getRolesList, getCompanyInfo, removeRoleById, getRoleInfoById, updateRoleById, addNewRole } from '@/api/setting'
import { mapGetters } from 'vuex'
export default {
  data() {
    return {
      rolesList: [],
      queryInfo: {
        page: 1,
        pagesize: 5,
        total: 0
      },
      companyInfo: {},
      isDialogShow: false,
      rules: {
        name: [{ required: true, message: '角色名称不能为空', trigger: 'blur' }]
      },
      roleInfo: {}
    }
  },
  computed: {
    ...mapGetters(['companyId']),
    dialogTitle() {
      return this.roleInfo.id ? '编辑' : '新增'
    }
  },
  created() {
    this.getRolesList()
    this.getCompanyInfo()
  },
  methods: {
    async getRolesList() {
      const { total, rows } = await getRolesList(this.queryInfo)
      this.queryInfo.total = total
      this.rolesList = rows
    },
    pageChange(val) {
      this.queryInfo.page = val
      this.getRolesList()
    },
    async getCompanyInfo() {
      this.companyInfo = await getCompanyInfo(this.companyId)
    },
    async handleRemove(row) {
      try {
        await this.$confirm('确认删除改角色吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消', type: 'warning'
        })
        await removeRoleById(row) // 这也是个异步操作哦！
        this.getRolesList()
        this.$message.success('删除成功')
      } catch (error) {
        this.$message.error('已取消操作')
      }
      // this.$confirm('确认删除该角色吗', '提示', {
      //   confirmButtonText: '确定',
      //   cancelButtonText: '取消',
      //   type: 'warning'
      // }).then(() => {
      //   await removeRoleById(row)
      //   this.getRolesList()
      //   this.$message.success('删除成功')
      // }).catch(() => {
      //   this.$message.info('已取消操作')
      // })
    },
    async handleEdit(row) {
      // 回填数据
      this.roleInfo = await getRoleInfoById(row)
      this.isDialogShow = true
    },
    async handleSubmit() {
      if (this.roleInfo.id) {
        // 编辑角色
        try {
          await this.$refs.formRef.validate()
          await updateRoleById(this.roleInfo)
        } catch (error) {
          this.$message.error(error)
        }
      } else {
        // 新增角色
        try {
          await addNewRole(this.roleInfo)
        } catch (error) {
          this.$message.error(`${this.dialogTitle}失败`)
        }
      }
      this.isDialogShow = false
      this.getRolesList()
      this.$message.success(`${this.dialogTitle}成功`)
    },
    handleCancel() {
      this.isDialogShow = false
      this.$refs.formRef.resetFields()
    },
    handleClosed() {
      this.roleInfo = {
        name: '',
        description: ''
      }
    }
  }

}
</script>

<style lang="scss" scoped>
.info-card {
  padding-left: 100px;
}
</style>
