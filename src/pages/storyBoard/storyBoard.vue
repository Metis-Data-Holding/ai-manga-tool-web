<template>
    <!-- 集数滚动条 -->
    <Episode :nums="20"></Episode>
    <view style="padding: 24px;display: flex;align-items: center;background: #F3F3F3;">
        <!-- 第一列 -->
        <view class="col col-1">
            <view class="opeartionBar radius-left" style="align-items: flex-start;">
                <view style="display: flex;align-items: center;">
                    <image src="/static/tag_finished.png" style="width: 18px;height: 18px;" mode="widthFix"></image>
                    <text style="margin-left: 6px;font-size: 16px;font-weight: bold;">完成进度：xx/xx</text>
                </view>
            </view>
            <view class="section">
                <view class="head">
                    <view class="title">分镜</view>
                    <view class="descTitle">01集_01场_01镜</view>
                </view>
                <view class="content" style="padding-bottom: 42px;">
                    <textarea :value="'sssssssssssssssss'" style="width: 100%; height: 100%"
                        placeholder-style="color:#999"></textarea>
                </view>
                <view class="bottom">
                    <view class="btn" style="padding: 12px;">
                        <image src="/static/tag_finished.png" class="icon" mode="widthFix"></image>
                        <text>标记完成</text>
                    </view>
                </view>
            </view>
        </view>
        <!-- 第二列 -->
        <view class="col col-2">
            <view class="opeartionBar" style="align-items: flex-end;">
                <view class="actionBtn">一键刷新资产</view>
            </view>
            <view class="section">
                <view class="head">
                    <view class="title">多参内容</view>
                </view>
                <view class="content" style="padding-bottom: 42px;">
                    <view class="resourceList">
                        <view class="verticalText"><text class="text">自动匹配</text></view>
                        <scroll-view class="scrollBar" style="flex: 1;padding: 0 6px;" :scroll-x="true"
                            :show-scrollbar="true">
                            <view class="item video" v-for="(item, index) in 20" :key="index">
                                <view class="thumbnail">
                                    <image
                                        src="https://ccyres.acgvr.com/aitools/res/2026/02/05/2cb58680d5b14c0a87579dd8195ac786.jpg"
                                        style="width: 100%;height: 100%;" mode="aspectFill"></image>
                                </view>
                                <text class="desc">里小莫</text>
                            </view>
                        </scroll-view>
                    </view>
                </view>
                <view class="bottom">
                    <view class="btn">项目库</view>
                    <view class="btn">公共库</view>
                    <view class="btn">上传</view>
                </view>
            </view>
        </view>
        <!-- 第三列 -->
        <view class="col col-3">
            <view class="opeartionBar" style="align-items: flex-start;">
                <view style="width: 100%;display: flex;align-items: center;justify-content: space-between;">
                    <view style="display: flex;">
                        <view class="actionBtn blue">全选</view>
                        <view class="actionBtn" style="margin-left: 8PX;">取消</view>
                    </view>
                    <view style="display: flex;">
                        <view class="actionBtn">重新匹配资产</view>
                        <view class="actionBtn yellow" style="margin-left: 8PX;">一键生视频</view>
                    </view>
                </view>
            </view>
            <view class="section" style="display: flex;">
                <view style="width: 63%;;">
                    <view class="head">
                        <view class="checkboxBtn active" style="margin-right: 6px;"></view>
                        <view class="title">文生视频提示词</view>
                    </view>
                    <view class="content" style="padding-bottom: 42px;">
                        <textarea :value="'sssssssssssssssss'" style="width: 100%; height: 100%"
                            placeholder-style="color:#999"></textarea>
                    </view>
                    <view class="bottom" style="background: #F3F3F3;justify-content: flex-start;padding-left: 8px;">
                        <text style="font-weight: bold;font-size: 24px;">@</text>
                    </view>
                </view>
                <view style="width: 37%;">
                    <view class="head">
                        <view class="title">视频设置</view>
                    </view>
                    <view class="content" style="padding-bottom: 42px;background-color: #E7E7E7;">
                        <view class="tagSelector">
                            <view class="title">生成秒数</view>
                            <view class="list">
                                <view class="item" v-for="(item, index) in dicts.duration" :key="item.value"
                                    :class="{ 'active': item.value == state.curSecondValue }"
                                    @click="state.curSecondValue = item.value">{{ item.text }}</view>
                            </view>
                        </view>
                        <view class="tagSelector" style="margin-top: 12px;">
                            <view class="title">生成数量</view>
                            <view class="list">
                                <view class="item" v-for="(item, index) in dicts.quantity" :key="item.value"
                                    :class="{ 'active': item.value == state.curQuantityValue }"
                                    @click="state.curQuantityValue = item.value">{{ item.text }}</view>
                            </view>
                        </view>
                    </view>
                    <view class="bottom" style="background: #E7E7E7;justify-content: flex-start;padding: 8px;">
                        <view class="actionBtn yellow" style="width: 100%;">生视频</view>
                    </view>
                </view>
            </view>
        </view>
        <!-- 第四列 -->
        <view class="col col-4">
            <view class="opeartionBar radius-right" style="align-items: flex-start;border-right: none;">
                <view style="width: 100%;display: flex;align-items: center;justify-content: space-between;">
                    <view style="display: flex;">
                        <view class="actionBtn blue">全选</view>
                        <view class="actionBtn" style="margin-left: 8PX;">取消</view>
                    </view>
                    <view style="display: flex;">
                        <view class="actionBtn yellow">一键超分</view>
                        <view class="actionBtn yellow" style="margin-left: 8PX;">一键导出</view>
                    </view>
                </view>
            </view>
            <view class="section" style="border-right: none;">
                <view class="head">
                    <view class="checkboxBtn active" style="margin-right: 6px;"></view>
                    <view class="title">视频生成结果</view>
                    <view class="subTitle">*选择视频进行二次编辑</view>
                </view>
                <view class="content" style="padding-bottom: 42px;">
                    <VideoList></VideoList>
                </view>
                <view class="bottom">
                    <view class="btn" @click="state.showVideoDetail = true">修改</view>
                    <view class="btn" @click="state.showVideoDetail = true">延长</view>
                    <view class="btn" @click="state.showVideoDetail = true">超分</view>
                </view>
            </view>
        </view>
    </view>
    <VideoDetail v-if="state.showVideoDetail" :durationDict="dicts.duration" :curDurationValue="state.curDurationValue"
        @updateDuration="state.curDurationValue = $event" @close="state.showVideoDetail = false"></VideoDetail>
</template>

<script setup>
import { defineProps, defineEmits, reactive, onMounted } from "vue";
import VideoDetail from "@/components/VideoDetail.vue";
import VideoList from "@/components/resourceList.vue";
import Episode from "@/components/Episode.vue";
const props = defineProps({
    projectConfig: {
        type: Object,
        default: () => { },
    },
});
const emits = defineEmits(["close"]);

const dicts = reactive({
    duration: [{
        value: '5',
        text: '5S'
    }, {
        value: '6',
        text: '6S'
    }, {
        value: '7',
        text: '7S'
    }, {
        value: '8',
        text: '8S'
    }, {
        value: '9',
        text: '9S'
    }, {
        value: '10',
        text: '10S'
    }, {
        value: '11',
        text: '11S'
    }, {
        value: '12',
        text: '12S'
    }, {
        value: '15',
        text: '15S'
    }],
    quantity: [{
        value: '1',
        text: '1'
    }, {
        value: '2',
        text: '2'
    }]
})

const state = reactive({
    curDurationValue: '5',
    curQuantityValue: '1',
    showVideoDetail: false,
})
</script>

<style scoped lang="scss">
.scrollBar {
    width: 100%;
    white-space: nowrap;
    overflow: hidden;
}

.checkboxBtn {
    cursor: pointer;
    width: 16px;
    height: 16px;
    border-radius: 4px;
    background-color: #F3F3F3;

    &.active {
        background-image: url('@/static/sel_icon_2.png');
        background-size: 100% 100%;
        background-repeat: no-repeat;
        background-position: center center;
    }
}

.opeartionBar {
    box-sizing: border-box;
    height: 56px;
    background: #fff;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    margin-bottom: 12px;
    padding: 0 12px;
    border-right: 2px solid #E7E7E7;

    &.radius-left {
        border-top-left-radius: 12px;
        border-bottom-left-radius: 12px;
    }

    &.radius-right {
        border-top-right-radius: 12px;
        border-bottom-right-radius: 12px;
    }
}

.actionBtn {
    padding: 0 18px;
    box-sizing: border-box;
    height: 30px;
    line-height: 30px;
    border-radius: 4px;
    color: #444;
    font-size: 14px;
    text-align: center;
    background-color: #F3F3F3;
    font-weight: bold;
    cursor: pointer;

    .icon{
        width: 14px;
        height: 14px;
    }

    &.yellow {
        background-color: #F8BA38;
    }

    &.blue {
        background: #409EFF;
        color: #fff;
    }
}

.section {
    padding: 12px;
    background: #fff;
    border-right: 2px solid #E7E7E7;
    box-sizing: border-box;
    .head {
        display: flex;
        align-items: center;

        .title {
            font-size: 16px;
            font-weight: bold;
            color: #333;
        }

        .subTitle {
            font-size: 12px;
            color: #666;
            font-weight: 400;
        }

        .descTitle {
            background-color: #E7E7E7;
            height: 20px;
            line-height: 20px;
            border-radius: 4px;
            color: #333333;
            padding: 2px 8px;
            margin-left: 10px;
            align-self: flex-start;
        }
    }

    .content {
        margin-top: 8px;
        background: #F3F3F3;
        padding: 8px;
        height: 200px;
        box-sizing: border-box;
        position: relative;
    }

    .bottom {
        display: flex;
        justify-content: flex-end;
        align-items: center;
        position: relative;
        height: 42px;
        box-sizing: border-box;
        border-radius: 0px 0px 8px 8px;
        background: #E7E7E7;

        .btn {
            cursor: pointer;
            min-width: 60px;
            height: 30px;
            line-height: 30px;
            display: flex;
            align-items: center;
            justify-content: center;
            color: #333;
            font-weight: 500;
            border-radius: 4px;
            margin-right: 6px;
            background: #fff;
            display: inline-block;
            text-align: center;
            .icon{
                width: 14px;
                height: 14px;
                margin-right: 4px;
            }
        }
    }
}

.tagSelector {
    .title {
        font-size: 14px;
        font-weight: bold;
        color: #333;
    }

    .list {
        margin-top: 6px;
        display: flex;
        flex-wrap: wrap;

        .item {
            width: 45px;
            height: 20px;
            line-height: 20px;
            text-align: center;
            border-radius: 5px;
            color: #333;
            background: #fff;
            margin-right: 6px;
            margin-bottom: 6px;
            box-sizing: border-box;
            font-size: 14px;

            &.active {
                color: #fff;
                background: #F8BA38;
            }
        }
    }
}

.col{
}

.col-1 {
    border-radius: 12px 0px 0px 12px;
    width: 14.68%;
}

.col-2 {
    min-width: 304px;
    width: 21.88%;

    .verticalText {
        width: 18px;
        height: 51px;
        border-radius: 12px;
        background-color: #409EFF;
        writing-mode: vertical-rl;
        display: flex;
        align-items: center;
        justify-content: center;

        .text {
            font-size: 12px;
            color: #fff;
            transform: scale(0.9);
            font-weight: 500;
        }
    }

    .resourceList {
        border-radius: 8px;
        background: #F3F3F3;
        height: 75px;
        display: flex;

        .item {
            display: inline-block;
            margin-left: 6px;

            .thumbnail {
                width: 40px;
                height: 40px;
                border-radius: 4px;
                overflow: hidden;
                position: relative;
            }

            &.video .thumbnail::before {
                content: '';
                position: absolute;
                z-index: 2;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background-color: rgba(0, 0, 0, 0.5);
            }

            &.video .thumbnail::after {
                content: '';
                position: absolute;
                z-index: 3;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                width: 16px;
                height: 16px;
                background-image: url('/static/play.png');
                background-size: cover;
                background-position: center;
                background-repeat: no-repeat;
            }

            .desc {
                font-size: 12px;
            }
        }
    }
}

.col-3 {
    flex: 1;
}

.col-4 {
    width: 27.35%;
}
</style>
