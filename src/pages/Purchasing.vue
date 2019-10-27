<template>
  <div>
    <!-- 面包屑 -->
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/dashboard' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>采购管理</el-breadcrumb-item>
        <el-breadcrumb-item>采购申请</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <!-- 表格操作 -->
    <div class="container">
      <div class="header">
        <div class="goodsTit">基本信息</div>
        <el-form ref="baseInfo" :model="baseInfo" label-width="80px">
          <el-form-item label="订单编号">
            <el-input disabled v-model="baseInfo.orderNum"></el-input>
          </el-form-item>
          <!-- <el-form-item label="合同编号">
            <el-input v-model="baseInfo.contract"></el-input>
          </el-form-item> -->
          <el-form-item label="下单时间">
            <el-col>
              <el-date-picker
                type="date"
                placeholder="选择日期"
                v-model="baseInfo.orderTime"
                style="width: 60%;"
                value-format="yyyy-MM-dd HH:mm:ss"
              ></el-date-picker>
            </el-col>
          </el-form-item>
          <el-form-item label="交货日期">
            <el-col>
              <el-date-picker
                type="date"
                placeholder="选择交货日期"
                v-model="baseInfo.deliveryTime"
                style="width: 60%;"
                value-format="yyyy-MM-dd HH:mm:ss"
              ></el-date-picker>
            </el-col>
          </el-form-item>
          <el-form-item label="收货地址">
            <el-input v-model="baseInfo.receivingAddress" placeholder="请填写收货地址"></el-input>
          </el-form-item>
        </el-form>
      </div>
      <div class="content">
        <div class="goodsTit">商品信息</div>
        <div class="btn_tools">
          <el-row>
            <el-button @click="shopInfo = true" type="success">添加商品</el-button>
          </el-row>
        </div>
        <div class="tables">
          <el-table :data="goodsTable" border style="width: 100%">
            <!-- <el-table-column prop="id" label="商品ID" width></el-table-column> -->
            <el-table-column prop="goodsName" label="商品名称" width></el-table-column>
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
                  <li
                    style
                    v-for="(item, index) in scope.row.gColors "
                    :key="index"
                  >{{ item.gcolor }}</li>
                </ul>
              </template>
            </el-table-column>
            <el-table-column prop="gColors" label="数量">
              <template slot-scope="scope">
                <ul>
                  <li
                    style
                    v-for="(item, index) in scope.row.gColors "
                    :key="index"
                  >{{ item.gnumber}}</li>
                </ul>
              </template>
            </el-table-column>
            <el-table-column prop="grams" label="克重"></el-table-column>
            <el-table-column prop="material" label="网孔"></el-table-column>
            <el-table-column prop="partsContent" label="件含量"></el-table-column>
            <el-table-column prop="unitPrice" label="单价/个"></el-table-column>
            <el-table-column prop="orderQuantities" label="订货数量/件"></el-table-column>
            <el-table-column prop="remarks" label="备注"></el-table-column>
            <el-table-column prop="packingMethod" label="包装方式"></el-table-column>
            <el-table-column prop="cost" label="金额"></el-table-column>
            <el-table-column fixed="right" label="操作">
              <template slot-scope="scope">
                <el-button @click="delGoods(scope.$index, goodsTable)" type="text" size="small">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div class="btn_tools">
          <el-row>
            <el-button type="primary" @click="submitGoods">提交商品</el-button>
          </el-row>
        </div>
      </div>
    </div>
    <!-- 商品信息框 -->
    <el-dialog title="商品信息" :visible.sync="shopInfo" width="70%">
      <el-form :inline="true" :model="goodsInfo" label-width="100px">
        <el-form-item label="甲方品名">
          <el-input v-model="goodsInfo.goodsName"></el-input>
        </el-form-item>
        <el-form-item label="条形码">
          <el-input v-model="goodsInfo.barCode"></el-input>
        </el-form-item>
        <el-form-item label="货号">
          <el-input v-model="goodsInfo.itemNumber"></el-input>
        </el-form-item>
        <el-form-item label="克重">
          <el-input v-model="goodsInfo.grams"></el-input>
        </el-form-item>
        <el-form-item label="网孔">
          <el-input v-model="goodsInfo.material"></el-input>
        </el-form-item>
        <el-form-item label="件含量">
          <el-input v-model="goodsInfo.partsContent"></el-input>
        </el-form-item>
        <el-form-item label="单价/个">
          <el-input v-model="goodsInfo.unitPrice"></el-input>
        </el-form-item>
        <el-form-item label="订货数量/件">
          <el-input v-model="goodsInfo.orderQuantities"></el-input>
        </el-form-item>
        <el-form-item label="备注">
          <el-input v-model="goodsInfo.remarks"></el-input>
        </el-form-item>
        <el-form-item label="包装方式">
          <el-input v-model="goodsInfo.packingMethod"></el-input>
        </el-form-item>
        <el-form-item label="金额">
          <el-input v-model="goodsInfo.cost"></el-input>
        </el-form-item>

        <el-form-item label="图片">
          <el-upload
            class="upload-demo"
            ref="my-upload"
            action="http://106.14.116.17/api/purchaseorder/uploadImg"
            :with-credentials="true"
            :on-success="successFile"
            :on-remove="handleRemove"
            :file-list="fileList"
            list-type="picture"
          >
            <el-button size="small" type="warning">点击上传</el-button>
            <!-- <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div> -->
          </el-upload>
        </el-form-item>
        <el-form-item style="display:block">
          <el-button type="danger" @click="addDomain">新增颜色</el-button>
        </el-form-item>
        <!-- 多颜色, 多数量 -->
        <el-form-item
          style="display:block;"
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
        <el-form-item style="display:block;">
          <el-button type="primary" @click="addGoods">保存</el-button>
          <el-button @click="shopInfo = false">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
// import qs from "qs";
export default {
  inject: ["reload"],
  data() {
    return {
      dynamicValidateForm: {
        domains: [
          {
            gcolor: "",
            gnumber: ""
          }
        ]
      },
      baseInfo: {
        orderNum: "",
        orderTime: "",
        deliveryTime: "",
        receivingAddress: ""
      },
      goodsInfo: {
        goodsName: "",
        barCode: "",
        itemNumber: "",
        gColors: "",
        grams: "",
        material: "",
        partsContent: "",
        unitPrice: "",
        orderQuantities: "",
        cost: "",
        remarks: "",
        packingMethod: "",
        goodsImg: "",
        goodsWorkshop: 0
      },
      goodsTable: [],
      shopInfo: false,
      // 图片路径
      fileList: []
    };
  },
  created() {
    // 生成订单编号
    this.$axios.get("/api/purchaseorder/createOrderCode").then(res => {
      console.log(res);
      this.baseInfo.orderNum = res.data;
    });
  },
  methods: {
    // 添加商品信息
    addGoods() {
      this.goodsInfo.gColors = this.dynamicValidateForm.domains;
      this.goodsTable.push(this.goodsInfo);
      this.clearFiles();
      this.goodsInfo = {};
      this.dynamicValidateForm.domains = [];
      this.shopInfo = false;
    },

    submitGoods() {
      const goodss = {
        orderNum: this.baseInfo.orderNum,
        orderTime: this.baseInfo.orderTime,
        deliveryTime: this.baseInfo.deliveryTime,
        receivingAddress: this.baseInfo.receivingAddress,
        orderType: 1,
        goods: this.goodsTable
      };
      console.log(goodss);
      let url = `http://106.14.116.17/api/purchaseorder/orderRequest`;
      this.$axios({
        url: url,
        method: "post",
        //发送格式为json
        data: JSON.stringify(goodss),
        headers: {
          "Content-Type": "application/json"
        }
      }).then(res => {
        if (res.data.code === 0) {
          this.$message({
            message: "下单成功",
            type: "success"
          });
          this.reload();
        } else {
          this.$message.error(res.data.msg);
        }
      });
    },
    // 删除商品
    delGoods(index, rows) {
      rows.splice(index, 1);
    },

    clearFiles() {
      this.$refs["my-upload"].clearFiles();
    },
    // 图片删除时的钩子
    handleRemove(file, fileList) {
      console.log(1);
      console.log(file, fileList);
    },
    // 图片上传成功时候的钩子
    successFile(file) {
      if (file.code === 0) {
        this.goodsInfo.goodsImg = file.msg;
      } else {
        this.$message.error(file.msg);
      }
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
.header {
  width: 40%;
}

.btn_tools {
  margin: 20px 0;
}
.goodsTit {
  margin-bottom: 20px;
  color: #000;
}
.line {
  text-align: center;
}
</style>