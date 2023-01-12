import Bar from './Bar'
import UploadExcel from './UploadExcel'

export default {
  install(Vue) {
    Vue.component('Bar', Bar)
    Vue.component('UploadExcel', UploadExcel)
  }
}
