<template>
  <Modal v-if="sections.help" mode="modal" @close="toggleSection('help')">
    <About/>
  </Modal>

  <Modal v-if="sections.generate" mode="modal" @close="toggleSection('generate')">
    <Generate/>
  </Modal>

  <div class="examples">
    <Examples @change="loadBoard"/>
  </div>
  <Nav class="nav" @clear="clear" @open="toggleSection"/>
  <Board :board-data="board" class="board"/>
</template>

<script lang="ts">
import { defineComponent, reactive, ref } from 'vue'
import Nav from '@/components/Nav.vue'
import Modal from '@/components/Modal.vue'
import About from '@/components/About.vue'
import Generate from '@/components/Generate.vue'
import Examples from '@/components/Examples.vue'
import { BoardData, boards } from '@/boards'
import Board from '@/components/Board.vue'

export default defineComponent({
  name: 'App',
  components: { Board, Examples, Generate, About, Modal, Nav },
  setup () {
    const sections = reactive({
      help: false,
      examples: false,
      generate: false
    })

    const toggleSection = (id: keyof typeof sections) => {
      sections[id] = !sections[id]
    }

    const board = ref<BoardData>(boards.robot())

    const clear = () => {
      board.value = boards.empty()
    }

    const loadBoard = (name: keyof typeof boards) => {
      board.value = boards[name]()
    }

    loadBoard('ends')

    return {
      toggleSection,
      clear,
      sections,
      loadBoard,
      board
    }
  }
})
</script>

<style lang="scss" scoped>
.row {
  display: flex;
  flex: 1;
}

.examples {
  grid-area: sidebar;
  background: #162539;
  overflow: auto;
}

.nav {
  grid-area: nav;
}
</style>

<style lang="scss">
body {
  background-color: #1d314b;
  margin: 0;
  color: whitesmoke;
  font-weight: lighter;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol";
}

#app {
  height: 100vh;
  display: grid;
  grid-template-areas: "sidebar nav" "sidebar board" "sidebar controls";
  grid-template-columns: min(30vw, 400px) 1fr;
  grid-template-rows: auto 1fr auto;
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
</style>
