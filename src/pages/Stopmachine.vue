<template>
  <div>
    <!-- 面包屑 -->
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/dashboard' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>生产管理</el-breadcrumb-item>
        <el-breadcrumb-item>机器停歇</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <!-- 表格操作 -->
    <div class="container">
      <div class="btn_tools">
        <el-row type="flex">
          <el-col :span="12">
            <el-button @click="newPlanTure" type="success">新建记录</el-button>
          </el-col>
          <el-col :span="12" class="tac">
            <el-col :span="5" class="mr15">
              <el-input placeholder="请输入订单号" v-model="searchOrder"></el-input>
            </el-col>
            <el-col :span="5" class="mr15">
              <el-input placeholder="请输入订单号" v-model="searchOrder"></el-input>
            </el-col>
            <el-col :span="2">
              <el-button type="primary">搜索</el-button>
            </el-col>
          </el-col>
        </el-row>
      </div>
      <div class="table_data">
        <el-table :data="tableData" border style="width: 100%">
          <el-table-column prop="downtime" label="停机时间">
            <template slot-scope="scope">
              <span>{{ scope.row.downtime | dateFormart('yyyy-MM-dd')}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="bootupmaterial" label="开机用了多少原料(kg)"></el-table-column>
          <el-table-column prop="surplusmaterial" label="剩余原料重量(kg)"></el-table-column>
          <el-table-column prop="operator" label="入库员"></el-table-column>
          <el-table-column fixed="right" label="操作" width="100">
            <template slot-scope="scope">
              <el-button type="text" @click="handleClick(scope.row)">编辑</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="pagination">
        <el-pagination
          background
          layout="prev, pager, next"
          :total="totals"
          :current-page="currentPage"
          :page-sizes="[10, 20, 30, 40]"
          :page-size="pagesize"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        ></el-pagination>
      </div>
    </div>
    <el-dialog title="新建记录" :visible.sync="dialogVisible" width="30%">
      <el-form ref="form" :model="form" label-width="150px">
        <el-form-item label="停机时间">
          <el-col>
            <el-date-picker
              style="width:100%"
              type="date"
              placeholder="选择日期"
              v-model="form.downtime"
              value-format="yyyy-MM-dd HH:mm:ss"
            ></el-date-picker>
          </el-col>
        </el-form-item>
        <el-form-item label="开机用了多少原料(kg)">
          <el-input v-model="form.bootupmaterial"></el-input>
        </el-form-item>
        <el-form-item label="剩余原料重量(kg)">
          <el-input v-model="form.materialPackage"></el-input>
        </el-form-item>
        <el-form-item label="操作员">
          <el-input v-model="form.operator"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit">立即创建</el-button>
          <el-button @click=" dialogVisible = false ">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
export default {
  inject: ["reload"],
  data() {
    return {
      totals: null,
      currentPage: 1,
      pagesize: 10,
      tableData: [],
      dialogVisible: false,
      dialogEdit: false,
      searchOrder: "",
      goodsArr: [],
      form: {
        downtime: "",
        bootupmaterial: "",
        surplusmaterial: "",
        operator: ""
      }
    };
  },
  methods: {
    getTableData() {
      const url = `http://106.14.116.17/api/productionplan/list`;
      this.$axios
        .get(url, {
          params: {
            page: this.currentPage,
            limit: this.pagesize
          }
        })
        .then(res => {
          console.log(res);
          if (res.data.code === 0) {
            this.tableData = res.data.page.list;
            this.totals = res.data.page.totalPage;
          } else {
            this.$message.error(res.data.msg);
          }
        });
    },
    // 新建原料入库
    newPlanTure() {
      this.dialogVisible = true;
    },
    // 提交计划
    onSubmit() {
      this.form.orderNum = this.orderNum;
      this.form.productNameSpecs = this.goodsName;
      this.form.goodsId = this.goodsId;
      this.form.gColors = this.dynamicValidateForm.domains;
      console.log(this.form);
      const url = `http://106.14.116.17/api/productionplan/save`;
      this.$axios({
        url: url,
        method: "post",
        //发送格式为json
        data: JSON.stringify(this.form),
        headers: {
          "Content-Type": "application/json"
        }
      }).then(res => {
        console.log(res.data);
        if (res.data.code === 0) {
          this.$message({
            message: res.data.msg,
            type: "success"
          });
          this.reload();
        } else {
          this.$message.error(res.data.msg);
        }
      });
    },
    handleSizeChange(size) {
      this.pagesize = size; //每页下拉显示数据
    },
    handleCurrentChange(currentPage) {
      this.currentPage = currentPage;
      this.getTableData();
    }
  }
};
</script>

<style scoped>
.container {
  margin-top: 8px;
  padding: 15px;
  background: #fff;
  border: 1px solid #ddd;
  border-radius: 5px;
}
.btn_tools {
  margin-bottom: 15px;
}
.pagination {
  margin: 20px 0;
  text-align: right;
}
.ipnut_search {
  display: inline-block;
  width: 140px;
  margin-left: 10px;
}
.tac {
  display: flex;
  justify-content: flex-end;
}
.mr15 {
  margin-right: 15px;
}
</style>