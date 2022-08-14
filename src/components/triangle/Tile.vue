<template>

  <svg viewBox="-50 -43.3015 100 86.603" class="w-full h-full">
    <template v-if="tile.type === 'None'">
      <circle r="2" class="fill-red" />
    </template>
  </svg>
</template>

<script setup lang="ts">
import { PropType } from "vue";
import { Tile } from "@/lib/base/Tile";

defineProps({
  tile: {
    type: Object as PropType<Tile>,
  required: true
  }
})
</script>
