<template>
  <div>
    <div class="turn"></div>
  </div>
</template>

<script>
export default {
  name: 'Turn'
}
</script>

<style scoped>
div {
  overflow: hidden;
}
.turn {
  position: absolute;
  bottom: calc(50% - 3px);
  left: calc(50% - 3px);
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  border: 6px solid #861e32;
  border-radius: 100%;
}
</style>
