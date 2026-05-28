<template>
	<view class="pageWrapper">
		<view ref="contentRef" class="mainSection">
			<!-- <view class="header">
				<scroll-view class="scrollBar" :scroll-x="true" :show-scroll-bar="true">
					<view :class="['item', { active: -2 == state.curTopType }]" @click="clickTopType(-2, 0)">全部</view>
					<view :class="['item', { active: -1 == state.curTopType }]" @click="clickTopType(-1, 0)">项目通用</view>
					<view :class="['item', { active: index == state.curTopType }]"
						v-for="(item, index) in state.curepisodesList" :key="index"
						@click="clickTopType(index, item.id)">{{ item.name }}</view>
				</scroll-view>
				<view class="acrionBtn">一键生成全部资产</view>
			</view> -->
			<view class="mainContent">
				<view class="aside">
					<view :class="['item', { active: item.id == state.curResType }]"
						v-for="(item, index) in state.resTypeList" :key="index" @click="onClickResItem(item.id)">{{
							item.treeName }}</view>
				</view>
				<view class="content">
					<view class="head">
						<view class="title">项目库</view>
						<view style="display: flex;">
							<view @click="openAssetExtraction" class="btn"
								style="margin-right: 20px;background-color: #F8BA38;color: #333;">
								<text class="text">资产提炼</text>
							</view>
							<!-- <view @click="enableDraggable" class="btn"
								style="margin-right: 20px;background-color: #409EFF;color: #fff;width: 100px;">
								<text style="padding-left: 4px;">{{state.enableDraggable ? '保存排序' : '开启排序'}}</text>
							</view> -->
							<view @click="OpenBatchCreateRes" class="btn"
								style="margin-right: 20px;background-color: #409EFF;color: #fff;">
								<image class="icon" src="/static/publicIcon_white.png" mode="widthFix"></image>
								<text style="padding-left: 4px;">导入资产清单</text>
							</view>
							<view class="btn" style="margin-right: 20px;" v-debounce.click="{handler:createImageMultiple,immediate:true,delay:500}">
								<text class="text">一键生成全部资产</text>
							</view>
							<view class="btn" @click="addResItem">
								<image class="icon" src="/static/publicIcon.png" mode="widthFix"></image>
								<text class="text">新建资产</text>
							</view>
						</view>
					</view>
					<view class="subTitle" style="padding: 12px 0;display: flex;align-items: center;">
						<text style="font-size: 20px;font-weight: bold;color: #333;">{{state.resTypeList.find(item =>
							item.id == state.curResType)?.treeName + '资产'}}</text>
						<text style="font-size: 16px;color: #666666;" v-show="state.curResList?.length > 0">*{{
							state.curResList?.length }}</text>
						<view v-if="state.curResType == 2" style="width: 140px;height: 40px;margin-left: 12px;cursor: pointer;display: flex;align-items: center;color: #fff;background-color: #409EFF;border-radius: 8px; justify-content: center;margin-right: 8px;" @click="handleDownloadRoles">
                            <image src="/static/tag_download.png" style="width: 20px;" mode="widthFix"></image>
                            <text>一键下载角色</text>
                        </view>
					</view>
					<scroll-view ref="scrollWrapperRef" class="cardWrapper" scroll-y :show-scroll-bar="true" :scroll-top="scrollTop" v-if="listData?.length > 0">
						<view :class="['card-item', { active: item.id == state.curResourceInfo.id }]"
							v-for="(item, index) in listData" :key="item.id"
							@click="() => { state.curResourceInfo = item; state.curResIndex = index }">
							<view class="thumbnail">
								<image v-if="item.url&&item._mediaType=='image'" :src="item.url" style="width: 100%; height: 100%"
									mode="aspectFit"></image>
								<image v-else-if="item.url&&item._mediaType=='video'" src="/static/video_icon_black.png" style="position: absolute;left:50%;top: 106px; transform: translate(-50%,-50%); width: 58px; height: 58px"
									mode="widthFix"></image>
								<image v-else-if="item.url&&item._mediaType=='audio'" src="/static/audio_black.png" style="position: absolute;left:50%;top: 106px; transform: translate(-50%,-50%); width: 58px; height: 58px"
									mode="widthFix"></image>
								<view v-else-if="!item.url && item.content" style="padding: 8px;">
									<view style="color: #333;font-size: 16px;font-weight: bold;">生图SP：<br>
										<text
											style="font-size: 14px;color:#999;display: -webkit-box;-webkit-line-clamp: 8; -webkit-box-orient: vertical;overflow: hidden;">{{
												item.content }}</text>
									</view>
								</view>
							</view>
							<view class="bottom">
								<view class="left">
									<view class="title" style="width: 182px;box-sizing: border-box; overflow: hidden;text-overflow: nowrap;white-space: nowrap;text-overflow: ellipsis;">{{ item.name }}</view>
									<view class="desc">配音 {{ item.voiceName }}</view>
								</view>
								<view class="avatar">
									<image :src="item.avatarUrl || '/static/timbre.png'"
										style="width: 100%; height: 100%" mode="widthFix"></image>
								</view>
							</view>
						</view>				
					</scroll-view>
				</view>
			</view>
		</view>
		<resourceDetail ref="resourceDetailRef" v-if="state.curResourceInfo.id"  :data="state.curResourceInfo"
			:typeMap="state.resTypeList" :createImageConfig="props.projectConfig.projectConfig.pictureConfig"
			:huafengSp="state.huafengSp"
			@updated="handleResourceItemUpdate"
			@deleted="() => { updateResourceList(state.curResType); state.curResourceInfo = {}; }" />
	</view>

	<createOReditorRes v-if="state.isOpenEditorRes" :newResConfig="state.newResConfig" :isNewRes="state.isNewRes"
		:typeMap="state.resTypeList" @close="closeEditorRes" @saveSucceed="saveEditorResSucceed"></createOReditorRes>

	<batchCreateRes v-if="state.isOpenBatchCreateRes" @close="closeBatchCreateRes" @saveSucceed="saveEditorResSucceed">
	</batchCreateRes>

	<AssetExtractionModal
		v-if="state.isOpenAssetExtraction"
		:project-config="props.projectConfig"
		@close="closeAssetExtraction"
		@imported="handleAssetExtractionImported"
	/>
	
	<view v-if="state.isShowAutoUploadPop" class="auto-upload-mark">
		<view class="auto-upload-panel" @click="()=> state.isShowAutoUploadPop = false">
			<view :class="['auto-upload-left', { 'full-width': !state.curResourceInfo.id }]">
				<view id="role-zone" :class="['zone', { 'zone--hover': state.autoUploadHover === 'role' }]"
					ref="roleZoneRef"
					@dragenter.prevent="handleZoneDragEnter('role',$event)"
					@dragover.prevent="handleZoneDragOver('role',$event)"
					@dragleave.prevent="handleZoneDragLeave('role',$event)">
					<view class="zone-title">新建上传角色</view>
				</view>
				<view id="scene-zone" :class="['zone', { 'zone--hover': state.autoUploadHover === 'scene' }]"
					ref="sceneZoneRef"
					@dragenter.prevent="handleZoneDragEnter('scene',$event)"
					@dragover.prevent="handleZoneDragOver('scene',$event)"
					@dragleave.prevent="handleZoneDragLeave('scene',$event)">
					<view class="zone-title">新建上传场景</view>
				</view>
				<view id="prop-zone" :class="['zone', { 'zone--hover': state.autoUploadHover === 'prop' }]"
					ref="propZoneRef"
					@dragenter.prevent="handleZoneDragEnter('prop',$event)"
					@dragover.prevent="handleZoneDragOver('prop',$event)"
					@dragleave.prevent="handleZoneDragLeave('prop',$event)">
					<view class="zone-title">新建上传道具</view>
				</view>
				<view id="camera-zone" :class="['zone', { 'zone--hover': state.autoUploadHover === 'camera' }]"
					ref="cameraZoneRef"
					@dragenter.prevent="handleZoneDragEnter('camera',$event)"
					@dragover.prevent="handleZoneDragOver('camera',$event)"
					@dragleave.prevent="handleZoneDragLeave('camera',$event)">
					<view class="zone-title">新建上传运镜</view>
				</view>
				<view id="audio-zone" :class="['zone', { 'zone--hover': state.autoUploadHover === 'audio' }]"
					ref="audioZoneRef"
					@dragenter.prevent="handleZoneDragEnter('audio',$event)"
					@dragover.prevent="handleZoneDragOver('audio',$event)"
					@dragleave.prevent="handleZoneDragLeave('audio',$event)">
					<view class="zone-title">新建上传音频</view>
				</view>
			</view>
			<view v-if="state.curResourceInfo.id" class="auto-upload-right">
				<view id="reference-zone" :class="['upload-placeholder zone', { 'zone--hover': state.autoUploadHover === 'reference'}]"
					ref="rightZoneRef"
					@dragenter.prevent="handleZoneDragEnter('reference',$event)"
					@dragover.prevent="handleZoneDragOver('reference',$event)"
					@dragleave.prevent="handleZoneDragLeave('reference',$event)">
					<view class="zone-title">上传参考</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script setup>
import { defineProps, defineEmits, reactive, onMounted, ref,onBeforeUnmount, onUnmounted ,nextTick, onActivated, onDeactivated, computed } from "vue";

const scrollTop = ref(0);
import { APIPath, deleteRequest, getRequest, postRequest, putRequest } from "@/common/APIRequest"
import { AddBatchResource, DeleteResource, GetResourceTypeList, GetResourceListByProject, EditorResource, GetResourceList } from "../common/ResourceMgr";
import createOReditorRes from "./createOReditorRes.vue";
import { GetProjectEpisodesList } from "../common/ProjectMgr";
import resourceDetail from "@/components/resourceDetail/resourceDetail.vue";
import batchCreateRes from "@/components/batchCreateRes.vue";
import AssetExtractionModal from "@/components/AssetExtractionModal.vue";
import { getImageSize, isNull, uploadFileToServer,checkMediaType,optimizedSortUtils,urlToFile,convertImageFormat,downloadFile } from "../common/Tool";
import * as XLSX from 'xlsx'
import { extractContentByCategory } from "../common/ContentByCategory";
import { BananaTextImage, Doubaoseedream5_0liteTextImage, KirinV3TextImage } from '@/common/AIAgentForServer';
import { cloneDeep } from "lodash";
import { AddNewResource } from "../common/ResourceMgr";
import { GetAIModelList } from "@/common/Common";
// UploadFile 不再在此文件中直接使用（使用 uploadFileToServer）

const excelData = ref([])
const fileContent = ref('');
let fileInput = null;
const props = defineProps({
	projectConfig: {
		type: Object,
		default: () => { },
	},
});
const emits = defineEmits(["close"]);

const contentRef = ref(null)
const resourceDetailRef = ref(null)
const scrollWrapperRef = ref(null)

// zone refs for drag-aware hover detection (H5 only)
const roleZoneRef = ref(null)
const sceneZoneRef = ref(null)
const propZoneRef = ref(null)
const rightZoneRef = ref(null)
const cameraZoneRef = ref(null)
const audioZoneRef = ref(null)
let _rafId = null

const state = reactive({
	curResourceInfo: {},
	// 调接口后会进行覆盖
	resTypeList: [
		{ treeName: "角色", id: 2, },
		{ treeName: "场景", id: 3, },
		{ treeName: "道具", id: 4, },
	],
	isOpenEditorRes: false,
	isNewRes: false,
	newResConfig: {
		id: 0,
		type: 1,
		title: "",
		imageUrl: "",
		detail: "",
		projectId: 0,
		episodesId: 0,
	},
	curResIndex: 0,
	curTopType: -2,
	curepisodesId: 0,
	curepisodesList: [],
	isOpenAssetExtraction: false,
	isShowAutoUploadPop:false,
	autoUploadHover: null,

	huafengSp:'', //画风SP最新值

	enableDraggable: false,
	originResListSort: [],

	agentList:[],
});

const listData = computed({
	get(){
		return state.curResList
	},
    set(val){ state.curResList = val }
})

function OpenBatchCreateRes() {
	// state.isOpenBatchCreateRes = true;
	importFile()
}
function getResTypeId(typeName) {
	switch (typeName) {
		case '角色':
			return 2
		case '道具':
			return 4
		case '场景':
			return 3
		default:
			return 2
	}
}
function importFile() {
	initFileInput()
	if (fileInput) {
		fileInput.value = ''
	}

	try {
		fileInput.focus();
		const event = new MouseEvent('click', {
			bubbles: true,
			cancelable: true,
			view: window
		});
		fileInput.dispatchEvent(event);
	} catch (error) {
		fileInput.click();
	}
}
const initFileInput = () => {
	const existingInput = document.getElementById('docxFileInput');
	if (existingInput) {
		fileInput = existingInput;
		// 移除旧的事件监听器，避免重复绑定
		fileInput.removeEventListener('change', handletxtFileUpload);
	} else {
		fileInput = document.createElement('input');
		fileInput.id = 'docxFileInput';
		fileInput.type = 'file';
		fileInput.accept = '.txt';
		fileInput.style.position = 'absolute';
		fileInput.style.top = '-9999px';
		fileInput.style.left = '-9999px';
		fileInput.style.opacity = '0';
		document.body.appendChild(fileInput);
	}
	// 绑定新的事件监听器
	fileInput.addEventListener('change', handletxtFileUpload);
};

const handletxtFileUpload = (e) => {
	const file = e.target.files[0];
	if (!file) return;
	if (file.type !== 'text/plain' && !file.name.endsWith('.txt')) {
		uni.showToast({
			title: '请选择txt格式的文件',
			icon: 'none'
		});
		e.target.value = '';
		return;
	}
	const reader = new FileReader();
	reader.onload = (event) => {
		// fileContent.value = event.target.result;
		const extractedData = extractContentByCategory(event.target.result)
		// console.log('提取到的数据:', extractedData);
		var resList = []
		for (let index = 0; index < extractedData.roles.length; index++) {
			const element = extractedData.roles[index];
			var item = {
				projectId: props.projectConfig.id,
				episodesId: 0,
				typeId: 2,
				name: element.name,
				content: `${element.style}\n${element.outputReq}\n${element.mainContent}`,
				voiceName: `${element.voicename}`,
				voiceDetail: `${element.voice}`,
				coreFeature: `${element.coreFeature}`,
			}
			resList.push(item)
		}
		for (let index = 0; index < extractedData.props.length; index++) {
			const element = extractedData.props[index];
			var item = {
				projectId: props.projectConfig.id,
				episodesId: 0,
				typeId: 4,
				name: element.name,
				content: `${element.style}\n${element.outputReq}\n${element.mainContent}`,
				voiceName: '',
				voiceDetail: '',
			}
			resList.push(item)
		}
		for (let index = 0; index < extractedData.scenes.length; index++) {
			const element = extractedData.scenes[index];
			var item = {
				projectId: props.projectConfig.id,
				episodesId: 0,
				typeId: 3,
				name: element.name,
				content: `${element.style}\n${element.outputReq}\n${element.mainContent}`,
				voiceName: '',
				voiceDetail: '',
			}
			resList.push(item)
		}
		state.rawItems = resList
		startBatchCreateRes()
		//   console.log('提取到的数据:', resList);
		e.target.value = ''
	};
	reader.onerror = (error) => {
		console.error('文件读取失败：', error);
		uni.showToast({
			title: '导入失败',
			icon: 'none'
		});
		e.target.value = '';
	};
	reader.readAsText(file, 'utf-8');
}

const handleFileChange = (e) => {
	const file = e.target.files[0];
	if (!file) return;
	if (!file.name.endsWith('.xlsx')) {
		uni.showToast({
			title: '请选择xlsx格式的文件',
			icon: 'none'
		});
		e.target.value = '';
		return;
	}
	const reader = new FileReader();
	reader.onload = (event) => {
		try {
			const workbook = XLSX.read(event.target.result, { type: 'array' })
			// 获取第一个工作表（默认读取第一个 sheet）
			const worksheet = workbook.Sheets[workbook.SheetNames[0]]
			// console.log('工作表内容：', worksheet)
			// 将工作表转换为二维数组（header: 1 表示第一行作为表头）
			const data = XLSX.utils.sheet_to_json(worksheet, { header: 1 })
			// 存储解析后的数据
			excelData.value = data
			//  console.log('工作表内容：', excelData.value)
			var col0text = ''
			var col1text = ''
			var col2text = ''
			var col3text = ''
			var col4text = ''
			var col5text = ''

			var tempResList = []
			var roleCount = 0
			var sceneCount = 0
			var propCount = 0
			var unknowCount = 0
			excelData.value.forEach((row, rowIndex) => {
				if (!isNull(row[1]) && !isNull(row[2])) {
					if (rowIndex == 0) {
						col0text = row[0] //index
						col1text = row[1] //类型
						col2text = row[2] //名称
						col3text = row[3] //生图sp
						col4text = row[4] //音色名字
						col5text = row[5] //音色描述
					}
					else {
						var typeName = `${row[1] ?? ''}`
						var item = {
							projectId: props.projectConfig.id,
							episodesId: 0,
							// index:`${row[0]}`,
							typeId: getResTypeId(typeName),
							name: `${row[2] ?? ''}`,
							content: `${row[3] ?? ''}`,
							// voice:`${row[4]??''}`,
							// voicedetail:`${row[5]??''}`,
						}
						if (row[1] == '角色') {
							roleCount++
						}
						else if (row[1] == '场景') {
							sceneCount++
						}
						else if (row[1] == '道具') {
							propCount++
						}
						else {
							unknowCount++
						}

						tempResList.push(item)
					}
				}
			})
			state.rawItems = tempResList
			//   console.log('资产清单',state.rawItems)
			startBatchCreateRes()
			e.target.value = ''
		} catch (error) {
			console.error('Excel 解析失败：', error)
			alert('Excel 文件解析失败，请检查文件是否损坏！')
		}
		finally {
		}
	};
	reader.onerror = (error) => {
		console.error('文件读取失败：', error);
		uni.showToast({
			title: '导入失败',
			icon: 'none'
		});
		e.target.value = '';
	};
	reader.readAsArrayBuffer(file)
}

function startBatchCreateRes() {
	if (state.rawItems.length == 0) {
		uni.showToast({
			title: '没有资产可以增加',
			icon: 'none'
		});
		return
	}

	AddBatchResource(state.rawItems, (res) => {
		uni.showToast({
			title: '资产增加成功',
			icon: 'none'
		});
		updateResourceList(state.curResType);
	})
}

function closeBatchCreateRes() {
	state.isOpenBatchCreateRes = false;
}

function openAssetExtraction() {
	state.isOpenAssetExtraction = true;
}

function closeAssetExtraction() {
	state.isOpenAssetExtraction = false;
}

function handleAssetExtractionImported() {
	state.isOpenAssetExtraction = false;
	updateResourceList(state.curResType);
}

onMounted(() => {
	GetAIModelList().then((data)=>{
		state.agentList=data
	})

	GetResourceTypeList(25, (resTypeList) => {
		state.resTypeList = resTypeList
		if (resTypeList.length > 0) {
			state.curResType = state.resTypeList[0].id;
			onClickResItem(state.curResType);
		}
	})

	GetResourceList(1, 1000, 9, (resList) => {
		const huafengSpid = props.projectConfig.projectConfig.pictureConfig.promptSpId;
		state.huafengSp = resList.find(item => item.id == huafengSpid)?.content;
	})

	// state.curResType = state.resTypeList[0].id;
	// onClickResItem(state.curResType);
	registerEvents()
});

onBeforeUnmount(()=>{
	removeEvents()
})

/* onActivated(() => {
	registerEvents()
}) */

onDeactivated(() => {
	removeEvents()
})

function clickTopType(type, id) {
	state.curTopType = type;
	state.curepisodesId = id;
	updateResourceList(state.curResType);
}

function saveEditorResSucceed() {
	updateResourceList(state.curResType);
	state.isOpenEditorRes = false;
}
function closeEditorRes() {
	state.isOpenEditorRes = false;
}
function addResItem() {
	state.isOpenEditorRes = true;
	state.isNewRes = true;
	state.newResConfig = {
		id: 0,
		type: state.curResType,
		title: "",
		imageUrl: "",
		detail: "",
		projectId: props.projectConfig.id,
		episodesId: state.curepisodesId,
	};
}
function editorRes(item, index) {
	state.isOpenEditorRes = true;
	state.isNewRes = false;
	state.newResConfig = {
		id: item.id,
		type: item.typeId,
		title: item.name,
		imageUrl: item.url,
		detail: item.content,
		projectId: item.projectId,
		episodesId: item.episodesId,
	};
	state.curResIndex = index;
}
function deleteRes(id) {
	uni.showModal({
		title: "确认删除",
		content: "确定删除该资源吗？",
		success: (res) => {
			if (res.confirm) {
				DeleteResource([id], (res) => {
					updateResourceList(state.curResType);
				});
			}
		},
	});
}
function onClickResItem(type) {
	state.curResType = type;
	updateResourceList(type);
}
function updateResourceList(type,callback) {
	state.curResList = [];
	const params = {
		pageNum: 1,
		pageSize: 3000,
		typeId: type,
		projectId: props.projectConfig.id,
	}
	let requestUrl = APIPath.resourceList + '?';
	Object.keys(params).forEach(key => requestUrl += `&${key}=${params[key]}`)
	getRequest(requestUrl, (data) => {
		if (data.code == 200) {
			const sorted = optimizedSortUtils.batchSort(data.rows,'name')
			state.curResList = sorted.map(item=>({
				...item,
				_mediaType: checkMediaType(item.url)
			}));
		}
		else {
			console.error(data.msg)
		}
		if(callback)callback()
	}, (error) => {
		console.error(error)
		if(callback)callback()
	})
}

function createImageMultiple() {

	const curModelId = props.projectConfig.projectConfig.pictureConfig.defaultModel;
	let rawRatio = props.projectConfig.projectConfig.pictureConfig.defaultFrame || '16:9',
		rawResolution = props.projectConfig.projectConfig.pictureConfig.defaultResolution || '1k',
		rawCount = 1;

	let configs = [];
	let emptyContentExist = false;
	let historyImgExist = false;

	const toastSuccess = () => {
		uni.showToast({
			title: '批量生图执行成功，请耐心等候！',
			icon: 'none'
		})
	}

	const toastFail = () => {
		uni.showToast({
			title: '执行失败' + error,
			icon: 'none'
		})
	}

	const fn = (reqData) => {
		let listeningTargetIndex;
		// 如果资源详情是打开状态，增加监听任务id
		if(resourceDetailRef.value?.addListeningTaskId){
			const index = reqData.findIndex(i=>i.itemId == state.curResourceInfo.id);
			index!==-1 && (listeningTargetIndex=index)
		}

		const addListeningTaskId = (taskList) => {
			listeningTargetIndex!==-1 && resourceDetailRef.value.addListeningTaskId(taskList[listeningTargetIndex])
		}

		const modelInterface = state.agentList.find(i => i.id == curModelId)?.modelInterface;
		switch (modelInterface) {
			case 'Doubaoseedream5_0liteTextImage': 
				Doubaoseedream5_0liteTextImage(reqData, (data) => {
					addListeningTaskId(data.taskList)					
					toastSuccess()
				}, (error) => {
					toastFail()
				})
				break;
			case 'BananaTextImage': 
				BananaTextImage(reqData, (data) => {
					addListeningTaskId(data.taskList)
					toastSuccess()
				}, (error) => {
					toastFail()
				})
				break;
			case 'KirinV3TextImage': //KirinV3Omni
				KirinV3TextImage(reqData, (data) => {
					addListeningTaskId(data.taskList)					
					toastSuccess()
				}, (error) => {
					toastFail()
				})
				break;
		}
	}

	if (!curModelId) {
		uni.showToast({
			title: '请在项目设置中选择默认生图模型',
			icon: 'none'
		})
		return
	}

	GetResourceListByProject({ projectId: props.projectConfig.id }, (resList) => {
		if (resList.length == 0) {
			uni.showToast({
				title: '当前项目下没有任何资源',
				icon: 'none'
			})
			return
		}
		var styleSP= state.huafengS || props.projectConfig.projectConfig.pictureConfig.promptSp;
		if(!isNull(styleSP)){
			styleSP="\n风格："+styleSP
		}
		for (const resItem of resList) {
			const _isEmpty = isNull(resItem.content?.trim());
			const _isHistoryImgExist = resItem.historyUrl.filter(i=>i.status==5).length>=1;
			_isEmpty && (emptyContentExist = true);
			_isHistoryImgExist && (historyImgExist = true);

			if (_isEmpty || _isHistoryImgExist) {
				continue;
			}

			configs.push({
				modelId: curModelId,
				prompt: resItem.content + styleSP,
				ratio: rawRatio,
				resolution: rawResolution,
				watermark: false,
				name: resItem.name,
				typeId: resItem.typeId,
				num: rawCount,
				itemId: resItem.id,
			})

		}
		// console.log('待批量生图的资源配置', configs)

		if (configs.length == 0) {
			let title = '没有可执行的生图资源';
			historyImgExist && (title = '已跳过已生图的资源，' + title)
			uni.showToast({
				title: title,
				icon: 'none',
				duration: 3000
			})
			return
		}

		if (emptyContentExist) {
			uni.showModal({
				title: "提示",
				content: "存在空的生图SP，确认跳过空的并继续",
				confirmText: "确定",
				success: (res) => {
					if (res.confirm) {
						fn(configs)
					}
				}
			})
		}
		else {
			fn(configs)
		}
	})


}

function handleResourceItemUpdate(data){
	// 如果有传值，单个进行更新
	if(data && data.id){
		const _clone = cloneDeep(data)
		for(let resItem of state.curResList){
			if(resItem.id==data.id){
				for(let prop in resItem){
					resItem[prop] = _clone[prop]
				}
				resItem._mediaType = checkMediaType(resItem.url)
				break;
			}
		}
	}else{
    	updateResourceList(state.curResType);
	}
}

function updateAutoUploadHoverByPoint(x, y) {
	if (_rafId) cancelAnimationFrame(_rafId)
	_rafId = requestAnimationFrame(() => {
		_rafId = null
		try {
			const zones = [
				{ name: 'role', el: roleZoneRef.value },
				{ name: 'scene', el: sceneZoneRef.value },
				{ name: 'prop', el: propZoneRef.value },
				{ name: 'camera', el: cameraZoneRef.value },
				{ name: 'audio', el: audioZoneRef.value },
				{ name: 'reference', el: rightZoneRef.value },
			]
			let hit = null
			for (const z of zones) {
						let el = z.el
						// uni-app H5 may return a component-like wrapper instead of raw DOM node;
						// try fallback to document.getElementById
						if (!el || !el.getBoundingClientRect) {
							const dom = document.getElementById(`${z.name}-zone`)
							if (dom && dom.getBoundingClientRect) {
								el = dom
								// console.log('DEBUG fallback to DOM for', z.name, dom)
							}
						}
						if (!el || !el.getBoundingClientRect) continue
						const r = el.getBoundingClientRect()
				if (x >= r.left && x <= r.right && y >= r.top && y <= r.bottom) {
					hit = z.name
					break
				}
			}
			if (state.autoUploadHover !== hit) {
				state.autoUploadHover = hit
			}
		} catch (err) {
			// ignore — getBoundingClientRect may not exist on non-H5 runtimes
		}
	})
}

function handleZoneDragEnter(area, e) {
	e.preventDefault()
	updateAutoUploadHoverByPoint(e.clientX, e.clientY)
}

function handleZoneDragOver(area, e) {
	e.preventDefault()
	updateAutoUploadHoverByPoint(e.clientX, e.clientY)
}

function handleZoneDragLeave(area, e) {
	e.preventDefault()
	state.autoUploadHover = null
}

function registerEvents(){
	setTimeout(()=>{
		if (typeof window === 'undefined') return
			const contentEl = document.querySelector('.mainContent')	
			// 移除所有可能存在的旧事件监听器
			window.removeEventListener('dragenter', handleWindowDragEnter)
			window.removeEventListener('dragover', handleWindowDragOver)
			window.removeEventListener('drop', handleWindowDrop)
			window.addEventListener('dragenter', handleWindowDragEnter)
			window.addEventListener('dragover', handleWindowDragOver)
			window.addEventListener('drop', handleWindowDrop)		
	},1000)
} 

function removeEvents(){
	if (typeof window === 'undefined') return
	const contentEl = document.querySelector('.mainContent')	
	// 移除document上的事件监听器
	// 同时也移除可能的内容元素上的监听器（向后兼容）
	window.removeEventListener('dragenter', handleWindowDragEnter)
	window.removeEventListener('dragover', handleWindowDragOver)
	window.removeEventListener('drop', handleWindowDrop)
}

function handleWindowDragEnter(e){
	// 允许拖拽
	if(!state.isShowAutoUploadPop){
		state.isShowAutoUploadPop = true
	}
}

function handleWindowDragOver(e){
	// 允许拖拽并在弹窗显示时更新 hover 区域（基于坐标）
	e.preventDefault()
	if(!state.isShowAutoUploadPop){
		state.isShowAutoUploadPop = true
	}
	if(state.isShowAutoUploadPop){
		updateAutoUploadHoverByPoint(e.clientX, e.clientY)
	}
}

function handleWindowDrop(e){
	// 阻止默认行为
	e.preventDefault()
	// console.log("handleWindowDrag:",e)
	state.isShowAutoUploadPop = false
	if(e.dataTransfer?.files.length<=0)return
	const files = e.dataTransfer.files
	// console.log("files:",files)
	const autoUploadHover = state.autoUploadHover
	// console.log("autoUploadHover:",autoUploadHover)
	if(!isNull(autoUploadHover)){

		let validFiles = files;

		// 过滤出图片文件
		if(autoUploadHover=='reference'){
			validFiles = Array.from(validFiles).filter(file => file.type?.startsWith('image/'))
			if(validFiles.length === 0){
				uni.showToast({
					title:'拖拽文件格式不是图片格式',
					mask:false,
					icon:'none'
				})
				return
			}
		}
			
		// 显示上传开始提示
		uni.showToast({
			title: `开始上传 ${validFiles.length} 个文件`,
			icon: 'none'
		})
		
		// 处理文件上传队列
		handleFileUploadQueue(validFiles, autoUploadHover)
	}
}

// 处理文件上传队列
async function handleFileUploadQueue(files, autoUploadHover) {
	try {
		// 顺序执行上传
		for (const file of files) {
			await uploadFile(file, autoUploadHover)
		}
		
		// 上传完成提示
		uni.showToast({
			title: `成功上传 ${files.length} 个文件`,
			icon: 'success'
		})
	} catch (error) {
		// 上传失败提示
		uni.showToast({
			title: '上传失败，请重试',
			icon: 'none'
		})
		console.error('上传失败:', error)
	}
}

// 上传单个文件
function uploadFile(file, autoUploadHover) {
	return new Promise((resolve, reject) => {
		if(['role','scene','prop','camera','audio'].includes(autoUploadHover)){
			var targetType = -1
			switch(autoUploadHover){
				case 'role':
					targetType = state.resTypeList.find(p=>p.treeName.includes("角色"))?.id || -1
					break
				case 'scene':
					targetType = state.resTypeList.find(p=>p.treeName.includes("场景"))?.id || -1
					break
				case 'prop':
					targetType = state.resTypeList.find(p=>p.treeName.includes("道具"))?.id || -1	
					break
				case 'camera':
					targetType = state.resTypeList.find(p=>p.treeName.includes("运镜"))?.id || -1	
					break
				case 'audio':
					targetType = state.resTypeList.find(p=>p.treeName.includes("音频"))?.id || -1	
					break
			}
			var typeIdList = state.resTypeList.map(p=>p.id)
			if(typeIdList.includes(targetType)){
				onClickResItem(targetType)
				/* state.isNewRes = true */
				// var imgUrl1 = URL.createObjectURL(file)
				if(!isNull(file)){
					uploadFileToServer(file).then(newUrl=>{
					  // newUrl 与原来 UploadFile 返回的格式一致
					  // console.log("newUrl:"+newUrl)
					  const nameWithoutExt = (file.name || '').replace(/\.[^/.]+$/, '')
					  var newConfig = {
					    typeId: targetType,
					    name: nameWithoutExt,
					    url: newUrl,
					    content: '',
					    projectId: props.projectConfig.id,
					    episodesId: state.curepisodesId,
					    status: 1
					  }
					  AddNewResource(newConfig,(resData)=>{
							updateResourceList(state.curResType,()=>{
								nextTick(() => {
									scrollTop.value = 999999;
									nextTick(()=>{
										scrollTop.value = scrollTop.value + 1
									})
								})
							})
							resolve()
						}, error => {
							reject(error)
						})
					}).catch(err=>{
					  reject(err)
					})
				}else{
					reject(new Error('无法创建文件URL'))
				}
			}else{
				reject(new Error('无效的目标类型'))
			}
		}else if(autoUploadHover == 'reference'){
			if(!state.curResourceInfo.id) return reject(new Error('没有选中的资产'));

			// 使用统一的 uploadFileToServer，确保失败会走 reject
			uploadFileToServer(file).then(newUrl => {
				var _uploadFile = {
					id: new Date().getTime() + (Math.random() * 10000).toString().slice(-5),
					url: newUrl,
					name: file.name || ''
				};

				var newResInfo = resourceDetailRef?.value.getCurrentData() || {...state.curResourceInfo } || {};
				if (!newResInfo.expand) newResInfo.expand = {};
				if (!Array.isArray(newResInfo.expand.imgUrls)) newResInfo.expand.imgUrls = [];
				newResInfo.expand.imgUrls.push(_uploadFile);

				var params = { ...newResInfo, status: 1 };
				// console.log("params:", params);
				EditorResource(params, async resData => {
					var id = state.curResourceInfo.id;
					// state.curResourceInfo.id = 0;
					// await nextTick();
					// state.curResourceInfo.id = id;
					handleResourceItemUpdate(params);
					resolve();
				}, error => {
					reject(error);
				});
			}).catch(err => {
				reject(err);
			});
		}else{
			reject(new Error('无效的上传区域'))
		}
	})
}

async function handleDownloadRoles(){
	console.log(state.curResList)
	const targets = state.curResList.filter(i=>i.url)
	const isTips = targets.length<state.curResList.length;

	const fn = async()=>{
		uni.showLoading()
		for(const i of targets){		
			let img = i.url;
			let name = i.name;
			if(process.env.NODE_ENV == 'development'){
				img = img.replace('https://aires.jigentoys.net','/api-video')
			}
			const file = await urlToFile(img, name);
			const convertedBlob = await convertImageFormat(file, 'image/jpeg');
			downloadFile(convertedBlob, `${name}.jpg`);
		}
		uni.hideLoading()
	}

	if(isTips){
		uni.showModal({
			title: '提示',
			content: '检测到包含未生图项，是否过滤掉并继续？',
			showCancel: true,
			success: (res) => {
				if (res.confirm) {
					fn()
				}
			}
		})
	}else{
		fn()
	}
}

function enableDraggable(){
	if(state.enableDraggabl==false){
		state.originResListSort = state.curResList.map(p=>p.id)
	}else{

	}
	state.enableDraggable = !state.enableDraggable
}
</script>

<style scoped lang="scss">
.sp-input {
	overflow: hidden;
	background: #ffffff;
	padding-left: 16rpx;
	border: 6rpx solid #8240fa;
	margin-top: 16rpx;
}

.sp-item {
	display: inline-block;
	margin-left: 24rpx;
}

.pageWrapper {
	display: flex;
	flex: 1;
	min-height: 0;

	.mainSection {
		flex: 1;
		display: flex;
	}
}

.header {
	width: 100%;
	padding: 12px;
	display: flex;
	box-sizing: border-box;

	.scrollBar {
		width: 0;
		flex: 1;
		max-height: 60px;
		white-space: nowrap;
		overflow: hidden;

		.item {
			height: 36px;
			width: 64px;
			color: #333;
			font-size: 14px;
			border-radius: 8px;
			background: #f3f3f3;
			font-weight: bold;
			text-align: center;
			line-height: 36px;
			cursor: pointer;
			margin-left: 12px;
			display: inline-block;
			transition:
				background-color 0.3s ease-in-out,
				color 0.3s ease-in-out;

			&.active,
			&:hover {
				background-color: #409eff;
				color: #fff;
			}
		}
	}
}

.mainContent {
	padding: 16px 24px 16px 24px;
	background: #f3f3f3;
	flex: 1;
	display: flex;

	.aside {
		padding: 8px;
		width: 116px;
		border-radius: 12px;
		background: #fff;

		.item {
			width: 100px;
			height: 40px;
			line-height: 40px;
			border-radius: 8px;
			margin-top: 16px;
			transition:
				background-color 0.3s ease-in-out,
				color 0.3s ease-in-out;
			text-align: center;

			&.active,
			&:hover {
				background-color: #409eff;
				color: #fff;
			}
		}
	}

	.content {
		margin-left: 16px;
		flex: 1;
		display: flex;
		flex-direction: column;

		.head {
			display: flex;
			justify-content: space-between;
			align-items: center;
			margin-bottom: 12px;

			.title {
				font-size: 24px;
				color: #333;
				font-weight: bold;
			}

			.btn {
				display: flex;
				align-items: center;
				justify-content: center;
				width: 140px;
				height: 36px;
				line-height: 36px;
				background: #f8ba38;
				color: #333;
				font-size: 14px;
				border-radius: 8px;
				font-weight: bold;
				text-align: center;
				cursor: pointer;

				.icon {
					width: 13px;
					height: 13px;
				}

				.text {
					padding-left: 4px;
				}
			}
		}

		.cardWrapper {
			flex: 1;
			min-height: 0;
		}

		.card-item {
			display: inline-block;
			vertical-align: top;
			background-color: #fff;
			border-radius: 12px;
			margin-right: 12px;
			margin-bottom: 12px;
			padding: 6px;
			box-shadow: 0px 1px 2px 0px rgba(0, 0, 0, 0.1);
			position: relative;
			box-sizing: border-box;
			// cursor: move;

			&.active {
				background-color: #FFE3AF;
			}

			&.active::before {
				content: "";
				position: absolute;
				top: 0;
				left: 0;
				width: 100%;
				height: 100%;
				border: 3px solid #FCC34A;
				border-radius: 12px;
				box-sizing: border-box;
			}

			.thumbnail {
				width: 212px;
				height: 212px;
				border-radius: 8px;
				overflow: hidden;
				background-color: #F7F7F7;
			}

			.bottom {
				display: flex;
				justify-content: space-between;
			}

			.left {
				padding-left: 8px;

				.title {
					margin-top: 8px;
					font-size: 16px;
					font-weight: bold;
				}

				.desc {
					margin-top: 6px;
					font-size: 12px;
					color: #666666;
				}
			}

			.avatar {
				align-self: flex-end;
				width: 20px;
				height: 20px;
			}
		}
	}
}

.aside {
	width: 120px;
	height: 100%;
	background-color: #f3f3f3;
	font-size: 14px;
	font-weight: bold;
	text-align: center;
	line-height: 48px;
	cursor: pointer;
}

.acrionBtn {
	margin-left: 10px;
	width: 140px;
	height: 36px;
	line-height: 36px;
	background: #f8ba38;
	color: #333;
	font-size: 14px;
	border-radius: 8px;
	font-weight: bold;
	text-align: center;
	cursor: pointer;
}

/* 自动上传弹窗样式 */
.auto-upload-mark {
	position: fixed;
	left: 0;
	top: 0;
	width: 100%;
	height: 100%;
	background: rgba(0,0,0,0.5);
	z-index: 9999;
	display: flex;
	align-items: stretch;
	justify-content: center;
	opacity: 0;
	animation: fadeIn 0.3s ease-out forwards;
}

@keyframes fadeIn {
	from {
		opacity: 0;
	}
	to {
		opacity: 1;
	}
}
.auto-upload-panel {
	flex: 1 1 100%;
	display: flex;
	height: 100%;
	box-sizing: border-box;
	padding: 40px;
	animation: slideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
	transform: translateY(20px);
	opacity: 0;
}

@keyframes slideUp {
	from {
		transform: translateY(20px);
		opacity: 0;
	}
	to {
		transform: translateY(0);
		opacity: 1;
	}
}
.auto-upload-left {
	width: 60%;
	display: flex;
	flex-direction: column;
	gap: 20px;
	box-sizing: border-box;
	padding-right: 20px;
}
.auto-upload-left.full-width {
	width: 100%;
	padding-right: 0;
}
.auto-upload-right {
	width: 40%;
	padding-left: 20px;
	box-sizing: border-box;
	display: flex;
	align-items: flex-start;
	justify-content: center;
}
.zone {
	background: #fff;
	border-radius: 12px;
	flex: 1;
	display: flex;
	align-items: center;
	justify-content: center;
	position: relative;
	transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
	cursor: pointer;
	border: 2px dashed transparent;
}
.zone-title {
	font-size: 20px;
	color: #333;
	font-weight: 700;
	transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
	position: relative;
}
.zone--hover {
	border-color: #FF4D4F;
	background-color: #FFF5F5;
	transform: translateY(-2px);
}
.zone--hover .zone-title {
	color: #FF4D4F;
}
.upload-placeholder {
	background: #fff;
	border-radius: 12px;
	width: 100%;
	height: 100%;
	display: flex;
	align-items: center;
	justify-content: center;
	font-size: 18px;
	font-weight: 700;
	color: #333;
	border: 2px dashed transparent;
	transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
	cursor: pointer;
}
.upload-placeholder.zone--hover {
	border-color: #FF4D4F;
	background-color: #FFF5F5;
	transform: translateY(-2px);
	color: #FF4D4F;
}
</style>
