<template>
  <div class="animated fadeIn">
    <b-card no-body>
      <b-card-body>
        <div class="row">
          <div class="col-md-6 col-sm-12">
            <SecurityInfo/>
          </div>
          <div class="col-md-6 col-sm-12">
            <SecurityNotice/>
          </div>
        </div>
      </b-card-body>
    </b-card>
  </div>
</template>

<script>
  import SecurityInfo from "./SecurityInfo";
  import SecurityNotice from "./SecurityNotice";

  export default {
    name: 'BillBoard',
    components: {SecurityNotice, SecurityInfo}
  }
</script>

<style scoped>

</style>
