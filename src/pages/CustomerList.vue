<template>
  <div>
    <!-- 面包屑 -->
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/dashboard' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>客户管理</el-breadcrumb-item>
        <el-breadcrumb-item>客户列表</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <!-- 表格操作 -->
    <div class="container">
      <div class="btn_tools">
        <el-row type="flex">
          <el-col :span="12">
            <el-button @click="addCustomer" type="success">新建客户</el-button>
          </el-col>
          <el-col :span="12" class="tac">
            <el-col :span="5" class="mr15">
              <el-input placeholder="请输入用户名" v-model="searchOrder"></el-input>
            </el-col>
            <el-col :span="5" class="mr15">
              <el-input placeholder="请输入手机号" v-model="searchOrder"></el-input>
            </el-col>
            <el-col :span="2">
              <el-button type="primary">搜索</el-button>
            </el-col>
          </el-col>
        </el-row>
      </div>
      <div class="table_data">
        <el-table ref="multipleTable" :data="tableData" border style="width: 100%">
          <el-table-column type="selection" width="55"></el-table-column>
          <el-table-column prop="username" label="用户名"></el-table-column>
          <el-table-column prop="email" label="邮箱"></el-table-column>
          <el-table-column prop="mobile" label="手机号"></el-table-column>
          <el-table-column prop="status" label="状态">
            <template slot-scope="scope">
              <span v-if="scope.row.status == 0">
                <el-tag type="warning">冻结</el-tag>
              </span>
              <span v-if="scope.row.status == 1">
                <el-tag type="primary">正常</el-tag>
              </span>
            </template>
          </el-table-column>
          <el-table-column prop="createTime" label="创建时间"></el-table-column>
          <el-table-column fixed="right" label="操作" width="400px">
            <template slot-scope="scope">
              <el-button
                @click="editUser(scope.row)"
                type="success"
                size="mini"
                icon="el-icon-edit"
              >编辑</el-button>
              <el-button
                @click="delUser(scope.row)"
                type="danger"
                size="mini"
                icon="el-icon-delete"
              >删除</el-button>
              <el-button
                @click="handleClick(scope.row)"
                type="primary"
                size="mini"
                icon="el-icon-share"
              >重置密码</el-button>
              <el-button
                @click="frozenUser(scope.row)"
                size="mini"
                icon="el-icon-user"
                type="warning"
              >冻结账号</el-button>
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
    <el-dialog title="新建客户" :visible.sync="dialogVisible" width="30%">
      <el-form :model="addInfo" label-width="110px">
        <el-form-item label="用户名">
          <el-input v-model="addInfo.username"></el-input>
        </el-form-item>
        <el-form-item label="密码">
          <el-input type="password" v-model="addInfo.password"></el-input>
        </el-form-item>
        <el-form-item label="邮箱">
          <el-input type="email" v-model="addInfo.email"></el-input>
        </el-form-item>
        <el-form-item label="手机号">
          <el-input type="text" v-model="addInfo.mobile"></el-input>
        </el-form-item>
        <el-form-item label="创建角色" prop="region">
          <el-radio-group v-model="radio2">
            <el-radio
              :label="item.roleId"
              v-for="item in roleName"
              :key="item.roleId"
            >{{item.roleName}}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="addnewuser">立即创建</el-button>
          <el-button @click="dialogVisible = false">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import qs from "qs";
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
      roleName: "",
      radio2: "",
      addInfo: {
        username: "",
        password: "",
        email: "",
        mobile: "",
        status: 1,
        roleIdList: []
      }
    };
  },
  created() {
    this.getTable();
  },
  methods: {
    getTable() {
      // 获取下级用户
      const url = `http://106.14.116.17/api/user/list`;
      this.$axios
        .get(url + `?page=${this.currentPage}&limit=${this.pagesize}`)
        .then(res => {
          if (res.data.code === 0) {
            this.tableData = res.data.data;
            this.totals = res.data.count;
          } else {
            this.$message.error(res.data.msg);
          }
        });
    },
    addCustomer() {
      this.dialogVisible = true;
      let url = `http://106.14.116.17/api/role/getSonRole`;
      this.$axios.get(url).then(res => {
        if (res.data.code === 0) {
          this.roleName = res.data.role;
        } else {
          this.$message.error(res.data.msg);
        }
      });
    },
    // 重置密码
    handleClick(row) {
      console.log(row);
    },
    // 新建计划
    newPlanTure() {
      this.dialogVisible = false;
      this.$message({
        message: "恭喜你，这是一条成功消息",
        type: "success"
      });
    },
    addnewuser() {
      this.addInfo.roleIdList.push(this.radio2);
      let url = `http://106.14.116.17/api/user/save`;
      this.$axios.post(url, qs.stringify(this.addInfo)).then(res => {
        if (res.data.code == 0) {
          this.dialogVisible = false;
          this.reload();
        } else {
          this.$message.error(res.data.msg);
        }
      });
    },
    // 冻结账号
    frozenUser(index, row) {
      // index是索引值
      // 冻结账号id
      console.log(row.userId);
    },
    // 删除用户
    delUser(row) {
      console.log(row);
      this.$confirm("此操作将永久删除该用户, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          let url = `http://106.14.116.17/api/user/delete`;
          let arr = [];
          arr.push(row.userId);
          this.$axios({
            url: url,
            method: "post",
            data: JSON.stringify(arr),
            headers: {
              "Content-Type": "application/json"
            }
          }).then(res => {
            console.log(res.data);
            if (res.data.code === 0) {
              this.$message({
                message: "删除用户成功！",
                type: "success",
                onClose: () => {
                  this.getTable();
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
            message: "已取消删除"
          });
        });
    },
    // 编辑用户
    editUser(row) {
      // let url = `http://106.14.116.17/api/user/update`;
      // this.$http.post(url).then(res => {
      //   console.log(res);
      // });
      console.log(row);
    },
    // 初始页currentPage、初始每页数据数pagesize和数据data
    handleSizeChange(size) {
      this.pagesize = size; //每页下拉显示数据
    },
    handleCurrentChange(currentPage) {
      this.currentPage = currentPage;
      this.getTable();
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