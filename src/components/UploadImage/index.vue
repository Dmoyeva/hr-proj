<template>
  <div>
    <el-upload
      action="#"
      list-type="picture-card"
      :on-preview="handlePictureCardPreview"
      :on-remove="handleRemove"
      :limit="1"
      :file-list="fileList"
      :class="{ display: isIconShow }"
      :on-change="handleChange"
      :before-upload="checkImage"
      :http-request="handleUpload"
    >
      <i class="el-icon-plus" />
    </el-upload>
    <el-progress v-if="isProgressShow" style="width: 180px" :percentage="percentage" />
    <el-dialog :visible.sync="dialogVisible" title="图片预览">
      <img width="100%" :src="dialogImageUrl" alt="">
    </el-dialog>
  </div>
</template>
<script>
import COS from 'cos-js-sdk-v5'
const cos = new COS({
  SecretId: 'AKIDQeePvBD1ZFkzCHBtOsFOIwKXVCTkqfDU',
  SecretKey: '5vfOvDUcWAcUDm6NSJwLadT5dz70DEIB'
})
export default {
  data() {
    return {
      fileList: [],
      dialogImageUrl: '',
      dialogVisible: false,
      currentUid: null,
      percentage: 0,
      isProgressShow: false
    }
  },
  computed: {
    isIconShow() {
      return this.fileList.length === 1
    }
  },
  methods: {
    handleRemove(file, fileList) { // fille上传的文件，fileList删除后的fileList
      // this.fileList = fileList
      // 因为组件给fileList做了包装，里面有uid属性
      this.fileList = fileList.filter(img => img.uid !== file.uid)
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url
      this.dialogVisible = true
    },
    handleChange(file, fileList) {
      // 注意此处的问题，因为设置了action为#，导致上传失败，返回的fileList是空的
      // 如果上传成功，返回的fileList是会有结果的
      this.fileList = fileList.map(item => item)
    },
    checkImage(file) {
      const imageType = ['image/jpeg', 'image/png', 'image/bmp', 'image/gif']
      // const typeCheck = imageType.some(item => item === file.type)
      const typeCheck = imageType.includes(file.type)
      const maxSize = 5 * 1024 * 1024
      if (!typeCheck) {
        this.$message.error('仅支持jpg/png/bmp/gif格式文件')
        return false
      }
      if (file.size > maxSize) {
        this.$message.error('图片大小不能超过5MB')
        return false
      }
      // 记录下当前文件的uid便于后续处理添加url地址
      this.currentUid = file.uid
      this.isProgressShow = true
      return true // 最后一定要return true！不然会默认return undefined，导致失败
    },
    handleUpload(params) {
      if (params.file) {
        cos.putObject(
          {
            Bucket: 'dmoyeva-1300941383', /* 填入您自己的存储桶，必须字段 */
            Region: 'ap-chengdu', /* 存储桶所在地域，例如ap-beijing，必须字段 */
            Key: params.file.name, /* 存储在桶里的对象键（例如1.jpg，a/b/test.txt），必须字段 */
            Body: params.file, /* 必须，上传文件对象，可以是input[type="file"]标签选择本地文件后得到的file对象 */
            onProgress: (progressData) => {
              this.percentage = progressData.percent * 100
            }
          },
          (err, data) => {
            // 上传后的回调，处理err或者data
            // console.log(err || data)
            if (!err && data.statusCode === 200) {
              this.fileList = this.fileList.map(item => {
                // 'http://' + data.location 就是线上地址
                if (item.uid === this.currentUid) {
                  // 在这里手动添加了一个uploaded参数，是方便在后续更新的时候判断图片是否上传完毕
                  // 'http://' + data.Location
                  return { url: 'http://' + data.Location, uploaded: true }
                }
                return item
              })
              setTimeout(() => {
                this.isProgressShow = false
              }, 1000)
              this.percentage = 0 // 要重置百分比！！！
            }
          }
        )
      }
    }
  }
}
</script>

<style lang="scss">
.display .el-upload--picture-card {
  display: none;
}
</style>
