<template>
    <!-- 融图参数弹窗 -->
    <Teleport to="body">
        <view class="popup-rongtu-setting">
            <view class="tagSelector" style="margin-top: 12px;">
                <view class="title">图片质量</view>
                <view class="list">
                    <view class="item" v-for="(item, index) in state.resolutionList" :key="item.value"
                        :class="{ 'active': item == state.curresolution }" @click="handleChange(item, 'curresolution')">
                        {{ item }}
                    </view>
                </view>
            </view>
            <view class="tagSelector" style="margin-top: 12px;">
                <view class="title">画幅尺寸</view>
                <view class="list">
                    <view class="item" v-for="(item, index) in state.ratioList" :key="item.value"
                        :class="{ 'active': item == state.curratio }" @click="handleChange(item, 'curratio')">{{ item }}
                    </view>
                </view>
            </view>
            <view class="tagSelector" style="margin-top: 12px;">
                <view class="title">生成数量</view>
                <view class="list">
                    <view class="item" v-for="(item, index) in [1, 2, 3, 4]" :key="item.value"
                        :class="{ 'active': item == state.curCount }" @click="handleChange(item, 'curCount')">{{ item }}
                    </view>
                </view>
            </view>
            <view class="footer">
                <view class="btn" @click="handleClose">取消</view>
                <view class="btn light" @click="rawConfirm">确定</view>
            </view>
        </view>
        <view class="mask"></view>
    </Teleport>
</template>

<script setup name="PopupRongtuSetting">
import { reactive, ref, computed, watch } from "vue";
const emit = defineEmits(["close", "confirm"]);
const props = defineProps({
    show: {
        type: Boolean,
        required: true,
        default: false,
    },
    value: {
        type: Object,
        default: () => ({
            resolution: "1K",
            ratio: "9:16",
            count: 1,
        }),
    },
});

const state = reactive({
    resolutionList: ["1K", "2K", "3k", "4K"],
    ratioList: ["9:16", "16:9", "4:3", "3:4", "1:1"],

    curresolution: "1K",
    curratio: "9:16",
    curCount: 1,
});

watch(() => props.value, (newVal) => {
    state.curresolution = newVal.resolution
    state.curratio = newVal.ratio
    state.curCount = newVal.count
}, {
    deep: true,
    immediate: true,
})

const handleChange = (item, prop) => {
    state[prop] = item
}

const handleClose = () => {
    emit("close")
}

const rawConfirm = () => {
    emit("confirm", {
        resolution: state.curresolution,
        ratio: state.curratio,
        count: state.curCount,
    })
    handleClose()
}

</script>
<style scoped lang="scss">
.mask {
    position: fixed;
    z-index: 98;
    background: rgba(0, 0, 0, .6);
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
}

.popup-rongtu-setting {
    border-width: 0px;
    position: fixed;
    z-index: 99;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    min-width: 420px;
    min-height: 248px;
    background-color: #FFF;
    border-radius: 12px;
    padding: 20px 16px;
    box-sizing: border-box;

    .footer {
        display: flex;
        align-items: center;
        justify-content: flex-end;
        margin-top: 12px;

        .btn {
            cursor: pointer;
            width: 120px;
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

    .tagSelector {
        margin-top: 20px;

        &:first-child {
            margin-top: 0;
        }

        .title {
            font-size: 16px;
            font-weight: bold;
            color: #333;
        }

        .list {
            margin-top: 8px;
            display: flex;
            flex-wrap: wrap;

            .item {
                min-width: 70px;
                height: 32px;
                line-height: 32px;
                border: 1px solid #DCDCDC;
                padding: 0 8px;
                text-align: center;
                border-radius: 5px;
                color: #333;
                background: linear-gradient(0deg, #F3F3F3, #F3F3F3), #FFFFFF;
                margin-right: 6px;
                margin-bottom: 6px;
                box-sizing: border-box;
                font-size: 14px;
                font-weight: 500;

                cursor: pointer;
                transition: background-color 0.2s ease-in-out;

                &.active {
                    background: #F8BA38;
                }
            }
        }
    }
}
</style>
