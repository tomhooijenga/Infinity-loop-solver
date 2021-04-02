<template>
  <Modal v-if="sections.about" @close="toggleSection('about')">
    <About @close="toggleSection('about')"/>
  </Modal>

  <Modal v-if="sections.settings" @close="toggleSection('settings')">
    <Settings @close="toggleSection('settings')"/>
  </Modal>

  <div class="examples-background" :class="{show: sections.examples}" @click="toggleSection('examples')"></div>
  <div :class="{show: sections.examples}" class="examples">
    <Examples @change="selectBoard"/>
  </div>

  <Nav class="nav" @open="toggleSection" @generate="generateBoard"/>
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
import { boards } from '@/boards'

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
      about: false,
      settings: false,
      examples: true
    })

    const toggleSection = (id: keyof typeof sections) => {
      sections[id] = !sections[id]
    }

    const { loadBoard, generateBoard } = useBoard()

    loadBoard('heart')

    function selectBoard (board: keyof typeof boards): void {
      loadBoard(board)

      sections.examples = false
    }

    return {
      toggleSection,
      sections,
      selectBoard,
      generateBoard
    }
  }
})
</script>

<style lang="scss" scoped>
.examples {
  grid-area: sidebar;
  overflow: auto;

  @media (max-width: 768px) {
    background: #162539;
    position: fixed;
    left: 0;
    top: 0;
    bottom: 0;
    width: 60vw;
    z-index: 2;
    transform: translateX(-60vw);
    transition: transform .2s ease-in-out;

    &.show {
      transform: translateX(0);
    }
  }
}

.examples-background {
  position: fixed;
  display: none;
  left: 0;
  top: 0;
  bottom: 0;
  right: 0;
  z-index: 1;
  background-color: rgba(255, 255, 255, 0.2);

  @media (max-width: 768px) {
    &.show {
      display: block;
    }
  }
}

.nav {
  grid-area: nav;
}
</style>

<style lang="scss">
// #D3F6F8
// #45D7E2

// #D9E8D1
// #628D4A

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

@media (max-width: 768px) {
  #app {
    grid-template-areas: "nav" "board" "controls";
    grid-template-columns: 1fr;
    grid-template-rows: auto 1fr auto;
  }
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
