<template>
  <h1>What am I looking at?</h1>
  <p>This is a solver and generator for the <a href="http://loopgame.co/" target="_blank">&infin; Loop</a> game.</p>

  <h1>What can I do?</h1>
  <p>Create and solve your own, or check it out with one of the examples!</p>
  <dl>
    <dt>Settings</dt>
    <dd>Control the parameters of the board.</dd>
    <dt>Generate</dt>
    <dd>Fill your board with a random pattern.</dd>
    <dt>Clear</dt>
    <dd>Remove all tiles and reset to 3&times;3.</dd>
  </dl>
  <dl>
    <dt>Scramble</dt>
    <dd>Rotate each tile in a random direction.</dd>
    <dt>Solve</dt>
    <dd>Try to solve the board.</dd>
  </dl>
  <button type="button" @click="$emit('close')">Close</button>
</template>

<script>
export default {
  name: 'About'
}
</script>

<style scoped>
h1:first-of-type {
  margin-top: 0;
}

dl {
  display: grid;
  grid-template-columns: 80px 1fr;
}

dt {
  width: 80px;
  text-align: right;
  font-weight: bold;
}

dd {
  margin-left: 1rem;
}

button {
  margin: 0 auto;
  display: block;
}
</style>
