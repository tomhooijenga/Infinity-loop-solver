<template>
  <button
    type="button"
    class="disabled:bg-transparent hover:disabled:bg-transparent disabled:cursor-not-allowed disabled:text-white/70 transition-colors rounded-full py-2 px-4"
    :class="{
      'bg-light hover:bg-light/70': variant === 'light',
      'bg-dark hover:bg-dark/70': variant === 'dark',
    }"
  >
    <slot />
  </button>
</template>

<script setup lang="ts">
import { PropType } from "vue";

defineProps({
  variant: {
    type: String as PropType<"dark" | "light">,
    default: "light",
  },
});
</script>
