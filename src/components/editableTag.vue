<template>
    <span class="editableTag">
        <el-input class="input-new-tag" ref="saveTagInput" v-if="inputVisible" v-model="inputValue" :size="$attrs.size" @keyup.enter.native="handleInputConfirm" @blur="handleInputConfirm">
        </el-input>
        <el-button v-else class="button-new-tag" :size="$attrs.size" @click="showInput">
            <slot></slot>
        </el-button>
    </span>
</template>

<script>
export default {
    name: 'editableTag',
    data() {
        return {
            inputVisible: false,
            inputValue: ''
        };
    },
    methods: {
        showInput() {
            this.inputVisible = true;
            this.$nextTick(_ => {
                this.$refs.saveTagInput.$refs.input.focus();
            });
        },

        handleInputConfirm() {
            let inputValue = this.inputValue;
            if (inputValue) {
                this.$emit('updateData', inputValue);
            }
            this.inputVisible = false;
            this.inputValue = '';
        }
    }
}
</script>

<style lang="less" scoped>
.button-new-tag {
    height: 32px;
    line-height: 30px;
    padding-top: 0;
    padding-bottom: 0;
}
.input-new-tag {
    width: 90px;
    vertical-align: top;
}
</style>