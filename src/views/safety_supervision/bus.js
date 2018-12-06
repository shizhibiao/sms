import Vue from 'vue'
const bus = new Vue({
  data () {
    return {
      jieguo: '',
      queren: '',
      billStatus: ''
    }
  },
  created() {
    this.$on('jieguo',(val)=>{
      this.jieguo = val
    })
    this.$on('queren',(val)=>{
      this.queren = val
    })
    this.$on('saveBill',(val)=>{
      this.billStatus = val
    })
  },
})

export default bus