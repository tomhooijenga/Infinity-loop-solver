<template>
  <div>
    <div class="vertical"></div>
  </div>
</template>

<script>
export default {
  name: 'Line'
}
</script>

<style scoped>
.vertical {
  position: absolute;
  top: 0;
  left: 50%;
  margin-left: -3px;
  width: 6px;
  height: 100%;
  background: #861e32;
}
</style>
