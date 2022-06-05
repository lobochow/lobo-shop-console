<template>
    <div class="root">
        分类1：<input type="text"><button>添加</button>
        <el-table class="c1Table" :data="c1s" style="width: 100%">
            <el-table-column prop="name" label="名字" width="100">
            </el-table-column>
            <el-table-column label="小分类">
                <template slot-scope="scope">
                    <el-tag type="info" v-for="(item, index) in scope.row.subCate" :key="index">{{item}}</el-tag>
                    <editableTag size="small" @updateData="value => updateSubCate(scope.$index, value)">添加</editableTag>
                </template>
            </el-table-column>
            <el-table-column label="操作">
                <template>
                    <el-tag type="danger">删除</el-tag>
                </template>
            </el-table-column>
        </el-table>
    </div>
</template>

<script>
import { request } from '@/api/index.js'
import editableTag from '@/components/editableTag'

export default {
    name: 'category',
    components: { editableTag },
    data() {
        return {
            c1: '',
            c1s: [
                {
                    name: '1',
                    subCate: ['a', 'b', 'c']
                },
                {
                    name: '2',
                    subCate: ['d', 'e', 'f']
                },
                {
                    name: '3',
                    subCate: ['g', 'h', 'i']
                }
            ]
        }
    },
    methods: {
        handleClose(tag) {
            this.dynamicTags.splice(this.dynamicTags.indexOf(tag), 1);
        },
        updateSubCate(index, value){
            this.c1s[index].subCate.push(value);
        }
    }
}
</script>

<style lang="less" scoped>
.root {
    width: 100%;
    padding: 40px;
}

.c1Table {
    width: 100%;
}

.el-tag:not(:first-child) {
    margin-left: 10px;
}
</style>