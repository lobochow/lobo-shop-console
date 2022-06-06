<template>
    <div class="root">
        <el-table class="c1Table" :data="categorys.c1s" style="width: 100%">
            <el-table-column type="index" label="大类序号" width="120">
            </el-table-column>
            <el-table-column label="一级分类">
                <template slot-scope="scope">
                    <el-tag closable @close="deleteC1(scope.$index, index)" type="info" v-for="(item, index) in scope.row.c1names" :key="index">{{item}}</el-tag>
                    <editableTag size="small" @updateData="value => updateC1(scope.$index, value)">添加</editableTag>
                </template>
            </el-table-column>
            <el-table-column label="快速入口">
                <template slot-scope="scope">
                    <el-tag closable @close="deleteQuick(scope.$index, index)" type="info" v-for="(quick, index) in scope.row.quickEnter" :key="index">{{quick}}</el-tag>
                    <editableTag size="small" @updateData="value => updateQuick(scope.$index, value)">添加</editableTag>
                </template>
            </el-table-column>
            <el-table-column label="操作">
                <template>
                    <el-tag type="danger">删除</el-tag>
                </template>
            </el-table-column>
        </el-table>

        <p>
            选择分类1：<el-select v-model="selectedIndex.c1" size="small">
                <el-option :value="index+1" v-for="(c1, index) in categorys.c1s.length" :key="index">{{index+1}}</el-option>
            </el-select>
        </p>
        <el-table :data="c2s" style="width: 100%">
            <el-table-column label="二级分类" width="120">
                <template slot-scope="scope">
                    <el-tag closable @close="deleteC2(scope.$index)" type="info">{{scope.row.c2name}}</el-tag>
                </template>
            </el-table-column>
            <el-table-column label="三级分类">
                <template slot-scope="scope">
                    <el-tag closable @close="deleteC3" type="info" v-for="(c3, index) in scope.row.c3s" :key="index">{{c3}}</el-tag>
                    <editableTag size="small" @updateData="updateC3">添加</editableTag>
                </template>
            </el-table-column>
        </el-table>
        <editableTag size="small" @updateData="updateC2">添加二级分类</editableTag>
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
            selectedIndex: {
                c1: 1,
                c2: 1
            },
            categorys: {
                c1s: [
                    {
                        c1Id: '01',
                        c1names: ['c1-1-1', 'c1-1-2', 'c1-1-3'],
                        quickEnter: ['quickEnter1', 'quickEnter2', 'quickEnter3'],
                        c2s: [
                            {
                                c2name: 'c2-1',
                                c3s: ['c3-1', 'c3-2', 'c3-3']
                            },
                            {
                                c2name: 'c2-2',
                                c3s: ['c3-4', 'c3-5', 'c3-6']
                            },
                            {
                                c2name: 'c2-3',
                                c3s: ['c3-7', 'c3-8', 'c3-9']
                            }
                        ]
                    },
                    {
                        c1Id: '02',
                        c1names: ['c1-2-1', 'c1-2-2', 'c1-2-3'],
                        c2s: [
                            {
                                c2name: 'c2-4',
                                c3s: ['c3-1', 'c3-2', 'c3-3']
                            },
                            {
                                c2name: 'c2-5',
                                c3s: ['c3-4', 'c3-5', 'c3-6']
                            },
                            {
                                c2name: 'c2-6',
                                c3s: ['c3-7', 'c3-8', 'c3-9']
                            }
                        ]
                    }
                ],
            }
        }
    },
    computed: {
        c2s() {
            return this.categorys.c1s[this.selectedIndex.c1 - 1].c2s;
        }
    },
    methods: {
        handleClose(tag) {
            this.dynamicTags.splice(this.dynamicTags.indexOf(tag), 1);
        },
        updateC1(index, value) {
            this.categorys.c1s[index].c1names.push(value);
        },
        deleteC1(rowIndex, valueIndex) {
            this.categorys.c1s[rowIndex].c1names.splice(valueIndex, 1);
        },
        updateC2(value) {
            this.categorys.c1s[this.selectedIndex.c1-1].c2s.push({c2name: value });
        },
        deleteC2(rowIndex) {
            this.categorys.c1s[this.selectedIndex.c1-1].c2s.splice(rowIndex, 1);
        },
        updateC3(value) {
            this.categorys.c1s[this.selectedIndex.c1-1].c2s[this.selectedIndex.c2-1].c3s.push(value);
        },
        deleteC3(rowIndex) {
            this.categorys.c1s[this.selectedIndex.c1-1].c2s[this.selectedIndex.c2-1].c3s.splice(rowIndex, 1);
        },
        updateQuick(index, value) {
            this.categorys.c1s[index].quickEnter.push(value);
        },
        deleteQuick(rowIndex, valueIndex) {
            this.categorys.c1s[rowIndex].quickEnter.splice(valueIndex, 1);
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

.cell > * {
    margin-right: 10px;
    margin-bottom: 10px;
}
</style>