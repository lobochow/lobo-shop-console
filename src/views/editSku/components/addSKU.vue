<template>
    <el-dialog title="添加SKU" :visible.sync="visible" :before-close="handleClose">
        <el-form ref="form_addSKU" :model="skuEditInfo" label-width="80px">
            <el-form-item label="SKU描述">
                <el-input v-model="skuEditInfo.description"></el-input>
            </el-form-item>
            <el-form-item label="分类">
                <el-cascader :options="categorys" :props="cascaderProps"
                             v-model="skuEditInfo.category_ids">
                </el-cascader>
            </el-form-item>
            <el-form-item label="属性特征">
                <el-tag closable @close="deleteSkuAttr(index)" v-for="(attr, index) in skuEditInfo.attrList" :key="index" style="margin-right: 10px">{{attr}}</el-tag>
                <editableTag size="small" @updateData="value => addSkuAttr(value)">添加特征属性</editableTag>
            </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
            <el-button @click="hideDialog">取 消</el-button>
            <el-button type="primary" @click="reqAddOrUpdateSku">确 定</el-button>
        </span>
    </el-dialog>
</template>

<script>
import { postSKU } from '@/api'
import editableTag from '@/components/editableTag'

export default {
    name: 'addSKU',
    props: ['categorys', 'skuInfo', 'visible'],
    components: {editableTag},
    data() {
        return {
            skuEditInfo: {
                attrList: []
            },
            form_sku: {},
            //级联选择器配置
            cascaderProps: {
                value: '_id',
                label: 'name',
                expandTrigger: 'hover'
            },
            skuCategorysEditValue: [],
        }
    },
    methods: {
        handleClose(done) {
            this.$confirm('确认关闭？')
                .then(_ => {
                    this.hideDialog();
                    done();
                })
                .catch(_ => { });
        },
        async reqAddOrUpdateSku() {
            let skuReqInfo = this.skuInfoReqFormat(this.skuEditInfo);

            let result = await postSKU(skuReqInfo);
            if (result.code == 200) {
                //关闭dialog
                this.hideDialog();
                //更新数据
                this.$emit('updateSkuInfo');
                this.$message({
                    message: '添加成功',
                    type: 'success'
                });
            } else {
                this.$message({
                    message: '添加失败',
                    type: 'error'
                });
            }
        },

        skuInfoReqFormat(skuInfo) {
            /*
            原本数据结构
            skuInfo:{
                _id: String,
                description: String,
                category_ids: ['c1_id', 'c2_id', 'c3_id'],
                attrList: ['attr1', 'attr2']
            }
            转化后结构
            skuInfo:{
                _id: String,
                description: String,
                c1_id: String,
                c2_id: String,
                c3_id: String,
                attrList: ['attr1', 'attr2']
            }
            */
            let { _id, description, attrList } = skuInfo;
            let [c1_id, c2_id, c3_id] = skuInfo.category_ids;
            return {
                _id,
                description,
                attrList,
                c1_id,
                c2_id,
                c3_id
            }
        },
        hideDialog(){
            this.$emit('update:visible', false);
        },
        addSkuAttr(value){
            this.skuEditInfo.attrList.push(value);
        },
        deleteSkuAttr(index){
            this.skuEditInfo.attrList.splice(index, 1);
        },
    },
    watch: {
        skuInfo(new_skuInfo) {
            Object.assign(this.skuEditInfo, new_skuInfo);

            //深拷贝
            this.skuEditInfo.attrList = [...new_skuInfo.attrList];
        }
    },
    mounted() {
        this.dialogVisible = this.visible;
    },
}
</script>

<style lang="less" scoped>
</style>