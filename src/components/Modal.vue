<template>
  <transition
    appear
    enter-active-class="transition-opacity"
    leave-active-class="transition-opacity"
    enter-from-class="opacity-0"
    leave-to-class="opacity-0"
  >
    <div
      class="fixed z-10 inset-0 transition-opacity flex justify-center items-center bg-white/20"
      @click.self="$emit('close')"
    >
      <div class="w-auto max-w-[800px] m-8 p-8 rounded bg-dark shadow">
        <slot> default body </slot>
      </div>
    </div>
  </transition>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "Modal",

  emits: ["close"],
});
</script>
