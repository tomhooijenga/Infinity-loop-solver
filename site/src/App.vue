<template>
  <Modal v-if="sections.help" @close="toggleSection('help')">
    <About @close="toggleSection('help')"/>
  </Modal>

  <Modal v-if="sections.generate" @close="toggleSection('settings')">
    <Settings @close="toggleSection('settings')"/>
  </Modal>

  <div class="examples">
    <Examples @change="loadBoard"/>
  </div>
  <Nav class="nav" @clear="clearBoard" @open="toggleSection"/>
  <board-area />
</template>

<script lang="ts">
import { defineComponent, reactive } from 'vue'
import Nav from '@/components/Nav.vue'
import Modal from '@/components/Modal.vue'
import About from '@/components/About.vue'
import Settings from '@/components/Settings.vue'
import Examples from '@/components/Examples.vue'
import BoardArea from '@/components/BoardArea.vue'
import { useBoard } from '@/use-board'

export default defineComponent({
  name: 'App',
  components: {
    BoardArea,
    Examples,
    Settings,
    About,
    Modal,
    Nav
  },
  setup () {
    const sections = reactive({
      help: false,
      examples: false,
      settings: false
    })

    const toggleSection = (id: keyof typeof sections) => {
      sections[id] = !sections[id]
    }

    const { loadBoard, clearBoard } = useBoard()

    loadBoard('heart')

    return {
      toggleSection,
      sections,
      loadBoard,
      clearBoard
    }
  }
})
</script>

<style lang="scss" scoped>
.examples {
  grid-area: sidebar;
  overflow: auto;
}

.nav {
  grid-area: nav;
}
</style>

<style lang="scss">
body {
  background-color: #162539;
  margin: 0;
  color: whitesmoke;
  font-weight: lighter;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol";
}

h1 {
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

a {
  color: whitesmoke;
}

button {
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol";
  flex: 1;
  background: #1d314b;
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