import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
    routes: [
        {
            path: '/',
            redirect: '/login'
            // redirect: '/dashboard'
        },
        {
            path: '/',
            component: resolve => require(['./components/Home.vue'], resolve),
            meta: {
                title: '自述文件',
                requireAuth: true, // 添加该字段，表示进入这个路由是需要登录的
            },
            children: [{
                path: '/dashboard',
                component: resolve => require(['./pages/Dashboard.vue'], resolve),
                meta: {
                    title: '系统首页'
                }
            },
            {
                path: '/production',
                component: resolve => require(['./pages/Production.vue'], resolve),
                meta: {
                    title: '生产计划'
                }
            },
            {
                path: '/orderinfo',
                component: resolve => require(['./pages/Orderinfo.vue'], resolve),
                meta: {
                    title: '订单信息'
                }
            },
            {
                path: '/pullnet',
                component: resolve => require(['./pages/Pullnet.vue'], resolve),
                meta: {
                    title: '订单拉网'
                }
            },
            {
                path: '/hotrope',
                component: resolve => require(['./pages/Hotrope.vue'], resolve),
                meta: {
                    title: '订单烫绳'
                }
            },
            {
                path: '/shearmaterial',
                component: resolve => require(['./pages/Shearmaterial.vue'], resolve),
                meta: {
                    title: '订单剪料'
                }
            },
            {
                path: '/make',
                component: resolve => require(['./pages/Make.vue'], resolve),
                meta: {
                    title: '订单制球'
                }
            },
            {
                path: '/externalhair',
                component: resolve => require(['./pages/Externalhair.vue'], resolve),
                meta: {
                    title: '订单外发'
                }
            },
            {
                path: '/packing',
                component: resolve => require(['./pages/Packing.vue'], resolve),
                meta: {
                    title: '订单包装'
                }
            },
            {
                path: '/purchasing',
                component: resolve => require(['./pages/Purchasing.vue'], resolve),
                meta: {
                    title: '采购申请'
                }
            },
            {
                path: '/purchasingList',
                component: resolve => require(['./pages/PurchasingList.vue'], resolve),
                meta: {
                    title: '采购清单'
                }
            },
            {
                path: '/material',
                component: resolve => require(['./pages/Material.vue'], resolve),
                meta: {
                    title: '原料入库'
                }
            },
            {
                path: '/send',
                component: resolve => require(['./pages/Send.vue'], resolve),
                meta: {
                    title: '订单配送'
                }
            },
            {
                path: '/stopmachine',
                component: resolve => require(['./pages/Stopmachine.vue'], resolve),
                meta: {
                    title: '机器停歇'
                }
            },
            {
                path: '/customerList',
                component: resolve => require(['./pages/CustomerList.vue'], resolve),
                meta: {
                    title: '客户列表'
                }
            }
            ]
        },
        {
            path: '/login',
            component: resolve => require(['./pages/login.vue'], resolve)
        },
    ]
})