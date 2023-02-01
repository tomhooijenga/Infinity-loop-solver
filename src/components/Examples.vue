<template>
  <h1 id="examples" class="pt-14 -mt-14">Examples</h1>
  <ExampleBoard
    v-for="[name, data] of boardData"
    :key="name"
    :type="data.type"
    :tiles="data.tiles"
    :width="data.width"
    :height="data.height"
    class="bg-light first-of-type:mt-0 mt-4"
    @click="loadBoard(name)"
  />
</template>

<script setup lang="ts">
import { BoardData, boards } from "@/boards";
import { useBoard } from "@/use-board";
import ExampleBoard from "@/components/ExampleBoard.vue";

const { loadBoard } = useBoard();

const boardData: [keyof typeof boards, BoardData][] = Object
  .entries(boards)
  .map(([name, board]) => [name as keyof typeof boards, board()]);
</script>
