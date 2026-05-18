<template>
    <Teleport to="body">
        <view>
            <view class="popup-resource-editor">
                <view class="icon-close-popup" @click="handleClose"></view>
                <view class="resourcePreview">
                    <image :src="state.url" style="width: 100%;height: 100%;" mode="aspectFit" @load="handleImageLoad">
                    </image>
                </view>
                <view
                    style="width: 23.2%;min-width: 320px;display: flex;flex-direction: column;align-items: center;padding: 0 8px 0 20px;box-sizing: border-box;height: 100%;">
                    <view class="headTitle">资产图片详情</view>
                    <view class="section section-sp" v-if="state.historyContent">
                        <view class="title">
                            <image class="image" src="/static/desc_icon.png" style="width: 16px;height: 16px;"></image>
                            <text class="text">资产SP生图描述</text>
                        </view>
                        <view class="content" style="flex: 1;display: flex;flex-direction: column;min-height: 0;">
                            <view class="info" style="flex: 1;min-height: 0;display: flex;flex-direction: column;">
                                <textarea style="width: 100%; height: 200px;overflow-x: hidden;flex: 1;min-height: 0;"
                                    placeholder-style="color:#999" disabled :value="state.historyContent.prompt"
                                    placeholder="请填写图片生成的SP描述" :maxlength="-1"></textarea>
                                <view
                                    style="margin-left: 6px;width: 40px;height: 40px;position: relative;margin-bottom: 6px;padding-top: 8px;"
                                    v-for="(item, index) in state.historyContent.urls" :key="item.id">
                                    <image @click="uni.previewImage({ urls: [item] })" :src="item"
                                        style="width: 100%; height: 100%;border-radius: 4px;border: 1px dashed #e3e3e3;box-sizing: border-box;"
                                        mode="aspectFill"></image>
                                    <view v-show="state.historyContent.urls.length > 1"
                                        @click="uni.previewImage({ urls: [item] })"
                                        style="position: absolute;bottom: 0;left: 0;width: 100%;height: 16px;color: #fff;font-size: 12px;text-align: center;background-color: rgba(0,0,0,0.7);">
                                        图片{{ index + 1 }}</view>
                                </view>
                            </view>
                            <view class="tags">
                                <view class="tag-item">模型 {{ state.historyContent.modelName || '' }}</view>
                                <view class="tag-item">画幅 {{ state.historyContent.ratio || '' }}</view>
                                <view class="tag-item">画质 {{ state.historyContent.resolution || '' }}</view>
                            </view>
                        </view>
                    </view>
                    <view class="section section-history">
                        <view class="title">
                            <image class="image" src="/static/history.png" style="width: 16px;height: 16px;"></image>
                            <text class="text">历史生图</text>
                        </view>
                        <view class="content" style="flex: 1;min-height: 0;">
                            <scroll-view class="resourceList" scroll-y>
                                <block v-for="(item, index) in historyList" :key="item.id">
                                    <view @click="handleSelect(item, index)"
                                        :class="'item ' + (state.selectedIndex == index ? 'active' : '')"
                                        style="background-color: #666666;">
                                        <template v-if="[-1, 0, 1, 2, 3, 4].includes(item.status)">
                                            <view
                                                style="width: 100%;position: absolute;z-index: 1;top: 50%;left: 50%;transform: translate(-50%, -50%);color: #fff;display: flex;flex-direction: column;align-items: center;">
                                                <image v-show="item.status == 3" src="/static/erroricon.png"
                                                    style="width: 32px;height: 32px;margin-bottom: 8px;"
                                                    mode="widthFix">
                                                </image>
                                                <view style="text-align: center;">
                                                    <text v-show="[-1, 0].includes(item.status)">队列中</text>
                                                    <text v-show="[1, 2, 4].includes(item.status)">生成中</text>
                                                    <text v-show="item.status == 3">生成失败</text>
                                                </view>
                                                <view v-show="[-1, 0].includes(item.status)"
                                                    @click.stop="handleCancelImageGeneration(item, index)"
                                                    style="margin-top: 5px;width: 42px;height: 18px;border-radius: 21px;line-height: 18px;text-align: center;font-size: 12px;background-color: #FF5757;cursor: pointer;">
                                                    撤销</view>
                                                <view v-show="[3].includes(item.status)"
                                                    @click.stop="getTaskInfo(item.id)"
                                                    style="margin-top: 5px;width: 60px;height: 18px;border-radius: 21px;line-height: 18px;text-align: center;font-size: 12px;background-color: #FF5757;cursor: pointer;">
                                                    查看原因</view>
                                                <view v-show="[1, 2, 4].includes(item.status)" class="loadingIcon">
                                                </view>
                                            </view>
                                        </template>
                                        <template v-else-if="item.status == 5">
                                            <image :src="item.ossUrl" style="width: 100%; height: 100%;cursor: pointer;"
                                                mode="aspectFit">
                                            </image>
                                            <!-- <view class="textTag" @click.stop="handleOpenResourceEditorPopup(item, form.name)">
                                                <image src="/static/proDetaiIcon_white.png" style="width: 12px; height: 12px;"
                                                    mode="aspectFit"></image>
                                                <text style="padding-left: 4px;">预览</text>
                                            </view> -->
                                            <!-- <view class="desc">{{ item.name }}</view> -->
                                        </template>
                                        <view v-if="[3, 5].includes(item.status) && props.editable" class="deleteIcon"
                                            @click.stop="handleRemoveHistoryImage(item, index)">
                                        </view>
                                    </view>
                                </block>
                            </scroll-view>
                        </view>
                    </view>
                    <view class="footer" style="width: 100%;display: flex;align-items: center;height: 56px;">
                        <view
                            style="flex:1;height: 40px;margin-bottom: 16px;cursor: pointer;display: flex;align-items: center;color: #fff;background-color: #409EFF;border-radius: 8px; justify-content: center;margin-right: 8px;"
                            @click="handleDownload(2)">
                            <image src="/static/tag_download.png" style="width: 20px;" mode="widthFix"></image>
                            <text>送审下载</text>
                        </view>
                        <view
                            style="flex:1;height: 40px;margin-bottom: 16px;cursor: pointer;display: flex;align-items: center;color: #fff;background-color: #409EFF;border-radius: 8px; justify-content: center;margin-left: 8px;"
                            @click="handleDownload">
                            <image src="/static/tag_download.png" style="width: 20px;" mode="widthFix"></image>
                            <text>原图下载</text>
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

const emit = defineEmits(["close", "confirm", "cancelGeneration", "getTaskInfo"]);
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
    index: {
        type: Number,
        required: true,
        default: 0,
    },
    name: {
        type: String,
        required: true,
        default: '',
    },
});

const historyList = computed(() => {
    return props.data.filter(item => item.status != 8);
})

const state = reactive({
    selectedIndex: 0,
    historyContent: null,
    selectedIndex: 0,
    url: '',
});

const handleClose = () => {
    emit("close")
}

const handleDownload = async (type = 1) => {
    const target = historyList.value[state.selectedIndex];
    let url = target?.ossUrl || '';
    if (process.env.NODE_ENV === 'development') {
        url = url.replace(
            'https://aires.jigentoys.net',
            '/api-video'
        );
    }
    const fileName = props.name;
    uni.showLoading({
        title: '处理中…',
    })
    try {
        let file = await urlToFile(url, fileName);
        if (type == 2) {
            file = await convertImageFormat(file, 'image/jpeg');
        }
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

const handleImageLoad = (e) => {
}

const handleSelect = (item, index) => {
    if(item.status!=5){
        return
    }
    state.selectedIndex = index;
    getDetail()
}

const handleCancelImageGeneration = (item, index) => {
    emit('cancelGeneration', { item, index })
}

const getTaskInfo = (id) => {
    emit('getTaskInfo', id)
}

const getDetail = () => {
    const id = historyList.value[state.selectedIndex].id;
    state.url = historyList.value[state.selectedIndex].ossUrl || '';
    getRequest(`${APIPath.aiTask}/${id}`, (resData) => {
        if (resData.code == 200) {
            try {
                const { paramsValue, modelId, name, modelInterface } = resData.data;
                const content = JSON.parse(paramsValue);
                switch (modelInterface) {
                    case 'BananaTextImage': //香蕉2 //香蕉pro
                    case 14:
                    case 15:
                        state.historyContent = {
                            prompt: content.input[0]?.params?.prompt || '',
                            ratio: content.input[0]?.params?.aspect_ratio || '',
                            resolution: content.input[0]?.params?.resolution || '',
                            urls: content.input[0]?.params?.image_urls || [],
                        }
                        break;
                    case 'KirinV3TextImage'://可灵
                        state.historyContent = {
                            prompt: content.input[0]?.params?.prompt || '',
                            ratio: content.input[0]?.params?.aspect_ratio || '',
                            resolution: content.input[0]?.params?.resolution || '',
                            urls: content.input[0]?.params?.image_list?.map(item => item.image) || [],
                        }
                        break;
                    case 'Doubaoseedream5_0liteTextImage': //豆包seedream5.0lite 海外豆包seedream5.0lite 豆包seedream4.5 海外豆包seedream4.5
                        const { standardRatio, level } = parseResolution(...content.size.split('x'));
                        state.historyContent = {
                            prompt: content.prompt || '',
                            ratio: standardRatio,
                            resolution: level,
                            urls: typeof (content.image) == 'string' ? [content.image] : content.image,
                        }
                        break;
                }
                state.historyContent.modelName = name

                // console.log('content', content, state.historyContent)
            } catch (err) {
                console.error('解析失败:', err);
            }
        }
    })
}

onMounted(() => {
    state.selectedIndex = props.index;
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
        height: 36px;
        line-height: 36px;
        flex-shrink: 0;
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
        height: 35%;
        flex-shrink: 0;
    }

    .section-history {
        flex: 1;
        min-height: 0;
        display: flex;
        flex-direction: column;
        overflow-y: hidden;
        margin-bottom: 8px;
    }

    .tags {
        margin-top: 6px;
        width: 100%;
        display: flex;
        align-items: center;
        flex-wrap: wrap;

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
        height: 100%;

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
}

.loadingIcon {
    margin-top: 8px;
    width: 20px;
    height: 20px;
    border: 4rpx solid;
    border-radius: 50%;
    border-color: #fff;
    border-top-color: transparent;
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
</style>
