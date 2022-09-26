<template>
  <svg viewBox="-50 -43.30127018922193 100 86.60254037844386">
    <template v-if="tile.type === 'None'">
      <circle r="2" class="fill-red" cy="14.433756729740644" />
    </template>

    <template v-else-if="tile.type === 'End'">
      <circle
        r="14.433756729740644"
        cy="14.433756729740644"
        class="fill-transparent stroke-red stroke-[6px]"
      />
      <path
        d="M 12.5 7.216878364870321 L 25 0"
        class="fill-transparent stroke-red stroke-[6px]"
      />
    </template>

    <template v-else-if="tile.type === 'Turn'">
      <circle
        r="50"
        cx="50"
        cy="43.30127018922193"
        class="fill-transparent stroke-red stroke-[6px]"
      />
    </template>

    <template v-else-if="tile.type === 'Triangle'">
      <circle
        r="50"
        cx="0"
        cy="-43.30127018922193"
        class="fill-transparent stroke-red stroke-[6px]"
      />

      <circle
        r="50"
        cx="50"
        cy="43.30127018922193"
        class="fill-transparent stroke-light stroke-[10px]"
      />
      <circle
        r="50"
        cx="50"
        cy="43.30127018922193"
        class="fill-transparent stroke-red stroke-[6px]"
      />

      <circle
        r="50"
        cx="-50"
        cy="43.30127018922193"
        class="fill-transparent stroke-light stroke-[10px]"
      />
      <circle
        r="50"
        cx="-50"
        cy="43.30127018922193"
        class="fill-transparent stroke-red stroke-[6px]"
      />
    </template>
  </svg>
</template>

<script setup lang="ts">
import { PropType } from "vue";
import { Tile } from "@/lib/base/Tile";

defineProps({
  tile: {
    type: Object as PropType<Tile>,
    required: true,
  },
});
</script>
