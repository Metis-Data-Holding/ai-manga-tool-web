<template>
    <view v-if="show">
        <view class="popup-computeing-power" style="display: flex;flex-direction: column;">
            <view class="icon-close-popup" @click="emit('onClose')" style="top: 24px;right: 24px;"></view>
            <view class="headTitle">项目算力详情</view>
            <view style="display: flex;align-items: center;margin-top: 10px;">
                <view class="tabs">
                    <view :class="['item', { 'active': index == state.curTabsIndex }]"
                        v-for="(value, index) in state.tabs" :key="index" @click="handleTabChange(index)">{{
                            value.name }}</view>
                </view>
                <view style="width: 480px;">
                    <uni-search-bar placeholder="请输入项目名称" bgColor="#F3F3F3"
                        @confirm="(e) => { state.localSearchWord = e.value; getProjectStatistics() }"
                        @clear="()=>{state.localSearchWord = ''; getProjectStatistics()}" cancelButton="none" />
                </view>
            </view>
            <view style="width: 100%;flex: 1;min-height: 0;">             
                <vxe-grid v-bind="gridOptionsList" height="100%">
                    <template #action="{ row }">
                        <view style="display: flex;width: 100%;">
                            <button @click="getDetail(row)" style="width: 100px;font-size: 16px;">查看详情</button>
                        </view>
                    </template>
                </vxe-grid>
            </view>
        </view>
        <view class="mask"></view>
        <template v-if="state.showDetail">
            <view class="popup-computeing-power" style="z-index: 103;display: flex;flex-direction: column;">
                <view class="headTitle" style="padding: 16px 0;">{{ state.detailTitle }}</view>
                <view class="icon-close-popup" @click="state.showDetail = false" style="top: 24px;right: 24px;"></view>
                <view style="width: 100%;flex: 1;min-height: 0;">
                    <vxe-grid v-bind="gridOptionsDetail" height="100%"></vxe-grid>
                </view>
            </view>
            <view class="mask" style="z-index: 101;"></view>
        </template>
    </view>
</template>

<script setup name="PopupComputingPower">
import { reactive, onMounted, watch } from 'vue'
import { APIPath, getRequest } from '@/common/APIRequest'
const emit = defineEmits(['onClose'])
const props = defineProps({
    show: {
        type: Boolean,
        required: true,
        default: false,
    }
})

watch(() => props.show, (newVal) => {
    if (newVal) {
        handleTabChange(1)
    }
})

const state = reactive({
    tabs: [
        { name: "今日消耗", },
        { name: "总消耗", },
    ],
    curTabsIndex: 0,
    showDetail: false,
    detailTitle: '',

    totalSum_list: '',
    totalSum_Detail: '',

    localSearchWord: '',
})

const handleTabChange = (index) => {
    state.curTabsIndex = index;
    getProjectStatistics();
}


const sum_list = reactive({ projectName: '总消耗合计', projectManager: '', totalPoint_formated: '', })
const gridOptionsList = reactive({
    border: true,
    showFooter: true,
    align: null,
    columnConfig: {
        resizable: true
    },
    headerCellStyle: {
        background: '#FFEECE',
    },
    columns: [
        { type: 'checkbox', title: '', width: 60 },
        { field: 'projectName', title: '项目名称',},
        { field: 'projectManager', title: '负责人',},
        {
            field: 'totalPoint_formated', title: '总消耗', fixed: 'right',
            cellStyle: () => {
                return {
                    backgroundColor: '#FFEECE',
                }
            }
        },
        { title: '操作', fixed: 'right', slots: { default: 'action' },width: 150 }
    ],
    data: [],
    footerData: [
        sum_list
    ]
})

const sum_Detail = reactive({ projectName: '总消耗合计', modelName: '', totalPoint_formated: '', })
const gridOptionsDetail = reactive({
    border: true,
    showFooter: true,
    align: null,
    columnConfig: {
        resizable: true
    },
    headerCellStyle: {
        background: '#FFEECE',
    },
    columns: [
        { type: 'checkbox', title: '', width: 60 },
        { field: 'projectName', title: '项目名称' },
        { field: 'modelName', title: '模型名称' },
        {
            field: 'totalPoint_formated', title: '总消耗', fixed: 'right',
            cellStyle: () => {
                return {
                    backgroundColor: '#FFEECE',
                }
            }
        },
    ],
    data: [],
    footerData: [
        sum_Detail
    ]
})

const getProjectStatistics = () => {
    let url = APIPath.projectStatistics;
    if (state.curTabsIndex == 0) {
        const date = new Date();
        const year = date.getFullYear();
        const month = date.getMonth() + 1;
        const day = date.getDate();
        const dateStr = `${year}-${month < 10 ? '0' + month : month}-${day < 10 ? '0' + day : day}`;
        url += `?dateStr=${dateStr}`;
    }
    getRequest(url, (res) => {
        if (res.code == 200) {
            let data = res.data;
            if (state.localSearchWord) {
                data = data.filter(item => item.projectName.includes(state.localSearchWord))
            }        
            let count = 0;
            data.forEach(item => {
                count += Number(item.totalPoint)
                item.totalPoint_formated = item.totalPoint.toLocaleString(undefined, {
                    minimumFractionDigits: 0
                })
            })
            gridOptionsList.data = data || [];
            sum_list.totalPoint_formated = count.toLocaleString(undefined, {
                minimumFractionDigits: 0
            })
        }
    })
}

const getDetail = (rowData) => {
    uni.showLoading()
    state.detailTitle = rowData.projectName
    let url = `${APIPath.projectModelStatistics}?projectId=${rowData.projectId}`
    if (state.curTabsIndex == 0) {
        const date = new Date();
        const year = date.getFullYear();
        const month = date.getMonth() + 1;
        const day = date.getDate();
        const dateStr = `${year}-${month < 10 ? '0' + month : month}-${day < 10 ? '0' + day : day}`;
        url += `&dateStr=${dateStr}`;
    }

    getRequest(url, (res) => {
        uni.hideLoading()
        if (res.code == 200) {
            state.showDetail = true;
            let count = 0;
            res.data.forEach(item => {
                count += Number(item.totalPoint)
                item.totalPoint_formated = item.totalPoint.toLocaleString(undefined, {
                    minimumFractionDigits: 0
                })
            })
            
            gridOptionsDetail.data = res.data || [];
            sum_Detail.totalPoint_formated = count.toLocaleString(undefined, {
                minimumFractionDigits: 0
            })
        }
    }, () => {
        uni.hideLoading()
    })
}

</script>
<style>
.cell-light {
    background-color: #FFEECE !important;
}

</style>
<style scoped lang="scss">
::v-deep .vxe-footer--row {
    background-color: #FFEECE !important;
    /* 绿色背景 */
}

.mask {
    position: fixed;
    z-index: 98;
    background: rgba(0, 0, 0, .6);
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
}

.popup-computeing-power {
    border-width: 0px;
    position: fixed;
    z-index: 99;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    width: 90VW;
    height: 90vh;
    background-color: #FFF;
    border-radius: 15px;
    padding: 24px;
    box-sizing: border-box;

    .headTitle {
        font-size: 32px;
        font-weight: 500;
        line-height: 100%;
        color: #FFA701;
        text-align: left;
    }
}

.tabs {
    .item {
        cursor: pointer;
        display: inline-block;
        width: 144px;
        height: 36px;
        line-height: 36px;
        text-align: center;
        background-color: #e7e7e7;
        color: #666666;
        font-weight: bold;
        position: relative;
        font-size: 16px;
        transition: background-color 0.3s ease-in-out;

        &:first-child {
            border-radius: 8px 0 0 8px;
        }

        &:last-child {
            border-radius: 0 8px 8px 0;
        }

        &.active {
            background-color: #f8ba38;
            color: #333333;
        }
    }
}
</style>
