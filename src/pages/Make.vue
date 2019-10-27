<template>
  <div>
    <!-- 面包屑 -->
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/dashboard' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>生产管理</el-breadcrumb-item>
        <el-breadcrumb-item>订单制作</el-breadcrumb-item>
        <el-breadcrumb-item>订单制球</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <!-- 表格操作 -->
    <div class="container">
      <div class="btn_tools">
        <el-row type="flex">
          <el-col :span="12">
            <el-button @click="newPlanTure()" type="success">新建制球</el-button>
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
          <!-- <el-table-column prop="userSign" label="负责人"></el-table-column> -->
          <el-table-column prop="deliveryTime" label="日期">
            <template slot-scope="scope">
              <span>{{ scope.row.deliveryTime | dateFormart('yyyy-MM-dd')}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="productNameSpecs" label="品名规格"></el-table-column>
          <el-table-column prop="gColor" label="颜色"></el-table-column>
          <el-table-column prop="orderCount" label="订单数量"></el-table-column>
          <el-table-column prop="documentaryClerk" label="跟单员"></el-table-column>
          <el-table-column prop="markeOrderTime" label="制单日期">
            <template slot-scope="scope">
              <span>{{ scope.row.markeOrderTime | dateFormart('yyyy-MM-dd')}}</span>
            </template>
          </el-table-column>
          <el-table-column fixed="right" label="操作">
            <template slot-scope="scope">
              <el-button @click="handleClick(scope.row)" type="text" size="small">查看</el-button>
              <el-button @click="sunhaoClick(scope.row)" type="text" size="small">损耗</el-button>
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
    <!-- 新建制球弹出框 -->
    <el-dialog title="新建制球" :visible.sync="dialogVisible" width="70%">
      <el-form :inline="true" ref="form" :model="form" label-width="110px">
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

        <el-form-item label="颜色">
          <el-input v-model="form.gColor"></el-input>
        </el-form-item>
        <el-form-item label="订单数量">
          <el-input v-model="form.orderCount"></el-input>
        </el-form-item>
        <el-form-item label="日期">
          <el-col>
            <el-date-picker
              style="width:100%"
              type="date"
              placeholder="选择日期"
              v-model="form.deliveryTime"
              value-format="yyyy-MM-dd HH:mm:ss"
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
              type="date"
              placeholder="选择日期"
              v-model="form.markeOrderTime"
              value-format="yyyy-MM-dd HH:mm:ss"
            ></el-date-picker>
          </el-col>
        </el-form-item>
        <!-- <el-form-item>
          <el-button type="primary" @click="onSubmit">立即创建</el-button>
          <el-button>取消</el-button>
        </el-form-item>-->
      </el-form>
      <div class="make" style="margin-bottom: 15px;">
        <el-tag>人员信息录入</el-tag>
      </div>
      <div class="makeInput">
        <el-form :inline="true" :model="staffName" label-width="110px">
          <el-form-item label="人员姓名">
            <el-input v-model="staffName.personnelName"></el-input>
          </el-form-item>
          <el-form-item label="工价">
            <el-input v-model="staffName.labourPrice"></el-input>
          </el-form-item>
          <el-form-item label="数量">
            <el-input v-model="staffName.personnelCount"></el-input>
          </el-form-item>
          <el-form-item label="总价">
            <el-input v-model="staffName.totalPrice"></el-input>
          </el-form-item>
          <el-form-item style="display:block">
            <el-button type="primary" @click="saveInfo">保存员工信息</el-button>
          </el-form-item>
        </el-form>
      </div>
      <div class="table_data">
        <el-table :data="staffTable" border style="width: 100%">
          <el-table-column prop="personnelName" label="人员姓名"></el-table-column>
          <el-table-column prop="labourPrice" label="工价"></el-table-column>
          <el-table-column prop="personnelCount" label="数量"></el-table-column>
          <el-table-column prop="totalPrice" label="总价"></el-table-column>
          <el-table-column fixed="right" label="操作" width="100">
            <template slot-scope="scope">
              <el-button @click="delGoods(scope.$index, staffTable)" type="text" size="small">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="bot_btn" style="margin-top:15px">
        <el-button @click="submitInfo" type="success">提交制球信息</el-button>
      </div>
    </el-dialog>

    <!-- 编辑制球弹出框 -->
    <el-dialog title="编辑制球" :visible.sync="editVisible" width="70%">
      <el-form :inline="true" ref="form" :model="form" label-width="110px">
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

        <el-form-item label="颜色">
          <el-input v-model="form.gColor"></el-input>
        </el-form-item>
        <el-form-item label="订单数量">
          <el-input v-model="form.orderCount"></el-input>
        </el-form-item>
        <el-form-item label="日期">
          <el-col>
            <el-date-picker
              style="width:100%"
              type="date"
              placeholder="选择日期"
              v-model="form.deliveryTime"
              value-format="yyyy-MM-dd HH:mm:ss"
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
              type="date"
              placeholder="选择日期"
              v-model="form.markeOrderTime"
              value-format="yyyy-MM-dd HH:mm:ss"
            ></el-date-picker>
          </el-col>
        </el-form-item>
        <!-- <el-form-item>
          <el-button type="primary" @click="onSubmit">立即创建</el-button>
          <el-button>取消</el-button>
        </el-form-item>-->
      </el-form>
      <div class="make" style="margin-bottom: 15px;">
        <el-tag>人员信息录入</el-tag>
      </div>
      <div class="makeInput">
        <el-form :inline="true" :model="staffName" label-width="110px">
          <el-form-item label="人员姓名">
            <el-input v-model="staffName.personnelName"></el-input>
          </el-form-item>
          <el-form-item label="工价">
            <el-input v-model="staffName.labourPrice"></el-input>
          </el-form-item>
          <el-form-item label="数量">
            <el-input v-model="staffName.personnelCount"></el-input>
          </el-form-item>
          <el-form-item label="总价">
            <el-input v-model="staffName.totalPrice"></el-input>
          </el-form-item>
          <el-form-item style="display:block">
            <el-button type="primary" @click="saveInfo">保存员工信息</el-button>
          </el-form-item>
        </el-form>
      </div>
      <div class="table_data">
        <el-table :data="staffTable" border style="width: 100%">
          <el-table-column prop="personnelName" label="人员姓名"></el-table-column>
          <el-table-column prop="labourPrice" label="工价"></el-table-column>
          <el-table-column prop="personnelCount" label="数量"></el-table-column>
          <el-table-column prop="totalPrice" label="总价"></el-table-column>
          <el-table-column fixed="right" label="操作" width="100">
            <template slot-scope="scope">
              <el-button @click="delGoods(scope.$index, staffTable)" type="text" size="small">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="bot_btn" style="margin-top:15px">
        <el-button @click="submitInfo" type="success">提交制球信息</el-button>
      </div>
    </el-dialog>

    <!-- 查看详情信息 -->
    <el-dialog title="人员信息详情" :visible.sync="details" width="70%">
      <!-- <div class="sp_header">
      </div>-->
      <div class="sp_table">
        <el-table :data="detailInfo" border style="width: 100%">
          <el-table-column prop="personnelName" label="人员姓名"></el-table-column>
          <el-table-column prop="labourPrice" label="工价"></el-table-column>
          <el-table-column prop="personnelCount" label="数量"></el-table-column>
          <el-table-column prop="totalPrice" label="总价"></el-table-column>
        </el-table>
      </div>
      <div class="pagination">
        <el-pagination
          background
          layout="prev, pager, next"
          :total="spTotals"
          :current-page="spCurrentPage"
          :page-sizes="[10, 20, 30, 40]"
          :page-size="spPagesize"
          @size-change="sphandleSizeChange"
          @current-change="sphandleCurrentChange"
        ></el-pagination>
      </div>
    </el-dialog>

    <!-- 新建拉网损耗弹出框 -->
    <el-dialog title :visible.sync="lossDialog" width="70%">
      <!-- 拉网损耗弹表头 -->
      <div class="sp_header">
        <el-row>
          <el-button @click="addLossDialog = true" type="success">增加损耗</el-button>
        </el-row>
      </div>
      <div class="sp_table">
        <el-table :data="sunhaoTable" border style="width: 100%">
          <el-table-column prop="orderNum" width="180px" label="订单编号"></el-table-column>
          <el-table-column prop="orderCount" label="订单数量"></el-table-column>
          <el-table-column prop="personnel" label="工作人员"></el-table-column>
          <el-table-column prop="productionTime" label="生产时间">
            <template slot-scope="scope">
              <span>{{ scope.row.productionTime | dateFormart('yyyy-MM-dd')}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="lossReason" label="损耗原因"></el-table-column>
          <el-table-column prop="lossCount" label="损耗数量"></el-table-column>
          <el-table-column prop="outputShift" label="每班产量"></el-table-column>
          <el-table-column prop="documentaryClerk" label="跟单员"></el-table-column>
          <el-table-column prop="markeOrderTime" label="制单日期">
            <template slot-scope="scope">
              <span>{{ scope.row.markeOrderTime | dateFormart('yyyy-MM-dd')}}</span>
            </template>
          </el-table-column>
          <el-table-column fixed="right" label="操作" width="100">
            <template slot-scope="scope">
              <el-button @click="eidtLossClick(scope.row)" type="text" size="small">编辑</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="pagination">
        <el-pagination
          background
          layout="prev, pager, next"
          :total="shTotals"
          :current-page="shCurrentPage"
          :page-sizes="[10, 20, 30, 40]"
          :page-size="shPagesize"
          @size-change="shhandleSizeChange"
          @current-change="shhandleCurrentChange"
        ></el-pagination>
      </div>
    </el-dialog>

    <!-- 添加损耗单 -->
    <el-dialog title="新建损耗单" :visible.sync="addLossDialog" width="30%">
      <el-form :model="sunhao" label-width="80px">
        <el-form-item label="订单编号">
          <el-input disabled v-model="sunhao.orderNum"></el-input>
        </el-form-item>
        <el-form-item style="display:none;" label="商品ID">
          <el-input v-model="sunhao.goodsId"></el-input>
        </el-form-item>
        <el-form-item label="订单数量">
          <el-input v-model="sunhao.orderCount"></el-input>
        </el-form-item>
        <el-form-item label="工作人员">
          <el-input v-model="sunhao.personnel"></el-input>
        </el-form-item>
        <el-form-item label="生产时间">
          <el-col>
            <el-date-picker
              style="width:100%"
              value-format="yyyy-MM-dd HH:mm:ss"
              type="date"
              v-model="sunhao.productionTime"
            ></el-date-picker>
          </el-col>
        </el-form-item>
        <el-form-item label="损耗原因">
          <el-input v-model="sunhao.lossReason"></el-input>
        </el-form-item>
        <el-form-item label="损耗数量">
          <el-input v-model="sunhao.lossCount"></el-input>
        </el-form-item>
        <el-form-item label="每班产量">
          <el-input v-model="sunhao.outputShift"></el-input>
        </el-form-item>
        <el-form-item label="跟单员">
          <el-input v-model="sunhao.documentaryClerk"></el-input>
        </el-form-item>
        <el-form-item label="制单日期">
          <el-col>
            <el-date-picker
              style="width:100%"
              value-format="yyyy-MM-dd HH:mm:ss"
              type="date"
              v-model="sunhao.markeOrderTime"
            ></el-date-picker>
          </el-col>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="sunhaoSubmit">立即创建</el-button>
          <el-button>取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>

    <!-- 编辑损耗单 -->
    <el-dialog title="编辑损耗单" :visible.sync="editLossDialog" width="30%">
      <el-form :model="sunhao" label-width="80px">
        <el-form-item label="订单编号">
          <el-input disabled v-model="sunhao.orderNum"></el-input>
        </el-form-item>
        <el-form-item style="display:none;" label="商品ID">
          <el-input v-model="sunhao.goodsId"></el-input>
        </el-form-item>
        <el-form-item label="订单数量">
          <el-input v-model="sunhao.orderCount"></el-input>
        </el-form-item>
        <el-form-item label="工作人员">
          <el-input v-model="sunhao.personnel"></el-input>
        </el-form-item>
        <el-form-item label="生产时间">
          <el-col>
            <el-date-picker
              style="width:100%"
              value-format="yyyy-MM-dd HH:mm:ss"
              type="date"
              v-model="sunhao.productionTime"
            ></el-date-picker>
          </el-col>
        </el-form-item>
        <el-form-item label="损耗原因">
          <el-input v-model="sunhao.lossReason"></el-input>
        </el-form-item>
        <el-form-item label="损耗数量">
          <el-input v-model="sunhao.lossCount"></el-input>
        </el-form-item>
        <el-form-item label="每班产量">
          <el-input v-model="sunhao.outputShift"></el-input>
        </el-form-item>
        <el-form-item label="跟单员">
          <el-input v-model="sunhao.documentaryClerk"></el-input>
        </el-form-item>
        <el-form-item label="制单日期">
          <el-col>
            <el-date-picker
              style="width:100%"
              value-format="yyyy-MM-dd HH:mm:ss"
              type="date"
              v-model="sunhao.markeOrderTime"
            ></el-date-picker>
          </el-col>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="editLossSubmit">立即创建</el-button>
          <el-button @click="editLossDialog = false">取消</el-button>
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
      spTotals: null,
      spCurrentPage: 1,
      spPagesize: 10,
      shTotals: null,
      shCurrentPage: 1,
      shPagesize: 10,
      sunhaoTable: [],
      tableData: [],
      staffTable: [],
      detailInfo: [],
      searchOrder: "",
      orderbh: "请输入订单编号",
      dialogVisible: false,
      lossDialog: false,
      addLossDialog: false,
      editVisible: false,
      editLossDialog: false,
      // 订单编号
      orderNum: "",
      // 商品名称
      goodsName: "",
      // 商品id
      goodsId: "",
      goodsArr: [],
      form: {
        goodsId: "",
        orderNum: "",
        productNameSpecs: "",
        gColor: "",
        orderCount: "",
        deliveryTime: "",
        markeOrderTime: "",
        documentaryClerk: "",
        ballPackList: []
      },
      sunhao: {
        goodsId: "",
        lossCount: "",
        lossReason: "",
        orderCount: "",
        orderNum: "",
        outputShift: "",
        personnel: "",
        productionTime: "",
        workshop: "制球",
        workshopId: "",
        markeOrderTime: "",
        documentaryClerk: ""
      },
      staffName: {
        personnelName: "",
        labourPrice: "",
        personnelCount: "",
        totalPrice: "",
        type: 1
      },
      details: false
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
            goodsWorkShop: 4
          }
        })
        .then(res => {
          if (res.data.code === 0) {
            this.goodsArr = res.data.resule;
          } else {
            this.$message.error(res.data.msg);
          }
        });
    },
    getTableData() {
      const url = `http://106.14.116.17/api/orderballmaking/list`;
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
      this.details = true;
      console.log(row);
      const url = `http://106.14.116.17/api/ballpackdeatil/list`;
      this.$axios
        .get(url, {
          params: {
            page: this.spCurrentPage,
            limit: this.spPagesize,
            type: 1,
            pId: row.id
          }
        })
        .then(res => {
          console.log(res);
          if (res.data.code === 0) {
            this.detailInfo = res.data.page.list;
            this.spTotals = res.data.page.totalCount;
          } else {
            this.$message.error(res.data.msg);
          }
        });
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
      const url = `http://106.14.116.17/api/ordercutting/save`;
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
      console.log(obj);
      this.goodsName = obj.goodsName;
      this.orderNum = obj.orderNum;
    },
    handleSizeChange(size) {
      this.pagesize = size; //每页下拉显示数据
    },
    handleCurrentChange(currentPage) {
      this.currentPage = currentPage;
      this.getTableData();
    },
    sphandleSizeChange(size) {
      this.spPagesize = size; //每页下拉显示数据
    },
    sphandleCurrentChange(currentPage) {
      this.spCurrentPage = currentPage;
      this.getSonTable();
    },
    shhandleSizeChange(size) {
      this.shPagesize = size; //每页下拉显示数据
    },
    shhandleCurrentChange(currentPage) {
      this.shCurrentPage = currentPage;
      this.getSunHaoTable();
    },
    // 员工信息录入
    saveInfo() {
      console.log(this.staffName);
      this.staffTable.push(this.staffName);
      this.staffName = {};
    },
    // 提交员工信息
    submitInfo() {
      this.form.orderNum = this.orderNum;
      this.form.productNameSpecs = this.goodsName;
      this.form.goodsId = this.goodsId;
      this.form.ballPackList = this.staffTable;
      console.log(this.form);
      const url = `http://106.14.116.17/api/orderballmaking/save`;
      this.$axios({
        url: url,
        method: "post",
        //发送格式为json
        data: JSON.stringify(this.form),
        headers: {
          "Content-Type": "application/json"
        }
      }).then(res => {
        console.log(res);
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
    // 删除员工信息
    delGoods(index, rows) {
      rows.splice(index, 1);
    },
    // 获取损耗列表
    getSunHaoTable() {
      const url = `http://106.14.116.17/api/materialloss/list`;
      this.$axios
        .get(url, {
          params: {
            page: this.shCurrentPage,
            limit: this.shPagesize,
            workshop: "制球",
            workshopId: this.sunhao.workshopId
          }
        })
        .then(res => {
          console.log(res);
          if (res.data.code === 0) {
            this.sunhaoTable = res.data.page.list;
            this.shTotals = res.data.page.totalCount;
          } else {
            this.$message.error(res.data.msg);
          }
        });
    },
    sunhaoClick(row) {
      this.lossDialog = true;
      this.sunhao.orderNum = row.orderNum;
      this.sunhao.goodsId = row.goodsId;
      this.sunhao.workshopId = row.id;
      this.getSunHaoTable();
    },
    sunhaoSubmit() {
      const url = `http://106.14.116.17/api/materialloss/save`;
      this.$axios({
        url: url,
        method: "post",
        //发送格式为json
        data: JSON.stringify(this.sunhao),
        headers: {
          "Content-Type": "application/json"
        }
      }).then(res => {
        this.addLossDialog = false;
        if (res.data.code === 0) {
          this.$message({
            message: "提交成功",
            type: "success",
            onClose: () => {
              this.sunhao.lossCount = "";
              this.sunhao.lossReason = "";
              this.sunhao.orderCount = "";
              this.sunhao.outputShift = "";
              this.sunhao.personnel = "";
              this.sunhao.productionTime = "";
              this.sunhao.workshop = "制球";
              this.sunhao.markeOrderTime = "";
              this.sunhao.documentaryClerk = "";
              this.getSunHaoTable();
            }
          });
        } else {
          this.$message.error(res.data.msg);
        }
      });
    },
    // 损耗编辑
    eidtLossClick(row) {
      this.editLossDialog = true;
      this.sunhao.goodsId = row.goodsId;
      this.sunhao.lossCount = row.lossCount;
      this.sunhao.lossReason = row.lossReason;
      this.sunhao.orderCount = row.orderCount;
      this.sunhao.orderNum = row.orderNum;
      this.sunhao.outputShift = row.outputShift;
      this.sunhao.personnel = row.personnel;
      this.sunhao.productionTime = row.productionTime;
      this.sunhao.workshop = "制球";
      this.sunhao.workshopId = row.workshopId;
      this.sunhao.markeOrderTime = row.markeOrderTime;
      this.sunhao.documentaryClerk = row.documentaryClerk;
      this.sunhao.id = row.id;
    },
    // 损耗编辑提交
    editLossSubmit() {
      const url = `http://106.14.116.17/api/materialloss/update`;
      this.$axios({
        url: url,
        method: "post",
        //发送格式为json
        data: JSON.stringify(this.sunhao),
        headers: {
          "Content-Type": "application/json"
        }
      }).then(res => {
        if (res.data.code === 0) {
          this.editLossDialog = false;
          this.$message({
            message: "修改成功",
            type: "success",
            onClose: () => {
              this.sunhao.goodsId = "";
              this.sunhao.lossCount = "";
              this.sunhao.lossReason = "";
              this.sunhao.orderCount = "";
              this.sunhao.orderNum = "";
              this.sunhao.outputShift = "";
              this.sunhao.personnel = "";
              this.sunhao.productionTime = "";
              this.sunhao.markeOrderTime = "";
              this.sunhao.documentaryClerk = "";
              this.getSunHaoTable();
            }
          });
        } else {
          this.$message.error(res.data.msg);
        }
      });
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