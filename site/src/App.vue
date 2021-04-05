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
@import "@/assets/global";
</style>
