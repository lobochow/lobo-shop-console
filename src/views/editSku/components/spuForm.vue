<template>
    <div class="spuForm">
        <el-dialog title="添加SPU" :visible.sync="visible" :before-close="handleClose">

            <el-form ref="form_spu" :model="spuEditInfo" label-width="80px">
                <el-form-item label="短描述">
                    <el-input v-model="spuEditInfo.shortDescription"></el-input>
                </el-form-item>
                <el-form-item label="长描述">
                    <el-input v-model="spuEditInfo.longDescription"></el-input>
                </el-form-item>
                <el-form-item label="重量(kg)">
                    <el-input v-model="spuEditInfo.weight"></el-input>
                </el-form-item>
                <el-form-item label="特征属性">
                    <el-input placeholder="请输入内容" v-model="spuAttrValue" class="input-with-select" :disabled="disableAttrAdd">
                        <el-select v-model="spuAttrName" slot="prepend" placeholder="请选择" :disabled="disableAttrAdd">
                            <el-option :label="attrName" :value="attrName" v-for="(attrName, index) in optionalAttr"
                                       :key="index"></el-option>
                        </el-select>
                        <el-button slot="append" @click="addSpuAttr" :disabled="disableAttrAdd || !spuAttrName || !spuAttrValue">添加</el-button>
                    </el-input>
                </el-form-item>
                <el-table :data="spuEditInfo.attrList" style="margin-bottom: 20px">
                    <el-table-column label="特征" prop="attrName"></el-table-column>
                    <el-table-column label="属性值">
                        <template slot-scope="{row, $index}">
                            <span v-show="!spuAttrEditStatus[$index]">{{row.attrValue}}</span>
                            <input type="text" v-model="row.attrValue" v-show="spuAttrEditStatus[$index]" :ref="`attrInput${$index}`" style="width: 65%">
                        </template>
                    </el-table-column>
                    <el-table-column
                        label="操作" >
                        <template slot-scope="{row, $index}">
                            <el-button type="primary" size="mini" v-show="spuAttrEditStatus[$index]" @click="comfirmEditSpuAttr(row, $index)">确定</el-button>
                            <el-button type="warning" size="mini" @click="editAttr($index)" v-show="!spuAttrEditStatus[$index]">编辑</el-button>
                            <el-button type="danger" size="mini" @click="deleteAttr($index)">删除</el-button>
                        </template>
                    </el-table-column>
                </el-table>

                <el-form-item label="图片">
                    <el-upload action="/v1/spuSwiper" list-type="picture-card" :file-list="swipers"
                               :on-preview="handlePictureCardPreview" :on-remove="handleRemoveSPUImg"
                               :on-success='picUploadSuccess'>
                        <i class="el-icon-plus"></i>
                    </el-upload>
                    <el-dialog :visible.sync="dialogVisible_spuSwiper">
                        <img width="100%" :src="dialogImageUrl">
                    </el-dialog>
                </el-form-item>
            </el-form>

            <span slot="footer" class="dialog-footer">
                <el-button @click="hideDialog">取 消</el-button>
                <el-button type="primary" @click="reqAddSpu">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import editableTag from '@/components/editableTag'
import { deleteSPUSwiper, postSPU } from '@/api'

export default {
    name: 'SpuForm',
    props: ['visible', 'spuInfo', 'skuInfo'],
    components: { editableTag },
    data() {
        return {
            dialogVisible: false,

            dialogVisible_spuSwiper: false,
            dialogImageUrl: '',

            spuSwipers: [],
            spuEditInfo: {
                sku_id: '',
                longDescription: '',
                shortDescription: '',
                weight: 0,
                swipers: [],
                attrList: []
            },
            swipers: [],

            spuAttrName: '',
            spuAttrValue: '',
            spuAttrEditStatus: []
        }
    },
    computed:{
        optionalAttr(){
            return this.skuInfo?.attrList?.filter(attrName => !this.spuEditInfo.attrList.some(spuAttr => spuAttr.attrName == attrName));
        },
        disableAttrAdd(){
            return this.optionalAttr?.length === 0;
        }
    },
    watch: {
        spuInfo(newValue) {
            this.spuEditInfo = {
                sku_id: '',
                longDescription: '',
                shortDescription: '',
                weight: 0,
                swipers: [],
                attrList: []
            };
            Object.assign(this.spuEditInfo, newValue);
            this.swipers = [...this.spuEditInfo.swipers];
        },
        "spuEditInfo.attrList": function(newValue){
            for(let i = 0; i < this.spuEditInfo.attrList.length; i++) {
                this.spuAttrEditStatus.push(false);
            }
        }
    },
    methods: {
        handleClose(done) {
            this.$confirm('确认关闭？')
                .then(_ => {
                    this.hideDialog();
                    //done();
                })
                .catch(_ => { });
        },
        handlePictureCardPreview(file) {
            this.dialogImageUrl = file.url;
            this.dialogVisible = true;
        },
        async handleRemoveSPUImg(file) {
            let result = await deleteSPUSwiper({ filename: file.name });
            // if (result.code == 200) {
            //     let picIndex = this.findPic(file, this.spuEditInfo.swipers);
            //     this.deletePic(picIndex, this.spuEditInfo.swipers);
            // }

            let picIndex = this.findPic(file, this.spuEditInfo.swipers);
            this.deletePic(picIndex, this.spuEditInfo.swipers);
        },
        hideDialog() {
            this.$emit('update:visible', false);
            let editSwiperLength = this.spuEditInfo.swipers.length;
            let showSwiperLength = this.swipers.length;
            for(let i = 0; i < editSwiperLength; i++) {
                let editSwiperName = this.spuEditInfo.swipers[i].name;
                let isInEdit = false;
                for(let j = 0; j < showSwiperLength; j++) {
                    if(editSwiperName === this.swipers[j].name) {
                        isInEdit = true;
                        break;
                    }
                }

                if(!isInEdit) {
                    deleteSPUSwiper(this.spuEditInfo.swipers[i]);
                    console.log('删除照片:' + this.spuEditInfo.swipers[i].name);
                }
            }
        },
        picUploadSuccess(respones, file, fileList) {
            this.spuEditInfo.swipers.push(respones);
        },
        findPic(picFile, fileList) {
            fileList.forEach((item, index) => {
                if (item.name == picFile.name) {
                    return index;
                }
            })
        },
        deletePic(index, fileList) {
            fileList.splice(index, 1);
        },
        async reqAddSpu() {
            let result = await postSPU(this.spuEditInfo);
            if (result.code == 200) {
                this.$message({
                    message: '添加Spu成功',
                    type: 'success'
                })
                this.hideDialog();
                this.$emit('updateSkuInfo');
            } else {
                this.$message({
                    message: '添加Spu失败',
                    type: 'error'
                })
            }
        },
        addSpuAttr() {
            this.spuEditInfo.attrList.push({
                attrName: this.spuAttrName,
                attrValue: this.spuAttrValue
            });

            this.spuAttrName = this.optionalAttr?.[0] ?? '';
            this.spuAttrValue = this.disableAttrAdd ? '无额外属性' : '请输入';
        },
        editAttr(index){
            this.spuAttrEditStatus.splice(index,1,true);
            this.$nextTick( () => {
                this.$refs[`attrInput${index}`].focus();
            })
        },
        deleteAttr(index){
            this.spuEditInfo.attrList.splice(index, 1);
        },
        comfirmEditSpuAttr(row, index){
            this.spuAttrEditStatus.splice(index,1,false);
        }
    }
}
</script>

<style lang="less" scoped>
.el-select {
    width: 100px;
}
.input-with-select .el-input-group__prepend {
    background-color: #fff;
}
</style>