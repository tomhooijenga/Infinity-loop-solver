<template>
  <div v-bind="$attrs" class="sidebar">
    <div class="examples-background" />
    <div class="nav">
      <button type="button" @click="scrollTo('examples')">Examples</button>
      <button type="button" @click="scrollTo('settings')">Settings</button>
      <button type="button" class="about" @click="about = true">About</button>
    </div>
    <div class="examples">
      <Examples />
      <Settings />
      <Solvers />
    </div>
  </div>

  <Modal v-if="about" @close="about = false">
    <About @close="about = false" />
  </Modal>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
import Settings from "@/components/Settings.vue";
import Examples from "@/components/Examples.vue";
import Modal from "@/components/Modal.vue";
import About from "@/components/About.vue";
import Solvers from "@/components/Solvers.vue";

export default defineComponent({
  name: "Sidebar",
  components: {
    Solvers,
    Examples,
    Settings,
    Modal,
    About,
  },
  setup() {
    const about = ref(false);

    function scrollTo(id: string) {
      document.getElementById(id)?.scrollIntoView({
        behavior: "smooth",
      });
    }

    return {
      scrollTo,
      about,
    };
  },
});
</script>

<style lang="scss" scoped>
@import "@/assets/theme";

.sidebar {
  grid-area: sidebar;
  display: flex;
  flex-direction: column;
  overflow: auto;
}

.nav {
  position: sticky;
  top: 0;
  z-index: 1;
  background: rgba($app-bg, 0.8);
  padding: 1rem;
  display: flex;
  align-items: flex-start;

  button {
    flex-grow: 0;
  }
}

.about {
  margin-left: auto;
}

.examples {
  background-color: $app-bg;
  padding: 1rem;

  @media (max-width: 768px) {
    position: fixed;
    left: 0;
    top: 0;
    bottom: 0;
    width: 60vw;
    z-index: 2;
    transform: translateX(-60vw);
    transition: transform 0.2s ease-in-out;

    &.show {
      transform: translateX(0);
      box-shadow: 0 0 8px rgba(0, 0, 0, 0.33);
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
  background-color: $modal-backdrop-bg;

  @media (max-width: 768px) {
    &.show {
      display: block;
    }
  }
}
</style>
