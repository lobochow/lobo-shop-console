import Vue from 'vue'
import VueRouter from "vue-router";
Vue.use(VueRouter);

import Category from "@/views/category.vue"

export default new VueRouter({
	routes: [
		{
            name: 'category',
			path: '/category',
			component: Category
		},
		//主页重定向
		{
			path: '/',
			redirect: 'category'
		}
	]
})