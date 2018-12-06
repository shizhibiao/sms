<template>
    <el-table
      :data="postDta"
      style="width: 100%"
      size='small'
     >
     <el-table-column
            fixed
            label='#'
            width='60px'>
            <template slot-scope="scope">
              {{scope.$index + 1}}
            </template>
          </el-table-column>
      <el-table-column
        prop="resDeptName"
        label="责任单位"
           >
      </el-table-column>
      <el-table-column
        prop="resUserName"
        label="责任人"
           >
      </el-table-column>
      <el-table-column
        prop="resType"
        label="责任类型"
           >
      </el-table-column>
      <el-table-column
        v-if="isshow"
        prop="resonAnalysis"
        label="操作">
         <template slot-scope="scope">
        <el-button type="success" size='mini' @click="Newviewss(1, scope.$index, scope.row)">修 改</el-button>
        <el-button type="danger" size='mini' @click="removeeventDOS(scope.$index, scope.row)">删 除</el-button>
      </template>
      </el-table-column>
    </el-table>
</template>
  <script>
    export default {
      props: {
        postDta: Array
      },
      data () {
        return {
          isshow: true
        }
      },
      methods: {
        Newviewss (index, params, array) {
          this.$emit('getevents', index, params, array)
        },
        removeeventDOS (index, params) {
          this.$emit('getremoves', params)
        }
      }
    }
  </script>