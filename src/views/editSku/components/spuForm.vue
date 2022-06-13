<template>
    <div class="spuForm">
        <el-dialog title="添加SPU" :visible.sync="dialogVisible" :before-close="handleClose">

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
                    <el-upload action="/v1/spuSwiper" list-type="picture-card" :file-list="spuSwipers"
                               :on-preview="handlePictureCardPreview" :on-remove="handleRemoveSPUImg">
                        <i class="el-icon-plus"></i>
                    </el-upload>
                    <el-dialog :visible.sync="dialogVisible_spuSwiper">
                        <img width="100%" :src="dialogImageUrl">
                    </el-dialog>
                </el-form-item>
            </el-form>

            <span slot="footer" class="dialog-footer">
                <el-button @click="visible = false">取 消</el-button>
                <el-button type="primary">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
export default {
    name: 'SpuForm',
    props: ['visible'],
    data() {
        return {
            dialogVisible: false,
            dialogVisible_spuSwiper: false,
            dialogImageUrl: '',
            form_spu: {},
            spuSwipers: []
        }
    },
    watch: {
        visible(newValue){
            this.dialogVisible = newValue;
        }
    },
    methods: {
        handleClose(done) {
            this.$confirm('确认关闭？')
                .then(_ => {
                    this.dialogVisible = false;
                })
                .catch(_ => { });
        },
        handlePictureCardPreview(file) {
            this.dialogImageUrl = file.url;
            this.dialogVisible = true;
        },
        handleRemoveSPUImg(file){
            console.log(file);
            deleteSPUSwiper({filename: file.response.name});
        }
    },
}
</script>

<style lang="less" scoped>
</style>