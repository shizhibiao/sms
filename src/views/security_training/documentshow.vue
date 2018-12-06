<template>
  <div class='animated fadeIn'>
    <b-card no-body>
      <div slot='header'>
        <div class="float-right">
          <el-button size="small" type='success' class='mt-1' v-if="this.flag !== 1"  @click="submitData()" ><i class='fa fa-save'></i> 保存</el-button>
          <el-button size="small" type="primary" class='mt-1' v-if="this.flag === 3" @click="resetInfo()" ><i class='fa fa-refresh'></i> 重置</el-button>
          <el-button size="small" type="info" class='mt-1' @click="$router.back(-1)" ><i class="fa fa-back"></i> 返回</el-button>
        </div>
      </div>
      <b-card-body>
        <el-form :model="securityForm" :rules="rules" ref="securityForm" status-icon size="medium" label-width="120px" inline-message>
          <div class="row">
            <div class="col-lg-4 col-md-6 col-sm-12">
              <el-form-item  label="人员姓名" prop="tscCreatebyName">
                <!--<el-input v-if="this.flag === 2" v-model="securityForm.tscCreatebyName" readonly auto-complete="off"></el-input>-->
                <!--<el-input v-else-if="this.flag === 3" v-model="securityForm.tscCreatebyName" readonly auto-complete="off"></el-input>-->
                <!--<span v-else><strong>{{this.securityForm.tscCreatebyName}}</strong></span>-->
              </el-form-item>
            </div>
            <div class="col-lg-4 col-md-6 col-sm-12">
              <el-form-item label="类型" prop="tscCreatedeptName">
                <!--<el-input v-if="this.flag === 2" v-model="securityForm.tscCreatedeptName" readonly auto-complete="off"></el-input>-->
                <!--<el-input v-else-if="this.flag === 3" v-model="securityForm.tscCreatedeptName" readonly auto-complete="off"></el-input>-->
                <!--<span v-else><strong>{{this.securityForm.tscCreatedeptName}}</strong></span>-->
              </el-form-item>
            </div>
            <div class="col-lg-4 col-md-6 col-sm-12">
              <el-form-item label="人员类型" prop="tscCreatedeptName">
              </el-form-item>
            </div>
            <div class="col-lg-4 col-md-6 col-sm-12">
              <el-form-item label="培训类别" prop="tscCreatedeptName">
              </el-form-item>
            </div>
            <div class="col-lg-4 col-md-6 col-sm-12">
              <el-form-item label="培训类型" prop="tscCreatedeptName">
              </el-form-item>
            </div>
            <div class="col-lg-4 col-md-6 col-sm-12">
              <el-form-item label="是否外委" prop="tscCreatedeptName">
              </el-form-item>
            </div>
            <div class="col-lg-4 col-md-6 col-sm-12">
              <el-form-item label="实施单位" prop="tscCreatedeptName">
              </el-form-item>
            </div>
            <div class="col-lg-4 col-md-6 col-sm-12">
              <el-form-item label="教员" prop="tscCreatedeptName">
              </el-form-item>
            </div>
            <div class="col-lg-4 col-md-6 col-sm-12">
              <el-form-item label="培训地点" prop="tscCreatedeptName">
              </el-form-item>
            </div>
            <div class="col-lg-4 col-md-6 col-sm-12">
              <el-form-item label="开始日期" prop="tscCreatedeptName">
              </el-form-item>
            </div>
            <div class="col-lg-4 col-md-6 col-sm-12">
              <el-form-item label="结束日期" prop="tscCreatedeptName">
              </el-form-item>
            </div>
            <div class="col-lg-4 col-md-6 col-sm-12">
              <el-form-item label="培训方式" prop="tscCreatedeptName">
              </el-form-item>
            </div>
            <div class="col-lg-4 col-md-6 col-sm-12">
              <el-form-item type="textarea" label="培训内容" prop="tscCreatedeptName">
              </el-form-item>
            </div>
            <div class="col-lg-4 col-md-6 col-sm-12">
              <el-form-item  label="考试成绩" prop="tscCreatedeptName">
              </el-form-item>
            </div>
            <div class="col-lg-4 col-md-6 col-sm-12">
              <el-form-item  label="是否获证" prop="tscCreatedeptName">
              </el-form-item>
            </div>
            <div class="col-lg-4 col-md-6 col-sm-12">
              <el-form-item  label="课时" prop="tscCreatedeptName">
              </el-form-item>
            </div>
            <div class="col-lg-4 col-md-6 col-sm-12">
              <el-form-item type="textarea" label="有效期" prop="tscCreatedeptName">
              </el-form-item>
            </div>
          </div>
        </el-form>
        <!-- 附件上传 -->
        <security-notice-adjunct ref='adjunct'></security-notice-adjunct>
      </b-card-body>
    </b-card>
  </div>
</template>

<script>
    import { SecurityNoticeAdjunct } from '../../components/System/security_notice/index.js'
    export default {
      name: 'news_edit',
      components: {
        SecurityNoticeAdjunct
      }
    }
</script>

<style scoped>

</style>
