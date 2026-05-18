<template>
    <Teleport to="body">
        <view>
            <view class="popup-resource-picker">
                <view class="headTitle">{{ props.title }}</view>
                <view style="
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                ">
                    <view class="tabs">
                        <view :class="['item', { active: state.curTabsIndex == index }]"
                            v-for="(item, index) in state.tabs" :key="index" @click="handleTabChange(index)">{{
                                item.name }}</view>
                    </view>
                    <view v-if="state.curTabsIndex == 0 && props.uploadFileType == 1" style="font-size: 14px;">
                        *以下是最新上传的文件，已选择 <text style="color: #409EFF;">{{ selectedResStatisticsStr }}</text>张
                    </view>
                </view>

                <!-- 上传 -->
                <template v-if="state.curTabsIndex == 0">
                    <!-- 样式1 资源上传 -->
                    <template v-if="props.uploadFileType == 1">
                        <scroll-view class="resourceList" scroll-y :show-scrollbar="true" @scrolltolower="getOssList" lower-threshold="100">
                            <view class="item holder" @click="handleChooseFile">
                                <view
                                    style="display: flex;flex-direction: column;justify-content: center;align-items: center;width: 100%;height: 100%;">
                                    <image style="width: 26px;height: 23px;" src="/static/upload.png" mode="widthFix">
                                    </image>
                                    <view style="text-align: center;font-size: 12px;margin-top: 12px;">
                                        <text>点击上传<br></text><text>支持JPG/JPEG/PNG格式</text>
                                    </view>
                                </view>
                            </view>
                            <!-- 需要上传部分 -->
                            <view class="item" v-for="(item, index) in tempFiles" :key="index"
                                @click="item.checked = !item.checked">
                                <image v-if="item.path" :src="item.path" mode="aspectFill" class="img"></image>
                                <view :class="['checkbox', { checked: item.checked }]"></view>
                                <view class="icon-reduce" @click.stop.prevent="handleFileRemove(item)"></view>
                                <view class="preview" @click.stop.prevent="handlePreview(item.path)"></view>
                                <view class="desc">{{ item.name }}</view>
                            </view>
                            <!-- oss历史部分 -->
                            <view class="item" v-for="(item, index) in ossConfig.data" :key="item.ossId" v-memo="[item.ossId, item.checked]"
                                @click="item.checked = !item.checked">
                                <image :src="item.url" mode="aspectFill" class="img"></image>
                                <view :class="['checkbox', { checked: item.checked }]"></view>
                                <view class="icon-reduce auto" @click.stop.prevent="handleOssFileRemove(item, index)">
                                </view>
                                <view class="preview" @click.stop.prevent="handlePreview(item.url)"></view>
                                <view class="desc">{{ item.originalName }}</view>
                            </view>
                        </scroll-view>
                    </template>
                    <!-- 样式2 资源新增-->
                    <view style="flex: 1;display: flex;margin-top: 20px;" v-else-if="props.uploadFileType == 2">
                        <view style="width: 60%;">
                            <view class="field">
                                <view class="title">
                                    <image class="icon" src="/static/proNameIcon.png" mode="widthFix">
                                    </image>
                                    <view class="text"><text>资产名称</text><text style="color: #FF0000;">*</text></view>
                                </view>
                                <view class="inputContent">
                                    <input v-model="form.name" placeholder="请输入资产名称" />
                                </view>
                            </view>
                            <view class="field">
                                <view class="title">
                                    <image class="icon" src="/static/proNameIcon.png" mode="widthFix">
                                    </image>
                                    <view class="text"><text>资产类型</text><text style="color: #FF0000;">*</text></view>
                                </view>
                                <view class="tabs">
                                    <view :class="['item style2', { active: state.curResourceTabsIndex == index }]"
                                        v-for="(item, index) in state.resourceTabs" :key="index"
                                        @click="handleResouceTabChange(index, false)">{{
                                            item.name }}</view>
                                </view>
                            </view>
                            <view class="field">
                                <view class="title">
                                    <image class="icon" src="/static/picture.png" mode="widthFix">
                                    </image>
                                    <view class="text"><text>资产图片/视频/音频</text></view>
                                </view>
                                <view
                                    style="cursor: pointer; margin-top: 8px; box-sizing: border-box;display: flex;flex-direction: column;justify-content: center;align-items: center;width: 100%;height: 100%;background: #E7E7E7;padding: 16px;border-radius: 6px;"
                                    @click="handleChooseFile({ count: 1 })">
                                    <image style="width: 26px;height: 23px;" src="/static/upload.png" mode="widthFix">
                                    </image>
                                    <view style="text-align: center;font-size: 12px;margin-top: 12px;">
                                        <text>点击上传<br></text><text style="color: #666;">支持{{ availableType.join('/')
                                        }}格式</text>
                                    </view>
                                </view>
                            </view>
                        </view>
                        <view
                            style="flex: 1;background-color: #999999;margin-left: 20px;border-radius: 12px;height: 310px;position: relative;">
                            <image v-if="tempFiles[0]?.path && uploadFileMediaType == 'image'"
                                style="width: 100%;height: 100%;" :src="tempFiles[0].path" mode="aspectFit">
                            </image>
                            <video v-else-if="tempFiles[0]?.path && uploadFileMediaType == 'video'"
                                :src="tempFiles[0].path" style="width: 100%;height: 100%" controls loop
                                :show-fullscreen-btn="false" :show-center-play-btn="false" object-fit="contain"
                                autoplay></video>
                            <view v-else-if="tempFiles[0]?.path && uploadFileMediaType == 'audio'" style="position: relative;width: 100%;height: 100%;">
                                <image :src="audioContext.isPlay ? '/static/audio-pause.png' : '/static/audio-play.png'" style="cursor: pointer; width: 48px;height: 48px;position: absolute;top: 50%;left: 50%;transform: translate(-50%,-50%);" @click="() => audioContext.isPlay ? audioContext.instance.pause() : audioContext.instance.play()"></image>
                            </view>
                            <view v-show="state.curFileTabsIndex == 0 && uploadFileMediaType == 'image'"
                                style="position: absolute;top: 14px;left: 14px;background: rgba(0, 0, 0, 0.4);width: 46px;height: 20px;line-height: 20px;border-radius: 4px;color: #fff;text-align: center;cursor: pointer;"
                                @click="() => tempFiles[0]?.path && uni.previewImage({ urls: [tempFiles[0].path] })">
                                预览
                            </view>
                        </view>
                    </view>
                </template>
                <!-- 公共库/项目库 选择 -->
                <template v-else-if="state.curTabsIndex == 1 || state.curTabsIndex == 2">
                    <view style="display: flex;align-items: center;justify-content: space-between;padding-top: 12px;">
                        <view class="tabs">
                            <view :class="['item style2', { active: state.curResourceTabsIndex == index }]"
                                v-for="(item, index) in state.resourceTabs" :key="index"
                                @click="handleResouceTabChange(index)">{{
                                    item.name }}</view>
                        </view>
                        <view
                            style="width: 240px;display: flex;align-items: center;background-color: #E7E7E7;border-radius: 8px;padding: 8px;">
                            <image style="width: 24px;height: 24px;" src="/static/searchicon.png" mode="widthFix">
                            </image>
                            <input v-model="state.searchKeyWord" style="padding-left: 4px;" placeholder="请输入"
                                @input="debounceSearchCommonResource" />
                        </view>
                    </view>
                    <scroll-view class="resourceList" scroll-y :show-scrollbar="false" @scrolltolower="getResourceList"
                        lower-threshold="100">
                        <view class="item" v-for="(item, index) in state.resourceList" :key="item.id" v-memo="[item.id, item.checked]"
                            @click="item.checked = !item.checked">
                            <image v-if="item.url" :src="item.url" mode="aspectFit" class="img"></image>
                            <view :class="['checkbox', { checked: item.checked }]"></view>
                            <view class="preview" style="top: 8px;" @click.stop.prevent="handlePreview(item.url,item)"></view>
                            <image v-show="item._mediaType == 'video'" @click.stop.prevent="handlePreview(item.url,item)" src="/static/play.png" mode="widthFix" style="width: 48px;height: 48px;position: absolute;left: 50%;top: 50%; transform: translate(-50%,-50%);cursor: pointer;"></image>
                            <image v-show="item._mediaType == 'audio'" @click.stop.prevent="handlePreview(item.url,item)" src="/static/audio.png" mode="widthFix" style="width: 48px;height: 48px;position: absolute;left: 50%;top: 50%; transform: translate(-50%,-50%);cursor: pointer;"></image>
                            <view class="desc">{{ item.name }}</view>
                        </view>
                    </scroll-view>
                </template>

                <view class="footer">
                    <view class="btn" @click="handleClose">取消</view>
                    <view class="btn light" @click="handleConfirm">确定</view>
                </view>
            </view>
        </view>
        <view class="mask"></view>
        <!-- 视频预览播放 -->
        <PopupVideoPreview :src="state.previewVideourl" v-if="state.ispreviewVideo" @close="state.ispreviewVideo = false"></PopupVideoPreview>
        <!-- 音频预览播放 -->
        <PopupAudioPreview :src="audioPreviewPopup.url" v-if="audioPreviewPopup.visible" @close="audioPreviewPopup.visible = false"></PopupAudioPreview>
        
    </Teleport>
</template>

<script setup name="PopupResourcePicker">
import {
    APIPath,
    getRequest,
    postRequest,
    putRequest,
} from "@/common/APIRequest";
import { GetResourceTypeList, AddNewResource } from "@/common/ResourceMgr";
import { debounce } from 'lodash';
import { reactive, ref, computed, onMounted } from "vue";
import { UploadFile, checkMediaType } from '@/common/Tool'
import { deleteRequest } from "../common/APIRequest";
import PopupVideoPreview from '@/components/PopupVideoPreview.vue'
import PopupAudioPreview from '@/components/PopupAudioPreview.vue'

const tabsConfig = [{ name: "本地上传", id: 1 }, { name: "项目库选择", id: 3 }, { name: "公共库选择", id: 2 },];
const emit = defineEmits(["close", "confirm"]);
const props = defineProps({
    show: {
        type: Boolean,
        required: true,
        default: false,
    },
    //开放的页签，本地上传=1,项目库选择=2,公共库选择=2
    tabs: {
        type: Array,
        default: () => [1, 2, 3],//[1, 2, 3]
    },
    tabsIndex: {
        type: Number,
        default: 1,
    },
    uploadFileType: {
        // type 1：本地上传资源，上传文件个数为props.limit，不会同步到项目库， 2：创建资源，一次只能选一个，会同步到项目库
        type: [Number, String],
        default: 2,
    },
    // 资源类型Id
    typeId: {
        type: [Number, String],
    },
    // 项目Id
    projectId: {
        type: [Number, String],
    },
    title: {
        type: String,
        default: '选择资源',
    },
    //限制选择的数量
    limit: {
        type: Number,
        default: 1,
    },
    // 支持的文件类型
    availableType: {
        type: Array,
        default: () => ['jpg', 'jpeg', 'png', 'webp', 'mp4', 'mov', 'mp3', 'wav'],
    }
});

const audioContext = reactive({
    instance:null,
    isPlay:false
})

const audioPreviewPopup = reactive({
    visible:false,
    url:'',
})

const state = reactive({
    tabs: tabsConfig.filter((item) => props.tabs.includes(item.id)).map((item, index) => {
        if (item.id == 1 && props.uploadFileType == 2) {
            item.name = '本地资源'
        }
        return item
    }),
    curTabsIndex: 0,

    resourceTabs: [{ name: "角色库", id: 2 }, { name: "场景库", id: 3 }, { name: "道具库", id: 4 }],
    curResourceTabsIndex: 0,

    curFileTabsIndex: 0,

    pageNum: 1,
    pageSize: 50,
    isFinished: false,

    resourceList: [], // 资源列表
    searchKeyWord: '', // 搜索关键词

    ispreviewVideo: false,
    previewVideourl: '',
});

const ossConfig = reactive({
    pageNum: 1,
    pageSize: 50,
    data: [],
    isFinished: false,
})

const selectedResStatisticsStr = computed(() => {
    const curTabId = state.tabs[state.curTabsIndex].id;
    if (curTabId == 1) {
        let selectedCount = tempFiles.value.filter((item) => item.checked).length;
        let ossSelectedCount = ossConfig.data.filter((item) => item.checked).length;
        return `${selectedCount + ossSelectedCount}/${tempFiles.value.length + ossConfig.data.length}`
    }
    return ''
})

// 上传文件类型
const uploadFileMediaType = computed(() => {
    return tempFiles.value[0]?.type.split('/')[0] || ''
})

const resetPagination = () => {
    state.pageNum = 1;
    state.isFinished = false;
    state.resourceList = [];
}

const resetOssPagination = () => {
    ossConfig.pageNum = 1;
    ossConfig.isFinished = false;
    ossConfig.data = [];
}

// 本地上传文件列表
const tempFiles = ref([]);
// 资源上传文件列表（样式2才有）
const form = ref({
    name: "",
    url: "",
    content: "",
})

const handleTabChange = (index) => {
    const tabItem = state.tabs[index];
    state.curTabsIndex = index;
    if (tabItem.id == 1 && props.uploadFileType == 1) {
        resetOssPagination()
        getOssList()
    }
    if (tabItem.id == 2 || tabItem.id == 3) {
        resetPagination()
        getResourceList()
    }
}

const handleResouceTabChange = (index, isResetList = true) => {
    state.curResourceTabsIndex = index;
    if (isResetList) {
        resetPagination()
        getResourceList()
    }
}

const handleChooseFile = (params) => {
    const successFn = (res) => {      
        props.uploadFileType == 2 && (tempFiles.value = []);
        let showTips = false;
        for (let item of res.tempFiles) {
            let prefix = item.name.match(/\.([0-9a-zA-Z]+)/)?.[1] //item.type.split('/').pop();
            if (!props.availableType.includes(prefix?.toLocaleLowerCase())) {
                showTips = true;
                continue
            }
            if (tempFiles.value.length >= props.limit && props.uploadFileType == 1) {
                uni.showToast({
                    title: '最多选择' + props.limit + '个文件',
                    icon: 'none',
                    duration: 2000
                })
                break
            }
            const obj = {
                name: item.name,
                path: item.path,
                size: item.size,
                type: item.type,
                prefix,
                checked: true,
                state: 0, // 0未上传，1上传成功，2上传失败
            }
            if (props.uploadFileType == 1) {
                tempFiles.value.push(obj);
            } else if (props.uploadFileType == 2) {
                tempFiles.value = [obj];
            }
        }

        if (res.tempFiles[0].type.includes('audio')) {
            const innerAudioContext = uni.createInnerAudioContext();
            innerAudioContext.autoplay = true
            innerAudioContext.src = tempFiles.value[0].path;
            innerAudioContext.onPlay(() => {
                audioContext.isPlay = true
            });
            innerAudioContext.onPause(() => {
                audioContext.isPlay = false
            });

            audioContext.instance = innerAudioContext
        }

        showTips && uni.showToast({
            title: '请选择' + props.availableType.join('/') + '格式的文件',
            icon: 'none',
            duration: 3000
        })
    }

    if (props.uploadFileType == 1) {
        uni.chooseImage({
            count: props.limit,
            ...params,
            success: (res) => {
                successFn(res)
            }
        })
    } else {
        uni.chooseFile({
            count: props.limit,
            ...params,
            success: (res) => {
                successFn(res)
            }
        })
    }
}

const handleFileRemove = (item) => {
    for (let i = 0; i < tempFiles.value.length; i++) {
        if (tempFiles.value[i].name == item.name) {
            tempFiles.value.splice(i, 1);
            break;
        }
    }
}

const handleOssFileRemove = (item, index) => {
    uni.showModal({
        title: '提示',
        content: '确定删除？',
        success: (res) => {
            if (res.confirm) {
                // const ids = item.map((item)=>item.ossId).join(',')
                deleteRequest(`${APIPath.ossFile}/${item.ossId}`, () => {
                    ossConfig.data.splice(index, 1);
                })
            }		
        }
    })
}

const handlePreview = (path,itemData) => {
    if (!path) {
        return
    }
    const mediaType = checkMediaType(path);
    if(mediaType == 'image'){
        uni.previewImage({
            urls: [path],
        })
    }else if (mediaType == 'video') {
        state.ispreviewVideo = true
        state.previewVideourl = path
    } else if (mediaType == 'audio') {
        audioPreviewPopup.url = path;
        audioPreviewPopup.visible = true;
        audioPreviewPopup.title = itemData.name || '';
    }
}

const createUploadPromise = (data) => {
    return new Promise((resolve, reject) => {
        UploadFile(data.path, (url) => {
            data.url = url
            data.state = 1
            resolve(url)
        })
    })
}

// 点击确认
const handleConfirm = () => {
    //本地上传
    if (state.curTabsIndex == 0) {
        if (props.uploadFileType == 2 && !form.value.name) {
            uni.showToast({
                title: '请输入资源名称',
                icon: 'none',
                duration: 2000
            })
            return
        }
        if (props.uploadFileType == 2 && tempFiles.value.length == 0) {
            uni.showToast({
                title: '请添加资产图片或视频',
                icon: 'none',
                duration: 2000
            })
            return
        }

        const uploadFiles = tempFiles.value.filter((item) => item.checked);
        const selectedHistoryFiles = ossConfig.data.filter((item) => item.checked).map((item) => {
            return {
                url: item.url,
                name: item.originalName,
                id: item.ossId,
                value:item.value,
                coreFeature:item.coreFeature,
                voiceDetail:item.voiceDetail,
                voiceName:item.voiceName,
            }
        })

        if (uploadFiles.length > 0) {
            const uploadPromises = uploadFiles.map(item => createUploadPromise(item));
            Promise.all(uploadPromises)
                .then(results => {
                    // console.warn('全部上传成功', results)
                    const _uploadfiles = uploadFiles.map(item => ({
                        // 自定义id
                        id: new Date().getTime() + (Math.random() * 10000).toString().slice(-5),
                        url: item.url,
                        name: props.uploadFileType == 2 ? form.value.name : item.name,
                    }))
                    
                    if (props.uploadFileType == 2) {
                        const config = {
                            typeId: state.resourceTabs[state.curResourceTabsIndex].id,//state.newResConfig.type,
                            name: form.value.name,
                            url: tempFiles.value[0].url,
                            projectId: props.projectId,
                        }
                        AddNewResource(config, (resData) => {
                            // 变更id为资源id
                            _uploadfiles[0].id = resData.data;
                            emit("confirm", [..._uploadfiles, ...selectedHistoryFiles])
                            // 销毁音频实例
                            audioContext.instance && audioContext.instance.destroy();
                            handleClose()
                        })
                    }else{
                        emit("confirm", [..._uploadfiles, ...selectedHistoryFiles])
                        // 销毁音频实例
                        audioContext.instance && audioContext.instance.destroy();
                        handleClose()
                    }
                })
                .catch(error => console.error('至少一次上传失败', error))
        } else {
            emit("confirm", selectedHistoryFiles)
            handleClose()
        }

    } else {
        // 资源库选择
        const selectedFiles = state.resourceList.filter((item) => item.checked).map((item) => {
            return {
                url: item.url,
                name: item.name,
                id: item.id,
                value:item.value,
                coreFeature:item.coreFeature,
                voiceDetail:item.voiceDetail,
                voiceName:item.voiceName,
                assets:item.assets,
            }
        });
        emit("confirm", selectedFiles)
        handleClose()
    }

}

const handleClose = () => {
    emit("close")
}

const getResourceList = (extractParams) => {
    return new Promise((resolve, reject) => {
        if (state.isFinished) {
            return
        }
        var apiPath = APIPath.resourceList + `?pageNum=${state.pageNum}&pageSize=${state.pageSize}&typeId=${state.resourceTabs[state.curResourceTabsIndex].id}`
        if (extractParams) {
            for (const key in extractParams) {
                apiPath += `&${key}=${extractParams[key]}`
            }
        }
        // 如果是公共库，加上项目id=0
        if (tabsConfig[state.curTabsIndex].id == 2) {
            apiPath += `&projectId=0`
        } else {
            apiPath += `&projectId=${props.projectId}`
        }

        uni.showLoading({
            title: '加载中...',
        })
        getRequest(apiPath, (res) => {
            uni.hideLoading();
            if (res.code == 200) {
                if (res.rows.length < state.pageSize) {
                    state.isFinished = true
                } else {
                    state.pageNum++;
                }
                let data = res.rows.map(i=>{
                    return {
                        ...i,
                        _mediaType:checkMediaType(i.url)
                    }
                }).filter(i=>{
                    if(!i.url){
                        return false
                    }
                    let prefix = i.url.match(/\.([0-9a-zA-Z]+)/g);
                    prefix = prefix.length > 0 ? prefix[prefix.length-1]?.slice(1) : 'unknown';
                    return props.availableType.includes(prefix?.toLocaleLowerCase())
                })
                state.resourceList = state.resourceList.concat(data);
                resolve(data)
            }
            else {
                console.error(data.msg)
                reject(data)
            }
        }, (error) => {
            console.error(error)
            reject(error)
            uni.hideLoading()
        })
    })

}

const getOssList = () => {
    if (ossConfig.isFinished) {
        return
    }
    uni.showLoading({
        title: '加载中...',
    })
    getRequest(`${APIPath.getOssListForUser}?pageNum=${ossConfig.pageNum}&pageSize=${ossConfig.pageSize}`, (res) => {
        uni.hideLoading()
        if (res.code == 200) {
            if (res.rows.length < state.pageSize) {
                ossConfig.isFinished = true
            } else {
                ossConfig.pageNum++;
            }
            ossConfig.data = ossConfig.data.concat(res.rows.filter(i=>{
                if(!i.url){
                    return false
                }
                let prefix = i.url.match(/\.([0-9a-zA-Z]+)/g);
                prefix = prefix.length > 0 ? prefix[prefix.length-1]?.slice(1) : 'unknown';
                return props.availableType.includes(prefix)
            }));
        }
    }, () => {
        uni.hideLoading()
    })
}

const debounceSearchCommonResource = debounce((e) => {
    resetPagination()
    getResourceList({
        name: e.detail.value,
    })
}, 800)

if (props.typeId) {
    state.resourceTabs.some((item, index) => {
        if (item.id == props.typeId) {
            state.curResourceTabsIndex = index;
            return true;
        }
    })
}

onMounted(() => {
    GetResourceTypeList(25, (resTypeList) => {
        state.resourceTabs = resTypeList.map(item => ({ name: item.treeName, id: item.id }))
        handleTabChange(props.tabsIndex)
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

.popup-resource-picker {
    border-width: 0px;
    position: fixed;
    z-index: 99;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    width: 63vw;
    height: 75vh;
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

.tabs {
    .item {
        cursor: pointer;
        display: inline-block;
        width: 120px;
        height: 48px;
        line-height: 48px;
        text-align: center;
        color: rgba(0, 0, 0, 0.6);
        position: relative;
        font-size: 16px;
        transition: background-color 0.3s ease-in-out;

        &.style2 {
            width: 96px;
            background: #E7E7E7;
            color: #666666;
            height: 36px;
            line-height: 36px;
        }

        &.style2:first-child {
            border-top-left-radius: 8px;
            border-bottom-left-radius: 8px;
        }

        &.style2:last-child {
            border-top-right-radius: 8px;
            border-bottom-right-radius: 8px;
        }

        &.active {
            color: #f8ba38;
            font-weight: 500;

            &.style2 {
                background: #f8ba38;
                color: #333;

                &::after {
                    display: none;
                }
            }

            &::after {
                content: "";
                position: absolute;
                left: 0;
                bottom: 0;
                width: 100%;
                height: 4px;
                background-color: #f8ba38;
            }
        }
    }
}

.resourceList {
    flex: 1;
    margin-top: 8px;
    min-height: 0;

    .holder {
        cursor: pointer;
        border: 1px dashed #666;
    }

    .item {
        display: inline-block;
        vertical-align: top;
        width: 160px;
        height: 160px;
        border-radius: 8px;
        background: #ccc;
        position: relative;
        margin-top: 12px;
        margin-right: 8px;

        .img {
            width: 100%;
            height: 100%;
            border-radius: 8px;
        }

        .desc {
            background: rgba(0, 0, 0, 0.6);
            backdrop-filter: blur(10px);
            position: absolute;
            left: 0;
            bottom: 0;
            width: 100%;
            padding: 0 6px;
            box-sizing: border-box;
            height: 30px;
            line-height: 30px;
            border-radius: 0 0 8px 8px;
            font-size: 14px;
            color: #fff;
            text-align: center;
            white-space: nowrap;
            /* 强制不换行 */
            overflow: hidden;
            /* 隐藏溢出内容 */
            text-overflow: ellipsis;
            /* 显示省略号 */
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
            width: 24px;
            height: 24px;
            border-radius: 12px;
            background: rgba(0, 0, 0, 0.6);
            box-sizing: border-box;
            border: 0.5px solid #ffffff;
            position: absolute;
            transition: background-color 100ms ease-in-out;
            top: 6px;
            left: 6px;

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

        .icon-reduce {
            cursor: pointer;
            width: 20px;
            height: 20px;
            border-radius: 50%;
            background-color: #FF5757;
            position: absolute;
            right: 3%;
            top: 3%;
            transform: translate(50%, -50%);
            z-index: 10;

            &.auto {
                visibility: hidden;
            }

            &::before {
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                content: "";
                width: 12px;
                height: 3px;
                background-color: #fff;
            }

            &::before {
                transform: translate(-50%, -50%);
            }
        }
    }

    .item:hover .icon-reduce {
        visibility: visible;
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

.field {
    margin-bottom: 8px;

    &:last-child {
        margin-bottom: 0;
    }

    .title {
        display: flex;
        align-items: center;
        font-size: 16px;
        color: #333333;
        line-height: 32px;

        .icon {
            width: 16px;
            height: 16px;
        }

        .text {
            padding-left: 6px;
            font-weight: 500;
        }
    }

    .inputContent {
        background: #F7F7F7;
        padding: 16px;
        border-radius: 6px;
    }
}

.mark {
    position: fixed;
    width: 100%;
    height: 100%;
    top: 0;
    background-color: rgba(0, 0, 0, 0.6);
    display: flex;
    align-items: center;
    flex-direction: column;
    justify-content: flex-start;
    z-index: 101;
}
</style>
