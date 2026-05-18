<template>
    <view class="sliderSection">
        <view class="head">
            <view class="title">资产详情</view>
            <view>
                <view class="btn danger" @click="handleDeleteResource">删除</view>
                <view class="btn light" style="margin-left: 8px" @click="handleUpdateResource">保存</view>
            </view>
        </view>
        <view class="preview">
            <image :src="form.url" style="width: 100%; height: 100%" mode="heightFix"></image>
            <view class="btn">展开</view>
            <view class="overlay" v-if="false">
                <view>作者：user1524</view>
                <view>编号：22222</view>
                <view>日期：2026-02-06</view>
                <view>所属：33333</view>
            </view>
        </view>
        <view class="cell">
            <view class="leftContent">
                <view style="
                    width: 42px;
                    height: 18px;
                    line-height: 18px;
                    text-align: center;
                    background-color: #409eff;
                    color: #fff;
                    border-radius: 8px;
                    font-size: 12px;
                ">
                    {{ typeName }}</view>
                <view style="
                    font-size: 16px;
                    color: #333;
                    flex: 1;
                    margin: 0 6px;
                    font-weight: bold;
                    display: flex;
                    align-items: center;
                ">
                    <text>{{ form.name }}</text>
                    <image src="/static/proDetaiIcon.png" style="padding-left: 4px;width: 16px; height: 16px;cursor: pointer;"
                        mode="widthFix" @click="handleModifyResourceShow"></image>
                </view>
            </view>
            <view class="rightContent">
                <view style="
                    width: 40px;
                    height: 16px;
                    line-height: 16px;
                    text-align: center;
                    background: rgba(0, 0, 0, 0.4);
                    color: #fff;
                    border-radius: 4px;
                    font-size: 12px;
                ">
                    详情</view>
            </view>
        </view>

        <!-- 配音 -->
        <!-- <view class="timbre">
            <view class="head">
                <view class="title">
                    <image src="/static/timbre.png" class="icon" mode="widthFix"></image>
                    <text class="text">配音SP：</text>
                </view>
                <uni-data-select mode="none" :value="1"
                    :localdata="[{ value: 1, text: '阳光小伙' }, { value: 2, text: '成熟型男' },]"></uni-data-select>
            </view>
            <view class="desc">青年男声，中音域，音色沉稳，语速适中</view>
        </view> -->

        <view class="tabs">
            <view :class="['item', { 'active': index == state.curTabsIndex }]" v-for="(value, index) in state.tabs"
                :key="index" @click="handleTabChange(index)">{{ value.name }}</view>
        </view>
        <view class="tabContent">
            <!-- SP生图页签 -->
            <template v-if="state.curTabsIndex == 0">
                <view class="section">
                    <view class="title">
                        <image src="/static/proDetaiIcon.png" class="icon" mode="widthFix"></image>
                        <text class="text">资产SP生图描述</text>
                    </view>
                    <view class="textarea">
                        <textarea style="width: 100%; height: 100%" placeholder-style="color:#999"
                            v-model.trim="form.content" placeholder="请填写图片生成的SP描述" :maxlength="-1"></textarea>
                    </view>
                    <!-- 画风参考图设置 -->
                    <view
                        style="display: flex;align-items: center;padding: 6px 8px;background-color: #f7f7f7;cursor: pointer;">
                        <view
                            style="width: 40px;height: 40px;border-radius: 4px;background-color: #FFE3AF;display: flex;flex-direction: column;align-items: center;justify-content: center;">
                            <image src="/static/painting.png" style="width: 12px;height: 12px;" mode="widthFix"></image>
                            <view style="font-size: 12px;color: #333;margin-top: 2px;">画风</view>
                        </view>
                        <!-- 分割线 -->
                        <view style="width: 1px;height: 20px;background-color: #999999;margin-left: 6px;"></view>

                        <!-- 已选择的参考图列表 -->
                        <view style="margin-left: 6px;width: 40px;height: 40px;border-radius: 4px;overflow: hidden;"
                            v-for="(item, index) in ImageGeneration.imgs" :key="index">
                            <image :src="item" style="width: 100%; height: 100%" mode="aspectFill"></image>
                        </view>
                        <!-- 选图按钮 -->
                        <view @click="state.resourcePickerShow = true"
                            style="margin-left: 6px;width: 40px;height: 40px;border-radius: 4px;background-color: #E7E7E7;border: 1px dashed #999;box-sizing: border-box; display: flex;flex-direction: column;align-items: center;justify-content: center;cursor: pointer;">
                            <view style="font-size: 20px;font-weight: 500;line-height: 100%;">+</view>
                            <view style="font-size: 12px;color: #333;">图片</view>
                        </view>
                    </view>
                    <!-- 模型参数设置 -->
                    <view
                        style="display: flex; align-items: center; padding: 8px;background-color: #E7E7E7;border-radius: 0px 0px 8px 8px;">
                        <view class="selector" style="flex: 1;">SeeDream5.0</view>
                        <view class="selector" style="flex: 1;" @click="handleShowImageGenerationParamsPopup">9:16|1张
                        </view>
                        <view class="button" style="flex: 1;cursor: pointer;"
                            @click="uni.showToast({ title: '功能待开发', icon: 'none', duration: 2000 })">生图</view>
                    </view>
                </view>
                <view class="section">
                    <view class="title">
                        <image src="/static/picture.png" class="icon" mode="widthFix"></image>
                        <text class="text">历史生图</text>
                    </view>
                    <div class="resource">
                        <view class="item active">
                            <image
                                :src="'https://ccyres.acgvr.com/aitools/res/2026/02/05/2cb58680d5b14c0a87579dd8195ac786.jpg'"
                                style="width: 100%; height: 100%" mode="aspectFill"></image>
                            <view class="desc">李小莫</view>
                        </view>
                    </div>
                </view>
            </template>
            <template v-else-if="state.curTabsIndex == 1">
                <view class="section">
                    <view class="head">
                        <view class="title">
                            <image src="/static/picture.png" class="icon" mode="widthFix"></image>
                            <text class="text">{{typeName}}库</text>
                        </view>
                        <view class="search">
                            <image :src="'/static/searchicon.png'" style="width: 20px; height: 20px" mode="widthFix">
                            </image>
                            <input style="padding-left: 6px;flex: 1;" placeholder="请输入角色名称" :value="state.commonResourceSearchKeyWord" @input="(e)=>{state.commonResourceList_filter = state.commonResourceList.filter(i => i.name.includes(e.detail.value))}"/>
                        </view>
                    </view>
                    <div class="resource" style="height: 400px;overflow-y: auto;">
                        <view :class="['item', {'active': state.curCommonResourceIndex == index}]" v-for="(item,index) in state.commonResourceList_filter" :key="index" @click="handleCommonResourceSelect(index,item)">
                            <image
                                :src="item.url"
                                style="width: 100%; height: 100%" mode="aspectFill"></image>
                            <view class="desc">{{ item.name }}</view>
                        </view>
                    </div>
                </view>
            </template>
            <template v-else-if="state.curTabsIndex == 2">
                <view class="uploder" @click="handleSelectUploadResource">
                    <image src="/static/upload.png" style="width: 26px; height: 26px;" mode="widthFix"></image>
                    <view
                        style="font-size: 14px;color: #333;line-height: 180%;font-weight: 500;text-align: center;margin-top: 12px;">
                        单击选择文件进行上传</view>
                    <view style="font-size: 14px;color: #666;line-height: 180%;text-align: center;">支持JPG/JPEG/PNG格式
                    </view>
                </view>
                <!-- <view class="section">
                    <view class="head">
                        <view class="title">
                            <image src="/static/picture.png" class="icon" mode="widthFix"></image>
                            <text class="text">已上传资产</text>
                        </view>
                    </view>
                    <div class="resource">
                        <view class="item active">
                            <image
                                :src="'https://ccyres.acgvr.com/aitools/res/2026/02/05/2cb58680d5b14c0a87579dd8195ac786.jpg'"
                                style="width: 100%; height: 100%" mode="aspectFill"></image>
                            <view class="desc">李小莫</view>
                        </view>
                        <view class="item" v-for="(item, index) in [1, 2, 3, 4, 5]" :key="index">
                            <image
                                :src="'https://ccyres.acgvr.com/aitools/res/2026/02/05/2cb58680d5b14c0a87579dd8195ac786.jpg'"
                                style="width: 100%; height: 100%" mode="aspectFill"></image>
                            <view class="desc">李小莫</view>
                        </view>
                    </div>
                </view> -->
            </template>
        </view>
    </view>
    <!-- 生图参数弹窗 -->
    <Teleport to="body" v-if="state.imageGenerationShow">
        <view class="popup-imageGeneration">
            <view class="tagSelector" style="margin-top: 12px;">
                <view class="title">图片质量</view>
                <view class="list">
                    <view class="item" v-for="(item, index) in dictConfig.project_resolution" :key="item.value"
                        :class="{ 'active': item.value == ImageGeneration.curQualityValue }"
                        @click="ImageGeneration.curQualityValue = item.value">{{ item.text }}</view>
                </view>
            </view>
            <view class="tagSelector" style="margin-top: 12px;">
                <view class="title">画幅尺寸</view>
                <view class="list">
                    <view class="item" v-for="(item, index) in dictConfig.project_frame" :key="item.value"
                        :class="{ 'active': item.value == ImageGeneration.curRatioValue }"
                        @click="ImageGeneration.curRatioValue = item.value">{{ item.text }}</view>
                </view>
            </view>
            <view class="tagSelector" style="margin-top: 12px;">
                <view class="title">生成数量</view>
                <view class="list">
                    <view class="item" v-for="(item, index) in dictConfig.create_picture" :key="item.value"
                        :class="{ 'active': item.value == ImageGeneration.curQuantityValue }"
                        @click="ImageGeneration.curQuantityValue = item.value">{{ item.text }}</view>
                </view>
            </view>
            <view class="footer">
                <view class="btn" @click="handleImageGenerationParamsCancel">取消</view>
                <view class="btn light" @click="state.imageGenerationShow = false">确定</view>
            </view>
        </view>
        <view class="mask"></view>
    </Teleport>
    <!-- 修改资源 参数弹窗 -->
    <Teleport to="body" v-if="state.modifyPopupShow">
        <view style="z-index: 101;position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%);width: 420px;padding: 20px;background: #fff;border-radius: 12px;">
            <view style="font-size: 24px;color: #FFA600;text-align: center;">修改资产</view>
            <view style="font-size: 18px;color: #333;">资产名称</view>
            <view style="padding: 8px;background-color: #f7f7f7;margin-top: 8px;border-radius: 6px;">
                <input style="padding-left: 6px;flex: 1;" placeholder="请输入资产名称" v-model="form_updatePopup.name"/>
            </view>
            <view style="display: flex;align-items: center;padding: 24px;">
                <view style="flex:1;text-align: center;height: 44px;line-height: 44px;margin-right: 24px;background: #E7E7E7;border-radius: 8px;cursor: pointer;" @click="state.modifyPopupShow = false">取消</view>
                <view style="flex:1;text-align: center;height: 44px;line-height: 44px;color: #fff;background: #FFA600;border-radius: 8px;cursor: pointer;" @click="handleModifyResource">确认</view>
            </view>
        </view>
            
        <view class="mask"></view>
    </Teleport>
    <PopupResourcePicker v-if="state.resourcePickerShow" @close="state.resourcePickerShow = false"
        @confirm="handleSelectResource">
    </PopupResourcePicker>
</template>

<script setup name="resourceDetail">
import { EditorResource, DeleteResource, GetResourceList } from '../common/ResourceMgr'
import { UploadFile } from "@/common/Tool";
import {
    APIPath,
    getRequest,
    postRequest,
    putRequest,
} from "@/common/APIRequest";
import { ref, reactive, defineEmits, defineProps, onMounted, watch, toRefs, computed } from "vue";
import { deleteRequest } from "../common/APIRequest";
import { GetDict, GetAIModelList } from '@/common/Common'

import PopupResourcePicker from '@/components/PopupResourcePicker.vue'
const props = defineProps({
    data: {
        type: Object,
        default: () => { },
        required: true,
    },
    typeMap: {
        type: Array,
        required: true,
    },
})

const emit = defineEmits(["updated", "deleted"]);

const typeName = computed(() => {
    return props.typeMap.find((item) => item.type == props.data.typeId)?.name || ""
})

const state = reactive({
    tabs: [
        { name: "SP图片生成", },
        { name: "公共库挑选", },
        { name: "上传图片", },
    ],
    curTabsIndex: 0, // 页签索引
    imageGenerationShow: false, // 生图参数设置弹窗显示状态
    imageGenerationData_old: {}, // 生图参数设置弹窗旧数据
    resourcePickerShow: false, // ”SP生图“页签，选择参考图弹窗显示状态

    commonResourceList: [], // 公共库挑选页签对应的资源列表
    commonResourceList_filter:[], // 根据搜索关键字过滤后的列表
    curCommonResourceIndex: null, // 选择的索引值
    commonResourceSearchKeyWord: '', // 公共库挑选页签，搜索关键词

    modifyPopupShow: false, // 修改资源参数弹窗显示状态
})

// 资源数据的拷贝，避免直接修改props.data
const form = ref({})
//修改资源弹窗数据源
const form_updatePopup = ref({})

watch(() => props.data, (newVal) => {
    form.value = JSON.parse(JSON.stringify(newVal))
    console.log('form.value', form.value)

    state.curTabsIndex = 0;
    state.curCommonResourceIndex = null;
}, {
    immediate: true,
    deep: true,
})

// 生图功能的部分
const ImageGeneration = reactive({
    curQualityValue: '',
    curRatioValue: '',
    curQuantityValue: '',
    imgs: [], // 参考图已选列表
})

// 字典
const dictConfig = reactive({
    create_picture: [],//生图数量
    project_frame: [],//画幅
    project_resolution: [],//分辨率
    project_timbre: [],//音色
})

// 获取所有字典数据
const GetDicts = () => {
    for (const dictItem of Object.keys(dictConfig)) {
        GetDict(dictItem).then((datalist) => {
            dictConfig[dictItem] = datalist.map(i => {
                return {
                    value: i.dictValue,
                    text: i.dictLabel,
                }
            })
        })
    }
}

const handleTabChange = (index) => {
    state.curTabsIndex = index;
    if (index == 1) {
        var apiPath = APIPath.resourceList + '?pageNum=1&pageSize=1000&typeId=' + props.data.typeId + '&projectId=' + 0
        getRequest(apiPath, (data) => {
            if (data.code == 200) {
                state.commonResourceList = state.commonResourceList_filter = data.rows.filter(i => i.projectId == 0)
            }
            else {
                console.error(data.msg)
            }
        }, (error) => {
            console.error(error)
        })
    }
}

const handleShowImageGenerationParamsPopup = () => {
    // 备份旧数据，弹窗点击取消后恢复
    state.imageGenerationData_old = {
        curQualityValue: ImageGeneration.curQualityValue,
        curRatioValue: ImageGeneration.curRatioValue,
        curQuantityValue: ImageGeneration.curQuantityValue,
    }
    state.imageGenerationShow = true
}

const handleImageGenerationParamsCancel = () => {
    // 恢复旧数据
    ImageGeneration.curQualityValue = state.imageGenerationData_old.curQualityValue
    ImageGeneration.curRatioValue = state.imageGenerationData_old.curRatioValue
    ImageGeneration.curQuantityValue = state.imageGenerationData_old.curQuantityValue
    state.imageGenerationShow = false
}

// 选择资源确认
const handleSelectResource = (selectedFiles) => {
    ImageGeneration.imgs = selectedFiles
}

// 公共库挑选页签，选择资源
const handleCommonResourceSelect = (index,resourceItem) => {
    state.curCommonResourceIndex = index
    form.value.url = resourceItem.url
}

// 上传图片页签，选择图片
const handleSelectUploadResource = () => {
    uni.chooseImage({
        count: 1, //默认1
        sizeType: ["original", "compressed"], //可以指定是原图还是压缩图，默认二者都有
        sourceType: ["album"], //从相册选择
        success: function (res) {
            console.log("选择的图片信息:", res);
            UploadFile(res.tempFilePaths[0], (url) => {
                form.value.url = url
            })
        },
    });
}

const handleModifyResourceShow = () => {
    form_updatePopup.value = JSON.parse(JSON.stringify(form.value))
    state.modifyPopupShow = true
}

// 修改资源名称等
const handleModifyResource = () => {
    let params = {
        ...form.value,
        name: form_updatePopup.value.name,
    }
    console.log('params', params)
    EditorResource(params, (resData) => {
        uni.showToast({
            title: '保存成功',
            icon: 'success',
            duration: 2000
        })
        form.value = params
        state.modifyPopupShow = false
        emit('updated')
    })
}

// 右上角保存
const handleUpdateResource = () => {
    let params = {
        ...form.value,
    }
    console.log('params', params)
    EditorResource(params, (resData) => {
        uni.showToast({
            title: '保存成功',
            icon: 'success',
            duration: 2000
        })
        form.value = params
        emit('updated')
    })
}

const handleDeleteResource = () => {
    const id = props.data.id;
    uni.showModal({
        title: "确认删除",
        content: "确定删除该资源吗？",
        success: (res) => {
            if (res.confirm) {
                DeleteResource([id], (res) => {
                    emit('deleted')
                });
            }
        },
    });
}

onMounted(() => {
    GetDicts()
})
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

.popup-imageGeneration {
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

            &.active {
                background: #F8BA38;
            }
        }
    }
}

.selector {
    cursor: pointer;
    position: relative;
    height: 30px;
    line-height: 30px;
    box-sizing: border-box;
    font-size: 14px;
    color: rgba(0, 0, 0, 0.9);
    background: #fff;
    border-radius: 4px;
    border: none;
    margin-right: 8px;
    padding: 0 8px;
    padding-right: 24px;

    &::after {
        content: '';
        position: absolute;
        right: 10px;
        top: 10px;
        z-index: 2;
        width: 6px;
        height: 6px;
        border-left: 2px solid rgba(0, 0, 0, 0.9);
        border-bottom: 2px solid rgba(0, 0, 0, 0.9);
        transform: rotate(-45deg);
    }
}

.sliderSection {
    width: 360px;
    padding: 20px;
    background-color: #fff;
    display: flex;
    flex-direction: column;
    .head {
        display: flex;
        justify-content: space-between;

        .title {
            font-size: 16px;
            color: #ffa701;
            font-weight: bold;
        }

        .btn {
            width: 64px;
            height: 32px;
            line-height: 32px;
            text-align: center;
            border-radius: 8px;
            background-color: #e7e7e7;
            box-sizing: border-box;
            display: inline-block;
            cursor: pointer;

            &.danger {
                background: transparent;
                border: 1px solid #ff5757;
                color: #ff5757;
            }

            &.light {
                background: linear-gradient(90deg, #FFA600 0%, #FFDA3C 100%), linear-gradient(90deg, #F8BA38 0%, #FFCA5A 100%);
            }
        }
    }

    .preview {
        border-radius: 8px 8px 0px 0px;
        margin-top: 16px;
        width: 100%;
        height: 180px;
        background: #999999;
        position: relative;
        display: flex;
        justify-content: center;
        align-items: center;

        .overlay {
            display: flex;
            flex-direction: column;
            justify-content: center;
            position: absolute;
            z-index: 3;
            bottom: 0;
            left: 0;
            box-sizing: border-box;
            width: 100%;
            height: 90px;
            background: rgba(0, 0, 0, 0.6);
            backdrop-filter: blur(10px);
            border-radius: 8px 8px 0px 0px;
            padding: 0 12px;
            color: #fff;
            font-size: 12px;
            line-height: 160%;
            font-weight: 400;
        }

        .btn {
            position: absolute;
            left: 6px;
            top: 6px;
            width: 40px;
            height: 20px;
            line-height: 20px;
            border-radius: 4px;
            background: rgba(0, 0, 0, 0.4);
            color: #fff;
            text-align: center;
            cursor: pointer;
        }
    }

    .cell {
        display: flex;
        padding: 8px;
        background: #e7e7e7;
        border-radius: 0 0 8px 8px;

        .leftContent {
            flex: 1;
            display: flex;
            align-items: center;
        }
    }

    .timbre {
        margin-top: 8px;
        border-radius: 8px;
        background: linear-gradient(0deg, #E7E7E7, #E7E7E7), #F7F7F7;
        padding: 9px;

        .head {
            display: flex;
            justify-content: space-between;
            align-items: center;
        }

        .title {
            display: flex;
            align-items: center;

            .icon {
                height: 16px;
                width: 16px;
            }

            .text {
                padding-left: 4px;
                font-size: 16px;
                color: #333;
                font-weight: bold;
            }
        }

        .desc {
            margin-top: 8px;
            padding: 6px;
            border-radius: 4px;
            background-color: #fff;
            font-size: 14px;
            color: #666666
        }
    }

    .tabs {
        margin-top: 16px;
        border-radius: 8px;
        overflow: hidden;
        display: flex;
        border: 1px solid #e7e7e7;

        .item {
            flex: 1;
            height: 32px;
            line-height: 32px;
            text-align: center;
            background-color: #e7e7e7;
            color: #666666;
            font-weight: bold;
            position: relative;

            &::after {
                position: absolute;
                top: 0;
                right: 0;
                content: "";
                height: 32px;
                width: 1px;
                background: #e7e7e7;
            }

            &:last-child::after {
                display: none;
            }

            &.active {
                background-color: #f8ba38;
                color: #333333;
            }
        }
    }

    .tabContent {
        .section {
            margin-top: 8px;

            .head {
                display: flex;
                justify-content: space-between;
                align-items: center;
            }

            .title {
                display: flex;
                align-items: center;

                .icon {
                    height: 16px;
                    width: 16px;
                }

                .text {
                    padding-left: 4px;
                    font-size: 16px;
                    color: #333;
                    font-weight: bold;
                }
            }
        }

        .search {
            width: 180px;
            height: 26px;
            background: #F3F3F3;
            border-radius: 8px;
            padding: 3px 6px;
            display: flex;
            align-items: center;
        }

        .textarea {
            background: #f7f7f7;
            padding: 12px;
            width: 100%;
            height: 120px;
            box-sizing: border-box;
        }

        .button {
            width: 140px;
            height: 36px;
            line-height: 36px;
            text-align: center;
            border-radius: 8px;
            color: #333;
            background: linear-gradient(90deg, #f8ba38 0%, #ffca5a 100%);
        }

        .resource {
            margin-top: 10px;
            .item {
                display: inline-flex;
                position: relative;
                width: 110px;
                height: 110px;
                box-sizing: border-box;
                border-radius: 4px;
                overflow: hidden;
                margin: 0 5px;
                margin-bottom: 10px;

                .thumbnail {
                    width: 100%;
                    height: 100%;
                }

                &.active::after {
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
            }
        }

        .uploder {
            margin-top: 8px;
            background: #F7F7F7;
            height: 120px;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            cursor: pointer;
        }
    }
}
</style>
