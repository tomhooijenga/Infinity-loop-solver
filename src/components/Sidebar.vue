<template>
  <transition
    appear
    enter-active-class="transition-opacity"
    leave-active-class="transition-opacity"
    enter-from-class="opacity-0"
    leave-to-class="opacity-0"
  >
    <div
      v-if="flyout"
      class="lg:hidden fixed inset-0 z-10 bg-white/20"
      @click="flyout = false"
    ></div>
  </transition>

  <Button
    class="fixed left-4 top-4 lg:hidden"
    variant="dark"
    @click="flyout = true"
  >
    Settings
  </Button>

  <div
    class="fixed left-0 inset-y-0 z-10 shrink-0 lg:translate-x-0 transition bg-dark lg:relative w-min overflow-y-auto"
    :class="{ '-translate-x-full': !flyout, 'translate-x-0': flyout }"
  >
    <div class="sticky top-0 z-10 p-2 bg-dark/70 flex">
      <Button @click="scrollTo('examples')">Examples</Button>
      <Button class="ml-2" @click="scrollTo('settings')">Settings</Button>
      <Button class="ml-6" @click="about = true">About</Button>
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
    const flyout = ref(false);

    const about = ref(false);

    function scrollTo(id: string) {
      document.getElementById(id)?.scrollIntoView({
        behavior: "smooth",
      });
    }

    return {
      flyout,
      about,
      scrollTo,
    };
  },
});
</script>
