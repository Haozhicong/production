<template>
  <div>
    <!-- 面包屑 -->
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/dashboard' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>生产管理</el-breadcrumb-item>
        <el-breadcrumb-item>订单制作</el-breadcrumb-item>
        <el-breadcrumb-item>订单外发</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <!-- 表格操作 -->
    <div class="container">
      <div class="btn_tools">
        <el-row type="flex">
          <el-col :span="12">
            <el-button @click="newPlanTure()" type="success">订单外发</el-button>
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
          <el-table-column prop="orderNum" label="订单编号"></el-table-column>
          <el-table-column prop="userSign" label="负责人"></el-table-column>
          <el-table-column prop="requirement" label="产品名称"></el-table-column>
          <!-- <el-table-column prop="productNameSpecs" label="品名及规格"></el-table-column> -->
          <el-table-column prop="issuesCount" label="产品发出数量"></el-table-column>
          <el-table-column prop="harvestTime" label="实收时间">
             <template slot-scope="scope">
              <span>{{ scope.row.harvestTime | dateFormart('yyyy-MM-dd')}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="harvestCount" label="实收数量"></el-table-column>
          <el-table-column prop="deliveryTime" label="交货日期">
            <template slot-scope="scope">
              <span>{{ scope.row.deliveryTime | dateFormart('yyyy-MM-dd')}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="documentaryClerk" label="跟单员"></el-table-column>
          <el-table-column prop="markeOrderTime" label="制单日期">
            <template slot-scope="scope">
              <span>{{ scope.row.markeOrderTime | dateFormart('yyyy-MM-dd')}}</span>
            </template>
          </el-table-column>
          <el-table-column fixed="right" label="操作">
            <template slot-scope="scope">
              <el-button @click="handleClick(scope.row)" type="text" size="small">编辑</el-button>
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
    <!-- 新建生产计划弹出框 -->
    <el-dialog title="新建外发计划" :visible.sync="dialogVisible" width="30%">
      <el-form ref="form" :model="form" label-width="110px">
        <el-form-item label="订单编号">
          <el-select @change="selectGet" style="width:100%" v-model="goodsId" placeholder="请选择">
            <el-option
              v-for="item in goodsArr"
              :key="item.id"
              :label="item.orderNum"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="品名及规格">
          <el-input disabled v-model="goodsName"></el-input>
        </el-form-item>
        <el-form-item style="display:none" label="商品ID">
          <el-input v-model="goodsId"></el-input>
        </el-form-item>
        <el-form-item label="外发工厂">
          <el-input v-model="form.exportfactory"></el-input>
        </el-form-item>
        <el-form-item label="产品要求">
          <el-input v-model="form.requirement"></el-input>
        </el-form-item>
        <el-form-item label="产品工价">
          <el-input v-model="form.productPrice"></el-input>
        </el-form-item>
        <el-form-item label="产品发出数量">
          <el-input v-model="form.issuesCount"></el-input>
        </el-form-item>
        <el-form-item label="实收时间">
          <el-col>
            <el-date-picker
              style="width:100%"
              value-format="yyyy-MM-dd HH:mm:ss"
              type="date"
              placeholder="选择日期"
              v-model="form.harvestTime"
            ></el-date-picker>
          </el-col>
        </el-form-item>
        <el-form-item label="实收数量">
          <el-input v-model="form.harvestCount"></el-input>
        </el-form-item>
        <el-form-item label="车间负责人">
          <el-input v-model="form.userSign"></el-input>
        </el-form-item>
        <el-form-item label="交货时间">
          <el-col>
            <el-date-picker
              style="width:100%"
              value-format="yyyy-MM-dd HH:mm:ss"
              type="date"
              placeholder="选择日期"
              v-model="form.deliveryTime"
            ></el-date-picker>
          </el-col>
        </el-form-item>
        <el-form-item label="跟单员">
          <el-input v-model="form.documentaryClerk"></el-input>
        </el-form-item>
        <el-form-item label="制单日期">
          <el-col>
            <el-date-picker
              style="width:100%"
              value-format="yyyy-MM-dd HH:mm:ss"
              type="date"
              placeholder="选择日期"
              v-model="form.markeOrderTime"
            ></el-date-picker>
          </el-col>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit">立即创建</el-button>
          <el-button>取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>

    <!-- 新建拉网损耗弹出框 -->
    <el-dialog title :visible.sync="lossDialog" width="70%">
      <!-- 拉网损耗弹表头 -->
      <div class="sp_header">
        <el-row>
          <el-button @click="addLossDialog = true" type="success">增加损耗</el-button>
          <el-button type="primary">成功确定</el-button>
          <el-button type="info">信息按钮</el-button>
          <el-button type="warning">警告按钮</el-button>
        </el-row>
      </div>
      <div class="sp_table">
        <el-table :data="tableData" border style="width: 100%">
          <el-table-column prop="orderId" label="订单编号"></el-table-column>
          <el-table-column prop="orderTime" label="订单数量"></el-table-column>
          <el-table-column prop="deliveryTime" label="工作人员"></el-table-column>
          <el-table-column prop="address" label="生产时间"></el-table-column>
          <el-table-column prop="address" label="损耗原因"></el-table-column>
          <el-table-column prop="address" label="损耗数量"></el-table-column>
          <el-table-column prop="address" label="每班产量"></el-table-column>
          <el-table-column prop="address" label="跟单员"></el-table-column>
          <el-table-column prop="address" label="制单日期"></el-table-column>
          <el-table-column prop="address" label="备注"></el-table-column>
          <el-table-column fixed="right" label="操作" width="100">
            <template slot-scope="scope">
              <el-button @click="handleClick(scope.row)" type="text" size="small">查看</el-button>
              <el-button type="text" size="small">编辑</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-dialog>

    <!-- 添加损耗单 -->
    <el-dialog title="新建生产计划单" :visible.sync="addLossDialog" width="30%">
      <el-form ref="form" :model="form" label-width="80px">
        <el-form-item label="订单编号">
          <el-input v-model="form.orderId"></el-input>
        </el-form-item>
        <el-form-item label="订单数量">
          <el-input v-model="form.pName"></el-input>
        </el-form-item>
        <el-form-item label="工作人员">
          <el-input v-model="form.pColor"></el-input>
        </el-form-item>
        <el-form-item label="生产时间">
          <el-input v-model="form.pRope"></el-input>
        </el-form-item>
        <el-form-item label="损耗原因">
          <el-input v-model="form.pPacking"></el-input>
        </el-form-item>
        <el-form-item label="损耗数量">
          <el-input v-model="form.pNumber"></el-input>
        </el-form-item>
        <el-form-item label="每班产量">
          <el-input v-model="form.pAllCounts"></el-input>
        </el-form-item>
        <el-form-item label="跟单员">
          <el-input v-model="form.pAllCounts"></el-input>
        </el-form-item>
        <el-form-item label="备注">
          <el-input v-model="form.pAllCounts"></el-input>
        </el-form-item>
        <el-form-item label="制单日期">
          <el-col>
            <el-date-picker
              style="width:100%"
              value-format="yyyy-MM-dd HH:mm:ss"
              type="date"
              v-model="form.date"
            ></el-date-picker>
          </el-col>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit">立即创建</el-button>
          <el-button>取消</el-button>
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
      searchOrder: "",
      orderbh: "请输入订单编号",
      dialogVisible: false,
      lossDialog: false,
      addLossDialog: false,
      // 订单编号
      orderNum: "",
      // 商品名称
      goodsName: "",
      // 商品id
      goodsId: "",
      goodsArr: [],
      form: {
        goodsId: "",
        exportfactory:"",
        orderNum: "",
        requirement: "",
        productNameSpecs: "",
        productPrice: "",
        issuesCount: "",
        harvestTime: "",
        harvestCount: "",
        userSign: "",
        deliveryTime: "",
        markeOrderTime: "",
        documentaryClerk: ""
      }
    };
  },
  created() {
    this.getTableData();
  },
  methods: {
    // 获取订单拉网步骤商品
    getGoods() {
      const url = `http://106.14.116.17/api/goods/getGoodSIdOrderNum`;
      this.$axios
        .get(url, {
          params: {
            goodsWorkShop: 5
          }
        })
        .then(res => {
          console.log(res);
          if (res.data.code === 0) {
            this.goodsArr = res.data.resule;
          } else {
            this.$message.error(res.data.msg);
          }
        });
    },
    // 获取拉网列表数据
    getTableData() {
      const url = `http://106.14.116.17/api/orderoutsourc/list`;
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
            this.totals = res.data.page.totalCount;
          } else {
            this.$message.error(res.data.msg);
          }
        });
    },
    handleClick(row) {
      console.log(row);
    },
    // 新建计划
    newPlanTure() {
      this.getGoods();
      this.dialogVisible = true;
    },
    onSubmit() {
      this.form.orderNum = this.orderNum;
      this.form.productNameSpecs = this.goodsName;
      this.form.goodsId = this.goodsId;
      console.log(this.form);
      const url = `http://106.14.116.17/api/orderoutsourc/save`;
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
    // 获取下拉框属性值
    selectGet(vId) {
      let obj = {};
      obj = this.goodsArr.find(item => {
        return item.id === vId;
      });
      this.goodsName = obj.goodsName;
      this.orderNum = obj.orderNum;
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
.sp_header {
  margin-bottom: 15px;
}
.tac {
  display: flex;
  justify-content: flex-end;
}
.mr15 {
  margin-right: 15px;
}
</style>