<template>
    <div id="app">
        <el-menu default-active="category" class="el-menu-vertical-demo" background-color="#545c64" text-color="#fff" active-text-color="#ffd04b">
            <el-menu-item index="category" @click="goCategory">
                <span>分类</span>
            </el-menu-item>
            <el-menu-item index="homeSwiper" @click="goHomeSwiper">
                <span>首页轮播图</span>
            </el-menu-item>
            <el-menu-item index="editSku"  @click="goEditSku">
                <span>商品</span>
            </el-menu-item>
        </el-menu>
        <router-view></router-view>
    </div>
</template>

<script>
export default {
    name: 'App',
    data() {
        return {
            activeIndex: 1,
            c1: ''
        }
    },
    methods: {
        handleOpen(key, keyPath) {
            console.log(key, keyPath);
        },
        handleClose(key, keyPath) {
            console.log(key, keyPath);
        },
        goCategory(){
            this.$router.push('/category');
        },
        goHomeSwiper(){
            this.$router.push('/homeSwiper');
        },
        goEditSku(){
            this.$router.push('/editSku');
        }

    },
}
</script>

<style lang="less">
* {
    padding: 0px;
    margin: 0px;
}

.el-menu {
    width: 200px;
    min-height: 100vh;
}

#app {
    display: flex;
    align-items: stretch;
}
</style>
