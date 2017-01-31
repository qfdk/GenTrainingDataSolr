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
          <label for="fl">fl : </label>
          <input  @blur="search" @keyup.enter="search" type="text" class="form-control" v-model:value="fl">
        </div>
      </div>
      <br>
      <div class="form-inline">
        <div class="form-group">
          <label for="model">model : </label>
          <input  @blur="search" @keyup.enter="search" type="text" class="form-control" v-model:value="model">
        </div>
        <div class="form-group">
          <label for="reRankDocs">reRankDocs : </label>
          <input  @blur="search" @keyup.enter="search" type="number" class="form-control" v-model:value="reRankDocs">
        </div>
        <button @click="search" type="button" class="btn btn-primary"><span class="glyphicon glyphicon-sort" aria-hidden="true"></span> Compare</button>
      </div>
    </div>
    <hr>
    <!-- <test :columns="columns" :data="docs" :sort-column="columns"></test> -->
    <p class="alert alert-warning text-center" v-show="!isFinish">No result found</p>
    <div class="row" v-show="isFinish">
      <div class="col-xs-5">
        <h4> <span class="label label-success">Apache Solr</span></h4>
        <v-client-table :data="solr" :columns="columns_solr" :options="options"></v-client-table>
        <!-- <mytable
        :data="solr"
        :columns="columns_solr"></mytable> -->
      </div>

      <div class="col-xs-7">
        <h4> <span class="label label-info">Apache Solr with LTR</span></h4>
        <!-- <mytable
        :data="docs"
        :columns="columns"></mytable> -->
        <v-client-table :data="docs" :columns="columns" :options="options"></v-client-table>
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
      model:'jouvemodel',
      fl:'score,name_txt_en,[features]',
      reRankDocs:'5',
      solr:[],
      docs:[],
      columns:[],
      columns_solr:[],
      isFinish:false,
      options:{
        filterable:false,
        childRowKey:'id'
      }
    }
  },
  components:{
    mytable
  },
  computed:{
    rq:function()
    {
      return '{!ltr model='+this.model+' reRankDocs='+this.reRankDocs+'}'
    }
  },
  methods: {
    sortByKey(array, key){
      return array.sort(function(a, b) {
        var x = a[key]; var y = b[key];
        return ((x < y) ? -1 : ((x > y) ? 1 : 0));
      });
    },
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
            this.columns.unshift('_num')
            this.docs.forEach(function(e,index){
              e['_num']=index+1
            },this)
            // copy array !!!
            this.solr=JSON.parse(JSON.stringify(json.docs));
            this.columns.forEach(function(e){
              if(e!=='[features]')
              {
                this.columns_solr.push(e)
              }
            },this);

            this.solr.forEach(function(e){
              var feature = e['[features]']
              var orignalScore = feature.split(',')[0].split('=')[1]
              e['score']=orignalScore
            },this)

            this.sortByKey(this.solr,'socre')

            this.solr.forEach(function(e,index){
              e['_num']=index+1
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
