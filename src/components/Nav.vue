<template>
  <nav>
    <button type="button" @click="about = true">About</button>
    <button type="button" @click="$emit('generate')">Generate</button>
  </nav>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
import Modal from "@/components/Modal.vue";
import About from "@/components/About.vue";

export default defineComponent({
  name: "Nav",

  setup() {
    const about = ref(false);

    return {
      about,
    };
  },
});
</script>

<style scoped lang="scss">
nav {
  text-align: center;
  padding: 1rem;
  position: relative;

  @media (max-width: 768px) {
    padding-left: 0.5rem;
    padding-right: 0.5rem;
  }
}

button {
  @media (max-width: 768px) {
    padding-left: 0.5rem;
    padding-right: 0.5rem;
  }
}

.examples {
  display: none;

  @media (max-width: 768px) {
    display: initial;
  }
}

.clear {
  color: #cccccc;
  border: 1px solid #162539;
  background: none;
}
</style>
