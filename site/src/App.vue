<template>
  <Nav @open="toggleSection" @clear="clear" />

  <Modal mode="modal" v-if="sections.help" @close="toggleSection('help')">
    <About />
  </Modal>

  <Modal mode="modal" v-if="sections.generate" @close="toggleSection('generate')">
    <Generate />
  </Modal>

  <Modal mode="modal" v-if="sections.examples" @close="toggleSection('examples')">
    <Examples @change="copyBoard" />
  </Modal>

</template>

<script lang="ts">
import { defineComponent, reactive } from 'vue'
import Nav from '@/components/Nav.vue'
import Modal from '@/components/Modal.vue'
import About from '@/components/About.vue'
import Generate from '@/components/Generate.vue'
import Examples from '@/components/Examples.vue'
import { boards } from '@/boards'
import { Tile } from '../../src/solver/base/Tile'

export default defineComponent({
  name: 'App',
  components: { Examples, Generate, About, Modal, Nav },
  setup () {
    const sections = reactive({
      help: false,
      examples: false,
      generate: false
    })

    const toggleSection = (id: keyof typeof sections) => {
      sections[id] = !sections[id]
    }

    const board = reactive<{tiles: Tile[]}>({
      tiles: []
    })

    const clear = () => {
      board.tiles = boards.empty()
    }

    const loadBoard = (name: keyof typeof boards) => {
      board.tiles = boards[name]()
    }

    return {
      toggleSection,
      clear,
      sections,
      loadBoard
    }
  }
})
</script>

<style lang="scss">
body {
  background-color: #1d314b;
  margin: 0;
  color: whitesmoke;
  font-weight: lighter;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol";
}

#app {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
}
</style>
