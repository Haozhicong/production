<template>
  <div>
    <!-- 面包屑 -->
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/dashboard' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>生产管理</el-breadcrumb-item>
        <el-breadcrumb-item>订单信息</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <!-- 表格操作 -->
    <div class="container">
      <div class="btn_tools">
        <el-form :model="formInline" :inline="true" class="demo-form-inline">
          <div style="float: left">
            <el-form-item>
              <el-button @click="examine" type="success">审核</el-button>
            </el-form-item>
          </div>
          <div style="float: right">
            <el-form-item>
              <el-date-picker
                type="date"
                placeholder="选择下单时间"
                v-model="formInline.orderTime"
                value-format="yyyy-MM-dd HH:mm:ss"
              ></el-date-picker>
            </el-form-item>
            <el-form-item>
              <el-select v-model="formInline.status" placeholder="状态查询">
                <el-option label="待审核" value="1"></el-option>
                <el-option label="已审核" value="2"></el-option>
                <el-option label="制作中" value="3"></el-option>
                <el-option label="待发货" value="4"></el-option>
                <el-option label="已发货" value="5"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="searchSubmit">查询</el-button>
            </el-form-item>
          </div>
        </el-form>
      </div>
      <div class="table_data">
        <el-table ref="multipleTable" :data="tableData" border style="width: 100%">
          <el-table-column type="selection" width="50"></el-table-column>
          <el-table-column prop="orderNum" label="订单编号"></el-table-column>
          <el-table-column prop="userName" label="下单用户"></el-table-column>
          <el-table-column prop="orderTime" label="下单时间">
            <template slot-scope="scope">
              <span>{{ scope.row.orderTime | dateFormart('yyyy-MM-dd')}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="deliveryTime" label="交货时间">
            <template slot-scope="scope">
              <span>{{ scope.row.deliveryTime | dateFormart('yyyy-MM-dd')}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="orderType" label="状态">
            <template slot-scope="scope">
              <span v-if="scope.row.orderType == 1">
                <el-tag type="danger">待审核</el-tag>
              </span>
              <span v-if="scope.row.orderType == 2">
                <el-tag type="primary">已审核</el-tag>
              </span>
              <span v-if="scope.row.orderType == 3">
                <el-tag type="warning">制作中</el-tag>
              </span>
              <span v-if="scope.row.orderType == 4">
                <el-tag type="info">待发货</el-tag>
              </span>
              <span v-if="scope.row.orderType == 5">
                <el-tag type="success">已发货</el-tag>
              </span>
            </template>
          </el-table-column>
          <el-table-column prop="receivingAddress" label="收货地址"></el-table-column>
          <el-table-column fixed="right" label="操作" width="100">
            <template slot-scope="scope">
              <el-button @click="handleClick(scope.row)" type="text" size="small">查看</el-button>
              <el-button @click="examine(scope.row)" type="text" size="small">审核</el-button>
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

    <!-- 查看订单商品弹出框 -->
    <el-dialog title="订单信息" :visible.sync="sonDialog" width="73%">
      <!-- 采购商品表头 -->
      <div class="sp_header">
        <el-row>
          <!-- <el-button type="info">信息按钮</el-button>
          <el-button type="warning">警告按钮</el-button>-->
        </el-row>
      </div>
      <div class="sp_table">
        <!-- :summary-method="getSummaries" -->
        <!-- show-summary -->
        <el-table :data="orderShop" border style="width: 100%">
          <el-table-column prop="goodsName" label="商品名称"></el-table-column>
          <el-table-column prop="barCode" label="条形码"></el-table-column>
          <el-table-column prop="itemNumber" label="货号"></el-table-column>
          <el-table-column prop="goods_img" label="图片">
            <template slot-scope="scope">
              <img :src="scope.row.goodsImg" alt />
            </template>
          </el-table-column>
          <el-table-column prop="gColors" label="颜色">
            <template slot-scope="scope">
              <ul>
                <li style v-for="(item, index) in scope.row.gColors " :key="index">{{ item.gnumber}}</li>
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
          <el-table-column prop="grams" label="克重"></el-table-column>
          <el-table-column prop="material" label="网孔"></el-table-column>
          <el-table-column prop="partsContent" label="件含量"></el-table-column>
          <el-table-column prop="unitPrice" label="单价/个"></el-table-column>
          <el-table-column prop="orderQuantities" label="订货数量"></el-table-column>
          <el-table-column prop="remarks" label="备注"></el-table-column>
          <el-table-column prop="packingMethod" label="包装方式"></el-table-column>
          <el-table-column prop="cost" label="金额"></el-table-column>
          <el-table-column prop="goodsWorkshop" label="状态" width="100px">
            <template slot-scope="scope">
              <span v-if="scope.row.goodsWorkshop == 0">
                <el-tag type="warning">未操作</el-tag>
              </span>
              <span v-if="scope.row.goodsWorkshop == 1">
                <el-tag type>生产计划</el-tag>
              </span>
              <span v-if="scope.row.goodsWorkshop == 2">
                <el-tag type="warning">拉网</el-tag>
              </span>
              <span v-if="scope.row.goodsWorkshop == 3">
                <el-tag type="danger">烫绳</el-tag>
              </span>
              <span v-if="scope.row.goodsWorkshop == 4">
                <el-tag type="info">剪料</el-tag>
              </span>
              <span v-if="scope.row.goodsWorkshop == 5">
                <el-tag type="danger">制球车间</el-tag>
              </span>
              <span v-if="scope.row.goodsWorkshop == 6">
                <el-tag type="danger">外发工厂</el-tag>
              </span>
              <span v-if="scope.row.goodsWorkshop == 7">
                <el-tag type="success">包装车间</el-tag>
              </span>
            </template>
          </el-table-column>
          <!-- <el-table-column fixed="right" label="操作" width="100">
           <template slot-scope="scope">
              <el-button @click="handleClick(scope.row)" type="text" size="small">查看</el-button>
              <el-button type="text" size="small">编辑</el-button>
            </template> 
          </el-table-column>-->
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
      formInline: {
        status: "",
        orderTime: ""
      },
      // 订单信息表格
      tableData: [],
      // 订单商品表格
      orderShop: [
        {
          sName: "五节沐浴条",
          sTxm: "6938304704888",
          sHuohao: "YSH-488",
          sColor: "西瓜红配白",
          sWeight: "75g",
          sCaizi: "细网",
          sJhl: 48,
          sPrice: 1.54,
          sNumber: 100,
          sMoney: 7392.0,
          sRemake: "无",
          sDpai: "挂优拾惠吊牌",
          sState: 1
        },
        {
          sName: "润北优加香沐浴花",
          sTxm: "6938304704888",
          sHuohao: "RBY-103",
          sColor: "西瓜红配白",
          sWeight: "50g",
          sCaizi: "细网",
          sJhl: 48,
          sPrice: 1.0,
          sNumber: 50,
          sMoney: 2400.0,
          sRemake: "加香",
          sDpai: "挂润北优吊牌",
          sState: 2
        }
      ],
      // 弹出层
      dialogVisible: false,
      sonDialog: false,
      addOrderInfo: false,
      searchOrder: "",
      // 表单绑定
      form: {
        orderId: "",
        orderTime: "",
        deliveryTime: "",
        address: ""
      }
    };
  },
  created() {
    this.getTableData();
  },
  methods: {
    // 获取订单列表
    getTableData() {
      let url = `http://106.14.116.17/api/purchaseorder/list`;
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
    // 获取商品信息列表
    getSonTableData(orderNum) {
      const url = `http://106.14.116.17/api/goods/list`;
      this.$axios
        .get(url, {
          params: {
            page: this.spCurrentPage,
            limit: this.spPagesize,
            orderNum: orderNum
          }
        })
        .then(res => {
          console.log(res);
          if (res.data.code === 0) {
            this.orderShop = res.data.page.list;
            this.spTotals = res.data.page.totalCount;
          } else {
            this.$message.error(res.data.msg);
          }
        });
    },
    // 审核操作接口
    postExamine(id) {
      const url = `http://106.14.116.17/api/purchaseorder/approvalOrder`;
      const data = {
        id: id,
        orderType: 2
      };
      this.$axios({
        url: url,
        method: "post",
        //发送格式为json
        data: JSON.stringify(data),
        headers: {
          "Content-Type": "application/json"
        }
      }).then(res => {
        console.log(res);
        if (res.data.code === 0) {
          this.$message({
            message: "审核成功",
            type: "success"
          });
          this.reload();
        } else {
          this.$message.error(res.data.msg);
        }
      });
    },
    // 获取商品详情
    handleClick(row) {
      console.log(row);
      this.getSonTableData(row.orderNum);
      this.sonDialog = true;
    },
    // 新建订单信息
    newPlanTure() {
      this.dialogVisible = false;
      this.$message({
        message: "恭喜你，这是一条成功消息",
        type: "success"
      });
    },
    // 查询提交
    searchSubmit() {
      console.log(this.formInline);
    },
    // 合计金额
    getSummaries(param) {
      console.log("--------");
      console.log(param);
      const { columns, data } = param;
      const sums = [];
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = "总价";
          return;
        }
        const values = data.map(item => Number(item[column.property]));
        if (!values.every(value => isNaN(value))) {
          sums[index] = values.reduce((prev, curr) => {
            const value = Number(curr);
            if (!isNaN(value)) {
              return prev + curr;
            } else {
              return prev;
            }
          }, 0);
          sums[index] += " 元";
        } else {
          sums[index] = "N/A";
        }
      });

      return sums;
    },
    // 单击选中行
    // clickHight(row) {
    //   this.$refs.multipleTable.toggleRowSelection(row);
    // },
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
    // 单个审核
    examine(row) {
      console.log(row.id);
      this.$confirm("此操作将审批订单, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.postExamine(row.id);
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消审批"
          });
        });
    },
    // 批量审核
    examines() {
      console.log(this.$refs.multipleTable.selection);
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