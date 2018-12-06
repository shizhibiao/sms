<template>
  <div class="animated fadeIn">
    <b-card no-body>
      <div slot="header">
        {{procDef.name}}
        <button class="btn btn-info btn-sm float-right mt-1 ml-1" @click="$router.back(-1)"><i class="fa fa-backward"></i> 返回</button>
      </div>
      <b-card-body>
        <img :src="imgSrv"/>
      </b-card-body>
    </b-card>
  </div>
</template>

<script>
  import axios from 'axios'

  export default {
    name: 'ImageDisplay',
    data () {
      return {
        defId: '',
        procDef: {},
        imgSrv: ''

      }
    },
    methods: {
      getDeployed (id) {
        axios.get('/api/activiti/procdef/' + id)
          .then(response => {
            let data = response.data
            if (data && data.error === 0) {
              this.procDef = data.data
              if (this.procDef) {
                if (process.env.NODE_ENV === 'production') {
                  this.imgSrv = 'http://' + window.location.hostname + ':' + window.location.port + '/api/flowimage/jpbm.png?fileName=' + this.procDef.diagramResourceName
                } else {
                  // this.imgSrv = 'http://47.98.173.73:8080/flowimage/jpbm.png?fileName=' + this.procDef.diagramResourceName
                  this.imgSrv = 'http://127.0.0.1:8080/api/flowimage/jpbm.png?fileName=' + this.procDef.diagramResourceName
                }
              }
            }
          })
      }
    },
    created () {
      this.defId = this.$route.params.id
      this.getDeployed(this.defId)
    }
  }
</script>

<style scoped>

</style>
