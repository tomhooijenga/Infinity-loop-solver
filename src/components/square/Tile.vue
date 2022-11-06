<template>
  <svg viewBox="-50 -50 100 100">
    <template v-if="tile.type === 'None'">
      <circle r="2" class="fill-red" />
    </template>

    <template v-else-if="tile.type === 'End'">
      <circle r="25" class="fill-transparent stroke-red stroke-[6px]" />
      <path
        d="M 0 -25 L 0 -50"
        class="fill-transparent stroke-red stroke-[6px]"
      />
    </template>

    <template v-else-if="tile.type === 'Line'">
      <path
        d="M 0 -50 L 0 50"
        class="fill-transparent stroke-red stroke-[6px]"
      />
    </template>

    <template v-else-if="tile.type === 'Turn'">
      <path
        class="fill-transparent stroke-red stroke-[6px]"
        d="M 0 -50 A50,50 0 0,0 50,0"
      />
    </template>

    <template v-else-if="tile.type === 'Junction'">
      <path
        class="fill-transparent stroke-red stroke-[6px]"
        d="M 0 -50 A50,50 0 0,0 50,0"
      />
      <path
        class="fill-transparent stroke-light stroke-[10px]"
        d="M0,50 a50,50 0 0,1 50,-50"
      />
      <path
        class="fill-transparent stroke-red stroke-[6px]"
        d="M0,50 a50,50 0 0,1 50,-50"
      />
    </template>

    <template v-else-if="tile.type === 'Cross'">
      <path
        class="fill-transparent stroke-light stroke-[10px]"
        d="M0,50 a50,50 0 0,1 50,-50"
      />
      <path
        class="fill-transparent stroke-red stroke-[6px]"
        d="M 0 -50 A50,50 0 0,0 50,0"
      />

      <path
        class="fill-transparent stroke-light stroke-[10px]"
        d="M0,50 a50,50 0 0,1 50,-50"
      />
      <path
        class="fill-transparent stroke-red stroke-[6px]"
        d="M0,50 a50,50 0 0,1 50,-50"
      />

      <path
        class="fill-transparent stroke-light stroke-[10px]"
        d="M-50,0 a50,50 0 0,1 50,50"
      />
      <path
        class="fill-transparent stroke-red stroke-[6px]"
        d="M-50,0 a50,50 0 0,1 50,50"
      />

      <path
        class="fill-transparent stroke-light stroke-[10px]"
        d="M-50,0 a50,50 0 0,0 50,-50"
      />
      <path
        class="fill-transparent stroke-red stroke-[6px]"
        d="M-50,0 a50,50 0 0,0 50,-50"
      />
    </template>
  </svg>
</template>

<script setup lang="ts">
import { Tile } from "@/lib/base/Tile";

defineProps<{ tile: Tile }>();
</script>
