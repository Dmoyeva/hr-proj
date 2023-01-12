<template>
  <el-card>
    <el-dialog :visible="isDialogShow" title="新增员工" center width="50%" @close="handleCancel">
      <el-form ref="formRef" label-width="120px" :model="formData" :rules="rules">
        <el-form-item label="姓名" prop="username">
          <el-input v-model="formData.username" style="width: 300px" />
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
          <el-input v-model="formData.mobile" style="width: 300px" />
        </el-form-item>
        <el-form-item label="入职时间" prop="timeOfEntry">
          <el-date-picker v-model="formData.timeOfEntry" style="width: 300px" />
        </el-form-item>
        <el-form-item label="聘用形式" prop="formOfEmployment">
          <el-select v-model="formData.formOfEmployment" style="width: 300px">
            <el-option v-for="item in EmployeesEnum.hireType" :key="item.id" :label="item.value" :value="item.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="工号" prop="workNumber">
          <el-input v-model="formData.workNumber" style="width: 300px" />
        </el-form-item>
        <el-form-item label="部门" prop="departmentName">
          <el-input v-model="formData.departmentName" style="width: 300px" @focus="selectDepts" />
          <el-tree v-if="isTreeShow" v-loading="loading" :data="treeData" :props="{ label: 'name' }" default-expand-all @node-click="getCurrentNode" />
        </el-form-item>
        <el-form-item label="转正时间" prop="correctionTime">
          <el-date-picker v-model="formData.correctionTime" style="width: 300px" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-row type="flex" justify="center">
          <el-button size="small" type="primary" @click="handleSubmit">确认</el-button>
          <el-button size="small" @click="handleCancel">取消</el-button>
        </el-row>
      </template>
    </el-dialog>
  </el-card>
</template>

<script>
import { getDepartsInfo } from '@/api/departs.js'
import { addStuffInfo } from '@/api/employee'
import { transList } from '@/utils'
import EmployeesEnum from '@/api/constant/employees'
export default {
  props: {
    isDialogShow: {
      type: Boolean,
      required: true
    }
  },
  data() {
    return {
      formData: {
        username: '',
        mobile: '',
        formOfEmployment: '',
        workNumber: '',
        departmentName: '',
        timeOfEntry: '',
        correctionTime: ''
      },
      rules: {
        username: [
          { required: true, message: '员工姓名不能为空', trigger: 'blur' },
          { max: 4, min: 2, message: '2-4个字符', trigger: 'blur' }
        ],
        mobile: [
          { required: true, message: '手机号不能为空', trigger: 'blur' },
          { pattern: /^1[3-9]\d{9}$/, message: '手机号格式不对', trigger: 'blur' }
        ],
        formOfEmployment: [{ required: true, message: '请选择聘用形式', trigger: 'blur' }],
        workNumber: [{ required: true, message: '请输入员工工号', trigger: 'blur' }],
        departmentName: [{ required: true, message: '请选择员工部门', trigger: 'change' }],
        timeOfEntry: [{ required: true, message: '请选择入职时间', trigger: 'blur' }],
        correctionTime: [{ required: true, message: '请选择转正时间', trigger: 'blur' }]
      },
      isTreeShow: false,
      treeData: [],
      loading: false,
      EmployeesEnum
    }
  },
  methods: {
    async handleSubmit() {
      try {
        await this.$refs.formRef.validate()
        await addStuffInfo(this.formData)
        this.$parent.getAllStuffInfo()
        this.$parent.isDialogShow = false
        this.$message.success('添加成功')
      } catch (err) {
        this.$message.info('请填写相关信息')
      }
    },
    handleCancel() {
      this.$refs.formRef.resetFields()
      this.formData = {
        username: '',
        mobile: '',
        formOfEmployment: '',
        workNumber: '',
        departmentName: '',
        timeOfEntry: '',
        correctionTime: ''
      }
      this.$parent.isDialogShow = false
    },
    async selectDepts() {
      this.isTreeShow = true
      this.loading = true
      const { depts } = await getDepartsInfo()
      this.treeData = transList(depts, '')
      this.loading = false
    },
    getCurrentNode(obj) {
      this.isTreeShow = false
      this.formData.departmentName = obj.name
    }
  }

}
</script>

<style>

</style>
