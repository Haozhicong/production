<template>
  <div class="header clearfix">
    <div class="fl logo_icon">
      <i class="el-icon-menu"></i>
    </div>
    <div class="fl logo_tit">后台管理系统</div>
    <div class="fr header_right">
      <div class="header_right_con">
        <ul class="clearfix">
          <!-- Tools -->
          <li>
            <span class="quan_screen">
              <i class="el-icon-rank"></i>
            </span>
          </li>
          <li>
            <i class="el-icon-bell">
              <el-badge is-dot class="item"></el-badge>
            </i>
          </li>
          <li>
            <div class="user_info">
              <img class="user_photo" src="../assets/imgs/img.jpg" alt />
              <el-dropdown class="user-name" trigger="click" @command="handleCommand">
                <span class="el-dropdown-link">
                  {{username}}
                  <i class="el-icon-caret-bottom"></i>
                </span>
                <el-dropdown-menu slot="dropdown">
                  <a href="http://www.hzcweb.com" target="_blank">
                    <el-dropdown-item>关于作者</el-dropdown-item>
                  </a>
                  <el-dropdown-item>个人中心</el-dropdown-item>
                  <el-dropdown-item divided command="loginout">退出登录</el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>


<script>
export default {
  data() {
    return {
      name: ""
    };
  },
  computed: {
    username() {
      let username = sessionStorage.getItem("username");
      return username ? username : this.name;
    }
  },
  methods: {
    handleCommand(command) {
      if (command == "loginout") {
        sessionStorage.clear();
        this.$router.push("/login");
      }
    }
  }
};
</script>


<style scoped>
.header {
  height: 70px;
  background: #242f42;
  position: relative;
  width: 100%;
  font-size: 22px;
  color: #fff;
  line-height: 70px;
}
.logo_icon {
  padding: 0 21px;
  cursor: pointer;
  line-height: 70px;
}
.header_right_con ul li {
  float: left;
  margin-right: 20px;
  cursor: pointer;
}
.user_photo {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  margin-top: 15px;
  margin-right: 10px;
}
.user_info {
  cursor: pointer;
  height: 70px;
}
.user_name {
  font-size: 14px;
}
.user_info i {
  font-size: 14px;
}
.el-dropdown-link {
  cursor: pointer;
  color: #fff;
}
.el-icon-arrow-down {
  font-size: 14px;
}
.el-dropdown-menu {
  top: 43px !important;
}
.quan_screen i {
  transform: rotate(45deg);
}
</style>
