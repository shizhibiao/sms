<template>
  <b-card no-body>
         <h1 class="header">
            {{actiontitle}}
        </h1>
        <b-card-body>
            <div class="btnBox" style='text-align:center'>
                <el-button :type="savebtn.type" v-if ='savebtn.bool' @click ='saveBtnAction'>{{savebtn.text}}</el-button>
                <el-button :type="sendbtn.type" v-if ='sendbtn.bool' @click ='startNoticeAction' 
                :disabled='!isDisabled'
                
                >{{sendbtn.text}}</el-button>
                <el-button :type="backbtn.type" v-if ='backbtn.bool'>{{backbtn.text}}</el-button>
            </div>
        </b-card-body>
  </b-card>
</template>
<script>
// import axios from 'axios'
export default{
  data () {
    return {

    }
  },
  props: [
    'actiontitle',
    'sendbtn',
    'backbtn',
    'savebtn',
    'safetyId',
    'taskId',
    'flag',
    'isSave',
    'edit'

  ],
  computed: {
    isDisabled () {
      return this.isSave || this.flag === 0
    }
  },
  methods: {
    saveBtnAction () {
      this.$emit('saveDataHandler')
    },
    startNoticeAction () {
      if (this.safetyId) { // 排除新增页面
        this.$emit('startNotice')
        // 是否编辑  没 修改直接进入 并且保存了
        if (!this.edit || this.isSave) {
          console.log(this.isSave, this.edit)
          console.log('触发了')

          // axios.get('/api/safetynoticeflow/start/' + this.safetyId).then(response => {
          //   console.log(response)
          // })
        } else {
          console.log(this.isSave, this.edit)
          this.$message.error('请先保存')
        }
      }
    }
  },
  mounted () {

  }
}
</script>
<style scoped>

</style>
