<template>
  <div class="container" id="app">
    <top></top>
    <index></index>
    <bot></bot>
  </div>
</template>

<script>
import top from './components/Header'
import index from './components/Index'
import bot from './components/Footer'

export default {
  name: 'app',
  components: {
    top,
    index,
    bot
  }
}
</script>

<style>

</style>
