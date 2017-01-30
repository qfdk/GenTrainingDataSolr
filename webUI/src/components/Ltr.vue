<template>
  <div class="ltr">
    <div class="container">
      <div class="form-inline">
        <div class="form-group">
          <label for="url">Solr url : </label>
          <input  @blur="search" @keyup.enter="search" type="text" class="form-control" id="url" v-model:value="url">
        </div>
        <div class="form-group">
          <label for="query">Query : </label>
          <input  @blur="search" @keyup.enter="search" type="text" class="form-control" v-model:value="query">
        </div>
        <div class="form-group">
          <label for="rq">rq : </label>
          <input  @blur="search" @keyup.enter="search" type="text" class="form-control" v-model:value="rq">
        </div>
        <div class="form-group">
          <label for="fl">fl : </label>
          <input  @blur="search" @keyup.enter="search" type="text" class="form-control" v-model:value="fl">
        </div>
        <button @click="search" type="button" class="btn btn-primary"><span class="glyphicon glyphicon-sort" aria-hidden="true"></span> Compare</button>
      </div>
    </div>
    <hr>
    <p class="alert alert-warning text-center" v-show="!isFinish">No result found</p>
    <div class="row" v-show="isFinish">
      <div class="col-xs-5">
        <h4> <span class="label label-success">Apache Solr</span></h4>
      <mytable
        :data="solr"
        :columns="columns_solr"></mytable>
      </div>

      <div class="col-xs-7">
        <h4> <span class="label label-info">Apache Solr with LTR</span></h4>
        <mytable
        :data="docs"
        :columns="columns"></mytable>
      </div>
    </div>
  </div>
</template>

<script>
import mytable from './MyTable'

export default {
  name: "ltr",
  data(){
    return {
      url:'http://localhost:8983/solr/corejouve',
      query:'skirt',
      rq:'{!ltr model=jouvemodel reRankDocs=5}',
      fl:'score,name_txt_en,[features]',
      solr:[],
      docs:[],
      columns:[],
      columns_solr:[],
      isFinish:false
    }
  },
  components:{
    mytable
  },
  methods: {
    search(){
      this.docs=[]
      this.solr=[]
      this.columns_solr=[]
      this.columns=[]

      var fullUrl=this.url+'/select?indent=on&q='+this.query+'&rq='+encodeURI(this.rq)+'&fl='+this.fl+'&wt=json&rows=100';
      this.$http.get(fullUrl).then((data) => {
        var json = JSON.parse(data.body).response
        if('undefined'!==json.docs)
        {
          this.docs = json.docs
          if(this.docs.length>0)
          {
            this.columns=Object.keys(this.docs[0])
            // copy array !!!
            this.solr=JSON.parse(JSON.stringify(json.docs));
            this.columns.forEach(function(e){
              if(e!=='[features]')
              {
                this.columns_solr.push(e)
              }
            },this);
            this.solr.forEach(function(e,index){
              var feature = e['[features]']
              var orignalScore = feature.split(',')[0].split('=')[1]
              e['score']=orignalScore
            },this)
            this.isFinish=true
          }else{
            this.isFinish=false
          }
        }
      }, (error) => {
        this.showModal=true
        this.gen="Something was wrong ... Try to start your Apache solr."
      })
    }
  }
}
</script>

<style>

</style>
