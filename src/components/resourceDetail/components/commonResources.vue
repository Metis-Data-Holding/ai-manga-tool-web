<template>
    <view class="commonResources">
        <view class="head">
            <view class="title">
                <image src="/static/picture.png" class="icon" mode="aspectFit"></image>
                <text class="text">公共库</text>
            </view>
            <view class="searchBox">
                <image :src="'/static/searchicon.png'" style="width: 20px; height: 20px" mode="widthFix">
                </image>
                <input style="padding-left: 6px;flex: 1;" placeholder="请输入资产名称" :value="state.searchKeyWord"
                    @input="debounceSearchCommonResource" />
            </view>
        </view>
        <scroll-view class="resourceList" scroll-y :show-scrollbar="false" @scrolltolower="getList">
            <view :class="['item', { 'active': state.currentIndex == index }]"
                v-for="(item, index) in state.resourceList" :key="item.id" @click="handleSelect(index, item)" v-memo="[item.id,index == state.currentIndex]">
                <image v-if="item._mediaType == 'image'" :src="item.url" style="width: 100%; height: 100%" mode="aspectFit"></image>
                 <image v-else-if="item._mediaType == 'video'" src="/static/video_icon_white.png"
                    style="width: 40%; height: 40%;cursor: pointer;position: absolute;top: 50%;left: 50%;transform: translate(-50%, -50%);;" mode="widthFix" >
                </image>
                <image v-else-if="item._mediaType == 'audio'" src="/static/audio.png"
                    style="width: 40%; height: 40%;cursor: pointer;position: absolute;top: 50%;left: 50%;transform: translate(-50%, -50%);;" mode="widthFix" >
                </image>
                <view class="desc">{{ item.name }}</view>
            </view>
        </scroll-view>
    </view>
</template>

<script setup name="commonResources">
import {
    APIPath,
    getRequest,
    postRequest,
    putRequest,
} from "@/common/APIRequest";
import { reactive, ref, computed, onMounted } from "vue";
import { debounce } from 'lodash';
import { checkMediaType } from '@/common/Tool';
const emit = defineEmits(["close", "confirm"]);
const props = defineProps({
    show: {
        type: Boolean,
        required: true,
        default: false,
    },
    typeId: {
        type: [Number, String],
        required: true,
    },
});

const state = reactive({
    pageNum:1,
    pageSize:50,
    isFinished:false,

    resourceList: [], // 资源列表
    currentIndex: null, // 选择的索引值
    searchKeyWord: '', // 搜索关键词
});

const resetPagination = ()=>{
    state.pageNum=1
    state.isFinished=false
    state.resourceList=[]
}

// 选择资源
const handleSelect = (index, resourceItem) => {
    state.currentIndex=index
    emit('confirm',{data:resourceItem})
}

const getList = (extractParams) => {
    return new Promise((resolve, reject) => {
        if(state.isFinished){
            return
        }
        var apiPath = APIPath.resourceList+`?pageNum=${state.pageNum}&pageSize=${state.pageSize}&typeId=${props.typeId}&projectId=0`
        if (extractParams) {
            for (const key in extractParams) {
                apiPath += `&${key}=${extractParams[key]}`
            }
        }
        uni.showLoading({
            title: '加载中...',
        })
        getRequest(apiPath, (res) => {   
            uni.hideLoading();
            
            if (res.code == 200) {
                if(res.rows.length<state.pageSize){
                    state.isFinished=true
                }else{
                    state.pageNum++;
                } 

                const data = res.rows.filter(i => i.status == 1).map(i => ({
                    ...i,
                    _mediaType: checkMediaType(i.url)
                }))
                state.resourceList = state.resourceList.concat(data)
                resolve(data)
            }
            else {
                console.error(data.msg)
                reject(data)
            }
            uni.hideLoading()
        }, (error) => {
            console.error(error)
            reject(error)
        })
    })

}

const debounceSearchCommonResource = debounce((e) => {
    resetPagination()
    getList({
        name: e.detail.value,
    })
}, 800)

onMounted(() => {
    getList()
})

</script>

<style scoped lang="scss">
.commonResources {
    margin-top: 8px;
    height: 100%;
    display: flex;
    flex-direction: column;
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

.searchBox {
    width: 180px;
    height: 26px;
    background: #F3F3F3;
    border-radius: 8px;
    padding: 3px 6px;
    display: flex;
    align-items: center;
}

.resourceList {
    margin-top: 10px;
    flex: 1;
    min-height: 480px;
    .item {
        background-color: rgb(102, 102, 102);
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
</style>
