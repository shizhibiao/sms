<template>
  <b-nav-item-dropdown right no-caret>
    <template slot="button-content">
      <i class="icon-envelope-letter"></i>
      <b-badge pill variant="info">{{msgCount}}</b-badge>
    </template>
    <div class="dropdown-menu-lg">
      <b-dropdown-header tag="div" class="text-center"><strong>您有{{msgCount}}条消息</strong></b-dropdown-header>
      <b-dropdown-item @click="dealMsg(msg, index)" v-for="(msg, index) in msgList">
        <div class="message">
          <div class="small font-weight-bold text-truncate">{{msg.sysMessageDO.title}}</div>
          <div class="text-right">
            <small>{{msg.sysMessageDO.createTime}}</small>
          </div>
        </div>
      </b-dropdown-item>
      <b-dropdown-item :to="'/home/message'" class="text-center"><strong>查看所有消息</strong></b-dropdown-item>
    </div>
  </b-nav-item-dropdown>
</template>
<script>
  import axios from 'axios'

  export default {
    name: 'header-dropdown-mssgs',
    data: () => {
      return {
      }
    },
    computed: {
      msgList () {
        return this.$store.getters.msgList
      },
      msgCount () {
        return this.$store.getters.msgCount
      }
    },
    methods: {
      dealMsg (msg, index) {
        this.$store.commit('removeMsg', index)
        this.readMessage(msg.id)
        this.$router.push({path: msg.sysMessageDO.sourceUrl})
      },
      readMessage (msgId) {
        axios.get('/api/msg/read?msgId=' + msgId)
          .then(response => {

          })
      }
    },
    created () {

    }
  }
</script>
