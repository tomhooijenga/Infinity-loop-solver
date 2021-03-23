<template>
  <div>
    <div class="dot"></div>
    <div class="vertical"></div>
  </div>
</template>

<script>
export default {
  name: 'End'
}
</script>

<style scoped>
.dot {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate3d(-50%, -50%, 0);
  width: 50%;
  height: 50%;
  border: 6px solid #861e32;
  border-radius: 100%;
  box-sizing: border-box;
}
.vertical {
  position: absolute;
  top: 0;
  left: 50%;
  margin-left: -3px;
  width: 6px;
  height: 25%;
  background: #861e32;
}
</style>
