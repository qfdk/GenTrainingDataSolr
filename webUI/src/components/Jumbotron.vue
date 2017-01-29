<template>
  <div class="jumbotron">
    <div class="container">
      <h1>GenTrainingDataSolr</h1>
      <p>A simple tool to generate training data for Apache Solr</p>
      <pre># To enable LTR</br>> solr start -Dsolr.ltr.enabled=true</pre>
      <a class="btn btn-primary" href="./static/conf/solrconfig.xml">solrconfig.xml</a>
    </div>
  </div>
</template>

<script>

export default {
  name: "jumbotron",
  data(){
    return {
      //Component Data
      example: true,
      foo: "bar"
    }
  },
  methods: {
    functionExample(){
      //Basic Component method
    }
  }
}
</script>
