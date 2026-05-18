<template>
	<view style="display: flex;flex-direction: column;width: 100%;height: 100%;overflow: hidden;">
		<view
			style="display: flex;flex-direction: row; justify-self: flex-start;align-items: center; width: 100%;margin-left: 16rpx;padding: 16rpx 0;flex-shrink: 0;">
			<button style="margin: 0;margin-left: 16rpx;" @click="readNovel(2)">添加分集剧本</button>
			<button style="margin: 0;margin-left: 16rpx;" @click="selectAllji(true)">一键全选</button>
			<button style="margin: 0;margin-left: 16rpx;" @click="selectAllji(false)">取消全选</button>
			<button style="margin: 0;margin-left: 16rpx;" @click="deleteSelect()">删除选择</button>
			<button style="margin: 0;margin-left: 16rpx;" @click="allCreateCameraSub()">一键生成分镜</button>
			<button style="margin: 0;margin-left: 16rpx;" @click="openGlobalDefaultFenjingSP()">全局默认分镜SP</button>
			<!-- <button style="margin: 0;margin-left: 16rpx;" @click="handleSaveAllEpisodes()">一键保存剧本</button> -->
		</view>

		<scroll-view style="background-color: #ddd;width: 100%;flex: 1;height: 0;padding:16rpx 0px ;" :scroll-y="true"
			:scroll-top="scrollTop.value" @scrolltolower="handleScrollToLower" @scroll="handleScrolll">
			<view style="display: flex;flex-direction: column;width: 100%;">
				<block v-for="(item, index) in state.fenjiList" :key="index">
					<view style="flex-direction: row; display: flex;  margin-right: 16rpx;margin-top: 16rpx; width: 100%;
								align-items: center;justify-content: flex-start;position: relative;background:#C0C0C0;">
						<view class="flex-c-c-column">
							<view class="flex-c-c" style="align-self: flex-start;margin-left: 12rpx;">
								<image @click="selectJiResult(index)"
									style="width: 60rpx; height: 60rpx; margin-right: 8rpx; "
									:src="item.isSelect ? '/static/adsel_icon2.png' : '/static/nor_iconb.png'">
								</image>
								<text
									style="color: #333333;font-size: 48rpx;margin-left: 10rpx;">{{item.collectId}}_{{item.fieldId}}</text>
							</view>

							<view class="flex-c-c" style="margin: 16rpx;">
								<button @click="handleForwardAddOneEpisode(index)" style="margin-right: 32rpx;">向前
									加1集</button>
								<button @click="handleForwardAddOneScene(index)">向前 加1场次</button>
							</view>

							<view class="flex-c-c" style="margin: 16rpx;">
								<button @click="handleBackwardAddOneEpisode(index)" style="margin-right: 32rpx;">向后
									加1集</button>
								<button @click="handleBackwardAddOneScene(index)">向后 加1场次</button>
							</view>

							<view class="flex-c-c" style="margin: 16rpx;align-self: flex-start;">
								<button @click="handleMoveup(index)"
									style="margin-right: 32rpx;padding: 0px 64rpx;">上移</button>
								<button @click="handleMovedown(index)" style="padding: 0px 64rpx;">下移</button>
							</view>
							<view class="flex-c-c" style="margin: 16rpx;align-self: flex-start;">
								<button @click="handleSimpleCreatesubCam(index)"
									style="margin-right: 32rpx;">生成分镜</button>
								<button @click="openfenjingSP(index)">生成分镜SP</button>
							</view>
							<view class="flex-c-c" style="margin: 16rpx;align-self: flex-start;">
								<button @click="handleSaveCurEpisodes(item)" style="margin-right: 32rpx;">保存剧本</button>
								<button @click="openfullScreen(index)">全屏编辑</button>
							</view>
							<CustomLoading v-model:visible="item.loadingVisible" title="分镜生成中..." style="width: 90%;"
								circle-color="#ff6600" text-color="#666666" circle-size="50" />
						</view>

						<textarea :maxlength="-1" @input="fenjiInput" @focus="setFenjiIndex(index)"
							style="height: 600rpx;flex: 1; min-width: 0; overflow: hidden;border: 4rpx solid #999999;padding: 16rpx;margin-right: 32rpx;box-sizing: border-box;"
							:value="item.content/* item.detail */" placeholder="分集具体内容 文本"></textarea>

					</view>
				</block>
			</view>
		</scroll-view>
	</view>

	<view v-if="state.openfunllScreen" class="mark" style="justify-content:center;z-index: 11;">
		<view
			style="width: 90%;height: 90%;background: #ffffff;display: flex;flex-direction: column;justify-content: flex-start;align-items: center;padding: 24rpx;">
			<textarea :maxlength="-1" @input="fenjifullscreenInput" class="sp-input" style="width: 100%;height: 100%;"
				:value="state.curfenjiDetail" placeholder="请选择或者编辑"></textarea>
			<view
				style="display: flex;flex-direction: row;width: 100%;justify-content: space-between;align-items: center;margin-top: 24rpx;">
				<button @click="closefullScreen">取消</button>
				<button @click="savefenjiContent">保存</button>
			</view>
		</view>
	</view>

	<view v-if="state.isOpenFenjingSP" class="mark" style="justify-content:center;z-index: 11;">
		<view
			style="background: #ffffff;display: flex;flex-direction: column;justify-content: flex-start;align-items: flex-start;padding: 24rpx;">
			<view style="display: flex;flex-direction: row;width: 600rpx;margin-left: 16rpx;">
				<view
					style="display: flex;flex-direction: row;justify-content: center;align-items: flex-start;width: 100%;">
					<text>SP选择：</text>
					<uni-section style="width: 100%;flex: 1;" title="SP选择：" type="line">
						<view class="uni-px-5 uni-pb-5">
							<uni-data-select v-model="state.curSelectFenjingSPValue" :localdata="state.curfenjingSpList"
								@change="fenjingSPChange"></uni-data-select>
						</view>
					</uni-section>
				</view>
			</view>
			<textarea :maxlength="-1" @input="fenjingSPInput" class="sp-input"
				style="width: 2024rpx;height: 1024rpx;margin-top: 24rpx;" :value="state.curSelectFenjingSPValue"
				placeholder="请编辑"></textarea>
			<view
				style="display: flex;flex-direction: row;width: 100%;justify-content: space-between;align-items: center;margin-top: 24rpx;">
				<button @click="closefenjingSP">取消</button>
				<button @click="savefenjingSP">保存</button>
			</view>
		</view>
	</view>
</template>

<script setup>
	import {
		defineProps,
		defineEmits,
		reactive,
		onMounted,
		ref
	} from 'vue'
	import {
		doubaoChatStream
	} from '../common/AIAgent';
	import CustomLoading from './CustomLoading.vue'
	import {
		isNull,
		splitDramaByEpisode
	} from '../common/Tool';
	import {
		onHide,
		onShow,
		onUnload
	} from '@dcloudio/uni-app';
	import {
		APIPath,
		getRequest
	} from '../common/APIRequest';
	import {
		CreateProjectEpisodes,
		GetCamereDetail,
		GetProjectEpisodesList,
		ModifyProjectEpisodes,
		deleteProjectEpisodes
	} from '../common/ProjectMgr';
	import {
		GetResourceList
	} from '../common/ResourceMgr';
	const props = defineProps({

	})
	const fileContent = ref('');
	let fileInput = null;
	const emits = defineEmits(["close"])

	const state = reactive({
		newResConfig: {
			id: 0,
			type: 1,
			title: '',
			imageUrl: "",
			detail: '',
		},
		curfenjiIndex: 0,
		openfunllScreen: false,
		curfenjiDetail: '',
		importType: 1,
		spList: [],
		isOpenFenjingSP: false,
		curfenjingSpList: [],
		curSelectFenjingSPValue: '',
		fenjiList: [],
		importType: 0,
		novelContent: '',
		testVisible: true,
		isGlobalFenjingSp: false,
		gloablDefaultfenjingSpConfig: {
			spValue: ""
		},
		projectDetail: {},
		episodesDetail: {},
		episodesPageConfig: { // 分页相关状态
			currentPage: 1, // 当前页码
			pageSize: 100, // 每页数量
			isLoadingMore: false, // 是否正在加载更多
			hasMore: true, // 是否还有更多数据
			totalCount: 0 // 总数据量
		}
	})

	const scrollTop = ref(0)

	onMounted(() => {
		/* 	state.fenjiList = uni.getStorageSync('aimanju_novel_fenjiList') || []
			console.log("state.fenjiList:", state.fenjiList) */
		state.projectDetail = uni.getStorageSync("aimanju_current_projectdetail") || {}
		scrollTop.value = uni.getStorageSync("aimanju_script_scrolltop") || 0
		// console.log("state.projectDetail：", state.projectDetail)
		getEpisodesList()
		getSPList()
	})

	onShow(function() {})

	onHide(function() {})

	// 获取分集剧本列表
	function getEpisodesList(isLoadMore = false, callback = null, errorCallback = null) {
		if (isLoadMore) {
			if (state.episodesPageConfig.isLoadingMore || !state.episodesPageConfig.hasMore) {
				return
			}
			state.episodesPageConfig.isLoadingMore = true
			state.episodesPageConfig.currentPage++
		} else {
			// 首次加载，重置为第一页
			state.episodesPageConfig.currentPage = 1
			state.episodesPageConfig.hasMore = true
		}

		GetProjectEpisodesList(state.episodesPageConfig.currentPage, state.episodesPageConfig.pageSize, state.projectDetail
			.id, data => {
				state.episodesDetail = data

				state.episodesPageConfig.totalCount = data.total || 0
				state.episodesPageConfig.hasMore = (state.episodesPageConfig.currentPage * state.episodesPageConfig
					.pageSize) < state.episodesPageConfig.totalCount

				if (isLoadMore) {
					// 加载更多，追加到现有列表
					state.fenjiList = [...state.fenjiList, ...(data.rows || [])]
					sortFenjiList()
					state.episodesPageConfig.isLoadingMore = false
					uni.showToast({
						title: '已加载' + (data.rows || []).length + '条数据',
						icon: 'none',
						duration: 1500
					})
				} else {
					state.fenjiList = data.rows || []
					sortFenjiList()
				}
				console.log('当前页:', state.episodesPageConfig.currentPage, '总页数:', Math.ceil(state.episodesPageConfig
					.totalCount / state.episodesPageConfig.pageSize))

				if (callback) callback()
			}, () => {
				state.episodesPageConfig.isLoadingMore = false
				if (errorCallback) errorCallback()
			})
	}
	// 排序 fenjiList 函数(先按集数collectId排、再按场次fieldId排)
	function sortFenjiList() {
		// 先按 collectId 排序，再按 fieldId 排序
		state.fenjiList.sort((a, b) => {
			// 先比较 collectId
			if (a.collectId !== b.collectId) {
				// collectId 为 null/undefined 的排在后面
				if (a.collectId == null) return 1
				if (b.collectId == null) return -1
				// 数字比较
				return a.collectId - b.collectId
			}

			// collectId 相同，再比较 fieldId
			// fieldId 为 null/undefined 的排在后面
			if (a.fieldId == null) return 1
			if (b.fieldId == null) return -1

			// 数字比较
			return a.fieldId - b.fieldId
		})
		console.log('排序后的 fenjiList:', state.fenjiList)
	}

	function handleScrollToLower(detail) {
		getEpisodesList(true)
	}

	function handleScrolll(detail) {
		scrollTop.value = detail.detail.scrollTop
		uni.setStorageSync("aimanju_script_scrolltop", scrollTop.value)
	}

	function getSPList() {
		state.spList = []
		GetResourceList(1, 10000, 24, (resList) => {
			var typeList = resList.filter(item => item.typeId == 24)
			var tempContents = []
			for (let i = 0; i < typeList.length; i++) {
				var spitem = {
					id: typeList[i].id,
					title: typeList[i].name,
					content: typeList[i].content,
					isNew: false,
					isChange: false
				}
				tempContents.push(spitem)
			}
			var spItem = {
				/* 	name: element.treeName,
					type: element.type, */
				contents: tempContents,
			}
			state.spList.push(spItem)
			var tempsps = [...state.spList.find(item => item.type == state.curSPtype).contents ?? []]
			state.curfenjingSpList = selectSPbyType(state.curSPtype, tempsps)
		})
	}

	function openfenjingSP(index) {
		state.isGlobalFenjingSp = false
		state.curfenjiIndex = index
		state.isOpenFenjingSP = true
		// state.curfenjingSpList = selectSPbyType(4)
		var defaultSP = state.spList.find(item => item.type == 4)?.contents ?? ''
		state.curSelectFenjingSPValue = state.fenjiList[index].sp ?? defaultSP
		if (state.curSelectFenjingSPValue == '') {
			state.curSelectFenjingSPValue = defaultSP
		}
	}

	// 打开全局默认分镜SP
	function openGlobalDefaultFenjingSP() {
		state.curSelectFenjingSPValue = state.gloablDefaultfenjingSpConfig.spValue
		state.isGlobalFenjingSp = state.isOpenFenjingSP = true
	}

	function selectSPbyType(type, splist) {
		var selectData = splist.map(item => {
			return {
				value: item.content,
				text: item.title
			}
		})
		return selectData
	}

	function closefenjingSP() {
		state.isOpenFenjingSP = false
	}

	function savefenjingSP() {
		state.isOpenFenjingSP = false
		if (state.isGlobalFenjingSp) {
			state.gloablDefaultfenjingSpConfig.spValue = state.curSelectFenjingSPValue ?? ''
		} else {
			state.fenjiList[state.curfenjiIndex].sp = state.curSelectFenjingSPValue ?? ''
		}
		saveFenji()
	}

	function allCreateCameraSub() {
		var isExistNullSp = false
		var recordNum = 0
		for (let index = 0; index < state.fenjiList.length; index++) {
			var isSelect = state.fenjiList[index].isSelect
			if (isSelect) {
				var tempSp = state.fenjiList[index].sp
				if (isNull(tempSp)) {
					tempSp = state.gloablDefaultfenjingSpConfig.spValue
					isExistNullSp = true
					recordNum++
				}
				if (!isNull(tempSp)) {
					startCreatesubCam(index)
				}
			}

		}

		if (isExistNullSp) {
			var title = ""
			if (recordNum < state.fenjiList.length) {
				title = "存在分镜SP为空的选项，已跳过这些选项"
			} else {
				title = "生成失败，分镜SP都为空"
			}
			uni.showToast({
				title: title,
				icon: 'none'
			})
		}
	}

	const curFenjiCameraList = ref([])

	// 单独点击生成分镜
	function handleSimpleCreatesubCam(index) {
		var fenji = state.fenjiList[index]

		var detailInfoPromises = []
		var isExistFenjing = false
		detailInfoPromises.push(new Promise((resolve) => {
			GetCamereDetail(fenji.id, data => {
				console.log("获取当前分集详细信息：", data)
				curFenjiCameraList.value = data.cameras
				isExistFenjing = data.cameras.length > 0
				resolve()
			}, resolve)
		}))

		Promise.all(detailInfoPromises).then(() => {
			if (isExistFenjing) {
				uni.showActionSheet({
					title: fenji.collectId + "_" + fenji.fieldId + "已存在分镜数据",
					itemList: ['覆盖分镜数据', '追加分镜数据', '取消'],
					success: function(res) {
						if (res.tapIndex != 2) {
							var isNew = res.tapIndex == 0
							console.log("isNew:", isNew)
							startCreatesubCam(index, isNew)
						}
					},
					fail: function(res) {
						console.log(res.errMsg);
					}
				});
			} else {
				startCreatesubCam(index)
			}
		}).catch(() => {
			uni.showToast({
				title: '获取当前分集详细信息失败，请重新点击生成分镜按钮',
				icon: 'none'
			})
		})
	}

	function startCreatesubCam(index, isNew = true) {
		console.log("state.spList:", state.spList)
		// var defaultSP = state.spList.find(item => item.type == 4)?.contents ?? ''
		var defaultSP = state.gloablDefaultfenjingSpConfig.spValue
		var curFenJi = state.fenjiList[index]
		var tempSP = curFenJi.sp
		if (isNull(tempSP)) {
			tempSP = defaultSP
		}
		if (isNull(tempSP)) {
			uni.showToast({
				title: "分镜SP为空,请填写当前分镜SP或全局分镜SP",
				icon: 'none',
				duration: 3000
			})
			return
		}
		var body = [{
				"role": "system",
				"content": tempSP
			},
			{
				"role": "user",
				// "content": state.fenjiList[index].detail ?? ''
				"content": curFenJi.content ?? ''
			},
		]
		state.fenjiList[index].loadingVisible = true
		doubaoChatStream(body, (result) => {
			console.log('生成分镜结果=', result)
			let parts = result.split('####')
			parts = parts.map(part => part.trim()).filter(part => part !== '');
			console.log('分镜列表=', parts)
			state.fenjiList[index].cameras = isNew ? [] : curFenjiCameraList.value
			var curDate = Date.now()
			for (let i = 0; i < parts.length; i++) {
				const element = parts[i];
				let spParts = element.split('###')
				spParts = spParts.map(part1 => part1.trim()).filter(part1 => part1 !== '');
				var fenjingName = curFenJi.collectId + "_" + curFenJi.fieldId + "_" + (state.fenjiList[index]
					.cameras.length + index + 1)
				var tempCameraConfig = newCameraConfig(fenjingName,curDate, i)
				if (spParts.length > 0) {
					if (spParts.length >= 2) {
						tempCameraConfig.fenjinContent = spParts[1]
					}
					if (spParts.length >= 3) {
						tempCameraConfig.fenjinDialog = spParts[2]
					}
					if (spParts.length >= 4) {
						tempCameraConfig.rongtuSP = spParts[3]
					}
					if (spParts.length >= 5) {
						tempCameraConfig.videoContentSP = spParts[4]
					}
				}
				state.fenjiList[index].cameras.push(tempCameraConfig)
			}
			state.fenjiList[index].loadingVisible = false
			console.log('分镜列表=', state.fenjiList[index].cameras)
			saveFenji()
			handleSaveCurEpisodes(state.fenjiList[index])
		}, (chunk) => {

		}, (errormsg) => {
			uni.showToast({
				title: errormsg,
				icon: 'none'
			})
			state.fenjiList[index].loadingVisible = false
		})
	}

	function newCameraConfig(name, dateTime, index) {
		var cameraConfig = {
			id: dateTime + index,
			// id: Date.now() + index,
			// id:0,
			name: name,
			imageUrl: "",
			isSelectfanqiu: false,
			fanqiuSp: '',
			fanqiuResult: '',
			isSelectfanqiuResult: false,
			isSelectRongtu: false,
			rongtuhuafengStyle: '',
			rongtuStyle: '',
			rongtuSP: '',
			rongtuSPScene: '',
			rongtuFuxiangSP: '',
			rongtuImages: [],
			isSelectRongtuResult: false,
			rongtuCount: 0,
			rongtuHistory: [],
			rongtyResultImage: '',
			isSelectVideo: false,
			videoSP: '',
			videoContentSP: '',
			videoSPbottom: '',
			videofuxiangSP: '',
			isSelectVideoResult: false,
			videotime: 0,
			videofps: 0,
			resolutionratio: '',
			createVideoCount: 0,
			videoHistory: [],
			videoResultUrl: '',
			endCamera: null,

			fenjinContent: '',
			fenjinDialog: '',
			rongtucankaosp: '',
			cankaoVideo: ["", ""],
			cankaoVieoImages: [],
			isMulitVideo: false,
			videoAgentName: '',
			loadingVisible: false,
			loadingfenji: false,
			imageAgentName: '',

		}
		return cameraConfig
	}

	function deleteSelect() {
		/* state.fenjiList = state.fenjiList.filter(item => !item.isSelect)
		saveFenji() */

		var needRemoveList = state.fenjiList.filter(p => p.isSelect)
		if (needRemoveList.length > 0) {
			var idsList = needRemoveList.map(p => p.id)
			deleteProjectEpisodes(idsList, data => {
				const removeSet = new Set(idsList)
				const newArr = state.fenjiList.filter(p => !removeSet.has(p.id))
				console.log("删除所选之后所剩数组:", newArr)
				state.fenjiList = newArr
			}, () => {

			})
		}
	}

	function selectAllji(isSelect) {
		state.fenjiList.forEach(item => {
			item.isSelect = isSelect
		});
		saveFenji()
	}

	function readNovel(importType) {
		fileContent.value = '';
		state.importType = importType
		initFileInput();

		// 每次点击前清空 fileInput.value，确保选择相同文件也能触发 change 事件
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
			console.warn('触发文件选择框失败，使用兜底方案：', error);
		}
	}
	const initFileInput = () => {
		// if (document.getElementById('txtFileInput')) return;
		// /* const oldInput = document.getElementById('txtFileInput');
		// if (oldInput) {
		// 	oldInput.remove();
		// } */
		// fileInput = document.createElement('input');
		// fileInput.id = 'txtFileInput';
		// fileInput.type = 'file';
		// fileInput.accept = '.txt';
		// fileInput.style.position = 'absolute';
		// fileInput.style.top = '-9999px';
		// fileInput.style.left = '-9999px';
		// fileInput.style.opacity = '0';
		// fileInput.addEventListener('change', handleFileUpload);
		// document.body.appendChild(fileInput);
		const existingInput = document.getElementById('txtFileInput');

		if (existingInput) {
			fileInput = existingInput;
			// 移除旧的事件监听器，避免重复绑定
			fileInput.removeEventListener('change', handleFileUpload);
		} else {
			fileInput = document.createElement('input');
			fileInput.id = 'txtFileInput';
			fileInput.type = 'file';
			fileInput.accept = '.txt';
			fileInput.style.position = 'absolute';
			fileInput.style.top = '-9999px';
			fileInput.style.left = '-9999px';
			fileInput.style.opacity = '0';
			document.body.appendChild(fileInput);
		}

		// 绑定新的事件监听器
		fileInput.addEventListener('change', handleFileUpload);

	};
	const handleFileUpload = (e) => {
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
			fileContent.value = event.target.result;
			if (state.importType == 1) {
				state.novelContent = fileContent.value
			} else if (state.importType == 2) {
				addFenjijuben(fileContent.value)
			} else if (state.importType == 3) {
				//=====向前/后 加一集/一场次
				addFenjijubenInCurrentJuben(fileContent.value)
			}
			e.target.value = '';
			/* uni.showToast({
				title: '导入成功',
				icon: 'success'
			}); */
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

	function addFenjijuben(fenjingContent) {
		/* uni.showToast({
			title: '导入成功',
			icon: 'success'
		}); */
		// console.log("读取的文本：", fenjingContent)
		var newfenjiList = splitDramaByEpisode(fenjingContent)
		// console.log(newfenjiList.length)
		// console.log(newfenjiList)

		if (Array.isArray(newfenjiList) && newfenjiList.length > 0) {
			var newCollectId = 0
			if (state.fenjiList.length > 0) {
				newCollectId = state.fenjiList[state.fenjiList.length - 1].collectId
				// newCollectId++
			}
			// 显示 loading
			uni.showLoading({
				title: '正在导入分集...',
				mask: true
			})

			var createPromises = []
			for (var i = 0; i < newfenjiList.length; i++) {
				var fenjingContent = newfenjiList[i];
				newCollectId++
				var newItem = {
					projectId: state.projectDetail.id,
					name: '第' + newCollectId + "集",
					content: fenjingContent,
					collectId: newCollectId,
					fieldId: 1
				}
				createPromises.push(new Promise((resolve, reject) => {
					CreateProjectEpisodes(newItem, resData => {
						console.log("新增分集剧本:", resData)
						resolve(resData)
						// state.fenjiList.push(resData)
						/* 	getEpisodesList(false, data => {
						
							}, () => {
						
							}) */
					}, error => {
						console.error("创建分集失败:", error)
						reject(error)
					})
				}))

			}

			Promise.all(createPromises).then(results => {
				console.log("所有分集创建完成，共", results.length, "个")
				getEpisodesList(false, () => {
					uni.hideLoading()
					uni.showToast({
						title: '导入成功，共导入' + newfenjiList.length + '集',
						icon: 'success',
						duration: 2000
					})
				}, () => {
					uni.hideLoading()
				})
			}).catch(error => {
				uni.hideLoading()
				uni.showToast({
					title: '导入失败，请重试',
					icon: 'none'
				})
			})
		}
	}

	// 在当前剧本前后新增集/场次
	function addFenjijubenInCurrentJuben(fenjingContent) {
		if (addFenjijubenCallback) {
			addFenjijubenCallback(fenjingContent)
		}
	}

	function openfullScreen(index) {
		state.curfenjiIndex = index
		state.openfunllScreen = true
		// state.curfenjiDetail = state.fenjiList[index].detail
		state.curfenjiDetail = state.fenjiList[index].content
	}

	function fenjifullscreenInput(e) {
		state.curfenjiDetail = e.detail.value
	}

	function closefullScreen(index) {
		state.openfunllScreen = false
	}

	function savefenjiContent() {
		state.openfunllScreen = false
		// state.fenjiList[state.curfenjiIndex].detail = state.curfenjiDetail
		state.fenjiList[state.curfenjiIndex].content = state.curfenjiDetail
		saveFenji()
		handleSaveCurEpisodes(state.fenjiList[state.curfenjiIndex])
	}

	function saveSPConfig() {
		uni.setStorageSync('aimanju_novel_spList', state.spList)
	}

	function saveFenji() {
		uni.setStorageSync('aimanju_novel_fenjiList', state.fenjiList)
	}

	function selectJiResult(index) {
		state.fenjiList[index].isSelect = !state.fenjiList[index].isSelect
		saveFenji()
	}

	function setFenjiIndex(index) {
		state.curfenjiIndex = index
	}

	function fenjingSPInput(e) {
		state.curSelectFenjingSPValue = e.detail.value
	}

	function fenjiInput(e) {
		// state.fenjiList[state.curfenjiIndex].detail = e.detail.value
		state.fenjiList[state.curfenjiIndex].content = e.detail.value
		saveFenji()
	}


	let addFenjijubenCallback = null

	// 通用添加分集方法
	// isAfter: true=向后加集，false=向前加集
	// isScene: 是否是属于加场次
	function handleAddEpisode(index, isAfter, isScene = false) {
		var fenjiData = state.fenjiList[index]

		addFenjijubenCallback = (newContent) => {
			var insertIndex = isAfter ? index + 1 : index
			// var newOrderNum = isAfter ? fenjiData.orderNum + 1 : fenjiData.orderNum
			var newCollectId = isAfter ? fenjiData.collectId + 1 : fenjiData.collectId

			// 创建新分集数据
			var newItem = {
				projectId: fenjiData.projectId,
				// name: fenjiData.name,
				// orderNum: newOrderNum,
				// collectId:newCollectId,
				name: `第${newCollectId}集`,
				content: newContent,
				handelId: fenjiData.id,
				handelType: !isAfter ? 'before' : 'after',
				handelStyle: isScene ? 'field' : 'collect'
			}

			console.log("newItem:", newItem)

			if (isScene) {
				newItem.parentId = fenjiData.id
			}

			// 调用API创建新分集
			uni.showLoading({
				title: '创建中...',
				mask: true
			})

			CreateProjectEpisodes(newItem, resData => {
				uni.showToast({
					title: '添加成功',
					icon: 'success'
				})
				getEpisodesList(false, () => {
					setTimeout(() => {
						scrollTop.value = scrollTop.value + 1
					}, 200)
					// sortFenjiList()
				}, () => {

				})

			}, error => {
				console.log(error)
				uni.hideLoading()
				uni.showToast({
					title: '更新失败:' + error,
					icon: 'none',
					duration: 1500
				})
			})
		}

		readNovel(3)
	}

	// 向前加一集
	function handleForwardAddOneEpisode(index) {
		handleAddEpisode(index, false)
	}

	// 向后加一集
	function handleBackwardAddOneEpisode(index) {
		handleAddEpisode(index, true)
	}

	// 向前加一场次
	function handleForwardAddOneScene(index) {
		handleAddEpisode(index, false, true)

	}

	// 向后加一场次
	function handleBackwardAddOneScene(index) {
		handleAddEpisode(index, true, true)
	}

	//上移
	function handleMoveup(index) {
		// 如果是第一个元素，不能上移
		if (index <= 0) {
			uni.showToast({
				title: '已经是第一个了',
				icon: 'none'
			})
			return
		}
		// 交换当前元素和前一个元素
		swapItems(index, index - 1)
	}

	// 下移
	function handleMovedown(index) {
		// 如果是最后一个元素，不能下移
		if (index >= state.fenjiList.length - 1) {
			uni.showToast({
				title: '已经是最后一个了',
				icon: 'none'
			})
			return
		}

		// 交换当前元素和后一个元素
		swapItems(index, index + 1)
	}

	function swapItems(currentIndex, targetIndex) {
		// 获取两个元素
		var currentItem = state.fenjiList[currentIndex]
		var targetItem = state.fenjiList[targetIndex]

		var newItem = {
			...currentItem,
			handelId: currentItem.id,
			otherId: targetItem.id,
		}

		// 调用API更新两个元素
		uni.showLoading({
			title: '移动中...'
		})
		var updatePromises = [
			new Promise((resolve) => {
				ModifyProjectEpisodes(newItem, resolve, resolve)
			})
		]

		Promise.all(updatePromises).then(() => {
			// 更新成功，交换本地列表中的位置
			var temp = {
				...state.fenjiList[currentIndex]
			}
			state.fenjiList[currentIndex].collectId = state.fenjiList[targetIndex].collectId
			state.fenjiList[currentIndex].fieldId = state.fenjiList[targetIndex].fieldId
			state.fenjiList[targetIndex].collectId = temp.collectId
			state.fenjiList[targetIndex].fieldId = temp.fieldId
			sortFenjiList()


			/* getEpisodesList(false, () => {
				setTimeout(() => {
					scrollTop.value = scrollTop.value + 1
				}, 200)
			}, () => {

			}) */


			uni.hideLoading()
			uni.showToast({
				title: '移动成功',
				icon: 'success'
			})
		}).catch(error => {
			uni.hideLoading()
			uni.showToast({
				title: '移动失败',
				icon: 'none'
			})
		})
	}

	// 一键保存剧本
	function handleSaveAllEpisodes() {
		// var filterList = state.fenjiList.filter(p => p.isSelect)
	}

	// 保存分集剧本
	function handleSaveCurEpisodes(item) {
		console.log("item:", item)
		ModifyProjectEpisodes(item, data => {

		}, () => {

		})
	}
</script>

<style scoped>
	.sp-input {
		overflow: hidden;
		background: #ffffff;
		padding-left: 16rpx;
		border: 6rpx solid #8240FA;
		margin-top: 16rpx;
	}

	.flex-c-c {
		display: flex;
		justify-content: center;
		align-items: center;
		flex-direction: row;
	}

	.flex-c-c-column {
		display: flex;
		justify-content: center;
		align-items: center;
		flex-direction: column;
	}
</style>