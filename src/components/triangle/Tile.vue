<template>
  <svg :viewBox="`-50 -${height / 2} 100 ${height}`" class="w-full h-full">
    <template v-if="tile.type === 'None'">
      <circle r="2" class="fill-red" :cy="cy" />
    </template>

    <template v-else-if="tile.type === 'End'">
      <circle
        :r="cy"
        :cy="cy"
        class="fill-transparent stroke-red stroke-[6px]"
      />
      <path
        :d="`M ${Math.cos((Math.PI * 2 * 30) / 360) * cy} ${
          Math.sin((Math.PI * 2 * 30) / 360) * cy
        } L 25 0`"
        class="fill-transparent stroke-red stroke-[6px]"
      />
    </template>

    <template v-else-if="tile.type === 'Turn'">
      <circle
        r="50"
        cx="50"
        :cy="height / 2"
        class="fill-transparent stroke-red stroke-[6px]"
      />
    </template>

    <template v-else-if="tile.type === 'Triangle'">
      <circle
        r="50"
        cx="0"
        :cy="-height / 2"
        class="fill-transparent stroke-red stroke-[6px]"
      />

      <circle
        r="50"
        cx="50"
        :cy="height / 2"
        class="fill-transparent stroke-light stroke-[10px]"
      />
      <circle
        r="50"
        cx="50"
        :cy="height / 2"
        class="fill-transparent stroke-red stroke-[6px]"
      />

      <circle
        r="50"
        cx="-50"
        :cy="height / 2"
        class="fill-transparent stroke-light stroke-[10px]"
      />
      <circle
        r="50"
        cx="-50"
        :cy="height / 2"
        class="fill-transparent stroke-red stroke-[6px]"
      />
    </template>
  </svg>
</template>

<script setup lang="ts">
import { PropType } from "vue";
import { Tile } from "@/lib/base/Tile";

const height = Math.sqrt(100 ** 2 - 50 ** 2);
const cy = (height / 2 + height / 2 - height / 2) / 3;

defineProps({
  tile: {
    type: Object as PropType<Tile>,
    required: true,
  },
});
</script>
