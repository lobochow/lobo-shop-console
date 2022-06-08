<template>
    <div class="root">
        首页轮播图
        <el-upload action="http://127.0.0.1:8088/v1/homeSwiper" list-type="picture-card"
                   :on-preview="handlePictureCardPreview" :on-remove="handleRemove"
                   :file-list="swipers">
            <i class="el-icon-plus"></i>
        </el-upload>
        <el-dialog :visible.sync="dialogVisible">
            <img width="100%" :src="dialogImageUrl" alt="">
        </el-dialog>
    </div>
</template>

<script>
import { getHomeSwiper, deleteHomeSwiper } from '@/api'

export default {
    name: 'homeSwiper',
    data() {
        return {
            swipers: [],
            imageUrl: '',
            dialogImageUrl: '',
            dialogVisible: false
        };
    },
    methods: {
        handleRemove(file, fileList) {
            deleteHomeSwiper(file);
            console.log(file, fileList);
        },
        handlePictureCardPreview(file) {
            this.dialogImageUrl = file.url;
            this.dialogVisible = true;
        },
        async reqSwipers() {
            this.swipers = await getHomeSwiper();
            this.swipers.forEach(pic => {
                let forName = pic.picUrl.split('/');
                pic.name = forName[forName.length -1];
                pic.url = pic.picUrl;
            })
        }
    },
    mounted() {
        this.reqSwipers();
    },
}
</script>

<style lang="less" scoped>
.root{
    padding: 40px;
}

.avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
}
.avatar-uploader .el-upload:hover {
    border-color: #409eff;
}
.avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
}
.avatar {
    width: 178px;
    height: 178px;
    display: block;
}
</style>