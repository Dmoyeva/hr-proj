<template>
  <div class="dashboard-container">
    <div class="dashboard-text">name: {{ username }}</div>
    <Bar :left-show="true">
      <template #left>
        click
      </template>
      <template #right>
        <el-button>click</el-button>
        <el-button>click</el-button>
        <el-button>click</el-button>
      </template>
    </Bar>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'Dashboard',
  data() {
    return {
      isLeftShow: true
    }
  },
  computed: {
    ...mapGetters([
      'username'
    ])
  }
}
</script>

<style lang="scss" scoped>
.dashboard {
  &-container {
    margin: 30px;
  }

  &-text {
    font-size: 30px;
    line-height: 46px;
  }
}
</style>
