<template>
    <div class="root">
        <el-card class="showSku" v-show="componentStatus == 1">
            <el-table :data="skuList" style="width: 100%">
                <el-table-column prop="description" label="SKU">
                </el-table-column>

                <el-table-column label="SPU">
                    <template slot-scope="scope">
                        <el-tag closable @close="reqDeleteSPU(spu)" type="info" v-for="(spu, index) in scope.row.spuList" :key="index" @click="editSPU(spu)">
                            {{spu.shortDescription}}</el-tag>
                        <el-button type="success" @click="showSPUAdd(scope.row._id)" size="mini">添加SPU</el-button>
                    </template>
                </el-table-column>

                <el-table-column label="操作">
                    <template slot-scope="scope">
                        <el-button size='small' type="warning" @click="editSKU(scope.row)">编辑</el-button>
                        <el-button size='small' type="danger" @click="reqDeleteSKU(scope.row)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <el-button type="primary" @click="dialogVisible_addSKU = true">添加SKU</el-button>

            <!-- 添加SKU弹窗 -->
            <el-dialog title="添加SKU" :visible.sync="dialogVisible_addSKU" :before-close="handleClose">
                <el-form ref="form_addSKU" :model="form_sku" label-width="80px">
                    <el-form-item label="SKU描述">
                        <el-input v-model="form_sku.description"></el-input>
                    </el-form-item>
                    <el-form-item label="分类">
                        <el-cascader :options="categorys" :props="cascaderProps" @change="handleCIDChange" v-model="skuCategorysEditValue">
                        </el-cascader>
                    </el-form-item>
                </el-form>
                <span slot="footer" class="dialog-footer">
                    <el-button @click="dialogVisible_addSKU = false">取 消</el-button>
                    <el-button type="primary" @click="reqAddSKU">确 定</el-button>
                </span>
            </el-dialog>

            <!-- 添加SPU弹窗 -->
            <el-dialog title="添加SPU" :visible.sync="dialogVisible_addSPU" :before-close="handleClose">

                <el-form ref="form_spu" :model="form_spu" label-width="80px">
                    <el-form-item label="短描述">
                        <el-input v-model="form_spu.shortDescription"></el-input>
                    </el-form-item>
                    <el-form-item label="长描述">
                        <el-input v-model="form_spu.longDescription"></el-input>
                    </el-form-item>
                    <el-form-item label="重量(kg)">
                        <el-input v-model="form_spu.weight"></el-input>
                    </el-form-item>
                    <el-form-item label="图片">
                        <el-upload action="/v1/spuSwiper" list-type="picture-card" :file-list="spuShowSwipers"
                                   :on-success="uploadSwiper" :on-preview="handlePictureCardPreview"
                                   :on-remove="handleRemove">
                            <i class="el-icon-plus"></i>
                        </el-upload>
                        <el-dialog :visible.sync="dialogVisible_spuSwiper">
                            <img width="100%" :src="dialogImageUrl">
                        </el-dialog>
                    </el-form-item>
                </el-form>

                <span slot="footer" class="dialog-footer">
                    <el-button @click="dialogVisible_addSPU = false">取 消</el-button>
                    <el-button type="primary" @click="reqAddSPU">确 定</el-button>
                </span>
            </el-dialog>
        </el-card>
    </div>
</template>

<script>
import { getCategorys, postSKU, postSPU, getSKU, deleteSPU, deleteSKU, deleteSPUSwiper } from '@/api'

import editableTag from '@/components/editableTag'

export default {
    name: 'editSku',
    components: { editableTag },
    data() {
        return {
            form_sku: {},
            categorys: [],
            //1:展示sku  2:编辑sku
            componentStatus: 1,
            dialogVisible_addSKU: false, //添加SKU弹窗控制
            skuList: [],

            //sku相关属性
            skuCategorysEditValue: [],

            //spu相关属性
            sku_id: '',
            dialogVisible_addSPU: false, //添加SPU弹窗控制
            form_spu: {},
            dialogVisible_spuSwiper: false,
            dialogImageUrl: '',
            spuShowSwipers: [],
            spuUpdateSwipers: [],


            skuFormData: {},
            swiperImageUrl: '',
            swiperDialogVisible: false,
            dialogVisible: false,
            skuDescriptrion: '',
            skuService: [
                {
                    serviceName: '服务1',
                    attrList: ['1', '2', '3']
                }
            ],
            spuList: [
            ],
            editSpuInfo: {
                longDes: '',
                shortDes: '',
                weight: 1,
                swipers: []
            },
            c1_id: '',
            c2_id: '',
            c3_id: '',
            cascaderProps: {
                value: '_id',
                label: 'name',
                expandTrigger: 'hover'
            }
        }
    },
    methods: {
        //弹窗控制
        handleClose(done) {
            this.$confirm('确认关闭？')
                .then(_ => {
                    done();
                })
                .catch(_ => { });
        },
        //上传照片组件的照片移除功能
        handleRemove(file, fileList) {

            //spu图片集该有的情况
            let indexOfImg = -1;
            this.spuUpdateSwipers.forEach((img,index) => {
                if(img.name == file.name){
                    indexOfImg = index;
                }
            })
            if(indexOfImg != -1){
                //删除文件
                deleteSPUSwiper({filename: file.name});
                //浏览器端更新spu图片信息
                this.spuUpdateSwipers.splice(indexOfImg, 1);
            }
        },
        handlePictureCardPreview(file) {
            this.dialogImageUrl = file.url;
            this.dialogVisible = true;
        },
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
        handleCIDChange(value) {
            value.forEach((item, index) => {
                this.form_sku[`c${index + 1}_id`] = item;
            })
        },

        //SKU相关
        async reqAddSKU() {
            this.dialogVisible_addSKU = false;
            let result = await postSKU(this.form_sku);
            if (result.code == 200) {
                this.$message({
                    message: '添加成功',
                    type: 'success'
                });
            } else {
                this.$message({
                    message: '添加失败',
                    type: 'danger'
                });
            }
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
        editSKU(skuInfo){
            this.form_sku = {...skuInfo};
            delete this.form_sku.spuList;
            this.dialogVisible_addSKU = true;

            for(let attr in this.form_sku){
                if(/c._id/.test(attr)){
                    this.skuCategorysEditValue.push(this.form_sku[attr]);
                }
            }
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
        async reqAddSPU() {
            this.dialogVisible_addSPU = false;
            this.spuShowSwipers.forEach(imgItem => {

            })
            let result = await postSPU({ ...this.form_spu, swipers: this.spuUpdateSwipers, sku_id: this.sku_id });
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
        uploadSwiper(res) {
            this.spuUpdateSwipers.push({
                name: res.name,
                url: res.url
            })
        },
        showSPUAdd(sku_id){
            this.dialogVisible_addSPU = true;
            this.sku_id = sku_id;
        },
        editSPU(row){
            this.form_spu = {...row};
            this.spuShowSwipers = row.swipers;
            this.spuUpdateSwipers = row.swipers;
            this.sku_id = row.sku_id;
            this.dialogVisible_addSPU = true;
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