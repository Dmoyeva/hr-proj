<template>
  <div class="container">
    <div class="app">
      <el-card>
        <el-tabs>
          <el-tab-pane label="登录账户设置">
            <el-form ref="formRef" label-width="120px" :rules="rules" :model="formData" style="margin-top: 30px">
              <el-form-item label="用户名" prop="username">
                <el-input v-model="formData.username" style="width: 240px" />
              </el-form-item>
              <el-form-item label="密码" prop="newPassword">
                <el-input v-model="formData.newPassword" style="width: 240px" type="password" />
              </el-form-item>
              <el-form-item>
                <el-button type="primary" size="small" @click="refreshStuffInfo">
                  更新
                </el-button>
              </el-form-item>
            </el-form>
          </el-tab-pane>
          <el-tab-pane label="个人详情">
            <!-- 动态组件 -->
            <el-row type="flex" justify="end">
              <el-tooltip content="打印个人基本信息">
                <router-link :to="`/employees/print/${stuffId}?type=personal`">
                  <i class="el-icon-printer" />
                </router-link>
              </el-tooltip>
            </el-row>
            <component :is="personalComponent" />
          </el-tab-pane>
          <el-tab-pane label="岗位信息">
            <el-row type="flex" justify="end">
              <el-tooltip content="打印岗位信息">
                <router-link :to="`/employees/print/${stuffId}?type=job`">
                  <i class="el-icon-printer" />
                </router-link>
              </el-tooltip>
            </el-row>
            <Job />
          </el-tab-pane>
        </el-tabs>
      </el-card>
    </div>
  </div>
</template>

<script>
import { getUserinfoDetail } from '@/api/user'
import { refreshStuffInfo } from '@/api/employee'
import Personal from './components/personal.vue'
import Job from './components/job.vue'
export default {
  components: { Personal, Job },
  data() {
    return {
      formData: {
        username: '',
        newPassword: ''
      },
      rules: {
        username: [{ required: true, message: '用户名不能为空', trigger: 'blur' }],
        newPassword: [{ required: true, message: '密码不能为空', trigger: 'blur' }, { min: 6, max: 9, message: '密码长度6-9位', trigger: 'blur' }]
      },
      stuffId: this.$route.params.id,
      personalComponent: 'Personal'
    }
  },
  created() {
    this.getUserinfoDetail()
  },
  methods: {
    async getUserinfoDetail() {
      this.formData = await getUserinfoDetail(this.stuffId)
    },
    async refreshStuffInfo() {
      this.$refs.formRef.validate(async valid => {
        if (valid) {
          await refreshStuffInfo({ ...this.formData, password: this.formData.newPassword })
          this.$message.success('更新成功')
        } else {
          this.$message.info('请填写相关信息')
        }
      })
      // try {
      //   // 校验
      //   await this.$refs.formRef.validate()
      //   await refreshStuffInfo({ ...this.formData, password: this.formData.newPassword }) // 将新密码的值替换原密码的值
      //   this.$message.success('保存成功')
      // } catch (error) {
      //   this.$message.success('更新失败')
      // }
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
