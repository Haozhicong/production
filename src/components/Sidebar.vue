<template>
  <div class="sidebar">
    <el-menu
      class="sidebar-el-menu"
      :default-active="onRoutes"
      background-color="#324157"
      text-color="#bfcbd9"
      active-text-color="#20a0ff"
      router
    >
      <template v-for="item in navList">
        <template v-if="item.subs">
          <el-submenu :index="item.index" :key="item.index">
            <template slot="title">
              <i :class="item.icon"></i>
              <span slot="title">{{ item.title }}</span>
            </template>
            <template v-for="subItem in item.subs">
              <el-submenu v-if="subItem.subs" :index="subItem.index" :key="subItem.index">
                <template slot="title">{{ subItem.title }}</template>
                <el-menu-item
                  v-for="(threeItem,i) in subItem.subs"
                  :key="i"
                  :index="threeItem.index"
                >{{ threeItem.title }}</el-menu-item>
              </el-submenu>
              <el-menu-item v-else :index="subItem.index" :key="subItem.index">{{ subItem.title }}</el-menu-item>
            </template>
          </el-submenu>
        </template>
        <template v-else>
          <el-menu-item :index="item.index" :key="item.index">
            <i :class="item.icon"></i>
            <span slot="title">{{ item.title }}</span>
          </el-menu-item>
        </template>
      </template>
    </el-menu>
  </div>
</template>


<script>
export default {
  data() {
    return {
      isCollapse: true,
      navList: [
        {
          icon: "iconfont icon-home-fill",
          index: "dashboard",
          title: "系统首页"
        },
        {
          icon: "iconfont icon-dingdan",
          title: "采购管理",
          index: "1",
          subs: [
            {
              index: "purchasing",
              title: "采购申请"
            },
            {
              index: "purchasingList",
              title: "采购清单"
            }
          ]
        },
        {
          icon: "iconfont icon-dingdan",
          index: "finance",
          title: "财务管理"
        },
        {
          icon: "iconfont icon-tubiao_shengchanrenwudan",
          title: "生产管理",
          index: "3",
          subs: [
            {
              index: "orderinfo",
              title: "订单信息"
            },
            {
              index: "material",
              title: "原料入库"
            },
            {
              index: "stopmachine",
              title: "机器停歇"
            },
            {
              index: "production",
              title: "生产计划"
            },
            {
              index: "pullnet",
              title: "订单拉网"
            },
            {
              index: "hotrope",
              title: "订单烫绳"
            },
            {
              index: "shearmaterial",
              title: "订单剪料"
            },
            {
              index: "makefather",
              title: "订单制作",
              subs: [
                {
                  index: "make",
                  title: "订单制球"
                },
                {
                  index: "externalhair",
                  title: "订单外发"
                }
              ]
            },
            // {
            //   index: "test",
            //   title: "测试文件的"
            // },
            {
              index: "packing",
              title: "订单包装"
            },
            {
              index: "send",
              title: "订单配送",
              // subs: [
              //   {
              //     index: "send",
              //     title: "订单实发"
              //   },
              //   {
              //     index: "pendingsend",
              //     title: "订单待发"
              //   }
              // ]
            }
          ]
        },
        {
          icon: "iconfont icon-dingdan",
          title: "客户管理",
          index: "4",
          subs: [
            {
              index: "customerList",
              title: "客户列表"
            }
          ]
        }
      ]
    };
  },
  beforeCreate() {
    // 获取菜单
    // let url = `http://106.14.116.17/api/menu/user`;
    // this.$axios.get(url).then(res => {
    //   if (res.data.code === 0) {
    //     // this.navList = res.data.menuList;
    //   } else {
    //     this.$message.error(res.data.msg);
    //   }
    // });
  },

  computed: {
    onRoutes() {
      return this.$route.path.replace("/", "");
    }
  },
  methods: {
    handleOpen(key, keyPath) {
      console.log(key, keyPath);
    },
    handleClose(key, keyPath) {
      console.log(key, keyPath);
    }
  }
};
</script>
<style scoped>
.sidebar {
  display: block;
  position: absolute;
  left: 0;
  top: 70px;
  bottom: 0;
  overflow-y: scroll;
}
.sidebar::-webkit-scrollbar {
  width: 0;
}
.sidebar-el-menu:not(.el-menu--collapse) {
  width: 250px;
}
.sidebar > ul {
  height: 100%;
}
.sidebar ul li i {
  margin-right: 5px;
  width: 24px;
  display: inline-block;
}
</style>
