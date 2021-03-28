<template>
  <transition name="modal" appear>
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

<style scoped>
  .modal-backdrop {
    position: fixed;
    z-index: 9998;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(255, 255, 255, 0.2);
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
    transition: all 0.3s ease;
    font-family: Helvetica, Arial, sans-serif;
    border: 1px solid #162539;
    background-color: #162539;
    padding: 1rem;
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
