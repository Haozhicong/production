<template>
  <div>
    <!-- 面包屑 -->
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/dashboard' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>生产管理</el-breadcrumb-item>
        <el-breadcrumb-item>订单配送</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <!-- 表格操作 -->
    <div class="container">
      <div class="btn_tools">
        <el-row type="flex">
          <el-col :span="12">
            <el-button @click="newPlanTure()" type="success">新建运货单</el-button>
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
          <el-table-column prop="supplier" label="供应商"></el-table-column>
          <el-table-column prop="receivingAddress" label="收货地址"></el-table-column>
          <el-table-column prop="deliveryTime" label="发货时间">
            <template slot-scope="scope">
              <span>{{ scope.row.deliveryTime | dateFormart('yyyy-MM-dd')}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="contacts" label="联系人"></el-table-column>
          <el-table-column prop="contactsPhone" label="联系电话"></el-table-column>
          <el-table-column prop="consignor" label="发货人"></el-table-column>
          <el-table-column prop="deliverer" label="送货人"></el-table-column>
          <el-table-column prop="consignee" label="收货人"></el-table-column>
          <el-table-column prop="type" label="状态">
            <template slot-scope="scope">
              <span v-if="scope.row.type == 0">
                <el-tag type="danger">未送货</el-tag>
              </span>
              <span v-if="scope.row.type == 1">
                <el-tag type="primary">已送货</el-tag>
              </span>
            </template>
          </el-table-column>
          <el-table-column fixed="right" label="操作">
            <template slot-scope="scope">
              <el-button @click="watchInfo(scope.row)" type="text" size="small">查看</el-button>
              <el-button type="text" size="small">编辑</el-button>
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
    <el-dialog title="新建运货单" :visible.sync="dialogVisible" width="70%">
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
        <el-form-item style="display: none;" label="商品ID">
          <el-input v-model="goodsId"></el-input>
        </el-form-item>
        <el-form-item label="供应商">
          <el-input v-model="form.supplier"></el-input>
        </el-form-item>
        <el-form-item label="收货地址">
          <el-input v-model="form.receivingAddress"></el-input>
        </el-form-item>
        <el-form-item label="发货日期">
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
        <el-form-item label="联系人">
          <el-input v-model="form.contacts"></el-input>
        </el-form-item>
        <el-form-item label="联系电话">
          <el-input v-model="form.contactsPhone"></el-input>
        </el-form-item>
        <el-form-item label="发货人">
          <el-input v-model="form.consignor"></el-input>
        </el-form-item>
        <el-form-item label="送货人">
          <el-input v-model="form.deliverer"></el-input>
        </el-form-item>
        <el-form-item label="收货人">
          <el-input v-model="form.consignee"></el-input>
        </el-form-item>
      </el-form>
      <div class="make" style="margin-bottom: 15px;">
        <el-tag>发货信息录入</el-tag>
      </div>
      <div class="makeInput">
        <el-form :inline="true" :model="staffName" label-width="110px">
          <!-- <el-form-item label="货号">
            <el-input v-model="staffName.itemNumber"></el-input>
          </el-form-item>-->
          <el-form-item label="品名">
            <el-input v-model="staffName.goodsName"></el-input>
          </el-form-item>
          <el-form-item label="产品规格">
            <el-input v-model="staffName.specs"></el-input>
          </el-form-item>
          <el-form-item label="箱数(箱)">
            <el-input v-model="staffName.boxNum"></el-input>
          </el-form-item>
          <el-form-item label="装箱数">
            <el-input v-model="staffName.boxingNum"></el-input>
          </el-form-item>
          <el-form-item label="数量(包)">
            <el-input v-model="staffName.packNum"></el-input>
          </el-form-item>
          <el-form-item label="立方数">
            <el-input v-model="staffName.cubeNum"></el-input>
          </el-form-item>
          <el-form-item label="生产日期">
            <el-col>
              <el-date-picker
                style="width:100%"
                type="date"
                placeholder="选择日期"
                v-model="staffName.productionDate"
                value-format="yyyy-MM-dd HH:mm:ss"
              ></el-date-picker>
            </el-col>
          </el-form-item>
          <el-form-item label="备注">
            <el-input v-model="staffName.note"></el-input>
          </el-form-item>
          <el-form-item style="display:block">
            <el-button type="primary" @click="saveInfo">保存商品信息</el-button>
          </el-form-item>
        </el-form>
      </div>
      <div class="table_data">
        <el-table :data="staffTable" border style="width: 100%">
          <el-table-column prop="itemNumber" label="货号"></el-table-column>
          <el-table-column prop="goodsName" label="品名"></el-table-column>
          <el-table-column prop="specs" label="产品规格"></el-table-column>
          <el-table-column prop="boxNum" label="箱数(箱)"></el-table-column>
          <el-table-column prop="boxingNum" label="装箱数"></el-table-column>
          <el-table-column prop="packNum" label="数量(包)"></el-table-column>
          <el-table-column prop="cubeNum" label="立方数(包)"></el-table-column>
          <el-table-column prop="productionDate" label="生产日期">
            <template slot-scope="scope">
              <span>{{ scope.row.productionDate | dateFormart('yyyy-MM-dd')}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="note" label="备注"></el-table-column>
        </el-table>
      </div>
      <div class="bot_btn" style="margin-top:15px">
        <el-button @click="submitInfo" type="success">提交商品信息</el-button>
      </div>
    </el-dialog>

    <!-- 新建拉网损耗弹出框 -->
    <el-dialog title="人员信息详情" :visible.sync="personInfo" width="70%">
      <!-- 拉网损耗弹表头 -->
      <div class="sp_header">
        <el-row>
          <el-button type="primary">成功确定</el-button>
          <el-button type="info">信息按钮</el-button>
          <el-button type="warning">警告按钮</el-button>
        </el-row>
      </div>
      <div class="sp_table">
        <el-table :data="detailInfo" border style="width: 100%">
          <el-table-column prop="orderNum" label="订单编号"></el-table-column>
          <el-table-column prop="goodsName" label="品名"></el-table-column>
          <el-table-column prop="specs" label="规格"></el-table-column>
          <el-table-column prop="boxNum" label="箱数"></el-table-column>
          <el-table-column prop="boxingNum" label="装箱数"></el-table-column>
          <el-table-column prop="packNum" label="数量(包)"></el-table-column>
          <el-table-column prop="cubeNum" label="立方数"></el-table-column>
          <el-table-column prop="shippedBoxNum" label="已发货箱数"></el-table-column>
          <el-table-column prop="unshippedBoxNum" label="未发货箱数"></el-table-column>
          <el-table-column prop="note	" label="备注"></el-table-column>
          <el-table-column prop="state" label="状态">
            <template slot-scope="scope">
              <span v-if="scope.row.state == 0">
                <el-tag type="danger">未发货</el-tag>
              </span>
              <span v-if="scope.row.state == 1">
                <el-tag type="primary">未发完</el-tag>
              </span>
              <span v-if="scope.row.state == 2">
                <el-tag type="warning">已发完</el-tag>
              </span>
            </template>
          </el-table-column>
          <el-table-column prop="productionDate" label="生产日期">
            <template slot-scope="scope">
              <span>{{ scope.row.productionDate | dateFormart('yyyy-MM-dd')}}</span>
            </template>
          </el-table-column>
          <el-table-column fixed="right" label="操作" width="100">
            <template slot-scope="scope">
              <el-button type="text" @click="editRow(scope.row)" size="small">编辑</el-button>
              <el-button type="text" @click="sendGoods(scope.row)" size="small">发货</el-button>
            </template>
          </el-table-column>
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
      staffTable: [],
      detailInfo: [],
      searchOrder: "",
      orderbh: "请输入订单编号",
      dialogVisible: false,
      addLossDialog: false,
      personInfo: false,
      // 订单编号
      orderNum: "",
      // 商品名称
      goodsName: "",
      // 商品id
      goodsId: "",
      goodsArr: [],
      form: {
        orderNum: "",
        consignor: "",
        contactsPhone: "",
        supplier: "",
        deliveryTime: "",
        contacts: "",
        deliverer: "",
        consignee: "",
        receivingAddress: "",
        infoEntity: []
      },
      staffName: {
        orderNum: "",
        goodsId: "",
        goodsName: "",
        // itemNumber: "",
        specs: "",
        boxNum: "",
        boxingNum: "",
        packNum: "",
        cubeNum: "",
        productionDate: "",
        note: "",
        state: ""
      }
    };
  },
  created() {
    this.getTableData();
  },
  methods: {
    // 获取订单拉网步骤商品
    getGoods() {
      const url = `http://106.14.116.17/api/purchaseorder/queryOrderNumTyep`;
      this.$axios({
        url: url,
        method: "post",
        //发送格式为json
        data: JSON.stringify({
          orderType: 4
        }),
        headers: {
          "Content-Type": "application/json"
        }
      }).then(res => {
        console.log(res);
        if (res.data.code === 0) {
          this.goodsArr = res.data.data;
        } else {
          this.$message.error(res.data.msg);
        }
      });
    },
    // 获取包装列表数据
    getTableData() {
      const url = `http://106.14.116.17/api/deliverynote/list`;
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
    watchInfo(row) {
      console.log(row);
      this.personInfo = true;
      const url = `http://106.14.116.17/api/deliverynoteinfo/list`;
      this.$axios
        .get(url, {
          params: {
            page: this.spCurrentPage,
            limit: this.spPagesize,
            deliveryId: row.id
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
    // 发货接口
    sendGoods(row) {
      const url = `http://106.14.116.17/api/deliverynoteinfo/update`;
      this.$prompt("请输发货数量(箱)", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消"
      })
        .then(({ value }) => {
          this.$axios({
            url: url,
            method: "post",
            //发送格式为json
            data: JSON.stringify({
              shippedBoxNum: value,
              id: row.id
            }),
            headers: {
              "Content-Type": "application/json"
            }
          }).then(res => {
            console.log(res);
            if (res.data.code === 0) {
              this.$message({
                message: res.data.msg,
                type: "success",
                onClose: () => {
                  this.watchInfo();
                }
              });
            } else {
              this.$message.error(res.data.msg);
            }
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "取消输入"
          });
        });
    },
    // 新建计划
    newPlanTure() {
      this.getGoods();
      this.dialogVisible = true;
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
      this.staffName.goodsId = this.goodsId;
      this.staffName.orderNum = this.orderNum;
      this.staffName.goodsName = this.goodsName;
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
    // 员工信息录入
    saveInfo() {
      console.log(this.staffName);
      this.staffTable.push(this.staffName);
      this.staffName = {};
    },
    // 提交员工信息
    submitInfo() {
      this.form.orderNum = this.orderNum;
      this.staffName.goodsName = this.goodsName;
      this.staffName.goodsId = this.goodsId;
      this.form.infoEntity = this.staffTable;
      console.log(this.form);
      const url = `http://106.14.116.17/api/deliverynote/save`;
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
            message: "新建成功",
            type: "success"
          });
          this.reload();
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