<template>
  <div class="container">
    <div class="app">
      <Bar :left-show="true">
        <template #left>
          共{{ queryInfo.total }}条数据
        </template>
        <template #right>
          <el-button type="success" size="small" @click="$router.push('/import')">excel导入</el-button>
          <el-button type="danger" size="small" @click="handleExport">excel导出</el-button>
          <el-button type="primary" size="small" @click="isDialogShow = true">新增员工</el-button>
        </template>
      </Bar>
      <el-card>
        <el-table border :data="stuffList">
          <el-table-column type="index" label="序号" sortable="" align="center" width="60px" />
          <el-table-column label="姓名" prop="username" sortable />
          <el-table-column label="头像" sortable align="center" width="120px">
            <template v-slot="{ row }">
              <img v-imagerror="require('@/assets/common/head.jpg')" :src="row.staffPhoto" alt="" style="width: 100px; height: 100px; padding: 10px; border-radius: 50%" @click="showQrCode(row.staffPhoto)">
            </template>
          </el-table-column>
          <el-table-column label="手机号" prop="mobile" sortable />
          <el-table-column label="工号" prop="workNumber" sortable />
          <el-table-column label="聘用形式" prop="formOfEmployment" sortable :formatter="hireTypeFormat" />
          <el-table-column label="部门" prop="departmentName" sortable />
          <el-table-column label="入职时间" prop="timeOfEntry" sortable>
            <template slot-scope="{ row }">
              {{ row.timeOfEntry | formatDate }}
            </template>
          </el-table-column>
          <el-table-column label="账户状态" prop="enableState" sortable align="center">
            <template slot-scope="{ row }">
              <el-switch :value="row.enableState === 1" />
            </template>
          </el-table-column>
          <el-table-column label="操作" sortable width="240px" align="center" fixed="right">
            <template slot-scope="{ row }">
              <el-button type="text" size="small" @click="$router.push(`/employees/detail/${ row.id }`)">查看</el-button>
              <el-button type="text" size="small">转正</el-button>
              <el-button type="text" size="small">调岗</el-button>
              <el-button type="text" size="small">离职</el-button>
              <el-button type="text" size="small">角色</el-button>
              <el-button type="text" size="small" @click="handleDelete(row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-row type="flex" justify="center" align="middle" style="height: 60px">
          <el-pagination
            layout="prev, pager, next"
            :current-page="queryInfo.page"
            :total="queryInfo.total"
            :page-size="queryInfo.size"
            @current-change="pageChange"
          />
        </el-row>
      </el-card>
      <Dialog :is-dialog-show.sync="isDialogShow" />
      <el-dialog :visible.sync="isQrCodeShow" title="二维码">
        <el-row type="flex" justify="center" align="middle"> <canvas ref="canvasRef" /></el-row>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import { getAllStuffInfo, deleteStuffInfo } from '@/api/employee'
import EmployeesEnum from '@/api/constant/employees'
import Dialog from './components/dialog.vue'
import { formatDate } from '@/filters'
import QrCode from 'qrcode'
export default {
  components: { Dialog },
  data() {
    return {
      queryInfo: {
        page: 1,
        size: 10,
        total: 0
      },
      stuffList: [],
      EmployeesEnum,
      isDialogShow: false,
      isQrCodeShow: false
    }
  },
  created() {
    this.getAllStuffInfo()
  },
  methods: {
    async getAllStuffInfo() {
      const { total, rows } = await getAllStuffInfo(this.queryInfo)
      this.stuffList = rows
      this.queryInfo.total = total
    },
    pageChange(val) {
      this.queryInfo.page = val
      this.getAllStuffInfo()
    },
    hireTypeFormat(row, column, cellValue, index) {
      const obj = EmployeesEnum.hireType.find(item => item.id === cellValue)
      return obj ? obj.value : 'unknown' // cellValue即单元格的值
    },
    async handleDelete(row) {
      try {
        await this.$confirm('确定删除该员工信息吗', '提示', {
          cancelButtonText: '取消',
          confirmButtonText: '确定',
          type: 'warning'
        })
        await deleteStuffInfo(row.id)
        this.getAllStuffInfo()
        this.$message.success('删除成功')
      } catch (err) {
        this.$message.info('已取消操作')
      }
    },
    async handleExport() {
      const headerMap = {
        '手机号': 'mobile',
        '姓名': 'username',
        '入职日期': 'timeOfEntry',
        '聘用形式': 'formOfEmployment',
        '转正日期': 'correctionTime',
        '工号': 'workNumber',
        '部门': 'departmentName'
      }
      const { rows } = await getAllStuffInfo({ page: 1, size: this.queryInfo.total })
      const data = this.formatData(headerMap, rows)
      // console.log(data)
      import('@/vendor/Export2Excel').then(excel => {
        excel.export_json_to_excel({
          multiHeader: [['手机', '主要信息', '', '', '', '', '部门']],
          merges: ['A1:A2', 'B1:F1', 'G1:G2'],
          header: Object.keys(headerMap),
          data,
          filename: 'filename'
        })
      })
    },
    formatData(header, list) {
      return list.map(item => {
        // ['手机号','姓名'...]，还要处理时间跟聘用形式
        return Object.keys(header).map(key => {
          // ['138...','ZS'...]
          if (header[key] === 'timeOfEntry' || header[key] === 'correctionTime') {
            return formatDate(item[header[key]])
          }
          if (header[key] === 'formOfEmployment') {
            const type = this.EmployeesEnum.hireType.find(obj => obj.id === item[header[key]])
            return type ? type.value : 'unknown' // 需要判断找到了没！
          }
          return item[header[key]]
        })
      })
    },
    showQrCode(url) {
      if (url) {
        this.isQrCodeShow = true
        // <!-- 把url转换为二维码 -->，但是！！！组件更新是异步的，拿不到组件实例
        this.$nextT(() => {
          // 确认有DOM元素了，再进行二维码转换
          QrCode.toCanvas(this.$refs.canvasRef, url)
        })
      } else {
        this.$message.info('该用户暂未上传图片')
      }
    }
  }

}
</script>

<style lang="scss" scoped>

</style>
