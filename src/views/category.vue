<template>
    <div class="root">
        <el-table class="c1Table" :data="c1s" style="width: 100%">
            <el-table-column type="index" label="大类序号" width="120">
            </el-table-column>
            <el-table-column label="一级分类">
                <template slot-scope="scope">
                    <el-tag closable @close="updateC1('delete', scope.$index, 'c1names', index)" type="info" v-for="(item, index) in scope.row.c1names" :key="index">{{item}}</el-tag>
                    <editableTag size="small" @updateData="value => updateC1('add', scope.$index, 'c1names', value)">添加</editableTag>
                </template>
            </el-table-column>
            <el-table-column label="快速入口">
                <template slot-scope="scope">
                    <el-tag closable @close="updateC1('delete', scope.$index, 'quickEnter', index)" type="info" v-for="(quick, index) in scope.row.quickEnter" :key="index">{{quick}}</el-tag>
                    <editableTag size="small" @updateData="value => updateC1('add', scope.$index, 'quickEnter', value)">添加</editableTag>
                </template>
            </el-table-column>
            <el-table-column label="操作">
                <template slot-scope="scope">
                    <el-tag type="danger" @click="deleteC1(scope.$index)">删除</el-tag>
                </template>
            </el-table-column>
        </el-table>
        <el-button type="primary" size="small" @click="addC1">添加一级分类</el-button>

        <p>
            选择分类1：<el-select v-model="selectedIndex" size="small">
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
                    <el-tag closable type="info" v-for="(c3, index) in scope.row.c3s" :key="index">{{c3.c3name}}</el-tag>
                    <editableTag size="small" @updateData="value => updateC3('add',scope.$index, value)">添加</editableTag>
                </template>
            </el-table-column>
        </el-table>
        <editableTag size="small" @updateData="value => updateC2('add', value) ">添加二级分类</editableTag>
    </div>
</template>

<script>
import { postUpdateC1, getCategory_1, deleteCategory_1, getCategory_2, postUpdateC2, deleteCategory_2, postUpdateC3 } from '@/api/index.js'
import editableTag from '@/components/editableTag'

export default {
    name: 'category',
    components: { editableTag },
    data() {
        return {
            selectedIndex: 1,
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
            },
            c1s: [],
            c2s: []
        }
    },
    methods: {
        handleClose(tag) {
            this.dynamicTags.splice(this.dynamicTags.indexOf(tag), 1);
        },
        reqCategory_1() {
            this.c1s = getCategory_1();
        },
        addC1() {
            postUpdateC1({
                c1_names: [],
                quickEnter: []
            });

            this.updateAll();
        },
        updateC1(flag, index, attrname, valueOrIndex) {
            if (flag == 'add') this.c1s[index][attrname].push(valueOrIndex);
            if (flag == 'delete') this.c1s[index][attrname].splice(valueOrIndex, 1);
            postUpdateC1(this.c1s[index]);

            this.updateAll();
        },
        deleteC1(index) {
            deleteCategory_1(this.c1s[index]);

            this.updateAll();

        },
        reqCategory_2(c1_id) {
            this.c2s = getCategory_2(c1_id);
        },
        updateC2(flag, value) {
            if (flag == 'add') {
                postUpdateC2({
                    c2name: value,
                    c1_id: this.c1s[this.selectedIndex - 1]._id
                });
            }

            this.updateAll();
        },
        deleteC2(rowIndex) {
            deleteCategory_2(this.c2s[rowIndex]);
            this.updateAll();
        },
        updateC3(flag, c2Index, value){
            if(flag == 'add'){
                postUpdateC3({
                    c2_id: this.c2s[c2Index]._id,
                    c3name: value
                })
            }

            this.updateAll();
        },
        updateAll(){
            this.reqCategory_1();
            this.reqCategory_2(this.$route.query.c1_id);
        }
    },
    watch: {
        selectedIndex(newValue){
            this.reqCategory_2(this.c1s[newValue -1]._id);
            this.$router.push({
                path: '/category',
                query: {
                    c1_id: this.c1s[newValue -1]._id
                }
            })
        }
    },
    mounted() {
        this.reqCategory_1();
        if (!this.$route.query.c1_id) {
            this.reqCategory_2(this.c1s[this.selectedIndex -1]._id);
        }else{
            this.reqCategory_2(this.$route.query.c1_id);
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