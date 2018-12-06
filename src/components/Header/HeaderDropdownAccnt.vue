<template>
      <b-nav-item-dropdown right no-caret>
        <template slot="button-content">
          <img src="static/img/avatars/6.jpg" class="img-avatar" :alt="userName">
        </template>
        <!--<b-dropdown-header tag="div" class="text-center"> &#45;&#45; </b-dropdown-header>-->
        <b-dropdown-divider></b-dropdown-divider>
        <b-dropdown-item><i class="fa fa-user"></i> {{userName}}</b-dropdown-item>
        <b-dropdown-item @click="doLogout()"><i class="fa fa-lock"></i> 退出</b-dropdown-item>
      </b-nav-item-dropdown>
</template>
<script>
  export default {
    name: 'header-dropdown-accnt',
    computed: {
      user () {
        return this.$store.state.user
      },
      userName () {
        let deptName = this.$store.state.user.deptName
        if (deptName && deptName.length > 0) {
          return this.$store.state.user.userName + ' (' + deptName + ')'
        } else {
          return this.$store.state.user.userName
        }
      }
    },
    methods: {
      doLogout () {
        this.$router.push({path: '/login'})
      }
    }
  }
</script>
