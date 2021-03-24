<template>
  <div>
    <div class="turn-top"></div>
    <div class="turn-bottom"></div>
  </div>
</template>

<script>
export default {
  name: 'Junction'
}
</script>

<style scoped>
  div {
    overflow: hidden;
  }
  .turn-top {
    position: absolute;
    bottom: calc(50% - 3px);
    left: calc(50% - 3px);
    width: 100%;
    height: 100%;
    box-sizing: border-box;
    border: 6px solid #861e32;
    border-radius: 100%;
  }
  .turn-bottom {
    position: absolute;
    top: calc(50% - 3px);
    left: calc(50% - 3px);
    width: 100%;
    height: 100%;
    box-sizing: border-box;
    border: 6px solid #861e32;
    border-radius: 100%;
    box-shadow: 0 0 0 3px #1d314b;
  }
</style>
