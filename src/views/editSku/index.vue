<template>
    <div class="root">
        <el-card class="showSku">
            <el-table :data="skuList" style="width: 100%">
                <el-table-column prop="description" label="SKU">
                </el-table-column>

                <el-table-column label="SPU">
                    <template slot-scope="scope">
                        <el-tag closable @close="reqDeleteSPU(spu)" type="info" v-for="(spu, index) in scope.row.spuList" :key="index" @click="editSPU(spu)">
                            {{spu.shortDescription}}</el-tag>
                        <el-button type="success" @click="addSpu" size="mini">添加SPU</el-button>
                    </template>
                </el-table-column>

                <el-table-column label="操作">
                    <template slot-scope="scope">
                        <el-button size='small' type="warning" @click="editSku(scope.row)">编辑</el-button>
                        <el-button size='small' type="danger" @click="reqDeleteSKU(scope.row)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <el-button type="primary" @click="addSku">添加SKU</el-button>

            <addSKU :visible.sync="skuFormVisible" :categorys="categorys" :skuInfo="skuInfo" @updateSkuInfo="reqSKUInfo" ></addSKU>

            <spuForm :visible.sync="spuFormVisible" :spuInfo="spuInfo"></spuForm>
        </el-card>
    </div>
</template>

<script>
import addSKU from '@/views/editSku/components/addSKU'
import spuForm from '@/views/editSku/components/spuForm'

import { getCategorys, postSPU, getSKU, deleteSPU, deleteSKU, deleteSPUSwiper } from '@/api'

import editableTag from '@/components/editableTag'

export default {
    name: 'editSku',
    components: { editableTag, addSKU, spuForm },
    data() {
        return {
            categorys: [],

            skuList: [],

            skuInfo: {},
            spuInfo: {},

            spuFormVisible: false,
            skuFormVisible: false

        }
    },
    methods: {


        async reqCategorys() {
            this.categorys = await getCategorys();
            this.categorys.forEach(item => {
                item.name = item.c1names.join('/');
                item.children.forEach(item => {
                    item.name = item.c2name;
                    item.children.forEach(item => {
                        item.name = item.c3name;
                    })
                })
            })
        },

        //SKU相关
        showSkuDialog(){
            this.skuFormVisible = true;
        },
        addSku(){
            this.skuInfo = {};
            this.showSkuDialog();
        },
        editSku(skuInfo){
            this.skuInfo = this.skuInfoFormat(skuInfo);
            this.showSkuDialog();
        },
        async reqSKUInfo(){
            let result = await getSKU();
            if(result.code == 200){
                this.skuList = result.data;
            }else{
                this.$message({
                    message: '获取sku列表失败',
                    type: 'error'
                })
            }
        },
        skuInfoFormat(skuInfo){
            let formattedSkuInfo = {};
            let {description, _id} = skuInfo;

            formattedSkuInfo._id = _id;
            formattedSkuInfo.description = description;
            formattedSkuInfo.category_ids = [];

            for(let attr in skuInfo){
                if(/c._id/.test(attr)){
                    formattedSkuInfo.category_ids.push(skuInfo[attr]);
                }
            }

            return formattedSkuInfo;
        },
        async reqDeleteSKU(skuInfo){
            let result = await deleteSKU(skuInfo);
            if (result.code == 200) {
                console.log(skuInfo);
                skuInfo.spuList.forEach(spu => {
                    this.reqDeleteSPU(spu);
                });
                this.$message({
                    message: '删除sku成功',
                    type: 'success'
                });
            } else {
                this.$message({
                    message: '删除sku失败',
                    type: 'error'
                });
            }
        },


        //spu相关
        showSpuForm(){
            this.spuFormVisible = true;
        },
        addSpu(){
            this.spuInfo = {};
            this.showSpuForm();
        },
        async reqAddSPU() {
            this.dialogVisible_addSPU = false;
   
            let result = await postSPU({ ...this.form_spu, swipers: this.spuSwipers, sku_id: this.sku_id });
            if (result.code == 200) {
                this.$message({
                    message: '添加spu成功',
                    type: 'success'
                });
            } else {
                this.$message({
                    message: '添加spu失败',
                    type: 'danger'
                });
            }
        },
        handlePictureCardPreview(file) {
            this.dialogImageUrl = file.url;
            this.dialogVisible = true;
        },
        showSPUAdd(sku_id){
            this.dialogVisible_addSPU = true;
            this.sku_id = sku_id;
        },
        spuInfoFormat(spuInfo){
            return spuInfo;
        },
        editSPU(spuInfo){
            let formattedSpuInfo = this.spuInfoFormat(spuInfo);

            this.spuInfo = formattedSpuInfo;

            this.showSpuForm();
        },
        async reqDeleteSPU(spuInfo){
            let result = await deleteSPU(spuInfo);
            if (result.code == 200) {
                this.$message({
                    message: '删除spu成功',
                    type: 'success'
                });
            } else {
                this.$message({
                    message: '删除spu失败',
                    type: 'error'
                });
            }
        },
        handleRemoveSPUImg(file){
            console.log(file);
            deleteSPUSwiper({filename: file.response.name});
        }
    },
    mounted() {
        this.reqCategorys();
        this.reqSKUInfo();
    },
}
</script>

<style lang="less" scoped>
.root {
    padding: 40px;
    width: 100%;
}
</style>