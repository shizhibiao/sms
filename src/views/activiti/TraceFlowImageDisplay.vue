<template>
  <div class="animated fadeIn">
    <b-card no-body>
      <div slot="header">
        流程执行跟踪图
        <button class="btn btn-info btn-sm float-right mt-1 ml-1" @click="$router.back(-1)"><i class="fa fa-backward"></i> 返回</button>
      </div>
      <b-card-body>
        <img :src="imgSrv"/>
      </b-card-body>
    </b-card>
  </div>
</template>

<script>
  export default {
    name: 'TraceFlowImageDisplay',
    data () {
      return {
        procInstId: '',
        imgSrv: ''
      }
    },
    created () {
      this.procInstId = this.$route.params.id
      if (process.env.NODE_ENV === 'production') {
        this.imgSrv = 'http://' + window.location.hostname + ':' + window.location.port + '/api/flowimage/trace/' + this.procInstId
      } else {
        // this.imgSrv = 'http://47.98.173.73:8080/flowimage/trace/' + this.procInstId
        this.imgSrv = 'http://127.0.0.1:8080/api/flowimage/trace/' + this.procInstId
      }
    }
  }
</script>

<style scoped>

</style>
