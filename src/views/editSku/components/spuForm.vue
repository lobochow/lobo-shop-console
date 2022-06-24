<template>
    <div class="spuForm">
        <el-dialog title="添加Spu" :visible.sync="visible" :before-close="handleClose">

            <el-form ref="form_spu" :model="spuEditInfo" label-width="100px">
                <el-form-item label="价格（元）">
                    <el-input v-model="spuEditInfo.price"></el-input>
                </el-form-item>
                <el-form-item label="重量(kg)">
                    <el-input v-model="spuEditInfo.weight"></el-input>
                </el-form-item>
                <el-form-item label="销售属性">
                    <el-input placeholder="请输入内容" v-model="spuAttrValue" class="input-with-select"
                              :disabled="disableAttrAdd">
                        <el-select v-model="spuAttrName" slot="prepend" placeholder="请选择" :disabled="disableAttrAdd">
                            <el-option :label="attrName" :value="attrName" v-for="(attrName, index) in optionalAttr"
                                       :key="index"></el-option>
                        </el-select>
                        <el-button slot="append" @click="addSpuAttr"
                                   :disabled="disableAttrAdd || !spuAttrName || !spuAttrValue">添加</el-button>
                    </el-input>
                </el-form-item>

                <el-table :data="spuEditInfo.attrList" style="margin-bottom: 20px" row-class-name="spuAttrRow">
                    <el-table-column header-align="center" align="center" label="拖动">
                        <template>
                            <i class="iconfont icon-tuodongtupian dragIcon"></i>
                        </template>
                    </el-table-column>
                    <el-table-column label="销售属性">
                        <template slot-scope="{row}">
                            <span class="selectableCotent">{{row.attrName}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="属性值">
                        <template slot-scope="{row, $index}">
                            <span v-show="!spuAttrEditStatus[$index]" class="selectableCotent">{{row.attrValue}}</span>
                            <input type="text" v-model="row.attrValue" v-show="spuAttrEditStatus[$index]"
                                   :ref="`attrInput${$index}`" style="width: 65%">
                        </template>
                    </el-table-column>
                    <el-table-column label="操作">
                        <template slot-scope="{row, $index}">
                            <el-button type="primary" size="mini" v-show="spuAttrEditStatus[$index]"
                                       @click="comfirmEditSpuAttr(row, $index)">确定</el-button>
                            <el-button type="warning" size="mini" @click="editAttr($index)"
                                       v-show="!spuAttrEditStatus[$index]">编辑</el-button>
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
                <el-button @click="cancelEdit">取 消</el-button>
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
                price: 0,
                weight: 0,
                swipers: [],
                attrList: []
            },
            swipers: [],

            spuAttrName: '',
            spuAttrValue: '',
            spuAttrEditStatus: [],

            dragSelectIndex: '',
            dragSourceItem: null
        }
    },
    computed: {
        optionalAttr() {
            return this.skuInfo?.attrList?.filter(attrName => !this.spuEditInfo.attrList.some(spuAttr => spuAttr.attrName == attrName));
        },
        disableAttrAdd() {
            return this.optionalAttr?.length === 0;
        }
    },
    watch: {
        spuInfo(newValue) {
            this.spuEditInfo = {
                sku_id: '',
                weight: 0,
                swipers: [],
                attrList: []
            };
            Object.assign(this.spuEditInfo, newValue);
            this.swipers = [...this.spuEditInfo.swipers];

            this.dragInit();
        },
        "spuEditInfo.attrList": function (newValue) {
            for (let i = 0; i < this.spuEditInfo.attrList.length; i++) {
                this.spuAttrEditStatus.push(false);
            }
        }
    },
    methods: {
        handleClose(done) {
            this.$confirm('确认关闭？')
                .then(_ => {
                    this.cancelEdit();
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
        cancelUpdateSwiper() {
            let editSwiperLength = this.spuEditInfo.swipers.length;
            let showSwiperLength = this.swipers.length;
            for (let i = 0; i < editSwiperLength; i++) {
                let editSwiperName = this.spuEditInfo.swipers[i].name;
                let isInEdit = false;
                for (let j = 0; j < showSwiperLength; j++) {
                    if (editSwiperName === this.swipers[j].name) {
                        isInEdit = true;
                        break;
                    }
                }

                if (!isInEdit) {
                    deleteSPUSwiper(this.spuEditInfo.swipers[i]);
                    console.log('删除照片:' + this.spuEditInfo.swipers[i].name);
                }
            }
        },
        hideDialog() {
            this.$emit('update:visible', false);
        },
        cancelEdit() {
            this.hideDialog();
            this.cancelUpdateSwiper();
            this.initData();
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
                this.$emit('update:visible', false);
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
            this.spuAttrValue = this.disableAttrAdd ? '无额外属性' : '';
        },
        editAttr(index) {
            this.spuAttrEditStatus.splice(index, 1, true);
            this.$nextTick(() => {
                this.$refs[`attrInput${index}`].focus();
            })
        },
        deleteAttr(index) {
            this.spuEditInfo.attrList.splice(index, 1);
        },
        comfirmEditSpuAttr(row, index) {
            this.spuAttrEditStatus.splice(index, 1, false);
        },
        initData() {
            let originData = {
                dialogVisible: false,

                dialogVisible_spuSwiper: false,
                dialogImageUrl: '',

                spuSwipers: [],
                spuEditInfo: {
                    sku_id: '',
                    price: 0,
                    weight: 0,
                    swipers: [],
                    attrList: []
                },
                swipers: [],

                spuAttrName: '',
                spuAttrValue: '',
                spuAttrEditStatus: []
            };

            Object.assign(this, originData);
        },
        dragInit() {
            this.$nextTick(() => {
                let spuAttrRows = document.querySelectorAll('.spuAttrRow');
                spuAttrRows.forEach((row, index) => {
                    row.setAttribute('draggable', 'true');

                    //文字可选
                    let spans = row.querySelectorAll('.selectableCotent');
                    spans.forEach(span => {
                        span.style.userSelect = 'text';
                    })

                    row.addEventListener('mousedown', e => {
                        this.dragSourceItem = e.target;
                    })

                    row.addEventListener('dragstart', e => {
                        if (this.dragSourceItem.classList.contains('dragIcon')) {
                            e.dataTransfer.dropEffect = 'move';
                            this.dragSelectIndex = index;
                        } else {
                            e.preventDefault();
                        }

                    }, false);

                    row.addEventListener('dragenter', e => {
                        e.preventDefault();
                        if (!e.currentTarget.classList.contains('dropRow')) {

                            spuAttrRows.forEach(row => {
                                row.classList.remove('dropRow');
                            })
                            e.currentTarget.classList.add('dropRow');

                            let attrList = this.spuEditInfo.attrList;

                            let removeAttrRow = attrList.splice(this.dragSelectIndex, 1)[0];

                            attrList.splice(index, 0, removeAttrRow);

                            this.dragSelectIndex = index;
                        }
                    })

                    row.addEventListener('dragover', e => {
                        e.preventDefault();
                        e.dataTransfer.effectAllowed = 'move';
                    })

                    row.addEventListener('dragend', e => {
                        spuAttrRows.forEach(row => {
                            row.classList.remove('dropRow');
                        })
                    })
                })
            })
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

::v-deep .spuAttrRow.dropRow {
    color: white;
    background-color: rgb(118, 184, 238);
}
</style>