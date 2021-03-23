<template>
  <div>
    <div class="vertical"></div>
    <div class="horizontal"></div>
  </div>
</template>

<script>
export default {
  name: 'Line'
}
</script>

<style scoped>
  .horizontal {
    position: absolute;
    top: 50%;
    left: 0;
    width: 100%;
    margin-top: -5px;
    height: 6px;
    background: #861e32;
    border: solid #1d314b;
    border-width: 2px 0;
  }
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
