<template>
  <div>
    <!-- 面包屑 -->
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/dashboard' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>生产管理</el-breadcrumb-item>
        <el-breadcrumb-item>生产计划</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <!-- 表格操作 -->
    <div class="container">
      <div class="btn_tools">
        <el-row type="flex">
          <el-col :span="12">
            <el-button @click="newPlanTure" type="success">新建生产计划</el-button>
          </el-col>
          <el-col :span="12" class="tac">
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
          <el-table-column prop="deliveryTime" label="交货日期">
            <template slot-scope="scope">
              <span>{{ scope.row.deliveryTime | dateFormart('yyyy-MM-dd')}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="userSign" label="车间负责人签字"></el-table-column>
          <el-table-column prop="productNameSpecs" label="品名及规格"></el-table-column>
          <el-table-column prop="gColors" label="颜色">
            <template slot-scope="scope">
              <ul>
                <li style v-for="(item, index) in scope.row.gColors " :key="index">{{ item.gcolor}}</li>
              </ul>
            </template>
          </el-table-column>
          <el-table-column prop="gColors" label="数量">
            <template slot-scope="scope">
              <ul>
                <li style v-for="(item, index) in scope.row.gColors " :key="index">{{ item.gnumber}}</li>
              </ul>
            </template>
          </el-table-column>
          <el-table-column prop="ropeMatching" label="配绳"></el-table-column>
          <el-table-column prop="packingMethod" label="包装方式"></el-table-column>
          <el-table-column prop="packNum" label="每件装箱量（只）"></el-table-column>
          <el-table-column prop="totalQuant" label="总数量（只）"></el-table-column>
          <el-table-column prop="documentaryClerk" label="跟单员"></el-table-column>
          <el-table-column prop="markeOrderTime" label="制单日期">
            <template slot-scope="scope">
              <span>{{ scope.row.markeOrderTime | dateFormart('yyyy-MM-dd')}}</span>
            </template>
          </el-table-column>
          <el-table-column fixed="right" label="操作" width="100">
            <template slot-scope="scope">
              <el-button type="text" @click="editClick(scope.row)">编辑</el-button>
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
    <el-dialog title="新建生产计划单" :visible.sync="dialogVisible" width="70%">
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
                type="date"
                placeholder="选择日期"
                v-model="form.deliveryTime"
                value-format="yyyy-MM-dd HH:mm:ss"
              ></el-date-picker>
            </el-col>
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
        </div>
        <el-form-item label="品名规格">
          <el-input disabled v-model="goodsName"></el-input>
        </el-form-item>
        <el-form-item style="display:none" label="商品ID">
          <el-input v-model="goodsId"></el-input>
        </el-form-item>
        <el-form-item label="配绳">
          <el-input v-model="form.ropeMatching"></el-input>
        </el-form-item>
        <el-form-item label="包装方式">
          <el-input v-model="form.packingMethod"></el-input>
        </el-form-item>
        <el-form-item label="每件装箱子量">
          <el-input v-model="form.packNum"></el-input>
        </el-form-item>
        <el-form-item label="总数量(只)">
          <el-input v-model="form.totalQuant"></el-input>
        </el-form-item>

        <el-form-item label="车间负责人">
          <el-input v-model="form.userSign"></el-input>
        </el-form-item>
        <el-form-item label="跟单员">
          <el-input v-model="form.documentaryClerk"></el-input>
        </el-form-item>

        <el-form-item style="display:block">
          <el-button type="danger" @click="addDomain">新增颜色</el-button>
        </el-form-item>
        <!-- 多颜色, 多数量 -->
        <el-form-item
          style="display:block"
          v-for="(domain, index) in dynamicValidateForm.domains"
          :label="'颜色' + (1 + index)"
          :key="domain.index"
        >
          <el-col :span="8">
            <el-input v-model="domain.gcolor"></el-input>
          </el-col>
          <el-col class="line" :span="4">数量</el-col>
          <el-col :span="8">
            <el-input v-model="domain.gnumber"></el-input>
          </el-col>
          <el-col class="line" :span="4">
            <el-button @click.prevent="removeDomain(domain)">删除</el-button>
          </el-col>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit">立即创建</el-button>
          <el-button @click=" dialogVisible = false ">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <!-- 编辑生产计划弹出框 -->
    <el-dialog title="编辑生产计划单" :visible.sync="editVisible" width="70%">
      <el-form ref="form" :inline="true" :model="form" label-width="110px">
        <div>
          <el-form-item label="订单编号">
            <el-input disabled v-model="form.orderNum"></el-input>
          </el-form-item>
          <el-form-item label="交货时间">
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
        </div>
        <el-form-item label="品名规格">
          <el-input disabled v-model="form.productNameSpecs"></el-input>
        </el-form-item>
        <el-form-item style="display:none" label="商品ID">
          <el-input v-model="form.goodsId"></el-input>
        </el-form-item>
        <el-form-item label="配绳">
          <el-input v-model="form.ropeMatching"></el-input>
        </el-form-item>
        <el-form-item label="包装方式">
          <el-input v-model="form.packingMethod"></el-input>
        </el-form-item>
        <el-form-item label="每件装箱子量">
          <el-input v-model="form.packNum"></el-input>
        </el-form-item>
        <el-form-item label="总数量(只)">
          <el-input v-model="form.totalQuant"></el-input>
        </el-form-item>

        <el-form-item label="车间负责人">
          <el-input v-model="form.userSign"></el-input>
        </el-form-item>
        <el-form-item label="跟单员">
          <el-input v-model="form.documentaryClerk"></el-input>
        </el-form-item>

        <el-form-item style="display:block">
          <el-button type="danger" @click="addDomain">新增颜色</el-button>
        </el-form-item>
        <!-- 多颜色, 多数量 -->
        <el-form-item
          style="display:block"
          v-for="(domain, index) in dynamicValidateForm.domains"
          :label="'颜色' + (1 + index)"
          :key="domain.index"
        >
          <el-col :span="8">
            <el-input v-model="domain.gcolor"></el-input>
          </el-col>
          <el-col class="line" :span="4">数量</el-col>
          <el-col :span="8">
            <el-input v-model="domain.gnumber"></el-input>
          </el-col>
          <el-col class="line" :span="4">
            <el-button @click.prevent="removeDomain(domain)">删除</el-button>
          </el-col>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="editSubmit">编辑提交</el-button>
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
      orderbh: "请输入订单编号",
      dialogVisible: false,
      dialogEdit: false,
      editVisible: false,
      searchOrder: "",
      goodsArr: [],
      // 订单编号
      orderNum: "",
      // 商品名称
      goodsName: "",
      // 商品id
      goodsId: "",
      form: {
        // id: "",
        deliveryTime: "",
        productNameSpecs: "",
        goodsId: "",
        markeOrderTime: "",
        orderNum: "",
        packNum: "",
        packingMethod: "",
        ropeMatching: "",
        totalQuant: "",
        userSign: "",
        documentaryClerk: "",
        gColors: []
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
    // 获取未操作的商品
    nullMake() {
      const url = `http://106.14.116.17/api/goods/getGoodSIdOrderNum`;
      this.$axios
        .get(url, {
          params: {
            goodsWorkShop: 0
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
    // 获取生产计划列表
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
            this.totals = res.data.page.totalCount;
          } else {
            this.$message.error(res.data.msg);
          }
        });
    },
    // 新建计划
    newPlanTure() {
      this.nullMake();
      this.dialogVisible = true;
    },
    // 提交计划
    onSubmit() {
      this.form.orderNum = this.orderNum;
      this.form.productNameSpecs = this.goodsName;
      this.form.goodsId = this.goodsId;
      this.form.gColors = this.dynamicValidateForm.domains;
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
    removeDomain(item) {
      var index = this.dynamicValidateForm.domains.indexOf(item);
      if (index !== -1) {
        this.dynamicValidateForm.domains.splice(index, 1);
      }
    },
    addDomain() {
      this.dynamicValidateForm.domains.push({ key: Date.now() });
    },
    editClick(row) {
      this.editVisible = true;
      this.form.orderNum = row.orderNum;
      this.form.productNameSpecs = row.productNameSpecs;
      this.form.goodsId = row.goodsId;
      this.form.deliveryTime = row.deliveryTime;
      this.form.markeOrderTime = row.markeOrderTime;
      this.form.packNum = row.packNum;
      this.form.packingMethod = row.packingMethod;
      this.form.ropeMatching = row.ropeMatching;
      this.form.totalQuant = row.totalQuant;
      this.form.userSign = row.userSign;
      this.form.documentaryClerk = row.documentaryClerk;
      this.dynamicValidateForm.domains = row.gColors;
      this.form.gColors = this.dynamicValidateForm.domains;
      this.form.id = row.id;
    },
    editSubmit() {
      console.log(this.form);
      const url = `http://106.14.116.17/api/productionplan/update`;
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
          this.form.deliveryTime = "";
          this.form.productNameSpecs = "";
          this.form.goodsId = "";
          this.form.markeOrderTime = "";
          this.form.orderNum = "";
          this.form.packNum = "";
          this.form.packingMethod = "";
          this.form.ropeMatching = "";
          this.form.totalQuant = "";
          this.form.userSign = "";
          this.form.documentaryClerk = "";
          this.dynamicValidateForm.domains = [];
          this.editVisible = false;
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
.line {
  text-align: center;
}
</style>