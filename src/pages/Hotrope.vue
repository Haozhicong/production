<template>
  <div>
    <!-- 面包屑 -->
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/dashboard' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>生产管理</el-breadcrumb-item>
        <el-breadcrumb-item>订单烫绳</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <!-- 表格操作 -->
    <div class="container">
      <div class="btn_tools">
        <el-row type="flex">
          <el-col :span="12">
            <el-button @click="newPlanTure()" type="success">新建烫绳</el-button>
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
          <el-table-column prop="orderNum" label="订单编号" width="150px"></el-table-column>
          <el-table-column prop="userSign" label="负责人"></el-table-column>
          <el-table-column prop="productNameSpecs" label="品名及规格"></el-table-column>
          <el-table-column prop="varietyRope" label="品种绳子"></el-table-column>
          <el-table-column prop="gColors" label="绳子颜色">
            <template slot-scope="scope">
              <ul>
                <li style v-for="(item, index) in scope.row.gColors " :key="index">{{ item.gcolor}}</li>
              </ul>
            </template>
          </el-table-column>
          <el-table-column prop="gColors" label="绳子个数">
            <template slot-scope="scope">
              <ul>
                <li style v-for="(item, index) in scope.row.gColors " :key="index">{{ item.gnumber}}</li>
              </ul>
            </template>
          </el-table-column>
          <el-table-column prop="lengthRope" label="绳子长度（公分）"></el-table-column>
          <el-table-column prop="numRopes" label="绳子数量"></el-table-column>
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
              <el-button @click="editClick(scope.row)" type="text" size="small">编辑</el-button>
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
    <!--新建烫绳计划弹出框 -->
    <el-dialog title="新建烫绳计划" :visible.sync="dialogVisible" width="70%">
      <el-form ref="form" :inline="true" :model="form" label-width="110px">
        <div>
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
        </div>
        <div>
          <el-form-item label="品名及规格">
            <el-input disabled v-model="goodsName"></el-input>
          </el-form-item>
          <el-form-item style="display:none" label="商品ID">
            <el-input v-model="goodsId"></el-input>
          </el-form-item>
          <el-form-item label="品种绳子">
            <el-input v-model="form.varietyRope"></el-input>
          </el-form-item>
          <el-form-item label="绳子长度(公分)">
            <el-input v-model="form.lengthRope"></el-input>
          </el-form-item>
          <el-form-item label="绳子数量">
            <el-input v-model="form.numRopes"></el-input>
          </el-form-item>
          <el-form-item label="车间负责人">
            <el-input v-model="form.userSign"></el-input>
          </el-form-item>
          <el-form-item label="跟单员">
            <el-input v-model="form.documentaryClerk"></el-input>
          </el-form-item>
        </div>
        <div>
          <div>
            <el-form-item>
              <el-button type="danger" @click="addDomain">新增颜色</el-button>
            </el-form-item>
          </div>
          <!-- 多颜色, 多数量 -->
          <el-form-item
            style="display:block"
            v-for="(domain, index) in dynamicValidateForm.domains"
            :label="'绳子颜色' + (1 + index)"
            :key="domain.index"
          >
            <el-col :span="8">
              <el-input v-model="domain.gcolor"></el-input>
            </el-col>
            <el-col class="line" :span="4">绳子个数</el-col>
            <el-col :span="8">
              <el-input v-model="domain.gnumber"></el-input>
            </el-col>
            <el-col class="line" :span="4">
              <el-button @click.prevent="removeDomain(domain)">删除</el-button>
            </el-col>
          </el-form-item>
        </div>
        <el-form-item>
          <el-button type="primary" @click="onSubmit">立即创建</el-button>
          <el-button>取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>

    <!--编辑烫绳计划弹出框 -->
    <el-dialog title="编辑烫绳计划" :visible.sync="editVisible" width="70%">
      <el-form ref="form" :inline="true" :model="form" label-width="110px">
        <div>
          <el-form-item label="订单编号">
            <el-input disabled v-model="form.orderNum"></el-input>
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
        </div>
        <div>
          <el-form-item label="品名及规格">
            <el-input disabled v-model="form.productNameSpecs"></el-input>
          </el-form-item>
          <el-form-item style="display:none" label="商品ID">
            <el-input v-model="form.goodsId"></el-input>
          </el-form-item>
          <el-form-item label="品种绳子">
            <el-input v-model="form.varietyRope"></el-input>
          </el-form-item>
          <el-form-item label="绳子长度(公分)">
            <el-input v-model="form.lengthRope"></el-input>
          </el-form-item>
          <el-form-item label="绳子数量">
            <el-input v-model="form.numRopes"></el-input>
          </el-form-item>
          <el-form-item label="车间负责人">
            <el-input v-model="form.userSign"></el-input>
          </el-form-item>
          <el-form-item label="跟单员">
            <el-input v-model="form.documentaryClerk"></el-input>
          </el-form-item>
        </div>
        <div>
          <div>
            <el-form-item>
              <el-button type="danger" @click="addDomain">新增颜色</el-button>
            </el-form-item>
          </div>
          <!-- 多颜色, 多数量 -->
          <el-form-item
            style="display:block"
            v-for="(domain, index) in dynamicValidateForm.domains"
            :label="'绳子颜色' + (1 + index)"
            :key="domain.index"
          >
            <el-col :span="8">
              <el-input v-model="domain.gcolor"></el-input>
            </el-col>
            <el-col class="line" :span="4">绳子个数</el-col>
            <el-col :span="8">
              <el-input v-model="domain.gnumber"></el-input>
            </el-col>
            <el-col class="line" :span="4">
              <el-button @click.prevent="removeDomain(domain)">删除</el-button>
            </el-col>
          </el-form-item>
        </div>
        <el-form-item>
          <el-button type="primary" @click="editSumbitClick()">立即创建</el-button>
          <el-button @click="editVisible = false">取消</el-button>
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
      tableData: [],
      sunhaoTable: [],
      searchOrder: "",
      orderbh: "请输入订单编号",
      dialogVisible: false,
      lossDialog: false,
      editVisible: false,
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
        lengthRope: "",
        varietyRope: "",
        numRopes: "",
        userSign: "",
        deliveryTime: "",
        markeOrderTime: "",
        documentaryClerk: "",
        gColors: ""
      },
      dynamicValidateForm: {
        domains: [
          {
            gcolor: "",
            gnumber: ""
          }
        ]
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
            goodsWorkShop: 2
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
      const url = `http://106.14.116.17/api/orderironing/list`;
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
    // 编辑事件
    editClick(row) {
      this.editVisible = true;
      this.form.deliveryTime = row.deliveryTime;
      this.form.documentaryClerk = row.documentaryClerk;
      this.dynamicValidateForm.domains = row.gColors;
      this.form.gColors = this.dynamicValidateForm.domains;
      this.form.goodsId = row.goodsId;
      this.form.id = row.id;
      this.form.lengthRope = row.lengthRope;
      this.form.markeOrderTime = row.markeOrderTime;
      this.form.numRopes = row.numRopes;
      this.form.orderNum = row.orderNum;
      this.form.productNameSpecs = row.productNameSpecs;
      this.form.userSign = row.userSign;
      this.form.varietyRope = row.varietyRope;
    },
    // 编辑提交事件
    editSumbitClick() {
      const url = `http://106.14.116.17/api/orderironing/update`;
      this.$axios({
        url: url,
        method: "post",
        //发送格式为json
        data: JSON.stringify(this.form),
        headers: {
          "Content-Type": "application/json"
        }
      }).then(res => {
        if (res.data.code === 0) {
          this.editVisible = false;
          this.form.goodsId = "";
          this.form.orderNum = "";
          this.form.productNameSpecs = "";
          this.form.lengthRope = "";
          this.form.varietyRope = "";
          this.form.numRopes = "";
          this.form.userSign = "";
          this.form.deliveryTime = "";
          this.form.markeOrderTime = "";
          this.form.documentaryClerk = "";
          this.form.gColors = "";
          this.dynamicValidateForm.domains = [];
          this.$message({
            message: "修改成功",
            type: "success",
            onClose: () => {
              this.getTableData();
            }
          });
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
      this.form.gColors = this.dynamicValidateForm.domains;
      console.log(this.form);
      const url = `http://106.14.116.17/api/orderironing/save`;
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
    },
    sphandleSizeChange(size) {
      this.spPagesize = size; //每页下拉显示数据
    },
    sphandleCurrentChange(currentPage) {
      this.spCurrentPage = currentPage;
      this.getSunHaoTable();
    },
    removeDomain(item) {
      var index = this.dynamicValidateForm.domains.indexOf(item);
      if (index !== -1) {
        this.dynamicValidateForm.domains.splice(index, 1);
      }
    },
    addDomain() {
      this.dynamicValidateForm.domains.push({ key: Date.now() });
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
.line {
  text-align: center;
}
</style>