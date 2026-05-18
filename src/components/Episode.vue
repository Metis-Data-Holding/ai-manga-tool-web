<template>
    <!-- 集数滚动条 -->
    <scroll-view class="episode" :scroll-x="true" :show-scrollbar="true" v-show="props.datas.length > 0">
        <view :class="['item', { 'active': index === state.activeIndex }]" v-for="(item, index) in props.datas"
            :key="index" @click="handleClick(index,item.id)">
            <!-- /static/tag_finished.png -->
            <image src="/static/tag_pending.png" class="imgTag" mode="widthFix"></image>
            <!-- <text class="text">{{ item.name }}</text> -->
            <text class="text">第{{ item.collectId }}集{{ item.extractName||''}}</text>
        </view>
    </scroll-view>
</template>

<script setup name="Episode">
import { reactive, onMounted, watch } from "vue";

const props = defineProps({
    nums: {
        type: Number,
        default: 0,
    },
    datas:{
        type:Array,
        default:()=>[]
    },
    projectId:{
        type:[Number,String],
        required:true,
    }
});

const emits = defineEmits(["change",]);

const state = reactive({
    activeIndex: 0,
    list: []
})

watch(() => props.nums, (newVal, oldVal) => {
    const res = [];
    for (let i = 0; i < newVal; i++) {
        res.push({
            name: `第${i + 1}集`,
        })
    }
    state.list = res;
}, {
    immediate: true,
})

watch(() => props.datas, (newVal) => {
    const lastSelectedEpisodeInfo = uni.getStorageSync('lastSelectedEpisodeInfo');
    if(lastSelectedEpisodeInfo && lastSelectedEpisodeInfo.projectId==props.projectId && lastSelectedEpisodeInfo.episodeId){
        const _index = newVal.findIndex(item=>item.id==lastSelectedEpisodeInfo.episodeId)
        _index>-1 && (state.activeIndex=_index)
    }	
}, {
    immediate: true,
})

const handleClick = (index,itemID) => {
    state.activeIndex = index
    emits("change", {index:index,id:itemID});
    uni.setStorageSync('lastSelectedEpisodeInfo',{
        projectId:props.projectId,
        episodeId:itemID,
    })
}
</script>

<style scoped lang="scss">
.episode {
    width: 100%;
    min-height: 60px;
    white-space: nowrap;
    overflow: hidden;
    background: #fff;
    padding: 12px;
    box-sizing: border-box;

    .item {
        min-width: 80px;
        padding: 0 6px;
        box-sizing: border-box;
        height: 36px;
        color: #333;
        font-size: 14px;
        border-radius: 8px;
        background: #F3F3F3;
        font-weight: bold;
        text-align: center;
        line-height: 36px;
        cursor: pointer;
        margin-right: 12px;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        transition:
            background-color 0.3s ease-in-out,
            color 0.3s ease-in-out;

        &.active,
        &:hover {
            background-color: #F8BA38;
        }


        .imgTag {
            width: 16px;
            height: 16px;
        }

        .text {
            padding-left: 4px;
            font-size: 14px;
        }
    }
}
</style>
