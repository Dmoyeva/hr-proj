<template>
  <UploadExcel :on-success="handleSuccess" />
  <!-- on-success是组件可以接收的props函数，可以处理上传文件后的后续逻辑 -->
</template>

<script>
import { batchImportStuff } from '@/api/employee'
export default {
  methods: {
    async handleSuccess({ header, results }) {
      const infoMap = {
        '姓名': 'username',
        '手机号': 'mobile',
        '入职日期': 'timeOfEntry',
        '转正日期': 'correctionTime',
        '工号': 'workNumber'
      }
      // const arr = []
      // results.forEach(item => {
      //   const obj = {}
      //   Object.keys(item).forEach(key => {
      //     obj[infoMap[key]] = item[key]
      //   })
      //   arr.push(obj)
      // })
      const infoArr = results.map(item => {
        const obj = {}
        Object.keys(item).forEach(key => {
          if (infoMap[key] === 'timeOfEntry' || infoMap[key] === 'correctionTime') {
            // 后台要求处理成日期格式，注意new Date()的用法
            obj[infoMap[key]] = new Date(this.formatDate(item[key], '/'))
          } else {
            obj[infoMap[key]] = item[key]
          }
        })
        return obj
      })
      await batchImportStuff(infoArr)
      this.$message.success('导入成功')
      this.$router.back()
    },
    formatDate(numb, format) {
      const time = new Date((numb - 1) * 24 * 3600000 + 1)
      time.setYear(time.getFullYear() - 70)
      const year = time.getFullYear() + ''
      const month = time.getMonth() + 1 + ''
      const date = time.getDate() - 1 + ''
      if (format && format.length === 1) {
        return year + format + month + format + date
      }
      return year + (month < 10 ? '0' + month : month) + (date < 10 ? '0' + date : date)
    }
  }

}
</script>

<style>

</style>
