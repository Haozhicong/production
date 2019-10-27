<template>
  <div class="lgoin_wrap">
    <div class="lgoin">
      <div class="rlogo">客户管理系统</div>
      <el-form
        :model="ruleForm"
        status-icon
        :rules="rules"
        ref="ruleForm"
        size="big"
        class="demo-ruleForm"
      >
        <el-form-item label prop="username">
          <el-input type="text" placeholder="账号" v-model="ruleForm.username" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label prop="password">
          <el-input
            type="password"
            placeholder="密码"
            v-model="ruleForm.password"
            autocomplete="off"
            @keyup.enter.native="submitForm('ruleForm')"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm('ruleForm')">登录</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
// import md5 from "js-md5";
export default {
  data() {
    return {
      ruleForm: {
        username: "",
        password: ""
      },
      rules: {
        username: [
          { required: true, message: "请输入账号", trigger: "blur" },
          { min: 3, max: 16, message: "长度在 3 到 16 个字符", trigger: "blur" }
        ],
        password: [{ required: true, message: "请输入密码", trigger: "change" }]
      }
    };
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          const url = `http://106.14.116.17/api/login?username=${this.ruleForm.username}&password=${this.ruleForm.password}`;
          this.$axios.post(url).then(res => {
            if (res.data.code === 0) {
              sessionStorage.setItem("username", res.data.username);
              sessionStorage.setItem("userid", res.data.info.userId);
              this.$router.push("/dashboard");
            } else {
              this.$message.error(res.data.msg);
            }
          });
        } else {
          this.$alert("请正确填写账号密码", "提示", {
            confirmButtonText: "确定"
          });
          return false;
        }
      });
    }
  }
};
</script>

<style scoped>
.lgoin_wrap {
  position: relative;
  width: 100%;
  height: 100%;
  background: #444;
}
.lgoin {
  border: 1px solid #000;
  background-color: #fff;
  border-radius: 4px;
  height: 290px;
  left: 50%;
  margin-left: -220px;
  margin-top: -180px;
  padding: 35px 40px 50px;
  position: absolute;
  top: 50%;
  width: 360px;
}
.el-button {
  width: 100%;
}
.el-form-item {
  margin-bottom: 36px;
}

.rlogo {
  text-align: center;
  font-size: 26px;
  color: #444;
  cursor: pointer;
  height: 40px;
  overflow: hidden;
  margin-top: 15px;
  margin-bottom: 25px;
}
</style>
