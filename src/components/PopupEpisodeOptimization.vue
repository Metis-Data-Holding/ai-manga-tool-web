<template>
    <Teleport to="body">
        <view>
            <view class="popup-resource-editor">
                <view class="icon-close-popup" @click="handleClose"></view>
                <view style="display: flex;width: 100%;">
                    <view class="mainContent">
                        <view class="head">
                            <view class="tag" style="flex: 1;"><text>当前分镜</text><text v-if="cameraList.length > 0">（{{ cameraList.length }}个）</text></view>
                            <view class="tag" style="flex: 1;"><text>优化后分镜</text><text v-if="newCameraList.length > 0">（{{ newCameraList.length }}个）</text></view>
                        </view>
                        <view style="padding: 12px 10px;flex: 1;min-height: 0;display: flex;align-items: flex-start;">
                            <scroll-view id="cameraList-left" class="cameraList" :scroll-y="true">
                                <view class="item" :id="`camera_${index}`" v-for="(item, index) in cameraList"
                                    :key="item.id">
                                    <view class="headBar" style="column-gap: 12px;">
                                        <view style="display: flex;flex:1;justify-content: space-between;">
                                            <view class="textTag">
                                                <image class="img" src="/static/desc_icon.png" mode="heightFix"></image>
                                                <text class="text">{{ item.name }}</text>
                                            </view>
                                            <view class="textTag" v-if="!isMultiple">
                                                <image class="img" src="/static/history.png" mode="heightFix"></image>
                                                <text class="text">版本</text>
                                                <view style="display: flex;align-items: center;">
                                                    <view
                                                        :class="['numberButton', { 'active': index == state.optimizationRecordsIndex }]"
                                                        v-for="(record, index) in state.optimizationRecords"
                                                        :key="record.id"
                                                        @click="handleOptimizationRecordChange(index, record)">{{
                                                            index + 1 }}</view>
                                                </view>
                                            </view>
                                        </view>
                                    </view>
                                    <view class="content">
                                        <view style="display: flex;height: 40%;column-gap: 8px;">
                                            <textarea :maxlength="-1" class="textarea topRadius" @blur="() => { }"
                                                :value="item.fenjinContent_version" placeholder="分镜基础内容"
                                                disabled></textarea>
                                        </view>
                                        <view style="display: flex;height: 60%;column-gap: 8px;">
                                            <textarea :maxlength="-1" class="textarea bottomRadius" @blur="() => { }"
                                                :value="item.videoContentSP_version" placeholder="镜头内容"
                                                disabled></textarea>
                                        </view>
                                    </view>
                                </view>
                            </scroll-view>
                            <scroll-view id="cameraList-right" class="cameraList" :scroll-y="true">
                                <view class="item" :id="`camera_${index}`" v-for="(item, index) in newCameraList"
                                    :key="item.id">
                                    <view class="headBar" style="column-gap: 12px;">
                                        <view style="display: flex;flex:1;justify-content: space-between;">
                                            <view class="textTag">
                                                <image class="img" src="/static/desc_icon.png" mode="heightFix"></image>
                                                <text class="text">{{ item.name }}</text>
                                            </view>
                                            <view class="textTag" v-if="!isMultiple">
                                                <image class="img" src="/static/history.png" mode="heightFix"></image>
                                                <text class="text">版本</text>
                                                <view style="display: flex;align-items: center;">
                                                    <view
                                                        :class="['numberButton', { 'active': index == state.optimizationRecordsIndex }]"
                                                        v-for="(record, index) in state.optimizationRecords"
                                                        :key="record.id"
                                                        @click="handleOptimizationRecordChange(index, record)">{{
                                                            index + 1 }}</view>
                                                </view>
                                            </view>
                                        </view>
                                    </view>
                                    <view class="content">
                                        <view style="display: flex;height: 40%;column-gap: 8px;">
                                            <textarea :maxlength="-1" class="textarea topRadius"
                                                @blur="(e) => { item.fenjinContent = e.detail.value; }"
                                                :value="item.fenjinContent" placeholder="优化后的分镜基础内容"></textarea>
                                        </view>
                                        <view style="display: flex;height: 60%;column-gap: 8px;">
                                            <textarea :maxlength="-1" class="textarea bottomRadius"
                                                @blur="(e) => { item.videoContentSP = e.detail.value; }"
                                                :value="item.videoContentSP" placeholder="优化后的镜头内容"></textarea>
                                        </view>
                                    </view>
                                </view>
                            </scroll-view>
                        </view>
                        <view class="footer">
                            <view
                                style="background-color: #409EFF;color: #fff;width: 140px;height: 36px;line-height: 36px;text-align: center;border-radius: 8px;cursor: pointer;"
                                @click="handleCover">
                                全部覆盖分镜</view>
                        </view>
                    </view>

                    <view class="chatingContext">
                        <view
                            style="display: flex;align-items: center;justify-content: space-between;padding-right: 60px;margin-top: 12px;">
                            <view>
                                <text class="headTitle">分镜优化:</text>
                                <text style="padding-left: 8px;font-size: 20px;">{{
                                    isMultiple ? '全集优化' : cameraList[state.curCameraIndex].name }}</text>
                            </view>
                            <view class="menuButton"
                                @click="() => { popupSPConfig.typeId = '29'; state.optSPId = state.optimizationSPId; popupSPConfig.visible = true; popupSPConfig.selectOptimizationSP = true }">
                                {{ state.optimizationSPName || '请选择分镜优化SP' }}</view>
                        </view>
                        <view class="content">
                            <scroll-view id="chatList" :scroll-y="true" class="chatList"
                                :scroll-top="state.scrollTop_chatList"
                                @scroll="(e) => state.scrollTop_chatList = e.detail.scrollTop" :upper-threshold="100"
                                @scrolltoupper="handleGetHistoryChatList">
                                <view id="chatListInner" class="chatListInner">
                                    <view :class="['item', chatItem.type == 1 ? 'user' : 'agent']"
                                        v-for="(chatItem, chatIndex) in state.chatList"
                                        :key="chatItem.id || chatItem.createTime || chatIndex">
                                        <view class="head">{{ chatItem.type == 1 ? "用户" : "Agent" }}</view>
                                        <view class="desc" style="white-space: pre-line;">{{ chatItem.content }}</view>
                                    </view>
                                    <view :class="['item', 'agent']" v-if="state.requesting">
                                        <view class="head">Agent</view>
                                        <view class="desc dots-animation">正在处理中</view>
                                    </view>
                                </view>
                            </scroll-view>
                            <view class="floatBar">
                                <view class="itemButton" @click="handleCreateNewConext">
                                    <image class="icon" src="/static/add_icon.png" mode="heightFix"></image>
                                    <text class="text">新建</text>
                                </view>
                                <view class="dropdownBtn" v-if="!isMultiple" @click="handleHistoryClick">
                                    <image class="icon" src="/static/history_icon.png" mode="heightFix"></image>
                                    <text class="text">历史</text>
                                    <scroll-view :class="['list', { 'visible': state.historyContextListVisible }]"
                                        scroll-y>
                                        <view
                                            :class="['item', { 'active': version.chatSessionId == cameraList[state.curCameraIndex].chatSessionId }]"
                                            v-for="(version, versionIndex) in state.historyContextList"
                                            :key="version.id" @click="handleContextChange(version, versionIndex)">{{
                                                version.formatedTime }}</view>
                                    </scroll-view>
                                </view>
                            </view>
                            <view class="actionSheet" style="position: relative;">
                                <textarea :maxlength="-1" class="textarea"
                                    @blur="(e) => state.textareaValue = e.detail.value" :value="state.textareaValue"
                                    placeholder="描述想法，优化分镜..."></textarea>
                                <view class="actionBar">
                                    <view style="display: flex;align-items: center;">
                                        <view :class="['menuButton', { 'active': state.styleSPName != '' }]"
                                            @click="() => { popupSPConfig.typeId = '30'; state.optSPId = state.styleSPId; popupSPConfig.visible = true; popupSPConfig.selectOptimizationSP = false; }">
                                            <text>{{ state.styleSPName || '深化风格SP' }}</text>
                                            <image v-if="state.styleSPName != ''" src="/static/close.png"
                                                mode="heightFix" style="width: 20px;height: 20px;padding-left: 6px;"
                                                @click.stop="() => { state.styleSPName = ''; state.styleSPContent = '' }">
                                            </image>
                                        </view>
                                        <view class="menuButton">豆包seed2.0</view>
                                    </view>
                                    <view class="sendButton" @click="onSend()"></view>
                                </view>
                            </view>
                        </view>
                    </view>
                </view>
            </view>
        </view>
        <view class="mask"></view>
    </Teleport>
    <PopupSP v-if="popupSPConfig.visible" :value="state.optSPId" :typeId="popupSPConfig.typeId"
        @close="popupSPConfig.visible = false" title="选择分镜优化风格" @confirm="handleSelectOptimizationStyle"></PopupSP>
</template>

<script setup name="PopupCameraOptimization">
import { reactive, ref, computed, onMounted, watch, nextTick, getCurrentInstance, onBeforeUnmount } from "vue";
import {
    doubaoCreateWord,
    geminiCreateWord,
    aliCreateWord
} from '@/common/AIAgentForServer.js';
import { APIPath, getRequest, postRequest } from "@/common/APIRequest";
import { isNull } from "@/common/Tool";
import { debounce } from "lodash";
import { AIChat } from "@/common/AIAgentForServer.js";
import PopupSP from "@/components/popupSP.vue";
import { GetResourceList } from '@/common/ResourceMgr'
import { multiply } from "lodash";
import {
    newCameraConfig
} from '@/common/ProjectMgr';

function formatContextTitle(timeStr) {
    try {
        const date = typeof (timeStr) == 'string' ? new Date(timeStr) : timeStr;
        const month = date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : (date.getMonth() + 1);
        const day = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
        const hour = date.getHours() < 10 ? '0' + date.getHours() : date.getHours();
        const minute = date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes();
        return `${month}-${day} ${hour}:${minute}`
    }
    catch (error) {
        return timeStr
    }
}

function delay(ms) {
    return new Promise(resolve => {
        setTimeout(resolve, ms)
    })
}

const emit = defineEmits(["update", "close"]);
const props = defineProps({
    data: {
        type: Array,
        required: true,
        default: () => []
    },
    projectId: {
        type: [String, Number],
        required: true,
        default: ''
    },
    episodesId:{
        type: [String, Number],
        default: ''
    },
    episodeContent: {
        type: String,
        default: ''
    },
    tag: {
        type: String,
        default: ''
    }
});

// 是否按集入口
const isMultiple = computed(() => {
    return props.data?.length > 1 && props.episodeContent != ''
})

const instance = getCurrentInstance();
const cameraListRef = ref(null);
const cameraList = ref(props.data.map((i, idx) => {
    return {
        fenjinContent_version: props.data[idx].fenjinContent,
        videoContentSP_version: props.data[idx].videoContentSP,
        fenjinContent: '',
        videoContentSP: '',
        id: i.id,
        name: i.name,
        chatSessionId: props.data[idx].chatSessionId,
        episodesId: i.episodesId,
        projectId: props.projectId,
        requesting: false,
    }
}))

const newCameraList = ref([])

const state = reactive({
    curCameraIndex: 0,
    chatList: [
        // {
        //     isUser: false,
        //     content: "好的，Director。目前画布上还没有建立任何项目上下文。为了帮你找对方向，我想先确认一下："
        // }
    ],

    textareaValue: "",

    cameraScrollViewParams: {
        scrollTop: 0,
        height: 0
    },

    scrollTop_chatList: 0,  // 聊天列表scrollTop

    requesting: false, // 是否正在发信息请求中

    optimizationSPContent: '', // 优化主SP内容
    optimizationSPName: '', // 优化主SP名称
    optimizationSPId: '', // 优化主SP id

    styleSPContent: '', // 风格SP内容
    styleSPName: '', // 风格SP名称
    styleSPId: '', // 风格SP id

    optSPId: '', // 弹窗SPid，用于回显

    optimizationRecords: [],// 优化内容版本列表
    optimizationRecordsIndex: 0, // 优化内容版本列表选中的索引

    historyContextList: [], // 历史上下文列表
    historyContextListVisible: false, // 历史上下文列表显示状态

    pageSize: 20, // 聊天记录分页大小
    pageNum: 1, // 聊天记录分页页码
    total: 1, // 聊天记录总条数
});

let historyChatLoading = false;

const popupSPConfig = reactive({
    visible: false,
    typeId: '',
    selectOptimizationSP: false, // 区分是选择风格SP还是主SP
})

const handleClose = () => {
    emit("close")
}

const handleSelectOptimizationStyle = (data) => {
    if (!data || data?.length == 0) return
    if (popupSPConfig.selectOptimizationSP) {
        state.optimizationSPContent = data.content
        state.optimizationSPName = data.name
        state.optimizationSPId = data.id
    } else {
        state.styleSPContent = data.content
        state.styleSPName = data.name
        state.styleSPId = data.id
    }
}

const addChatRecoed = (config = { type: 1, content: '', timeout: null }) => {
    if (isMultiple.value) {
        state.chatList.push({
            content: config.content,
            type: config.type,
            msgType: config.msgType || 1,
        });
        nextTick(() => {
            state.scrollTop_chatList = 9999990;
        })
        return
    }

    const { chatSessionId } = cameraList.value[state.curCameraIndex]
    return new Promise((resolve, reject) => {
        postRequest(APIPath.chatRecord, {
            chatSessionId,
            content: config.content,
            type: config.type, // 1人发2是机器人发3是官方发
            msgType: config.msgType || 1, //消息类型1文字2语音3图片4视频
        }, (result) => {
            if (result.code == 200) {
                state.chatList.push({
                    content: config.content,
                    type: config.type,
                    msgType: config.msgType || 1,
                });
                nextTick(() => {
                    state.scrollTop_chatList = 9999990;
                })
                resolve(result)
            }
        })
    })
}

const startOptimization = async (index) => {
    let item;
    let originItem;
    let tempSP;

    if (isMultiple.value) {
        tempSP = JSON.stringify(props.data.map(i=>{
            return {
                分镜基础信息:i.fenjinContent,
                分镜内容:i.videoContentSP,
            }
        }))
    } else {
        item = cameraList.value[index];
        originItem = props.data[index];
        tempSP = JSON.stringify({
            '分镜基础信息': item.fenjinContent || originItem.fenjinContent,
            '分镜内容': item.videoContentSP || originItem.videoContentSP
        })
        item.requesting = true;
    }

    let allContent = tempSP;
    state.optimizationSPContent && (allContent += ('\n' + state.optimizationSPContent))
    state.textareaValue && (allContent += ('\n' + state.textareaValue))

    let params = {
        projectId: props.projectId,
        episodesId: props.episodesId,
        modelId: 18,
        max_tokens: 32768,
        messages: [{
            role: "user",
            content: [
                {
                    type: 'text',
                    text: allContent
                }
            ]
        }],
    }
    item && (params.cameraId = item.id);

    AIChat(params).then(async (message) => {
        let videoContentSP = '';
        let fenjinContent = '';

        state.requesting = false;

        try {
            if (isMultiple.value) {
                console.log('message=', message)
                let parts = message.split('####');
                parts = parts.map(part => part.trim()).filter(part => part !== '');
                var curDate = Date.now()
                const newCameras = [];
                for (let i = 0; i < parts.length; i++) {
                    const element = parts[i];
                    let spParts = element.split('###');
                    spParts = spParts.map(part1 => part1.trim()).filter(part1 => part1 !== '');
                    var fenjingName = props.tag + (i + 1);
                    var tempCameraConfig = newCameraConfig(fenjingName, curDate, i)
                    console.log('分镜列表内容=', spParts)
                    if (spParts.length > 0) {
                        if (spParts.length >= 2) {
                            tempCameraConfig.fenjinContent = spParts[1]
                        }
                        if (spParts.length >= 3) {
                            tempCameraConfig.videoContentSP = spParts[2]
                        }
                    }
                    newCameras.push(tempCameraConfig)
                }
                newCameraList.value = newCameras;
                console.log('newCameraList.value=', newCameraList.value)

                addChatRecoed({
                    type: 2,
                    content: `优化结果已完成\n\n${message}`
                });
                
            } else {
                let parts = message?.split('###');
                parts = parts.map(part => part.trim()).filter(part => part !== '');
                if (parts.length >= 0) {
                    fenjinContent = parts[0]
                }
                if (parts.length >= 1) {
                    videoContentSP = parts[1]
                }

                cameraList.value[index].videoContentSP = videoContentSP
                cameraList.value[index].fenjinContent = fenjinContent

                addChatRecoed({
                    type: 2,
                    content: `分镜【${item.name}】优化结果已完成\n\n${fenjinContent}\n${videoContentSP}`
                });
            }      
        }
        catch (error) {
            console.warn('解析镜头内容失败', error)
        }

    }).catch((err) => {
        console.warn(err)
    }).finally(() => {
        item && (item.requesting = false)
    })
}

const onSend = async () => {
    if (state.textareaValue == "" && state.styleSPContent == '') {
        uni.showToast({
            title: '请输入内容或选取深化风格SP',
            icon: 'none'
        })
        return
    }

    if (state.optimizationSPContent == '') {
        uni.showToast({
            title: '请选择分镜优化风格',
            icon: 'none'
        })
        return;
    }

    state.textareaValue && addChatRecoed({
        type: 1,
        content: state.textareaValue
    });

    state.textareaValue = "";

    state.requesting = true;

    if (isMultiple.value) {
        startOptimization()
    } else {
        startOptimization(0)
    }
}

const handleHistoryClick = () => {
    state.historyContextListVisible = !state.historyContextListVisible;
}

// 弹窗左侧分镜基础和镜头内容列表滚动事件
const handleScroll = (e) => {
    state.cameraScrollViewParams.scrollTop = e.detail.scrollTop
    if (state.cameraScrollViewParams.height == 0) {
        state.curCameraIndex = 0
    } else {
        const value = Math.floor((state.cameraScrollViewParams.scrollTop + state.cameraScrollViewParams.height / 2) / state.cameraScrollViewParams.height)
        if (value < 0) {
            value = 0
        }
        state.curCameraIndex = value;
    }
}

// 弹窗左侧底部分镜标签点击事件，滚动到对应位置
const handleCameraTagClick = (index) => {
    state.curCameraIndex = index;
    const value = index * state.cameraScrollViewParams.height + 1
    state.cameraScrollViewParams.scrollTop = value
}

// 点击覆盖按钮
const handleCover = () => {
    if(newCameraList.value.length==0){
        uni.showToast({
            title: '请先生成优化分镜内容',
            icon: 'none'
        })
        return
    }

    let existEmpty = false;
    for (let item of newCameraList.value) {
        if (item.fenjinContent == '' || item.videoContentSP == '') {
            existEmpty = true
        }
    }

    const fn = async () => {
        emit('update', newCameraList.value)
        emit('close')
    }

    if (existEmpty) {
        uni.showModal({
            title: '提示',
            content: '存在分镜内容为空，确认继续进行分镜内容覆盖？',
            success: (res) => {
                if (res.confirm) {
                    fn()
                }
            }
        })
    } else {
        fn()
    }
}

const handleCreateNewConext = () => {
    let existContent = false;
    for (let cameraItem of cameraList.value) {
        if (cameraItem.fenjinContent?.trim() !== '' && cameraItem.videoContentSP?.trim() !== '') {
            existContent = true
            break;
        }
    }
    if (existContent) {
        uni.showModal({
            title: '提示',
            content: '创建新上下文将会清除目前优化后的内容，确认继续？',
            success: (res) => {
                if (res.confirm) {
                    createNewContext()
                }
            }
        })
    } else {
        createNewContext()
    }
}

const computePopupHeight = debounce(() => {
    let rect = document.querySelector("#cameraList-left").getBoundingClientRect()
    state.cameraScrollViewParams.height = rect.height
}, 300, {})

// 获取优化内容版本
const getOptimizationVersion = () => {
    const { projectId, episodesId, id, chatSessionId } = cameraList.value[state.curCameraIndex];
    const requestUrl = `${APIPath.userChatRecordMemoirsList}?pageSize=99&pageNum=1&projectId=${projectId}&episodesId=${episodesId}&cameraId=${id}`
    getRequest(requestUrl, (result) => {
        if (result.code == 200) {
            const data = result.rows.filter(i => i.type == 1 && i.content?.trim()).map(i => {
                const content = JSON.parse(i.content)
                return {
                    ...i,
                    fenjingContent: content.fenjingContent,
                    videoContentSP: content.videoContentSP,
                }
            })

            // 如果之前没有版本，添加一个当前本版
            data.length == 0 && data.unshift({
                id: new Date().getTime(),
                fenjingContent: props.data[state.curCameraIndex].fenjinContent,
                videoContentSP: props.data[state.curCameraIndex].videoContentSP,
            })

            state.optimizationRecords = data
            state.historyContextList = result.rows.filter(i => i.type == 2).map(i => {
                const date = new Date(i.createTime);
                return {
                    ...i,
                    formatedTime: formatContextTitle(i.createTime),
                }
            })
        }
    })
}

// 创建新会话
const createNewContext = () => {
    // 多个镜头的逻辑
    if (isMultiple.value) {
        // 清空聊天内容
        state.chatList = [];

        //清空分镜基础和镜头内容
        for (let cameraItem of cameraList.value) {
            cameraItem.fenjinContent = '';
            cameraItem.videoContentSP = '';
        }
        return
    }

    // 单个镜头的逻辑
    let { episodesId, projectId, id } = cameraList.value[state.curCameraIndex]
    postRequest(APIPath.startChat, {
        episodesId,
        projectId,
        cameraId: id,
    }, (result) => {
        if (result.code == 200) {

            // 清空聊天内容
            state.chatList = [];

            // 清空分镜基础和镜头内容
            cameraList.value[state.curCameraIndex].fenjinContent = '';
            cameraList.value[state.curCameraIndex].videoContentSP = '';

            // 上下文历史列表在本地增加一个（不调接口刷新列表）
            const date = new Date();
            state.historyContextList.unshift({
                id: date.getTime(),
                formatedTime: formatContextTitle(date),
                chatSessionId: result.data.chatSessionId,
            })

            // 保存会话ID
            cameraList.value[state.curCameraIndex].chatSessionId = result.data.chatSessionId;
            emit('update', [{
                id: cameraList.value[state.curCameraIndex].id,
                chatSessionId: cameraList.value[state.curCameraIndex].chatSessionId,
            }])
        }
    })
}


// 获取聊天记录
const getChatList = (config = {}) => {
    config = {
        reset: false,
        toBottom: true,
        ...config,
    }

    let { chatSessionId } = cameraList.value[state.curCameraIndex]

    if (config.reset) {
        state.chatList = [];
        state.pageNum = 1;
        state.total = 1;
    }

    return new Promise((resolve) => {
        if (!chatSessionId || state.pageNum > state.total) {
            resolve({ code: 0, rows: [] })
            return
        }

        getRequest(APIPath.chatRecordList + `?chatSessionId=${chatSessionId}&pageSize=${state.pageSize}&pageNum=${state.pageNum}`, (result) => {
            if (result.code == 200) {
                const rows = result.rows || [];
                state.chatList = [...rows.reverse(), ...state.chatList];
                state.pageNum++
                state.total = result.total
                config.toBottom && nextTick(() => {
                    state.scrollTop_chatList = 9999999
                })
            }
            resolve(result)
        })
    })
}

const getChatListContentHeight = () => {
    if (typeof document == "undefined") {
        return 0
    }
    return document.querySelector("#chatListInner")?.getBoundingClientRect()?.height || 0
}

// 获取历史聊天记录
const handleGetHistoryChatList = async () => {
    if (historyChatLoading || state.chatList.length >= state.total) {
        return
    }

    historyChatLoading = true;

    const beforeScrollTop = state.scrollTop_chatList;
    const beforeContentHeight = getChatListContentHeight();

    try {
        const result = await getChatList({ toBottom: false })
        await nextTick()
        await delay(0)

        if (result?.code == 200 && beforeContentHeight > 0) {
            const afterContentHeight = getChatListContentHeight();
            const heightDelta = Math.max(afterContentHeight - beforeContentHeight, 0);
            state.scrollTop_chatList = beforeScrollTop + heightDelta;
        } else {
            state.scrollTop_chatList = beforeScrollTop;
        }
    } finally {
        historyChatLoading = false;
    }
}

const initChat = () => {
    if (isMultiple.value) {
        return
    }

    let { chatSessionId } = cameraList.value[state.curCameraIndex]
    // 如果没有会话记录，新增会话
    if (!chatSessionId) {
        createNewContext()
    }
    // 有会话记录，获取聊天历史记录 
    else {
        getChatList()
    }

    // 获取优化内容版本
    getOptimizationVersion()
}

// 版本内容切换（切换分镜基础和镜头内容）
const handleOptimizationRecordChange = (index, record) => {
    if (state.optimizationRecordsIndex == index) {
        return
    }
    state.optimizationRecordsIndex = index
    cameraList.value[0].fenjinContent_version = record.fenjingContent
    cameraList.value[0].videoContentSP_version = record.videoContentSP
}

// 点击历史，切换上下文
const handleContextChange = (item, index) => {
    if (item.chatSessionId === cameraList.value[state.curCameraIndex].chatSessionId) {
        return
    }
    const cameraItem = cameraList.value[state.curCameraIndex]
    cameraItem.chatSessionId = item.chatSessionId
    emit('update', [{
        id: cameraItem.id,
        chatSessionId: item.chatSessionId,
    }])

    getChatList({ reset: true })

    postRequest(APIPath.updateCameraChatSessionId, {
        cameraId: cameraItem.id,
        episodesId: cameraItem.episodesId,
        chatSessionId: cameraItem.chatSessionId,
    })
}

onMounted(async () => {
    // 获取深化AgentSP并设默认值
    GetResourceList(1, 200, '29', (resList) => {
        state.listData = resList.map(i => {
            return {
                name: i.name,
                content: i.content,
                id: i.id,
            }
        })

        let firstAgentSP = state.listData.find(i => i.id == 6012)
        firstAgentSP = firstAgentSP ? firstAgentSP : state.listData[0]
        if (firstAgentSP) {
            state.optimizationSPContent = firstAgentSP.content;
            state.optimizationSPName = firstAgentSP.name
            state.optimizationSPId = firstAgentSP.id
        }
    })

    initChat()

    await nextTick();
    // setTimeout(() => {
    //     const query = uni.createSelectorQuery();
    //     query
    //         .select("#cameraList")
    //         .boundingClientRect((data) => {
    //             console.log("得到布局位置信息", data);
    //         })
    //         .exec();
    // }, 2000);
    computePopupHeight()
    window.addEventListener('resize', computePopupHeight)
})

onBeforeUnmount(() => {
    window.removeEventListener('resize', computePopupHeight)
})



</script>
<style scoped lang="scss">
.mask {
    position: fixed;
    z-index: 90;
    background: rgba(0, 0, 0, 0.6);
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
}

.popup-resource-editor {
    border-width: 0px;
    position: fixed;
    z-index: 91;
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
        font-size: 24px;
        font-weight: 600;
        color: #FFA701;
        text-align: left;
    }

    .mainContent {
        flex: 1;
        min-width: 0;
        margin-right: 12px;
        border-radius: 12px;
        background-color: #E7E7E7;
        height: 100%;
        display: flex;
        flex-direction: column;
        height: 100%;

        .head {
            display: flex;
            align-items: center;

            .tag {
                font-size: 16px;
                font-weight: 600;
                color: #fff;
                background-color: #999999;
                text-align: left;
                height: 36px;
                line-height: 36px;
                padding: 0 12px;
            }
        }

        .cameraList {
            width: 100%;
            height: 100%;
            position: relative;
            box-sizing: border-box;

            .item {
                display: flex;
                flex-direction: column;
                height: 100%;

                .headBar {
                    display: flex;
                    align-items: center;
                    width: 100%;
                    height: 30px;
                    line-height: 30px;
                }

                .content {
                    flex: 1;
                    min-height: 0;
                }
            }
        }
    }

    .chatingContext {
        width: 36%;
        min-width: 420px;
        flex-shrink: 0;
        height: 100%;
        display: flex;
        flex-direction: column;

        .content {
            margin-top: 12px;
            flex: 1;
            min-height: 0;
            display: flex;
            flex-direction: column;
            background-color: #E7E7E7;
            border-radius: 12px;
        }

        .chatList {
            flex: 1;
            min-height: 0;

            .item {
                margin-top: 12px;
                position: relative;
                padding-top: 20px;

                .head {
                    width: 80px;
                    height: 20px;
                    line-height: 20px;
                    backdrop-filter: blur(10px);
                    font-size: 14px;
                    padding: 0 8px;
                    position: absolute;
                    top: 0;
                }

                .desc {
                    padding: 8px 10px;
                    background-color: #fff;
                    border-radius: 12px;
                    color: #333;
                    font-size: 16px;
                    word-break: break-all;

                    &.animation {
                        animation: forwards;
                    }
                }

                &.user {
                    margin-left: 48px;
                    margin-right: 12px;
                }

                &.agent {
                    margin-right: 48px;
                    margin-left: 12px;
                }

                &.user .desc {
                    border-top-right-radius: 0;
                }

                &.user .head {
                    background: linear-gradient(270deg, #F8BA38 0%, #FFCA5A 80%, rgba(255, 202, 90, 0) 100%);
                    text-align: right;
                    border-top-right-radius: 4px;
                    right: 0;
                    color: #666;
                }

                &.agent .desc {
                    border-top-left-radius: 0;
                }

                &.agent .head {
                    background: linear-gradient(90deg, #666666 50%, rgba(102, 102, 102, 0) 100%);
                    border-top-left-radius: 4px;
                    left: 0;
                    color: #fff;
                }
            }
        }

        .actionSheet {
            height: 28%;
            flex-shrink: 0;
            margin: 12px;
            background-color: #fff;
            border-radius: 12px;
            display: flex;
            flex-direction: column;
            padding: 8px;
            padding-top: 4px;
            margin-top: 8px;

            .textarea {
                width: 100%;
                height: 100%;
                flex: 1;
                min-height: 0;
                border: none;
            }

            .actionBar {
                display: flex;
                align-items: center;
                justify-content: space-between;

                .sendButton {
                    width: 30px;
                    height: 30px;
                    background-image: url("/static/send_icon.png");
                    background-size: cover;
                    background-repeat: no-repeat;
                    background-position: center;
                    cursor: pointer;
                }
            }
        }
    }

    .textTag {
        display: flex;
        align-items: center;

        .text {
            color: #333;
            font-weight: 600;
            font-size: 16px;
            padding-left: 4px;
        }

        .img {
            width: 16px;
            height: 16px;
        }
    }

    .textarea {
        overflow: hidden;
        padding: 16rpx;
        box-sizing: border-box;
        height: 100%;
        background-color: #fff;
        flex: 1;
        border: 1px solid #CCCCCC;

        &.topRadius {
            border-radius: 8px 8px 0 0;
        }

        &.bottomRadius {
            border-radius: 0 0 8px 8px;
        }
    }

    .menuButton {
        height: 30px;
        color: #333;
        font-size: 16px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 4px;
        background-color: #E7E7E7;
        margin-right: 6px;
        position: relative;
        cursor: pointer;
        padding: 0 16px;
        padding-right: 30px;
        margin-right: 12px;

        &::before {
            content: "";
            position: absolute;
            width: 8px;
            height: 8px;
            border-left: 1px solid #333;
            border-bottom: 1px solid #333;
            right: 6px;
            top: 40%;
            transform: rotate(-45deg) translateY(-50%);
        }

        &.active {
            padding-right: 8px;
        }

        &.active::before {
            display: none;
        }

        &::after {
            content: "";
            position: absolute;
            right: -6px;
            top: 10%;
            display: block;
            width: 1px;
            height: 80%;
            background-color: #999999;
        }

        &:last-child {
            margin-right: 0;
        }

        &:last-child::after {
            display: none;
        }
    }

    .numberButton {
        display: inline-block;
        height: 20px;
        line-height: 20px;
        text-align: center;
        min-width: 20px;
        background-color: #fff;
        margin-left: 4px;
        border-radius: 4px;
        cursor: pointer;
        border-radius: 1px solid #e7e7e7;
        box-shadow: 0 0 4px rgba(0, 0, 0, 0.1);

        &.active {
            background-color: #409EFF;
            color: #fff;
        }
    }

    .footer {
        padding: 0 12px;
        display: flex;
        align-items: center;
        margin-top: 12px;
        margin-bottom: 6px;
        justify-content: flex-end;

        .textButton {
            display: inline-block;
            height: 34px;
            line-height: 34px;
            text-align: center;
            min-width: 60px;
            background-color: #fff;
            margin-right: 8px;
            border-radius: 8px;
            cursor: pointer;

            &.active {
                background-color: #409EFF;
                color: #fff;
            }
        }
    }

    .floatBar {
        padding-top: 8px;
        display: flex;
        align-items: center;
        justify-content: flex-end;
        margin-right: 12px;
        // position: absolute;
        // top: -34px;
        // right: 16px;

        .itemButton,
        .dropdownBtn {
            padding: 0 10px;
            height: 30px;
            display: flex;
            align-items: center;
            justify-content: center;
            background-color: #fff;
            border-radius: 8px;
            margin-right: 6px;
            box-shadow: 0 0 8px rgba(0, 0, 0, 0.1);
            cursor: pointer;

            &:last-child {
                margin-right: 0;
            }

            .text {
                font-size: 12px;
                font-weight: 500;
                color: #666666;
                padding-left: 4px;
            }

            .icon {
                width: 16px;
                height: 16px;
            }
        }
    }
}

.dropdownBtn {
    position: relative;

    .list {
        max-height: 200px;
        width: 120px;
        transform: all 0.3s ease-in-out;
        position: absolute;
        z-index: 5;
        right: 0;
        bottom: 0;
        transform: translateY(-34px);
        box-shadow: 0 0px 12px rgba(0, 0, 0, 0.4);
        border-radius: 6px;
        overflow: hidden;
        visibility: hidden;
        background-color: #fff;

        &.visible {
            visibility: visible;
        }

        .item {
            text-align: center;
            height: 30px;
            width: 100%;
            background: #fff;
            color: #666666;
            font-size: 16px;
            font-weight: 500;
            border-bottom: 1px solid #f7f7f7;

            &.active {
                background-color: rgb(248, 186, 56);
                color: #333;
            }

            &:last-child {
                border-bottom: none;
            }
        }
    }
}

/* 动画1：经典省略号动画 */
.dots-animation::after {
    content: "";
    animation: dots 1.5s infinite;
    margin-left: 5px;
}

@keyframes dots {

    0%,
    20% {
        content: ".";
    }

    40% {
        content: "..";
    }

    60%,
    100% {
        content: "...";
    }
}
</style>
