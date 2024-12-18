import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
    {
        path: '/',
        name: 'home',
        // redirect: '/shop'
    },
    {
        path: '/shop',
        component: () => import('../views/ShopView.vue'),
        children: [
            {
                path: 'buy',
                name: 'shopbuy',
                component: () => import('../views/ShopBuy.vue')
            },
            {
                path: 'pay',
                name: 'shoppay',
                component: () => import('../views/ShopPay.vue'),
                props: true
            },
            {
                path: 'login',
                name: 'shoplogin',
                component: () => import('../views/ShopLoginView.vue')
            },
            {
                path: 'orders',
                name: 'shoporders',
                component: () => import('../views/ShopOrders.vue')
            }
        ]
    },
    {
        path: '/bank',
        name: 'bank',
        component: () => import('../views/BankView.vue'),
        children: [
            {
                path: 'account',
                name: 'bankaccount',
                component: () => import('../views/BankAccountView.vue')
            },
            {
                path: 'amount',
                name: 'bankamount',
                component: () => import('../views/BankAmount.vue')
            },
            {
                path: 'history',
                name: 'bankhistory',
                component: () => import('../views/BankHistory.vue')
            },
            {
                path: 'operation',
                name: 'bankoperation',
                component: () => import('../views/BankOperation.vue')
            }
        ]
    }
]

const router = new VueRouter({
    mode: 'history',
    base: process.env.BASE_URL,
    routes
})

export default router