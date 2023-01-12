<template>
  <el-card class="bar-container">
    <el-row type="flex" justify="space-between" align="middle" style="height: 60px">
      <el-col>
        <div v-if="leftShow" class="left">
          <i class="el-icon-info" />
          <slot name="left" />
        </div>
      </el-col>
      <el-col>
        <el-row type="flex" justify="end" align="middle">
          <slot name="right" />
        </el-row>
      </el-col>
    </el-row>
  </el-card>
</template>

<script>
export default {
  props: {
    leftShow: {
      type: Boolean,
      default: false
    }
  }

}
</script>

<style lang="scss" scoped>
.bar-container {
  margin: 10px 0;
    .left {
      line-height: 34px;
    i {
      margin-right: 5px;
      color: #409eff;
    }
    display: inline-block; // 依据内容决定宽度，而不是占满左边的分区
    padding: 0px 10px;
    border-radius: 3px;
    border: 1px solid rgba(145, 213, 255, 1);
    background: rgba(230, 247, 255, 1);
  }
}

</style>
