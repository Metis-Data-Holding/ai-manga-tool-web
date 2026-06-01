<template>
    <Teleport to="body">
        <view>
            <view class="popup-resource-editor">
                <view class="icon-close-popup" @click="handleClose"></view>
                <view class="resourcePreview">
                    <video object-fit="contain" style="height: 100%;width: 100%;" autoplay :src="state.url"
                        id="preVideo" :loop="true" :controls="true">
                    </video>
                </view>
                <view
                    style="width: 23.2%;min-width: 320px;display: flex;flex-direction: column;align-items: center;padding: 0 8px 0 20px;box-sizing: border-box;height: 100%;">
                    <view class="headTitle">分镜视频详情</view>
                    <view class="section section-sp" v-if="state.historyContent">
                        <view style="display: flex;align-items: center;justify-content: flex-start;">
                            <view class="title">
                                <image class="image" src="/static/desc_icon.png" style="width: 16px;height: 16px;"></image>
                                <text class="text">视频提示词</text>
                            </view>
                            <view
                                style="margin-left: 12px;padding: 0 6px;height: 28px;line-height: 28px;text-align: center;border-radius: 4px;color: rgb(104, 108, 116);font-size: 14px;background: #f4f4f5;cursor: pointer;border: 1px solid #dcdfe6;"
                                @click="copyContent">复制内容</view>
                        </view>
                        <view class="content" style="flex: 1;display: flex;flex-direction: column;min-height: 0;">
                            <view class="info" style="flex: 1;min-height: 0;display: flex;flex-direction: column;">
                                <textarea style="width: 100%; height: 200px;overflow-x: hidden;flex: 1;min-height: 0;"
                                    placeholder-style="color:#999" disabled :value="state.historyContent.prompt"
                                    placeholder="请填写图片生成的SP描述" :maxlength="-1"></textarea>
                            </view>
                            <view class="tags">
                                <view class="tag-item">模型 {{ state.historyContent.modelName || '' }}</view>
                                <view class="tag-item">画幅 {{ state.historyContent.ratio || '' }}</view>
                                <view class="tag-item">画质 {{ state.historyContent.resolution || '' }}</view>
                                <view class="tag-item">时长 {{ state.historyContent.duration || '' }}</view>
                                <view class="tag-item" v-if="state.historyContent.huafengName">画风 {{ state.historyContent.huafengName }}</view>
                                <view class="tag-item" v-if="state.historyContent.subtitlesStatus === 1">去字幕</view>
                                <view class="tag-item" v-if="state.historyContent.enhanceStatus === 1 && state.historyContent.templateId">超分-{{ props.enchanceMap[state.historyContent.templateId] }}</view>
                            </view>
                        </view>
                    </view>
                    <view class="section section-history">
                        <view class="title">
                            <image class="image" src="/static/history.png" style="width: 16px;height: 16px;"></image>
                            <text class="text">历史生成</text>
                        </view>
                        <view class="content" style="flex: 1;min-height: 0;">
                            <scroll-view
                                style="flex:1;min-height: 0; display: flex;white-space: nowrap;overflow: scroll;overflow-y: hidden;overflow-x: auto;height: 420rpx;border-radius: 16rpx 16rpx 0px 0px;"
                                scroll-x="true">
                                <block v-for="(statusitem, statusindex) in props.data" :key="statusindex">
                                    <view v-if="[3, 11, 12, 14].includes(statusitem.status)"
                                        style="display: flex;flex-direction: column;align-items: center;margin-right:16rpx;display: inline-block;position: relative;">
                                        <view
                                            style="width: 152rpx;height: 340rpx;background: #666666;border-radius: 8rpx;display: flex;align-items: center;justify-content: center;position: relative;overflow: hidden;flex-direction: column;">
                                            <view
                                                style="position: absolute;top: 35%;display: flex;justify-content: center;flex-direction: column;align-items: center;">
                                                <image src="/static/erroricon.png"
                                                    style="width: 48rpx;height: 48rpx;margin-bottom: 10rpx;"></image>
                                                <text
                                                    style="color:#FFFFFF;font-size: 24rpx;font-weight: 500;margin-bottom: 10rpx;">{{
                                                        statusTextMap[statusitem.status] }}</text>
                                                <view @click="getTaskInfo(statusitem.taskId)"
                                                    style="font-size: 20rpx;color: #FFFFFF;font-weight: 500;width: 108rpx;height: 36rpx;line-height: 36rpx; background: #FF5757;border-radius: 18rpx;display: flex;justify-content: center;align-items: center;cursor: pointer;">
                                                    查看原因</view>
                                            </view>
                                        </view>
                                        <image @click="deleteTask(statusindex, statusitem.taskId, 5)"
                                            style="width: 56rpx; height: 56rpx;position: absolute;top: 6px;right: 4px;cursor: pointer;"
                                            src="/static/tag_shanchu.png">
                                        </image>
                                    </view>
                                    <view v-else-if="[0, 2, 13, 15].includes(statusitem.status)"
                                        style="display: flex;flex-direction: column;align-items: center;margin-right:16rpx;display: inline-block;margin-top: 30rpx;">
                                        <view
                                            style="width: 152rpx;height: 340rpx;background: #666666;border-radius: 8rpx;display: flex;align-items: center;justify-content: center;position: relative;overflow: hidden;flex-direction: column;">
                                            <view
                                                style="position: absolute;top: 40%;display: flex;justify-content: center;flex-direction: column;align-items: center;">
                                                <view class="loading-circle"
                                                    :style="{ borderColor: '#ffffff', borderTopColor: 'transparent' }">
                                                </view>
                                                <text
                                                    style="color:#FFFFFF;font-size: 24rpx;font-weight: 500;margin-bottom: 10rpx;">{{
                                                        statusTextMap[statusitem.status] }}</text>
                                                <view v-if="statusitem.status == 2"
                                                    @click="cancelTaskQueue(index, statusitem.taskId)"
                                                    style="font-size: 20rpx;color: #FFFFFF;font-weight: 500;width: 84rpx;height: 36rpx;background: #FF5757;border-radius: 18rpx;display: flex;justify-content: center;align-items: center;cursor: pointer;">
                                                    撤销</view>
                                            </view>
                                        </view>
                                    </view>
                                    <view v-else-if="statusitem.status == 5"
                                        style="display: flex;flex-direction: column;align-items: center;margin-right:16rpx;display: inline-block;">
                                        <view
                                            :style="'width: 152rpx;height: 340rpx;background: #E7E7E7;border-radius: 8rpx;display: flex;align-items: center;justify-content: center;position: relative;border: 4px solid ' + (statusindex == state.selectedIndex ? '#FCC34A' : 'rgba(0, 0, 0, 0)') + ';overflow: hidden;'">
                                            <video @click="handleSelect(statusitem, statusindex)"
                                                style="width: 100%;height: 100%" :src="statusitem.url" :controls="false"
                                                :show-fullscreen-btn="false" :show-center-play-btn="false"
                                                object-fit="contain"></video>
                                            <view
                                                style="position: absolute;top: 0;width: 100%;display: flex;justify-content: flex-end;z-index: 2;">
                                                <image @click="deleteTask(statusindex, statusitem.taskId, 5)"
                                                    style="width: 56rpx; height: 56rpx;cursor: pointer;top: 6px;right: 4px;"
                                                    src="/static/tag_shanchu.png">
                                                </image>
                                            </view>
                                            <image v-if="statusindex == state.selectedIndex" src="/static/sel_icon_yellow.png" style="position: absolute;left: 0;top: 0; width: 48rpx;height: 48rpx;" />
                                            <view
                                                style="color: #FFFFFF;position: absolute;bottom: 0;width: 100%;display: flex;justify-content: flex-end;z-index: 2;border-radius: 6rpx;background: rgba(0, 0, 0, 0.4);">
                                                <view v-if="statusitem.enhanceStatus===1&&statusitem.templateId" style="width: 112rpx;height: 32rpx;background: linear-gradient(89deg, #2BE851 0%, #A5ED48 72%);border-radius: 6rpx;font-size: 20rpx;color: #333;display: flex;justify-content: center;align-items: center;">超分{{ props.enchanceMap[statusitem.templateId] }}</view>
															<view v-if="statusitem.subtitlesStatus===1" style="width: 60rpx;height: 32rpx;background: rgba(0, 0, 0, 0.4);border-radius: 6rpx;font-size: 20rpx;color: #FFFFFF;display: flex;justify-content: center;align-items: center;margin-top: 2px;">去字幕</view>
                                                <!-- <view
                                                    style="width: 60rpx;height: 32rpx;background: rgba(0, 0, 0, 0.4);border-radius: 6rpx;font-size: 20rpx;color: #FFFFFF;display: flex;justify-content: center;align-items: center;">
                                                    草稿</view> -->
                                            </view>
                                        </view>
                                    </view>
                                </block>
                            </scroll-view>
                        </view>
                    </view>
                    <view class="footer" style="width: 100%;display: flex;align-items: center;">
                        <view
                            style="flex:1;height: 40px;margin-bottom: 16px;cursor: pointer;display: flex;align-items: center;color: #FF5757;background-color: transparent;border-radius: 8px; justify-content: center;margin-right: 8px;box-sizing: border-box;border: 1px solid #FF5757;"
                            @click="handleDelete">
                            <text>删除视频</text>
                        </view>
                        <view
                            style="flex:1;height: 40px;margin-bottom: 16px;cursor: pointer;display: flex;align-items: center;color: #fff;background-color: #409EFF;border-radius: 8px; justify-content: center;margin-left: 8px;"
                            @click="handleDownload">
                            <image src="/static/tag_download.png" style="width: 20px;" mode="widthFix"></image>
                            <text>下载视频</text>
                        </view>
                    </view>
                </view>
            </view>
        </view>
        <view class="mask"></view>
    </Teleport>
</template>

<script setup name="PopupResourceEditor">
import { reactive, ref, computed, onMounted, watch } from "vue";
import { APIPath, getRequest } from "@/common/APIRequest";
import { urlToFile, convertImageFormat, downloadFile, parseResolution } from "@/common/Tool";

const emit = defineEmits(["close", "confirm", "getTaskInfo", "cancelTaskQueue", "deleteTask"]);
const props = defineProps({
    show: {
        type: Boolean,
        required: true,
        default: false,
    },
    data: {
        type: Object,
        required: true,
    },
    cameraIndex: {
        type: Number,
        required: true,
        default: 0,
    },
    videoResultUrl: {
        type: String,
        required: true,
        default: '',
    },
    name: {
        type: String,
        required: true,
        default: '',
    },
    statusTextMap: {
        type: Object,
        required: true,
        default: () => { },
    },
    enchanceMap: {
        type: Object,
        required: true,
        default: () => { },
    },
});

const state = reactive({
    selectedIndex: 0,
    historyContent: null,
    selectedIndex: 0,
    url: '',
});

const handleClose = () => {
    emit("close")
}

const handleDownload = async () => {
    const target = props.data[state.selectedIndex];
    console.log('target', target)
    let url = target?.url || '';
    if (process.env.NODE_ENV === 'development') {
        url = url.replace(
            'https://aires.jigentoys.net',
            '/api-video'
        );
    }
    const fileName = props.name;
    console.log('url', url, fileName)
    uni.showLoading({
        title: '处理中…',
    })
    try {
        let file = await urlToFile(url, fileName);
        const prefix = file.type.split('/')[1];
        downloadFile(file, `${fileName}.${prefix.toLowerCase()}`);
        uni.showToast({
            title: '下载成功',
            icon: 'success',
        })
    } catch (err) {
        uni.showToast({
            title: '下载失败',
            icon: 'none',
        })
        console.error('下载失败:', err);
    } finally {
        uni.hideLoading()
    }
}

const handleSelect = (item, index) => {
    state.selectedIndex = index;
    getDetail()
}

const getTaskInfo = (id) => {
    emit('getTaskInfo', id)
}

const cancelTaskQueue = () => {
    emit(cancelTaskQueue, { index: props.cameraIndex, taskId: props.data[state.selectedIndex].taskId })
}

const deleteTask = (statusindex, taskId, typeId) => {
    console.log('deleteTask')
    emit('deleteTask', { index: props.cameraIndex, statusindex, taskId, typeId: typeId })
}

const handleDelete = () => {
    console.log('handleDelete')
    emit('deleteTask', { index: props.cameraIndex, statusindex: state.selectedIndex, taskId: props.data[state.selectedIndex].taskId, typeId: 5 })
}

const getDetail = () => {
    const id = props.data[state.selectedIndex].taskId;
    state.url = props.data[state.selectedIndex].url || '';
    getRequest(`${APIPath.aiTask}/${id}`, (resData) => {
        if (resData.code == 200) {
            try {
                const { paramsValue, modelId, name, modelInterface, enhanceStatus, templateId, subtitlesStatus,frontExpand } = resData.data;
                const content = JSON.parse(paramsValue);

                //如果有新增字段，拿新增字段里面的
                if(frontExpand){
                    const _frontExpand = JSON.parse(frontExpand);
                    state.historyContent = {
                        prompt:_frontExpand.prompt,
                        huafengName:_frontExpand.huafeng?.name,
                        ratio:_frontExpand.ratio,
                        resolution:_frontExpand.resolution,
                        duration:_frontExpand.duration,
                    }
                }
                // 没新增字段，从总SP里面获取并按不同模型的结构来解析
                else{
                    switch (modelInterface) {
                        case 'seedance2': // 16 17 44 45 46 47 48 49 50 51
                        case 'DoubaoSeedance1_5Video':
                            state.historyContent = {
                                prompt: content.content[0]?.text || '',
                                ratio: content.ratio,
                                resolution: content.resolution,
                                duration: content.duration || '',
                            }
                            break;
                        case 'aliToVideo':
                            state.historyContent = {
                                prompt: content.input.prompt,
                                ratio: content.parameters.ratio,
                                resolution: content.parameters.resolution,
                                duration: content.parameters.duration || '',
                            }
                            break;
                        case 'ViduQ3Video':
                            state.historyContent = {
                                prompt: content.input[0]?.params?.prompt || '',
                                ratio: content.input[0]?.params?.aspect_ratio || '',
                                resolution: content.input[0]?.params?.resolution || '',
                                duration: content.input[0]?.params?.duration || '',
                            }
                            break;
                        case 'KirinV3Omni':
                            state.historyContent = {
                                prompt: content.input[0]?.params?.prompt || '',
                                ratio: content.input[0]?.params?.aspect_ratio || '',
                                resolution: (content.input[0]?.params?.mode == 'std' ? '720p' : '1080p') || '',
                                duration: content.input[0]?.params?.duration || '',
                            }
                            break;
                    }
                }

                state.historyContent.modelName = name;
                state.historyContent.subtitlesStatus = subtitlesStatus;
                state.historyContent.enhanceStatus = enhanceStatus;
                state.historyContent.templateId = templateId;
            } catch (err) {
                console.error('解析失败:', err);
            }
        }
    })
}

const copyContent = () => {
    uni.setClipboardData({
        data: state.historyContent.prompt,
        success: () => {
            uni.showToast({ title: '复制成功', icon: 'none' })
        },
        fail: (err) => {
            console.error('复制失败', err)
        }
    })
}

onMounted(() => {
    state.selectedIndex = props.data.findIndex(item => item.url == props.videoResultUrl);
    getDetail()
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

.popup-resource-editor {
    border-width: 0px;
    position: fixed;
    z-index: 99;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    width: 95.555vw;
    height: 51.663vw;
    max-height: 96%;
    background-color: #fff;
    border-radius: 12px;
    padding: 12px;
    box-sizing: border-box;
    display: flex;

    .headTitle {
        width: 100%;
        font-size: 24px;
        font-weight: 600;
        color: #FFA701;
        text-align: left;
    }

    .resourcePreview {
        flex: 1;
        height: 100%;
        border-radius: 10px;
        background: linear-gradient(0deg, #999999, #999999), rgba(0, 0, 0, 0.2);
        overflow: hidden;
    }

    .section {
        margin-top: 16px;
        width: 100%;

        .title {
            display: flex;
            align-items: center;
            font-weight: 600;
            font-size: 16px;

            .image {
                width: 100%;
                height: 100%;
            }

            .text {
                padding-left: 6px;
                color: #333333;
                font-size: 16px;
            }
        }

        .content {
            margin-top: 8px;

            .info {
                padding: 8px;
                border-radius: 8px;
                border: 1px solid #CCCCCC;
                background: #E7E7E7;
            }
        }
    }

    .section-sp {
        display: flex;
        flex-direction: column;
        flex: 1;
        min-height: 0;
    }

    .section-history {
        height: 500rpx;
        display: flex;
        flex-direction: column;
        overflow-y: hidden;
        margin-bottom: 8px;
    }

    .tags {
        margin-top: 6px;
        width: 100%;
        display: flex;
        flex-wrap: wrap;
        align-items: center;

        .tag-item {
            height: 30px;
            line-height: 30px;
            border-radius: 4px;
            color: #333;
            background-color: #E7E7E7;
            font-size: 14px;
            margin-right: 6px;
            text-align: center;
            padding: 4px 8px;
            margin-bottom: 8px;
        }
    }

    .resourceList {
        margin-top: 10px;
        height: 300px;

        .item {
            display: inline-block;
            vertical-align: top;
            position: relative;
            width: 105px;
            height: 105px;
            box-sizing: border-box;
            border-radius: 4px;
            overflow: hidden;
            margin: 0 5px;
            margin-bottom: 10px;
            vertical-align: top;

            .thumbnail {
                width: 100%;
                height: 100%;
            }

            &.active::after {
                cursor: pointer;
                position: absolute;
                left: 0;
                top: 0;
                content: '';
                width: 100%;
                height: 100%;
                box-sizing: border-box;
                z-index: 2;
                border: 3px solid #FCC34A;
            }

            &.active::before {
                position: absolute;
                content: '';
                left: 0;
                top: 0;
                background-image: url('/static/sel_icon.png');
                background-size: 100% 100%;
                background-position: center;
                background-repeat: no-repeat;
                width: 20px;
                height: 20px;
                z-index: 3;
            }

            .desc {
                position: absolute;
                bottom: 0;
                left: 0;
                width: 100%;
                height: 24px;
                line-height: 24px;
                text-align: center;
                font-size: 12px;
                color: #fff;
                background: rgba(0, 0, 0, 0.6);
                backdrop-filter: blur(10px);
            }

            .textTag {
                cursor: pointer;
                position: absolute;
                left: 50%;
                bottom: 6px;
                transform: translateX(-50%);
                font-size: 12px;
                color: #fff;
                display: flex;
                align-items: center;
                justify-content: center;
                width: 60px;
                height: 20px;
                background: rgba(0, 0, 0, 0.6);
                border-radius: 4px;
                z-index: 3;
            }

            .deleteIcon {
                visibility: hidden;
                cursor: pointer;
                position: absolute;
                top: 6px;
                right: 6px;
                width: 24px;
                height: 24px;
                background-image: url('/static/tag_shanchu.png');
                background-repeat: no-repeat;
                background-size: 100% 100%;
                background-position: center;
                z-index: 3;
            }

            &:hover {
                .deleteIcon {
                    visibility: visible;
                }
            }
        }
    }

    .loading-circle {
        width: 48rpx;
        height: 48rpx;
        border: 4rpx solid;
        border-radius: 50%;
        animation: loading-rotate 1s linear infinite;
    }

    @keyframes loading-rotate {
        0% {
            transform: rotate(0deg);
        }

        100% {
            transform: rotate(360deg);
        }
    }
}
</style>
