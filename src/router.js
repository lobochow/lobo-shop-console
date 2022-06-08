import Vue from 'vue'
import VueRouter from "vue-router";
Vue.use(VueRouter);

import Category from "@/views/category.vue"
import homeSwiper from '@/views/homeSwiper'

export default new VueRouter({
	routes: [
		{
            name: 'category',
			path: '/category',
			component: Category
		},
        {
            name: 'homeSwiper',
			path: '/homeSwiper',
			component: homeSwiper
		},
		//主页重定向
		{
			path: '/',
			redirect: 'homeSwiper'
		}
	]
})