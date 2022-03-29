<template>
  <div class="w-1/5 shrink-0 overflow-y-auto">
    <div class="sticky top-0 z-10 p-2 bg-dark/70 flex">
      <Button @click="scrollTo('examples')">Examples</Button>
      <Button class="ml-2" @click="scrollTo('settings')">Settings</Button>
      <Button class="ml-auto" @click="about = true">About</Button>
    </div>

    <div class="p-4">
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
import Button from "@/components/Button.vue";
import Settings from "@/components/Settings.vue";
import Examples from "@/components/Examples.vue";
import Modal from "@/components/Modal.vue";
import About from "@/components/About.vue";
import Solvers from "@/components/Solvers.vue";

export default defineComponent({
  name: "Sidebar",
  components: {
    Button,
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