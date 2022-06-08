<template>
    <div class="root">
        <el-table :data="categorys" style="width: 100%" row-key="_id" border :tree-props="{children: 'children', hasChildren: 'hasChildren'}">
            <el-table-column prop="name" label="分类名">
            </el-table-column>
            <el-table-column label="操作">
                <template scope="scope">
                    <editableTag size='small' v-if="!scope.row.c2_id" @updateData="value => addCategory(scope.row, value)">添加</editableTag>
                    <el-button type="warning" size="mini" @click="editCategory(scope.row)">编辑</el-button>
                    <el-button type="danger" size="mini" @click="deleteCate(scope.row)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>

        <editableTag size='small' @updateData="value => addCategory(null, value)">添加</editableTag>

        <el-dialog title="提示" :visible.sync="editDialogVisible" :before-close="handleClose">
            <p>分类名称：<el-input v-model="editCateInfo.name" placeholder="输入分类名称"></el-input>
            </p>
            <span slot="footer" class="dialog-footer">
                <el-button @click="editDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="updateCategory">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import { postUpdateC1, deleteCategory_1, postUpdateC2, deleteCategory_2, postUpdateC3, deleteUpdateC3, getCategorys } from '@/api/index.js'
import editableTag from '@/components/editableTag'

export default {
    name: 'category',
    components: { editableTag },
    data() {
        return {
            selectedIndex: 1,
            categorys: [],
            c1s: [],
            c2s: [],
            editDialogVisible: false,
            editCateInfo: {},
            name: ''
        }
    },
    methods: {
        handleClose(done) {
            this.$confirm('确认关闭？')
                .then(_ => {
                    done();
                })
                .catch(_ => { });
        },
        async reqCategorys() {
            this.categorys = await getCategorys();
        },
        addCategory(row, value) {
            if (!row) {
                postUpdateC1({
                    c1names: value.split('/')
                })
            } else if (row.c1_id) {
                postUpdateC3({
                    c3name: value,
                    c2_id: row._id
                });
            } else {
                postUpdateC2({
                    c2name: value,
                    c1_id: row._id
                });
            }

            this.reqCategorys();
        },
        editCategory(row) {
            this.editCateInfo = { ...row };
            this.editDialogVisible = true;
        },
        updateCategory() {
            this.editDialogVisible = false;
            if (this.editCateInfo.c1_id) {
                this.editCateInfo.c2name = this.editCateInfo.name;
                postUpdateC2(this.editCateInfo);
            } else if (this.editCateInfo.c2_id) {
                this.editCateInfo.c3name = this.editCateInfo.name;
                postUpdateC3(this.editCateInfo);
            } else {
                this.editCateInfo.c1names = this.editCateInfo.name.split('/');
                postUpdateC1(this.editCateInfo);
            }
            this.reqCategorys();
        },
        deleteCate(row) {
            if (row.c1_id) {
                deleteCategory_2(row);
            } else if (row.c2_id) {
                deleteUpdateC3(row);
            } else {
                deleteCategory_1(row);
            }

            this.reqCategorys();
        }
    },
    watch: {
        categorys() {
            this.categorys.forEach(c1 => {
                c1.name = c1.c1names.join('/');

                c1.children.forEach(c2 => {
                    c2.name = c2.c2name;

                    c2.children.forEach(c3 => {
                        c3.name = c3.c3name;
                    })
                })
            })
        }
    },
    mounted() {
        this.reqCategorys();
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