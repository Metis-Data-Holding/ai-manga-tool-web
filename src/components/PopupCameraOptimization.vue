<template>
    <Teleport to="body">
        <view>
            <view class="popup-resource-editor">
                <view class="icon-close-popup" @click="handleClose"></view>
                <view style="display: flex;width: 100%;">
                    <view class="mainContent">
                        <view class="head">
                            <view class="tag" style="flex: 1;">当前分镜</view>
                            <view class="tag" style="flex: 1;">优化后分镜</view>
                        </view>
                        <view style="padding: 12px 10px;flex: 1;min-height: 0;">
                            <scroll-view id="cameraList" ref="cameraListRef" :scroll-y="true"
                                :scroll-top="state.cameraScrollViewParams.scrollTop" @scroll="handleScroll">
                                <view class="item" :id="`camera_${index}`" v-for="(item, index) in props.data"
                                    :key="item.id">
                                    <view class="headBar" style="column-gap: 12px;">
                                        <view style="display: flex;flex:1;justify-content: space-between;">
                                            <view class="textTag">
                                                <image class="img" src="/static/desc_icon.png" mode="heightFix"></image>
                                                <text class="text">{{ item.name }}</text>
                                            </view>                                     
                                            <view class="textTag">
                                                <image class="img" src="/static/history.png" mode="heightFix"></image>
                                                <text class="text">版本</text>
                                                <view style="display: flex;align-items: center;">
                                                    <view class="numberButton active">1</view>
                                                </view>
                                            </view>
                                        </view>
                                        <view class="textTag" style="flex: 1;">
                                            <image class="img" src="/static/desc_icon.png" mode="heightFix"></image>
                                            <text class="text">{{ item.name }}</text>
                                        </view>
                                    </view>
                                    <view class="content">
                                        <view style="display: flex;height: 40%;column-gap: 8px;">
                                            <textarea :maxlength="-1" class="textarea topRadius" @blur="() => { }"
                                                :value="item.fenjinContent" placeholder="分镜基础内容"></textarea>
                                            <textarea :maxlength="-1" class="textarea topRadius"
                                                @blur="(e) => { cameraListValue[index].fenjinContent = e.detail.value; }"
                                                :value="cameraListValue[index].fenjinContent"
                                                placeholder="优化后的分镜基础内容"></textarea>
                                        </view>
                                        <view style="display: flex;height: 60%;column-gap: 8px;">
                                            <textarea :maxlength="-1" class="textarea bottomRadius" @blur="() => { }"
                                                :value="item.videoContentSP" placeholder="镜头内容"></textarea>
                                            <textarea :maxlength="-1" class="textarea bottomRadius"
                                                @blur="(e) => { cameraListValue[index].videoContentSP = e.detail.value; }"
                                                :value="cameraListValue[index].videoContentSP"
                                                placeholder="优化后的镜头内容"></textarea>
                                        </view>
                                    </view>
                                </view>
                            </scroll-view>
                        </view>
                        <view class="footer">
                            <view class="textTag" style="width: 100px;">
                                <image class="img" src="/static/desc_icon.png" mode="heightFix"></image>
                                <text class="text">分镜优化：</text>
                            </view>
                            <scroll-view scroll-x
                                style="flex: 1;white-space: nowrap;min-width: 0;align-items: flex-start;padding: 0 12px;">
                                <view class="textButton" v-for="(cameraItem, cameraIndex) in props.data"
                                    :key="cameraItem.id" :class="{ 'active': cameraIndex == state.curCameraIndex }"
                                    @click="handleCameraTagClick(cameraIndex)">
                                    {{ cameraItem.name }}
                                </view>
                            </scroll-view>
                            <view
                                style="background-color: #409EFF;color: #fff;width: 140px;height: 36px;line-height: 36px;text-align: center;border-radius: 8px;cursor: pointer;"
                                @click="handleCover">
                                全部覆盖分镜</view>
                        </view>
                    </view>

                    <view class="chatingContext">
                        <view
                            style="display: flex;align-items: center;justify-content: space-between;padding-right: 100px;margin-top: 12px;">
                            <view class="headTitle">
                                分镜优化
                            </view>
                            <view class="menuButton"
                                @click="() => { popupSPConfig.typeId = '29'; popupSPConfig.visible = true; popupSPConfig.selectOptimizationSP = true }">
                                {{ state.optimizationSPName || '请选择分镜优化SP' }}</view>
                        </view>
                        <view class="content">
                            <scroll-view :scroll-y="true" class="chatList" :scroll-top="state.scrollTop_chatList"
                                @scroll="(e) => state.scrollTop_chatList = e.detail.scrollTop">
                                <view :class="['item', chatItem.isUser ? 'user' : 'agent']"
                                    v-for="(chatItem, chatIndex) in state.chatList" :key="chatIndex">
                                    <view class="head">{{ chatItem.isUser ? "用户" : "Agent" }}</view>
                                    <view class="desc" style="white-space: pre-line;">{{ chatItem.content }}</view>
                                </view>
                                <view :class="['item', 'agent']" v-if="state.requesting">
                                    <view class="head">Agent</view>
                                    <view class="desc dots-animation">正在思考中</view>
                                </view>
                            </scroll-view>
                            <view class="actionSheet" style="position: relative;">
                                <view class="floatBar">
                                    <!-- <view class="itemButton" @click="handleCreateNewConext">
                                        <image class="icon" src="/static/add_icon.png" mode="heightFix"></image>
                                        <text class="text">新建</text>
                                    </view>
                                    <view class="itemButton" @click="handleHistoryClick">
                                        <image class="icon" src="/static/history_icon.png" mode="heightFix"></image>
                                        <text class="text">历史</text>
                                    </view> -->
                                    <view style="color: red;">未接上下文，功能处于测试阶段，覆盖分镜后内容并不会自动保存</view>
                                </view>
                                <textarea :maxlength="-1" class="textarea"
                                    @blur="(e) => state.textareaValue = e.detail.value" :value="state.textareaValue"
                                    placeholder="描述想法，优化分镜..."></textarea>
                                <view class="actionBar">
                                    <view style="display: flex;align-items: center;">
                                        <view class="menuButton"
                                            @click="() => { popupSPConfig.typeId = '30'; popupSPConfig.visible = true; popupSPConfig.selectOptimizationSP = false; }">
                                            深化风格SP</view>
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
    <PopupSP v-if="popupSPConfig.visible" :typeId="popupSPConfig.typeId" @close="popupSPConfig.visible = false"
        title="选择分镜优化风格" @confirm="handleSelectOptimizationStyle"></PopupSP>
</template>

<script setup name="PopupCameraOptimization">
import { reactive, ref, computed, onMounted, watch, nextTick, getCurrentInstance,onBeforeUnmount } from "vue";
import {
    doubaoCreateWord,
    geminiCreateWord,
    aliCreateWord
} from '@/common/AIAgentForServer.js';
import { APIPath, getRequest } from "@/common/APIRequest";
import { isNull } from "@/common/Tool";
import {debounce} from "lodash";
import PopupSP from "@/components/popupSP.vue";

function delay(ms) {
    return new Promise(resolve => {
        setTimeout(resolve, ms)
    })
}

const emit = defineEmits(["update"]);
const props = defineProps({
    data: {
        type: Array,
        required: true,
        default: () => []
    },
    projectId: {
        type: String,
        required: true,
        default: ''
    }
});

const instance = getCurrentInstance();
const cameraListRef = ref(null);
const cameraListValue = ref(props.data.map(i => {
    return {
        fenjinContent: '',
        videoContentSP: '',
        id: i.id,
        name: i.name
    }
}))

const historyList = computed(() => {
    return props.data.filter(item => item.status != 8);
})

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
    scrollTop_chatList: 0,
    requesting: false,

    optimizationSPContent: '',
    optimizationSPName: ''
});

const popupSPConfig = reactive({
    visible: false,
    typeId: '',
    selectOptimizationSP: false,
})

const handleClose = () => {
    emit("close")
}

const handleSelectOptimizationStyle = (data) => {
    console.log(data, popupSPConfig.selectOptimizationSP)
    if (popupSPConfig.selectOptimizationSP) {
        state.optimizationSPContent = data.content
        state.optimizationSPName = data.name
    } else {
        state.textareaValue = data.content
    }
}


const startOptimization = async (index) => {
    const item = props.data[index]
    let tempSP = JSON.stringify({
        '分镜基础信息': item.fenjinContent,
        '分镜内容': item.videoContentSP
    })

    let params = {
        projectId: props.projectId,
        modelId: 18,
        max_tokens: 32768,
        messages: [{
            "role": "system",
            "content": tempSP
        },
        {
            "role": "user",
            "content": state.optimizationSPContent + '\n' + state.textareaValue
        },
        ]
    }

    doubaoCreateWord(params, async (result) => {
        state.requesting = false;

        state.chatList.push({
            isUser: false,
            content: `分镜${item.name}优化结果已完成`
        });

        
        console.log('生成分镜结果=', result)

        try {
            let data = JSON.parse(result);
            data = JSON.parse(data.choices[0].message.content);
            let videoContentSP = '';
            let fenjinContent = '';
            Object.keys(data['分镜基础信息']).forEach(key => {
                fenjinContent += `${key}: ${data['分镜基础信息'][key]}` + '\n'
            })

            // 拼接特定字段，再追加剩余字段
            const keys = ['镜头序号','时长','景别运动','画面内容']
            for (let c of data['分镜内容']) {
                videoContentSP += `镜头${c['镜头序号']}（${c['时长']} ${c['景别运动']}） ${c['画面内容']}\n`;
                for(let key of keys){
                    delete c[key]
                }
                Object.keys(c).forEach(key => {
                    videoContentSP += `${key}: ${c[key]}` + '\n'
                })
            }
            
            cameraListValue.value[index].videoContentSP = videoContentSP

            cameraListValue.value[index].fenjinContent = fenjinContent //item.fenjinContent

            state.chatList.push({
                isUser: false,
                content: fenjinContent+'\n'+ videoContentSP
            });

            await nextTick();
            state.scrollTop_chatList = 999999;
        }
        catch (error) {
            console.warn(`解析分镜${item.name}结果失败=`, error)
        }

        // let parts = JSON.parse(result)?.choices?.[0].message?.content.split('####');
        // parts = parts.map(part => part.trim()).filter(part => part !== '');
    }, (errormsg) => {
        state.requesting = false
        uni.showToast({
            title: errormsg,
            icon: 'none'
        })
    })
}

const onSend = async () => {
    if (state.textareaValue == "") {
        return;
    }
    if (state.optimizationSPContent == '') {
        uni.showToast({
            title: '请选择分镜优化风格',
            icon: 'none'
        })
        return;
    }

    state.chatList.push({
        isUser: true,
        content: state.textareaValue
    });
    state.textareaValue = "";

    state.requesting = true;

    await nextTick();
    state.scrollTop_chatList = 999999;
    if (props.data.length == 1) {
        startOptimization(0)
    } else {
        for (let i = 0; i < props.data.length; i++) {
            startOptimization(i)
        }
    }
}

const handleHistoryClick = () => {
    state.scrollTop_chatList = 999999;
}

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

const handleCameraTagClick = (index) => {
    state.curCameraIndex = index;
    const value = index * state.cameraScrollViewParams.height + 1
    state.cameraScrollViewParams.scrollTop = value
}

const handleCover = () => {
    console.log(cameraListValue.value)
    let existEmpty = false;
    for (let item of cameraListValue.value) {
        if (item.fenjinContent == '' || item.videoContentSP == '') {
            existEmpty = true
        }
    }

    if (existEmpty) {
        uni.showModal({
            title: '提示',
            content: '存在分镜内容为空，确认继续进行分镜内容覆盖？',
            success: (res) => {
                if (res.confirm) {
                    emit('update', cameraListValue.value)
                    emit('close')
                }
            }
        })
    } else {
        emit('update', cameraListValue.value)
        emit('close')
    }
}

const handleCreateNewConext = ()=>{
    console.log('handleCreateNewConext')
    state.chatList = []
}

const computePopupHeight = debounce(()=>{
    let rect = document.querySelector("#cameraList").getBoundingClientRect()
    state.cameraScrollViewParams.height = rect.height
},300,{})

onMounted(async () => {
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

        #cameraList {
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
        width: 30%;
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
                    background-image: url("static/send_icon.png");
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
        &.topRadius{
            border-radius: 8px 8px 0 0;
        }
        &.bottomRadius{
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
        margin-right: 12px;
        position: relative;
        cursor: pointer;
        padding: 0 16px;
        padding-right: 30px;

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

    .numberButton{
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
        display: flex;
        align-items: center;
        justify-content: flex-end;
        position: absolute;
        top: -34px;
        right: 16px;

        .itemButton {
            padding: 0 8px;
            height: 30px;
            display: flex;
            align-items: center;
            justify-content: center;
            background-color: #fff;
            border-radius: 6px;
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
