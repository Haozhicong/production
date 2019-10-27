<template>
  <div class="container">
    <!--注意：列表这里比较特殊，数据结构比较特殊，第一：接接口的时候让后台按照死数据的数据结构进行传送，第二：每页只显示三种门店-->
    <el-table :data="tableData" border class="ems-table borderstyle" style="width: 100%;">
      <el-table-column prop="deliveryTime" label="商品名称" width="180"></el-table-column>
      <el-table-column prop label="颜色">
        <template slot-scope="scope">
          <ul>
            <li style="border-bottom: 1px solid #EBEEF5;margin:0 -10px;" v-for="(item, index) in scope.row.gColors " :key="index">{{ item.gColor }}</li>
          </ul>
        </template>
      </el-table-column>
      <el-table-column prop label="数量">
        <template slot-scope="scope">
          <ul>
            <li style="border-bottom: 1px solid #EBEEF5;margin:0 -10px;" v-for="(item, index) in scope.row.gColors " :key="index">{{ item.gNumber }}</li>
          </ul>
        </template>
      </el-table-column>
      <el-table-column prop="province" label="月份"></el-table-column>
      <el-table-column prop="room" label="总用量"></el-table-column>
      <el-table-column prop="abbreviation" label="金额（元）"></el-table-column>
      <el-table-column prop="bandwidth" label="金额（元）"></el-table-column>
      <el-table-column prop="flow" label="金额（元）"></el-table-column>
    </el-table>
  </div>
</template>
<script>
export default {
  name: "tableCom",
  data() {
    return {
      tableData: [
        {
          deliveryTime: "2019-10-30 00:00:00",
          gColors: [
            {
              gColor: 1,
              gNumber: 1
            },
            {
              gColor: 2,
              gNumber: 3
            },
            {
              gColor: 3,
              gNumber: 3
            }
          ],
          province: "广东",
          room: "广州双线1",
          abbreviation: "GZ_DB2",
          bandwidth: "10G",
          flow:
            "第一条1G (no latest data,no latest data)第二条1G (no latest data,no latest data)"
        }
      ]
    };
  }
};
</script>