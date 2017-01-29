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
      <div class="col-xs-6">
        <h4> <span class="label label-success">Apache Solr</span></h4>
        <table class="table">
          <thead id="thead_solr">
            <th  v-if="column!='[features]'" v-for="column in columns">{{column}}</th>
          </thead>
          <tbody>
            <tr v-for="item in solr">
              <td v-if="v!='[features]'" v-for="(k, v) in item" v-text="k"></td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="col-xs-6">
        <h4> <span class="label label-info">Apache Solr with LTR</span></h4>
        <table class="table">
          <thead id="thead_ltr">
            <th v-for="column in columns">{{column}}</th>
          </thead>
          <tbody>
            <tr v-for="item in docs">
              <td v-for="(k, v) in item" v-text="k"></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script>

export default {
  name: "ltr",
  data(){
    return {
      url:'http://localhost:8983/solr/corejouve',
      query:'skirt',
      rq:'{!ltr model=jouvemodel reRankDocs=5}',
      fl:'score,name_txt_en,[features]',
      docs:[],
      solr:[],
      columns:'',
      isFinish:false
    }
  },
  methods: {
    search(){
      this.docs=[]
      this.solr=[]
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
textarea{
  min-height: 345px;
  border-color: rgba(82, 168, 236, 0.8);
  box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.1), 0 0 8px rgba(82, 168, 236, 0.6);
}
</style>
