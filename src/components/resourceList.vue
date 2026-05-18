<template>
    <view class="videoList">
        <view class="item active" v-for="(item, index) in 20" :key="index">
            <view class="pending" v-if="false">
                <view class="text">队列中</view>
                <view class="revertBtn">撤销</view>
            </view>
            <view class="finished" v-else>
                <view class="thumbnail">
                    <image src="https://ccyres.acgvr.com/aitools/res/2026/02/05/2cb58680d5b14c0a87579dd8195ac786.jpg"
                        style="width: 100%;height: 100%;" mode="aspectFill"></image>
                </view>
                <view class="cover">
                    <view class="head">
                        <!-- <view class="tag">展开</view> -->
                        <view class="checkbox"></view>
                    </view>
                    <view class="playBtn"></view>
                    <view class="tag bottomTag light">草稿5s</view>
                </view>
            </view>
        </view>
    </view>
</template>

<script setup name="ResourceList">
import { reactive, onMounted } from "vue";
const props = defineProps({
    
    history: {
        type: Array,
        default: [],
    },
});
</script>

<style scoped lang="scss">
.videoList {
    width: 100%;
    white-space: nowrap;
    overflow: hidden;
    overflow-x: scroll;

    .item {
        margin-right: 8px;
        display: inline-block;
        background-color: #666666;
        width: 87px;
        height: 156px;
        border-radius: 6px;
        overflow: hidden;
        position: relative;

        &.active {
            border: 2px solid #F8BA38;
        }

        &:last-child {
            margin-right: 0;
        }

        .thumbnail {
            width: 100%;
            height: 100%;
            position: relative;
        }

        .pending {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;

            .text {
                font-size: 12px;
                color: #fff;
            }

            .revertBtn {
                margin-top: 6px;
                font-size: 12px;
                width: 42px;
                height: 18px;
                color: #fff;
                font-weight: 500;
                background-color: #FF5757;
                border-radius: 9px;
                text-align: center;
            }
        }

        .finished {
            position: relative;
            height: 100%;
            width: 100%;
            z-index: 2;

            .cover {
                background: rgba(0, 0, 0, 0.5);
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;

                .head {
                    display: flex;
                    justify-content: flex-end;

                    .checkbox {
                        width: 16px;
                        height: 16px;
                        border-radius: 4px;
                        background-color: #F3F3F3;
                        cursor: pointer;
                    }
                }

                .tag {
                    padding: 2px 4px;
                    border-radius: 3px;
                    background: rgba(0, 0, 0, 0.4);
                    font-size: 12px;
                    color: #fff;

                    &.bottomTag {
                        position: absolute;
                        right: 0;
                        bottom: 0;
                        z-index: 2;
                    }

                    &.light {
                        color: #333;
                        background: linear-gradient(89deg, #2BE851 0%, #A5ED48 72%);
                        ;
                    }
                }

                .playBtn {
                    position: absolute;
                    z-index: 3;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    width: 32px;
                    height: 32px;
                    background-image: url('/static/play.png');
                    background-size: cover;
                    background-position: center;
                    background-repeat: no-repeat;
                    cursor: pointer;
                }
            }
        }
    }

    .item.active .checkbox {
        background-image: url('/static/sel_icon.png');
        background-size: cover;
        background-position: center;
        background-repeat: no-repeat;
    }
}
</style>
