<template>
  <nav>
    <button type="button" @click="$emit('open', 'help')">
      Help
    </button>
    <button type="button" @click="$emit('open', 'generate')">
      Generate
    </button>
    <button class="clear" type="button" @click="$emit('clear')">
      Clear
    </button>
  </nav>
</template>

<script>
export default {
  name: 'Nav'
}
</script>

<style scoped>
nav {
  border-bottom: 1px solid #162539;
  text-align: center;
  padding: 1rem;
}

.clear {
  color: #cccccc;
  border: 1px solid #162539;
  background: none;
}
</style>
