<template>
  <transition appear name="modal">
    <div class="modal-backdrop" @click.self="$emit('close')">
      <div class="modal-body">
        <slot>
          default body
        </slot>
      </div>
    </div>
  </transition>
</template>

<script>
export default {
  name: 'Modal'
}
</script>

<style lang="scss" scoped>
@import "@/assets/theme";

.modal-backdrop {
  position: fixed;
  z-index: 9998;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: $modal-backdrop-bg;
  transition: opacity 0.3s ease;
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal-body {
  width: auto;
  max-width: 800px;
  margin: 2rem;
  border-radius: 2px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.33);
  background-color: $modal-bg;
  padding: 2rem;
  box-sizing: border-box;
}

.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.2s ease-in-out;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}
</style>
