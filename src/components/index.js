import Bar from './Bar'
import UploadExcel from './UploadExcel'
import UploadImage from './UploadImage'

export default {
  install(Vue) {
    Vue.component('Bar', Bar)
    Vue.component('UploadExcel', UploadExcel)
    Vue.component('UploadImage', UploadImage)
  }
}
