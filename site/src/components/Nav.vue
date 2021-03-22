<template>
  <nav>
    <button type="button" @click="$emit('open', 'help')">
      Help
    </button>
    <button type="button" @click="$emit('open', 'examples')">
      Examples
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
  display: flex;
  flex-wrap: wrap;
  margin: 0 auto;
  padding: 1rem;
  max-width: 800px;
}

button {
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol";
  flex: 1;
  background: #162539;
  color: #f5f5f5;
  font-size: 1rem;
  border: none;
  padding: 0.5rem 1rem;
  font-weight: lighter;
  border-radius: 20rem;
}

button + button {
  margin-left: 0.5rem;
}

.clear {
  color: #cccccc;
  border: 1px solid #162539;
  background: none;
}
</style>
