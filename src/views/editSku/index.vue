<template>
    <div class="root">
        <el-card class="showSku">
            <el-table :data="skuList" style="width: 100%" border="">
                <el-table-column prop="description" label="Sku" align="center" width="100px">
                </el-table-column>

                <el-table-column align="center" label="销售属性">
                    <template slot-scope="{row}">
                        <el-tag type="info" v-for="attr in row.attrList" :key="attr" style="margin: 0px 10px 10px 0px">
                            {{attr}}
                        </el-tag>
                    </template>
                </el-table-column>

                <el-table-column label="Spu" align="center">
                    <template slot-scope="scope">
                        <el-tag closable @close="reqDeleteSPU(spu)" type="info" style="margin: 0px 10px 10px 0px" class="spu-el-tag"
                                v-for="(spu, index) in scope.row.spuList" :key="index" @click="editSPU(spu, scope.row)">
                            {{spu.attrList.map(item => item.attrValue).join('-')}}</el-tag>
                        <el-button type="success" @click="addSpu(scope.row)" size="mini">添加Spu</el-button>
                    </template>
                </el-table-column>

                <el-table-column label="操作" align="center" width="150px">
                    <template slot-scope="scope">
                        <el-button size='small' type="warning" @click="editSku(scope.row)">编辑</el-button>
                        <el-button size='small' type="danger" @click="reqDeleteSKU(scope.row)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <el-button type="primary" @click="addSku" style="margin: 10px 0px 0px 0px">添加Sku</el-button>

            <addSKU :visible.sync="skuFormVisible" :categorys="categorys" :skuInfo="skuInfo"
                    @updateSkuInfo="reqSKUInfo"></addSKU>

            <spuForm :visible.sync="spuFormVisible" :spuInfo="spuInfo" :skuInfo="skuInfo" :showComponent="showSpuForm"
                     @updateSkuInfo="reqSKUInfo"></spuForm>
        </el-card>

        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage"
                       :page-sizes="[5, 10, 15]" :page-size="pageSize" layout="prev, pager, next, jumper, sizes, total"
                       :total="total">
        </el-pagination>
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

            skuInfo: {
                attrList: []
            },
            spuInfo: {},

            spuFormVisible: false,
            skuFormVisible: false,

            currentPage: 1,
            pageSize: 5,
            total: 0

        }
    },
    methods: {


        async reqCategorys() {
            let result = await getCategorys();
            this.categorys = result.categorys;
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
        showSkuDialog() {
            this.skuFormVisible = true;
        },
        addSku() {
            this.skuInfo = { attrList: [] };

            this.showSkuDialog();
        },
        editSku(skuInfo) {
            this.skuInfo = this.skuInfoFormat(skuInfo);
            this.showSkuDialog();
        },
        async reqSKUInfo() {
            let { currentPage, pageSize } = this;
            let result = await getSKU({
                currentPage,
                pageSize
            });
            if (result.code == 200) {
                this.skuList = result.data.skuList;
                this.total = result.data.count;
            } else {
                this.$message({
                    message: result.msg,
                    type: 'error'
                })
            }
        },
        skuInfoFormat(skuInfo) {

            let { description, _id, attrList } = skuInfo;

            let formattedSkuInfo = {
                description,
                _id,
                attrList
            };

            formattedSkuInfo.category_ids = [];
            for (let attr in skuInfo) {
                if (/c._id/.test(attr)) {
                    formattedSkuInfo.category_ids.push(skuInfo[attr]);
                }
            }

            return formattedSkuInfo;
        },
        async reqDeleteSKU(skuInfo) {
            let result = await deleteSKU(skuInfo);
            if (result.code == 200) {
                //删除子spu
                skuInfo.spuList.forEach(spu => {
                    this.reqDeleteSPU(spu);
                });
                this.reqSKUInfo();
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
        showSpuForm() {
            this.spuFormVisible = true;
        },
        addSpu(skuInfo) {
            let { _id } = skuInfo;

            this.spuInfo = { sku_id: _id };
            this.skuInfo = skuInfo;


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
        showSPUAdd(sku_id) {
            this.dialogVisible_addSPU = true;
            this.sku_id = sku_id;
        },
        spuInfoFormat(spuInfo) {
            let formattedSpuInfo = { ...spuInfo };
            return formattedSpuInfo;
        },
        editSPU(spuInfo, skuInfo) {
            let formattedSpuInfo = this.spuInfoFormat(spuInfo);

            this.spuInfo = formattedSpuInfo;
            this.skuInfo = skuInfo;

            this.showSpuForm();
        },
        async reqDeleteSPU(spuInfo) {
            let result = await deleteSPU(spuInfo);
            if (result.code == 200) {
                this.reqSKUInfo();
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
        handleRemoveSPUImg(file) {
            console.log(file);
            deleteSPUSwiper({ filename: file.response.name });
        },

        //分页器
        handleSizeChange(val) {
            this.pageSize = val;
            this.reqSKUInfo();
        },
        handleCurrentChange(val) {
            this.currentPage = val;
            this.reqSKUInfo();
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

.el-pagination {
    margin-top: 20px;
    text-align: center;
}

.spu-el-tag {
    &:hover{
        cursor: pointer;
    }
}
</style>