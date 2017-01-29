<template lang="html">
  <div class="index">
    <jumbotron :isShow=false msg="Compare"></jumbotron>
    <ltr></ltr>
  </div>
</template>

<script>
import jumbotron from './Jumbotron'
import ltr from './Ltr'
export default {
  name:'index',
  components: {
    jumbotron,
    ltr
  },
  data(){
    return {
    }
  },
  methods:{
  }
}
</script>
