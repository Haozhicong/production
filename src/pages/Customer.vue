<template>
  <div class="table">
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/dashboard' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>客户管理</el-breadcrumb-item>
        <el-breadcrumb-item>客户列表</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="container">
      <!-- 表头操作 -->
      <div class="handle_box">
        <el-upload
          class="upload-demo"
          :show-file-list="false"
          :on-progress="fileIng"
          :on-success="filesuccess"
          :on-error="fileerror"
          :data="usersid"
          element-loading-text="文件上传中..."
          v-loading.fullscreen.lock="fullscreenLoading"
          action="http://192.168.31.14:5000/api/imporantFile"
        >
          <el-button size="small" type="primary">导入Excle</el-button>
        </el-upload>
        <!-- 导出 -->
        <el-button type="success" @click="export2Excel">导出Excle</el-button>
        <!-- 删除 -->
        <el-button type="danger" @click="delAll">批量删除</el-button>
        <!-- 添加 -->
        <el-button type="warning" @click="addCus">添加客户</el-button>
        <!-- 搜索 -->
        <el-input
          v-model="select_word"
          v-on:input="selectKeyworld"
          placeholder="筛选关键词"
          class="handle-input mr10"
        ></el-input>
        <el-button type="primary" icon="search" @click="selectKeyworld">搜索</el-button>
      </div>
      <!-- 表格 -->
      <div class="table">
        <el-table
          :data="tableData"
          style="width: 100%"
          border
          :default-sort="{prop: 'date', order: 'descending'}"
          @selection-change="handleSelectionChange"
        >
          <el-table-column type="selection" width="55" align="center"></el-table-column>
          <el-table-column fixed prop="date_time" label="日期" sortable align="center" width="150">
            <template slot-scope="scope">
              <span>{{ scope.row.date_time | dateFormart('yyyy-MM-dd')}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="province" label="省份" align="center"></el-table-column>
          <el-table-column prop="city" label="城市" align="center"></el-table-column>
          <el-table-column prop="company_name" label="公司抬头" align="center"></el-table-column>
          <el-table-column prop="customer_name" label="姓名" align="center"></el-table-column>
          <el-table-column prop="customer_tel" label="电话" align="center"></el-table-column>
          <el-table-column prop="purchase" label="采购情况" align="center">
            <template slot-scope="scope">
              <span v-if="scope.row.purchase == 0">
                <el-tag type="danger">未采购</el-tag>
              </span>
              <span v-else>
                <el-tag type="success">已采购</el-tag>
              </span>
            </template>
          </el-table-column>
          <el-table-column prop="remarks" label="备注" align="center"></el-table-column>
          <el-table-column label="操作" width="180" align="center">
            <template slot-scope="scope">
              <el-button
                type="text"
                icon="el-icon-edit"
                @click="handleEdit(scope.$index, scope.row)"
              >编辑</el-button>
              <el-button
                type="text"
                icon="el-icon-delete"
                class="red"
                @click="del(scope.$index, scope.row)"
              >删除</el-button>
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
    <!-- 编辑弹出层 -->
    <el-dialog title="编辑" :visible.sync="editVisible" width="30%">
      <el-form ref="form" :model="form" label-width="100px">
        <el-form-item label="日期">
          <el-date-picker
            type="date"
            placeholder="选择日期"
            v-model="form.data_time"
            value-format="yyyy-MM-dd HH:mm:ss"
            style="width: 100%;"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="省份">
          <el-input v-model="form.province"></el-input>
        </el-form-item>
        <el-form-item label="城市">
          <el-input v-model="form.city"></el-input>
        </el-form-item>
        <el-form-item label="公司抬头">
          <el-input v-model="form.company_name"></el-input>
        </el-form-item>
        <el-form-item label="姓名">
          <el-input v-model="form.customer_name"></el-input>
        </el-form-item>
        <el-form-item label="电话">
          <el-input v-model="form.customer_tel"></el-input>
        </el-form-item>
        <el-form-item label="采购情况">
          <el-input v-model="form.purchase"></el-input>
        </el-form-item>
        <el-form-item label="备注">
          <el-input v-model="form.remarks"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click=" editVisible = false  ">取 消</el-button>
        <el-button type="primary" :loading="isLoading" @click="saveEdit()">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 添加客户弹出层 -->
    <el-dialog title="添加" :visible.sync="addVisible" width="30%">
      <el-form ref="addCustomer" :model="addCustomer" label-width="100px">
        <el-form-item label="日期">
          <el-date-picker
            type="date"
            placeholder="选择日期"
            v-model="addCustomer.data_time"
            value-format="yyyy-MM-dd HH:mm:ss"
            style="width: 100%;"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="省份">
          <el-input v-model="addCustomer.province"></el-input>
        </el-form-item>
        <el-form-item label="城市">
          <el-input v-model="addCustomer.city"></el-input>
        </el-form-item>
        <el-form-item label="公司抬头">
          <el-input v-model="addCustomer.company_name"></el-input>
        </el-form-item>
        <el-form-item label="姓名">
          <el-input v-model="addCustomer.customer_name"></el-input>
        </el-form-item>
        <el-form-item label="电话">
          <el-input v-model="addCustomer.customer_tel"></el-input>
        </el-form-item>
        <el-form-item label="采购情况">
          <el-input v-model="addCustomer.purchase"></el-input>
        </el-form-item>
        <el-form-item label="备注">
          <el-input v-model="addCustomer.remarks"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click=" addVisible = false  ">取 消</el-button>
        <el-button type="primary" :loading="isLoading" @click="saveAddCus">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>


<script>
// 时间格式化
function fmtDate(obj) {
  var date = new Date(obj);
  var y = 1900 + date.getYear();
  var m = "0" + (date.getMonth() + 1);
  var d = "0" + date.getDate();
  return (
    y +
    "-" +
    m.substring(m.length - 2, m.length) +
    "-" +
    d.substring(d.length - 2, d.length)
  );
}

export default {
  data() {
    return {};
  }
};
</script>

<style scoped>
.crumbs {
  margin: 10px 0;
}
.container {
  padding: 30px;
  background: #fff;
  border: 1px solid #ddd;
  border-radius: 5px;
}
.upload-demo {
  display: inline-block;
  margin-right: 10px;
}
.handle_box {
  margin-bottom: 20px;
}
.pagination {
  margin: 20px 0;
  text-align: right;
}
.red {
  color: red;
}
.mr10 {
  margin-right: 10px;
}
.handle-input {
  margin-left: 10px;
  width: 200px;
  display: inline-block;
}
.el-form-item__label {
  width: 100px;
}
.el-form-item__content {
  margin-left: 110px;
}
</style>
