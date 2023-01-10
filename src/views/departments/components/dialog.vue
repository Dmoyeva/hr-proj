<template>
  <el-dialog :title="dialogTitle" :visible="dialogVisible" width="50%" @close="handleCancel">
    <el-form ref="formRef" label-width="120px" :model="deptsInfo" :rules="rules">
      <el-form-item label="部门名称" prop="name">
        <el-input v-model="deptsInfo.name" style="width:80%" placeholder="1-50个字符" />
      </el-form-item>
      <el-form-item label="部门编码" prop="code">
        <el-input v-model="deptsInfo.code" style="width:80%" placeholder="1-16个字符" />
      </el-form-item>
      <el-form-item label="部门负责人" prop="manager">
        <el-select v-model="deptsInfo.manager" style="width:80%" placeholder="请选择负责人" @focus="getManager">
          <el-option v-for="item in briefStuffInfo" :key="item.id" :label="item.username" :value="item.username" />
        </el-select>
      </el-form-item>
      <el-form-item label="部门介绍" prop="introduce">
        <el-input
          v-model="deptsInfo.introduce"
          style="width:80%"
          type="textarea"
          :autosize="{ minRows: 2, maxRows: 4 }"
          placeholder="1-300个字符"
          resize="none"
        />
      </el-form-item>
    </el-form>
    <!-- el-dialog有专门放置底部操作栏的 插槽  具名插槽 -->
    <el-row slot="footer" type="flex" justify="center">
      <!-- 列被分为24 -->
      <el-col :span="8">
        <el-button type="primary" size="small" @click="handleSubmit">确定</el-button>
        <el-button size="small" @click="handleCancel">取消</el-button>
      </el-col>
    </el-row>
  </el-dialog>

</template>

<script>
import { getDepartsInfo, addDepts, getDeptsDetail, updateDeptsDetail } from '@/api/departs'
import { getBriefStuffInfo } from '@/api/employee'
export default {
  props: {
    dialogVisible: {
      type: Boolean,
      default: false
    },
    treeNode: {
      type: Object,
      default: null
    }
  },
  data() {
    const nameRepetition = async(rule, value, callback) => {
      const { depts } = await getDepartsInfo()
      // depts是所有的部门数据
      // 此处存在两种情况，编辑校验跟新增校验
      // 编辑校验==>同级目录下除开自己外不能有相同的name
      // 新增校验==>同级目录下不能有相同的name
      let isRepeat = false
      if (this.deptsInfo.id) {
        // id存在，是编辑，怎样找同级下其他的部门？this.deptsInfo.id就是传过来的id
        isRepeat = depts.filter(item => item.pid === this.deptsInfo.pid && item.id !== this.deptsInfo.id).some(item => item.name === value)
      } else {
        // id不存在，是新增，如何去找技术部所有的子节点
        isRepeat = depts.filter(item => item.pid === this.treeNode.id).some(item => item.name === value)
      }
      isRepeat ? callback(new Error(`同级已经有${value}了`)) : callback()
    }
    const codeRepetition = async(rule, value, callback) => {
      // 验证所有的name
      const { depts } = await getDepartsInfo()
      let isRepeat = false
      if (this.deptsInfo.id) {
        // id存在，编辑 ==>除开自己外不能跟其他的code重复
        isRepeat = depts.some(item => item.code === value && value && item.id !== this.deptsInfo.id)
      } else {
        // id不存在，新建
        isRepeat = depts.some(item => item.code === value && value) // value必须有值
      }
      isRepeat ? callback(new Error(`部门编码${value}已存在`)) : callback()
    }
    return {
      deptsInfo: {
        name: '',
        code: '',
        manager: '',
        introduce: ''
      },
      rules: {
        name: [
          { required: true, message: '部门名称不能为空', trigger: 'blur' },
          { max: 50, min: 1, trigger: 'blur' },
          { validator: nameRepetition, trigger: 'blur' }
        ],
        code: [
          { required: true, message: '部门编码不能为空', trigger: 'blur' },
          { max: 16, min: 1, trigger: 'blur' },
          { validator: codeRepetition, trigger: 'blur' }
        ],
        manager: [{ required: true, message: '必须选择部门负责人', trigger: 'blur' }],
        introduce: [{ required: true, message: '部门介绍不能为空', trigger: 'blur' },
          { max: 300, min: 1, trigger: 'blur' }]
      },
      briefStuffInfo: []
    }
  },
  computed: {
    // 显示不同的title，根据deptsInfo的id来判断，如果是添加，那么传递过来的deptsInfo没id
    dialogTitle() {
      return this.deptsInfo.id ? '编辑子部门' : '添加子部门'
    }
  },
  methods: {
    async getManager() {
      const result = await getBriefStuffInfo()
      this.briefStuffInfo = result
    },
    handleSubmit() {
      this.$refs.formRef.validate(async valid => {
        if (valid) {
          // 校验通过，此处存在两种选择，如果是编辑，将发起编辑的请求，如果是新增发起新增请求
          if (this.deptsInfo.id) {
            // id存在，更新数据，不用拼接pid
            await updateDeptsDetail(this.deptsInfo)
          } else {
            // id存在，新增数据，需要拼接pid
            await addDepts({ ...this.deptsInfo, pid: this.treeNode.id })
          }
          // 后续的逻辑不用变更
          this.$emit('updateDepts') // 通知父组件更新数据
          this.$emit('update:dialogVisible', false) // 关闭dialog会触发close事件
        }
      })
    },
    handleCancel() {
      // form组件的resetFields()方法只能重置表单里自定义的数据，对于获取的其他的数据无法重置
      // 所以在关闭对话框的时候，手动重置表单数据
      this.deptsInfo = {
        name: '',
        code: '',
        manager: '',
        introduce: ''
      }
      this.$refs.formRef.resetFields()
      this.$emit('update:dialogVisible', false)
    },
    async getDeptsDetail(id) {
      // 这里不能用treeNode.id，因为treeNode来源于props，而props数据是异步的，不一定能拿到
      // 所以通过父组件获取组件实例来操作，在父组件中取值
      const result = await getDeptsDetail(id)
      this.deptsInfo = result
    }
  }
}
</script>

<style>

</style>
