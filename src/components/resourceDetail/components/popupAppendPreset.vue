<!-- 生图预设 -->
<template>
    <Teleport to="body">
        <view>
            <view class="popup-painting-style">
                <view style="display: flex;align-items: center;justify-content: space-between;">
                    <view class="headTitle">选择生图预设</view>

                    <view style="width: 240px;">
                        <uni-search-bar placeholder="请输入关键字" bgColor="#F3F3F3" @input="handleSearch"
                            cancelButton="none" />
                    </view>
                </view>

                <view class="resourceList">
                    <view class="item" v-for="(item, index) in filteredListData" :key="item.id"
                        @click="handleSelect(item)">
                        <image v-if="item.url" :src="item.url" mode="aspectFill" class="img"></image>
                        <view :class="['checkbox', { 'checked': state.selectedIds.includes(item.id) }]"></view>
                        <!-- <view class="preview" style="top: 8px;" @click.stop="() => { }"></view> -->
                        <view class="bottom">
                            <view class="title">{{ item.name }}</view>
                        </view>
                    </view>
                </view>

                <view class="footer">
                    <view class="btn" @click="handleClose">取消</view>
                    <view class="btn light" @click="handleConfirm">确定</view>
                </view>
            </view>
        </view>
        <view class="mask"></view>
    </Teleport>
</template>

<script setup name="popupAppendPreset">
import { reactive, ref, computed, onMounted } from "vue";
import { GetResourceList } from '@/common/ResourceMgr'
import { debounce } from "lodash";

const emit = defineEmits(["close", "confirm"]);
const props = defineProps({
    show: {
        type: Boolean,
        required: true,
        default: false,
    },
});

const state = reactive({
    selectedIds: [],
    listData:[],
    searchKeyWord:''
});

const filteredListData = computed(() => {
    return state.listData.filter(item => item.name.includes(state.searchKeyWord))
})

const handleSelect = (item) => {
    if(state.selectedIds.includes(item.id)){
        state.selectedIds = state.selectedIds.filter(i=>i!==item.id)
    }else{
        state.selectedIds.push(item.id)
    }
}

const handleSearch = debounce((value) => {
    state.searchKeyWord = value
}, 500)

const handleConfirm = () => {
    emit("confirm",filteredListData.value.filter(item=>state.selectedIds.includes(item.id)))
    handleClose()
}

const handleClose = () => {
    emit("close")
}

onMounted(() => {
    GetResourceList(1, 10000, 27, (resList) => {
        state.listData = resList.map(i=>{
            return {
                name:i.name,
                content:i.content,
                id:i.id,
            }
        })
    })
})

</script>
<style scoped lang="scss">
.mask {
    position: fixed;
    z-index: 98;
    background: rgba(0, 0, 0, 0.6);
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
}

.popup-painting-style {
    border-width: 0px;
    position: fixed;
    z-index: 99;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    width: 908px;
    height: 60vh;
    background-color: #fff;
    border-radius: 15px;
    padding: 20px;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;

    .headTitle {
        font-size: 20px;
        font-weight: 500;
        color: #333;
        text-align: left;
    }
}

.resourceList {
    overflow-y: auto;
    flex: 1;

    .holder {
        cursor: pointer;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        border: 1px dashed #666;
    }

    .item {
        display: inline-block;
        width: 160px;
        height: 160px;
        border-radius: 8px;
        background: #999999;
        position: relative;
        margin-top: 12px;
        margin-right: 8px;
        overflow: hidden;

        &::before {
            content: "";
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 32px;
            height: 32px;
            background-image: url("/static/timbre_white.png");
            background-repeat: no-repeat;
            background-position: center;
            background-size: 100% 100%;
        }

        .img {
            width: 100%;
            height: 100%;
        }

        .bottom {
            padding: 0 8px;
            box-sizing: border-box;
            background: rgba(0, 0, 0, 0.6);
            backdrop-filter: blur(10px);
            position: absolute;
            left: 0;
            bottom: 0;
            width: 100%;
            height: 30px;
            text-align: center;
            transition: all 0.3s ease-in-out;
            overflow: hidden;

            .title {
                line-height: 30px;
                font-size: 16px;
                color: #fff;
            }
        }

         .preview {
            cursor: pointer;
            width: 20px;
            height: 20px;
            background-image: url("/static/preview.png");
            background-repeat: no-repeat;
            background-position: center;
            background-size: 100% 100%;
            position: absolute;
            bottom: 8px;
            right: 8px;
        }

        .checkbox {
            cursor: pointer;
            width: 20px;
            height: 20px;
            border-radius: 10px;
            background: rgba(0, 0, 0, 0.6);
            box-sizing: border-box;
            border: 0.5px solid #ffffff;
            position: absolute;
            top: 8px;
            left: 8px;

            &.checked {
                background: #409eff;

                &::after {
                    content: "";
                    position: absolute;
                    border-left: 2px solid #fff;
                    border-bottom: 2px solid #fff;
                    transform: rotate(-45deg) translate(-16%, -90%);
                    transform-origin: center;
                    top: 50%;
                    left: 50%;
                    width: 9px;
                    height: 4px;
                }
            }
        }

        .icon-close {
            cursor: pointer;
            width: 20px;
            height: 20px;
            border-radius: 50%;
            background-color: #FF5757;
            position: absolute;
            right: 8px;
            top: 8px;
            z-index: 10;

            &::before,
            &::after {
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                content: "";
                width: 12px;
                height: 2px;
                background-color: #fff;
            }

            &::before {
                transform: translate(-50%, -50%) rotate(45deg);
            }

            &::after {
                transform: translate(-50%, -50%) rotate(-45deg);
            }
        }
    }
}

.footer {
    display: flex;
    align-items: center;
    justify-content: flex-end;

    .btn {
        margin-top: 12px;
        cursor: pointer;
        width: 160px;
        height: 36px;
        line-height: 36px;
        text-align: center;
        border-radius: 5px;
        color: #333;
        background: #E7E7E7;
        font-size: 14px;
        font-weight: 500;
        margin-right: 8px;

        &.light {
            background: #F8BA38;
        }
    }
}
</style>
