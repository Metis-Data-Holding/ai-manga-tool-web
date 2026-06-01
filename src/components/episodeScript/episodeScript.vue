<template>
	<view
		style="display: flex;flex-direction: column;width: 100%;flex:1;height:0;overflow: hidden;background: #f3f3f3;align-items: center;">
		<view class="flex-c-c script-top-bg">
			<view class="script-top-left-bg flex-c-c" style="width: 17%; padding: 20rpx 24rpx; box-sizing: border-box;">
				<view @click="readNovel(2)" class="script-top-center-item yellowColor flex-c-c"
					style="width: 100%; height: 100%; border-radius: 8rpx;">
					第一步：
					<image style="width: 32rpx;height: 32rpx;margin-right: 16rpx;" src="/static/importIcon_black.png"
						mode="aspectFit"></image>
					导入剧本
				</view>
			</view>
			<view class="script-top-center-bg flex-c-c" style="justify-content: flex-start;">
				<view @click="selectAllji(true)" class="script-top-left-item flex-c-c primaryColor"
					style="color:#FFFFFF; width: 120rpx;margin-left: 32rpx;">全选</view>
				<view @click="selectAllji(false)" class="script-top-left-item flex-c-c"
					style="width: 120rpx; margin: 0 16rpx;">取消</view>
				<view @click="handleInverseSelect()" class="script-top-left-item flex-c-c"
					style="width: 120rpx; margin-right: 32rpx;">反选
				</view>
				<view @click="allCreateCameraSub()" class="script-top-center-item yellowColor flex-c-c"
					style="width: auto; font-weight: 500;padding: 0px 36rpx;margin-left: auto;margin-right: 26rpx;">
					<text>第二步</text>
					<image src="/static/point_icon.png" style="width: 10px;height: 14px;padding-right: 2px;margin-left: 3px;" mode="heightFix"></image>
					<text style="padding-right: 3px">{{ state.fenjiList.length }}</text>
					<text>全部生成故事板</text>
					</view>
			</view>
			<view v-if="false" class="script-top-right-bg flex-c-c" style="justify-content: flex-start; ">
				<view @click="selectAllAssets(true)" class="script-top-left-item flex-c-c blueColor"
					style="color:#FFFFFF; width: 120rpx;margin-left: 32rpx;">全选</view>
				<view @click="selectAllAssets(false)" class="script-top-left-item flex-c-c"
					style="width: 120rpx; margin: 0 16rpx;">取消</view>
				<view @click="handleExtractAssets()" class="script-top-right-item flex-c-c yellowColor"
					style="width: 160rpx; margin-right: 16rpx; font-weight: 500;margin-left: auto;">提炼资产</view>
				<view @click="handleSyncMatchAssets()" class="script-top-right-item flex-c-c yellowColor"
					style="width: auto; font-weight: 500;padding: 0px 36rpx;margin: 24rpx;">
					第二步：同步匹配资产</view>
			</view>
		</view>

		<scroll-view style="margin-top: 24rpx;width: 100%;flex: 1;height: 0;" :scroll-y="true" :show-scrollbar="true"
			:scroll-top="state.scrollTop" @scrolltolower="handleScrollToLower" @scroll="handleScrolll">
			<view class="flex-c-c-column" style="width: 100%;">
				<block v-for="(item, index) in state.fenjiList" :key="index">
					<view class="script-item"
						:style="`background: ${item.isHovering ? 'linear-gradient(0deg, #FFE3AF, #FFE3AF), #FFFFFF;' : ''}`"
						@mouseenter="onItemMouseEnter(index)" @mouseleave="onItemMouseLeave(index)">
						<view class="script-item-left-bg">
							<view class="left-header">
								<image style="width: 40rpx;height: 40rpx;margin-right: 16rpx;"
									src="/static/importIcon_black.png" mode="aspectFit"></image>
								<text class="episode-title" style="margin-left: 0;">{{
									item.collectId }}集{{ item.fieldId }}场</text>
							</view>

							<view class="control-row">
								<view class="script-btn" :class="{ 'white-bg': item.isHovering }"
									@click="handleForwardAddOneEpisode(index)">向前 加1集</view>
								<view class="script-btn" :class="{ 'white-bg': item.isHovering }"
									@click="handleForwardAddOneScene(index)">向前 加1场次</view>
							</view>

							<view class="control-row">
								<view class="script-btn" :class="{ 'white-bg': item.isHovering }"
									@click="handleBackwardAddOneEpisode(index)">向后 加1集</view>
								<view class="script-btn" :class="{ 'white-bg': item.isHovering }"
									@click="handleBackwardAddOneScene(index)">向后 加1场次</view>
							</view>

							<view class="control-row">
								<view class="script-btn" :class="{ 'white-bg': item.isHovering }"
									@click="handleMoveup(index)">上移</view>
								<view class="loading-placeholder">
									<CustomLoading v-model:visible="item.loadingVisible" title="分镜生成中..."
										circle-color="#ff6600" text-color="#666666" :circle-size="50" />
								</view>
							</view>
							<view class="control-row">
								<view class="script-btn" :class="{ 'white-bg': item.isHovering }"
									@click="handleMovedown(index)">下移</view>
								<view class="script-btn" :class="{ 'white-bg': item.isHovering }"
									@click="openfenjingSP(index)">本场故事SP</view>
							</view>
							<view class="control-row footer" style="justify-content: flex-start;gap: 10px;">
								<view class="script-btn btn-delete" style="width: 68px;" @click.stop="handleDeleteSelect(item)">删除</view>
								<view class="script-btn btn-generate" style="flex:1;display: flex;align-items: center;" v-debounce.click="{handler:()=>handleSimpleCreatesubCam(index),immediate:true,delay:500}">
									<image src="/static/point_icon.png" style="width: 10px;height: 14px;padding-right: 2px;" mode="heightFix"></image>
									<text style="padding-right: 4px;">1</text>
									<text>生成故事板</text>
								</view>
							</view>
						</view>

						<view class="flex-c-c-column script-item-center-bg">
							<view class="flex-c-c" style="width: 100%;justify-content: flex-start;margin-bottom:12rpx;">
								<image @click="selectJiResult(index)"
									style="width: 40rpx; height: 40rpx; margin-right: 16rpx;margin-left: 1.7%;"
									:src="item.isSelect ? '/static/sel_icon_2.png' : '/static/nor_iconb.png'">
								</image>
								<text
									style="align-self: flex-start;font-weight: bold; margin-bottom: 0rpx;color: #333333;font-size: 32rpx;">剧本内容</text>
								<!-- <view class="flex-c-c"
									:style="`height: 32rpx;margin-right: 2%;background: ${item.isHovering ? '#FFFFFF' : '#e7e7e7'};padding: 10rpx 32rpx;border-radius: 8rpx;font-size: 28rpx;`"
									@click="openfullScreen(index)">全屏编辑</view> -->
							</view>
							<textarea :maxlength="-1" @focus="setFenjiIndex(index)" @blur="(e)=>handleFenjiBlur(index,e)"
								:style="`height:500rpx;width: 95%; overflow: hidden;padding: 16rpx;background: ${item.isHovering ? '#FFFFFF' : '#F3F3F3'};border-radius: 16rpx;font-size: 28rpx;`"
								:value="item.content" placeholder="分集具体内容文本"
								placeholder-style="color:#999999"></textarea>
						</view>

						<view v-if="false" class="script-item-right-bg flex-c-c-column">
							<view class="flex-c-c"
								style="width: 100%;justify-content: flex-start; margin-bottom: 12rpx;">
								<image @click="toggleAssetSelectionAll(item)"
									style="width: 50rpx; height: 50rpx; margin-right: 16rpx;margin-left: 24rpx;cursor: pointer;"
									:src="item.isAssetSelected ? '/static/sel_icon_2.png' : '/static/nor_iconb.png'">
								</image>
								<text style="font-size: 32rpx;color: #333333;font-weight: 500;">本集资产清单</text>
							</view>
							<view class="assets-container">
								<!-- 循环渲染资产分类列 -->
								<view class="asset-column" v-for="cat in assetCategories" :key="cat.key">
									<view class="asset-label-box" :class="cat.labelClass">
										<text class="asset-label-text">{{ cat.label }}</text>
									</view>
									<view class="asset-list">
										<view class="asset-card" v-for="(asset, aIndex) in item.assets[cat.key]"
											:key="asset.id" :class="{'hover-active': asset.isHovering }"
											@mouseenter="handleAssetHover(asset, true, index)"
											@mouseleave="handleAssetHover(asset, false, index)"
											@click="toggleAssetSelection(item, cat.key, aIndex)">

											<!-- 编辑图标 -->
											<image style="width: 48rpx;height: 48rpx;position: absolute;top: 25%;"
												src="/src/static/bianji_icon.png" mode="aspectFit"></image>

											<!-- 封面图 -->
											<image class="asset-cover" style="z-index: 1;" :src="asset.coverUrl "
												mode="aspectFill">
											</image>

											<!-- 名称 -->
											<view class="asset-name-text-bg flex-c-c">
												<text class="asset-name-text">{{ asset.name }}</text>
											</view>

											<!-- 删除按钮 -->
											<image v-if="asset.isHovering" src="/src/static/shanchu_btn.png"
												class="del-btn" @click.stop="removeAsset(item, cat.key, aIndex)">
											</image>

											<!-- 悬浮详情弹窗 -->
											<view
												v-if="asset.showDetailPopup /* || (cat.key === 'roles' && index == 1 && aIndex == 0) */"
												class="asset-detail-popup"
												:class="{ 'popup-bottom': asset.isBottomPopup }" @click.stop
												@mouseenter="handleAssetHover(asset, true, index)"
												@mouseleave="handleAssetHover(asset, false, index)">
												<view class="popup-cover">
													<image :src="asset.coverUrl || '/static/normalbg.png'"
														:mode="asset.coverUrl ? 'aspectFit' : 'aspectFill'"></image>
												</view>

												<view class="popup-footer">
													<view
														style="display:flex; align-items:center; flex:1;margin-left: 16rpx;line-height: 100%;">
														<text class="popup-tag"
															:style="{background: getCategoryColor(cat.key)}">
															{{ getCategoryName(cat.key) }}
														</text>
														<text class="popup-name">{{ asset.name }}</text>
													</view>
													<view class="popup-del-btn" style="margin-right: 16rpx;"
														@click.stop="removeAsset(item, cat.key, aIndex)">删除</view>
												</view>
											</view>
										</view>
										<!-- 添加按钮 -->
										<view class="asset-card add-card" style="line-height: 100%;"
											@click="addAsset(item, cat.key)">
											<text style="font-size: 48rpx;color: #333333;">+</text>
											<text style="font-size: 24rpx; color: #000000; margin-top: 8rpx;">添加</text>
										</view>
									</view>
								</view>
							</view>
						</view>

					</view>
				</block>
			</view>
		</scroll-view>
	</view>

	<view v-if="state.openfunllScreen" class="mark" style="justify-content:center;z-index: 11;">
		<view
			style="background: #ffffff;display: flex;flex-direction: column;justify-content: center;align-items: center;padding: 24rpx;width: 1680rpx;height: 1300rpx;border-radius: 24rpx;position: relative;">
			<image style="position: absolute;top: 24rpx;right: 24rpx;width: 68rpx; height: 68rpx;"
				@click="closefullScreen" src="/static/close.png"></image>
			<text style="font-size: 40rpx;color: #333333;font-weight: 500;">{{
				state.fenjiList[state.curfenjiIndex].collectId }}集{{ state.fenjiList[state.curfenjiIndex].fieldId }}场
				- 剧本内容</text>

			<textarea :maxlength="-1" @blur="fenjifullscreenInput"
				style="width: 1632rpx;flex: 1;margin-top: 24rpx;border-radius: 16rpx;background: #F3F3F3;padding: 16rpx;font-size: 32rpx;line-height: 1.5;"
				:value="state.curfenjiDetail" placeholder="请选择或者编辑"></textarea>

			<view
				style="display: flex;flex-direction: row;width: 100%;justify-content: center;align-items: center;margin-top: 24rpx;">
				<button @click="closefullScreen"
					style="font-size: 28rpx;font-weight: 500; width: 240rpx;height: 72rpx;border-radius: 8rpx;background: #F3F3F3;color: #666666;display: flex;justify-content: center;align-items: center;margin-right: 32rpx;">取消</button>
				<button @click="savefenjiContent"
					style="font-size: 28rpx;font-weight: 500; width: 240rpx;height: 72rpx;border-radius: 8rpx;background: #F8BA38;color: #333333;display: flex;justify-content: center;align-items: center;">保存</button>
			</view>
		</view>
	</view>

	<view v-if="state.isOpenFenjingSP" class="mark" style="justify-content:center;z-index: 11;">
		<view
			style="background: #ffffff;display: flex;flex-direction: column;justify-content: center;align-items: center;padding: 24rpx;width: 60vw;height: 80vh; min-width: 1680rpx;min-height: 1400rpx;border-radius: 24rpx;position: relative;">
			<image style="position: absolute;top: 24rpx;right: 24rpx;width: 68rpx; height: 68rpx;"
				@click="closefenjingSP" src="/static/close.png"></image>
			<text style="font-size: 40rpx;color: #333333;font-weight: 500;">{{ state.curSPtitle }}</text>
			<view style="display: flex;align-items: center;justify-content: flex-start;width: 100%;padding: 8px 0;">
				<view style="width: 700rpx;">
					<uni-data-select v-model="state.curAIVModel" label="选择模型" :localdata="state.curaiList"
						@change="AIChange"></uni-data-select>
				</view>
				<view style="width: 700rpx;margin-left: 32px;">
					<uni-data-select v-model="state.curSelectFenjingSPValue" label="故事板SP"
						:localdata="state.curSelctSPList"></uni-data-select>
				</view>
			</view>
			<textarea :maxlength="-1" @blur="fenjingSPInput"
				style="width: 100%;height: 100%;margin-top: 24rpx;border-radius: 16rpx;background: #F3F3F3;padding: 16rpx;"
				:value="editable ? state.curSelectFenjingSPValue : '*该智能体提示词仅调用且不可编辑'" placeholder="SP内容" :disabled="!editable.value"></textarea>
			<view
				style="display: flex;flex-direction: row;width: 100%;justify-content: flex-end;align-items: center;margin-top: 24rpx;">
				<button
					style="font-size: 28rpx;font-weight: 500; width: 360rpx;height: 72rpx;border-radius: 8rpx;background: #F8BA38;display: flex;justify-content: center;align-items: center;margin: 0;"
					@click="savefenjingSP()">确定</button>
			</view>
		</view>
	</view>

	<ImportScript v-if="showImportModal" :confirmText="state.importType == 2 ? '执行分集' : state.importBtnConfirmText"
		:spOptions="state.episodeScriptSPlist" :resSpOptions="state.readResSPlist" @confirm="handleImportConfirm"
		@close="showImportModal = false" />

	<PopupResourcePicker v-if="state.showResourcePicker" :title="state.pickerTitle"
		@close="state.showResourcePicker = false" @confirm="handleResourceConfirm" />
</template>

<script setup>
	import {
		defineProps,
		defineEmits,
		reactive,
		onMounted,
		onBeforeUnmount,
		ref,
		computed,
		watch,
		nextTick
	} from 'vue'
	import {
		doubaoCreateWord,
		geminiCreateWord,
		aliCreateWord
	} from '@/common/AIAgentForServer.js';
	import CustomLoading from '@/components/CustomLoading.vue'
	import PopupResourcePicker from '@/components/PopupResourcePicker.vue';
	// import ImportScript from '@/components/ImportScript/ImportScript.vue';
	import {
		isNull,
		splitDramaByEpisode
	} from '@/common/Tool';
	import {
		onHide,
		onShow,
		onUnload
	} from '@dcloudio/uni-app';
	import {
		APIPath,
		getRequest
	} from '@/common/APIRequest';
	import {
		CreateProjectEpisodes,
		GetCamereDetail,
		GetProjectEpisodesList,
		ModifyProjectEpisodes,
		updateStorySp,
		deleteProjectEpisodes
	} from '@/common/ProjectMgr';
	import { GetDict, GetAIModelList } from '@/common/Common'
	import {
		GetResourceList
	} from '@/common/ResourceMgr';
	import {
		newCameraConfig
	} from '../../common/ProjectMgr';
	import { cloneDeep } from 'lodash';
	import {useStore} from 'vuex'
	const store = useStore()
	const props = defineProps({
		projectConfig: {
			type: Object,
			default: {}
		},
		scrollTop: {
			type: Number,
			default: 0
		}
	})
	const fileContent = ref('');
	let fileInput = null;
	const emits = defineEmits(["close","updateProjectSetting","updateScrollTop"])
	const showImportModal = ref(false);

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
		curAIVModel: '', // 分镜模型
		curaiList: [], // 分镜模型列表
		curSelectFenjingSPValue: '',
		fenjiList: [],
		importType: 0,
		novelContent: '',
		episodesDetail: {},
		episodesPageConfig: { // 分页相关状态
			currentPage: 1, // 当前页码
			pageSize: 1000, // 每页数量
			isLoadingMore: false, // 是否正在加载更多
			hasMore: true, // 是否还有更多数据
			totalCount: 0 // 总数据量
		},
		readResSPlist: [],
		curSPtitle: '',
		episodeScriptSPlist: [], //分集剧本SP列表
		showResourcePicker: false, // 控制弹窗显示
		pickerTitle: '选择资源',
		currentOperateCategory: '', // 当前操作的分类：roles/scenes/props
		currentOperateItemIndex: -1, // 当前操作的分集索引
		importBtnConfirmText: '',
		originalContents: {}, // 存储每个分集的原始内容

		createCameraStatus:{}, // 存储每个分集的分镜状态,离开页面时提醒是否有进行中任务

		scrollTop:0,
	})

	const editable = computed(()=>!store.getters.roles.includes('demo_personal'))

	watch(()=>props.projectConfig,(newVal,oldVal)=>{
		if(newVal){
			state.curAIVModel = newVal?.projectConfig?.txtConfig.storyboard.defaultModel || ''
		}
	},{deep:true,immediate:true})

	// 资产分类配置，用于循环渲染 UI
	const assetCategories = [{
			key: 'roles',
			label: '角色',
			labelClass: 'label-roles'
		},
		{
			key: 'scenes',
			label: '场景',
			labelClass: 'label-scenes'
		},
		{
			key: 'props',
			label: '道具',
			labelClass: 'label-props'
		}
	]

	// 生成默认 Mock 数据
	function generateMockAssets() {
		return {
			roles: [{
					id: 101,
					name: '陈小沫',
				},
				{
					id: 102,
					name: '张大伟',
				}
			],
			scenes: [{
				id: 201,
				name: '村门口',
			}],
			props: [{
					id: 301,
					name: '白色小货车11555',
				},
				{
					id: 302,
					name: '白利群香烟222222',
				}
			]
		}
	}

	// 当前项目详情
	const projectDetails = computed(() => {
		return props.projectConfig || {}
	})

	// 项目默认全局分集剧本SP
	const globalDefaultEpisodesSp = computed(() => {
		return projectDetails.value.projectConfig?.txtConfig?.createEpisodes?.sp
	})

	// 项目默认全局故事板SP
	const globalDefaultStoryBoardSp = computed(() => {
		return projectDetails.value.projectConfig?.txtConfig?.storyboard?.sp
	})

	// 项目默认全局资产提炼SP
	const globalDefaultAssetOptimizationSp = computed(() => {
		return projectDetails.value.projectConfig?.txtConfig?.createAssets?.sp
	})

	// 故事板sp列表第一条sp数据
	const storyBoardSPListFirstSp = computed(() => {
		var spValue = ""
		if (state.curfenjingSpList.length > 0) {
			spValue = state.curfenjingSpList[0].value ?? ''
		}

		return spValue
	})
	
	// 项目设置-资产总清单
	const assetListContent = computed(()=>{
		return projectDetails.value.assetListContent ?? ''
	})

	onMounted(() => {
		GetAIModelList().then((modelList)=>{
			state.curaiList = modelList.filter(item=>item.modelType==3).map(item=>({
				value: item.id.toString(),
				text: item.name,
				modelInterface:item.modelInterface
			}))
			!state.curAIVModel && (state.curAIVModel = state.curaiList[0]?.value)
		})
		getEpisodesList()
		getSPList()

		nextTick(()=>{			
			setTimeout(()=>{			
				state.scrollTop = props.scrollTop;
			},200)
		})
	})

	onBeforeUnmount(() => {
		emits('updateScrollTop',state.scrollTop)
	})

	onShow(function() {})

	onHide(function() {})

	function AIChange(e) {
		state.curAIVModel = e
	}

	// 处理分集数据（初始化 Mock 数据）
	function processEpisodeData(rows) {
		if (!rows || !Array.isArray(rows)) return [];

		return rows.map(row => {
			// 如果已有 assets 则保留，否则使用 mock
			const assets = row.assets || generateMockAssets();
			return {
				...row,
				isEditingAssets: false,
				isHovering: false,
				assets: assets
			};
		});
	}

	// 初始化已有资产的 hover 相关状态
	function initAssetHoverState(assets) {
		['roles', 'scenes', 'props'].forEach(key => {
			if (assets[key]) {
				assets[key].forEach(asset => {
					asset.isHovering = false
					asset.showDetailPopup = false
				})
			}
		})
		return assets
	}

	function onItemMouseEnter(index) {
		state.fenjiList[index].isHovering = true;
		state.fenjiList[index].isEditingAssets = true;
	}

	function onItemMouseLeave(index) {
		state.fenjiList[index].isHovering = false;
		state.fenjiList[index].isEditingAssets = false;
	}

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

		GetProjectEpisodesList(state.episodesPageConfig.currentPage, state.episodesPageConfig.pageSize, projectDetails
			.value
			.id, data => {
				state.episodesDetail = data

				state.episodesPageConfig.totalCount = data.total || 0
				state.episodesPageConfig.hasMore = (state.episodesPageConfig.currentPage * state.episodesPageConfig
					.pageSize) < state.episodesPageConfig.totalCount

				// 统一处理数据
				const processedRows = processEpisodeData(data.rows);

				if (isLoadMore) {
					// 加载更多，追加到现有列表
					state.fenjiList = [...state.fenjiList, ...processedRows]
					state.episodesPageConfig.isLoadingMore = false
					uni.showToast({
						title: '已加载' + processedRows.length + '条数据',
						icon: 'none',
						duration: 1500
					})
				} else {
					state.fenjiList = processedRows
				}

				sortFenjiList()
				// console.log('排序后的 fenjiList:', state.fenjiList)

				// console.log('当前页:', state.episodesPageConfig.currentPage, '总页数:', Math.ceil(state.episodesPageConfig
				// 	.totalCount / state.episodesPageConfig.pageSize))

				if (callback) callback()
			}, (error) => {
				state.episodesPageConfig.isLoadingMore = false
				// 如果加载更多失败，回退页码
				if (isLoadMore && state.episodesPageConfig.currentPage > 1) {
					state.episodesPageConfig.currentPage--
				}
				console.error('获取分集列表失败:', error)
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
		// console.log('排序后的 fenjiList:', state.fenjiList)
	}

	function handleScrollToLower(detail) {
		getEpisodesList(true)
	}

	function handleScrolll(detail) {
		state.scrollTop = detail.detail.scrollTop;
	}

	function getSPList() {
		state.spList = []
		GetResourceList(1, 1000, 20, (resList) => {
			for (let i = 0; i < resList.length; i++) {
				var spitem = {
					id: resList[i].id,
					type: resList[i].typeId,
					title: resList[i].name,
					content: resList[i].content,
					isNew: false,
					isChange: false
				}
				state.spList.push(spitem)
			}
			// console.log(state.spList)
			var tempsps = [...state.spList.filter(item => item.type == 24)] //生故事板
			state.curfenjingSpList = selectSPbyType(tempsps)	

			var tempsps1 = [...state.spList.filter(item => item.type == 21)] //资产提炼
			state.readResSPlist = selectSPbyType(tempsps1)

			var tempsps1_episodescript = [...state.spList.filter(item => item.type == 23)] //分集剧本-小说生成分集SP
			state.episodeScriptSPlist = selectSPbyType(tempsps1_episodescript)
			
			// 拿对应id更新故事板SP最新值
			const projectSetting = cloneDeep(props.projectConfig.projectConfig);
			const storyBoardSetting = projectSetting.txtConfig.storyboard; // 默认故事板SP		
			const targetSPItem = state.curfenjingSpList.find(item=>item.id==storyBoardSetting.spId)
			targetSPItem && (storyBoardSetting.sp = targetSPItem.value)
			
			// 拿对应id，更新生图、融图SP最新值
			GetResourceList(1, 1000, 9, (resList) => {
				const pictureSetting = projectSetting.pictureConfig; //生图 promptSp
				const rtSetting = projectSetting.rtConfig; //融图 rtSp

				const pictureSPItem = resList.find(item=>item.id==pictureSetting.promptSpId)
				pictureSPItem && (pictureSetting.promptSp = pictureSPItem.content)

				if(rtSetting){
					const rtSPItem = resList.find(item=>item.id==rtSetting.spId)
					rtSPItem && (rtSetting.sp = rtSPItem.content)
				}

				emits('updateProjectSetting',projectSetting)
			})

			// 拿对应id，生视频画风SP最新值
			GetResourceList(1, 1000, 31, (resList) => {
				const videoSetting = projectSetting.videoConfig; //生视频 rtSp

				const videoSPItem = resList.find(item=>item.id==videoSetting.rtSpId)
				videoSPItem && (videoSetting.rtSp = videoSPItem.content)

				emits('updateProjectSetting',projectSetting)
			})
		})
	}

	function openfenjingSP(index) {
		state.curfenjiIndex = index
		state.curSelctSPList = state.curfenjingSpList
		// var defaultSP = state.globalDefaultSpConfig.storyBoardSpValue ?? state.curfenjingSpList[0].value ?? ''
		var defaultSP = globalDefaultStoryBoardSp.value ?? state.curfenjingSpList[0].value ?? ''
		// state.curSelectFenjingSPValue = state.fenjiList[index].sp
		state.curSelectFenjingSPValue = state.fenjiList[index].storyBoardSp
		if (isNull(state.curSelectFenjingSPValue)) {
			state.curSelectFenjingSPValue = defaultSP
		}

		if (isNull(state.curSelectFenjingSPValue)) {
			state.curSelectFenjingSPValue = storyBoardSPListFirstSp.value
		}

		state.curSPtitle = state.fenjiList[index].collectId + '集' + state.fenjiList[index].fieldId + '场 故事板SP'
		state.isOpenFenjingSP = true
	}

	function selectSPbyType(splist) {
		var selectData = splist.map(item => {
			return {
				value: item.content,
				text: item.title,
				id: item.id,
			}
		})
		return selectData
	}

	function closefenjingSP() {
		state.isOpenFenjingSP = false
	}

	function savefenjingSP() {
		var newStoryBoardSp = state.curSelectFenjingSPValue ?? ''
		// console.log("newStoryBoardSp:" + newStoryBoardSp)
		// state.fenjiList[state.curfenjiIndex].sp = newStoryBoardSp
		state.fenjiList[state.curfenjiIndex].storyBoardSp = newStoryBoardSp
		handleSaveCurEpisodes(state.fenjiList[state.curfenjiIndex],2)
		state.isOpenFenjingSP = false
	}

	function allCreateCameraSub() {
		let excuteAvailable = false
		var filterList = state.fenjiList.filter(p => p.isSelect)
		if (filterList.length <= 0) {
			uni.showToast({
				title: '没有选中的分集剧本',
				icon: 'none',
				duration: 1500,
			})
			return
		}
		var isExistNullSp = false
		var recordNum = 0
		for (let index = 0; index < filterList.length; index++) {
			var tempSp = filterList[index].sp;
			if (isNull(tempSp)) {
				tempSp = globalDefaultStoryBoardSp.value				
			}
			if (isNull(tempSp)) {
				tempSp = storyBoardSPListFirstSp.value
				isExistNullSp = true
				recordNum++
			}
			if (!isNull(tempSp)) {
				excuteAvailable = true
				const indexOfFenji = state.fenjiList.findIndex(p => p.id == filterList[index].id)
				startCreatesubCam(indexOfFenji)
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
		}else if(excuteAvailable){
			excuteAvailable && uni.showToast({
				title: '正在处理中，请稍后',
				icon: 'none',
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
				// console.log("获取当前分集详细信息：", data)
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
							// console.log("isNew:", isNew)
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
		}).catch((e) => {
			uni.showToast({
				title: '获取当前分集详细信息失败，请重新点击生成分镜按钮',
				icon: 'none'
			})
		})
	}

	function startCreatesubCam(index, isNew = true) {
		// console.log("state.spList:", state.spList)
		var defaultSP = globalDefaultStoryBoardSp.value
		var curFenJi = state.fenjiList[index]
		// var tempSP = curFenJi.sp ?? ''
		var tempSP = curFenJi.storyBoardSp ?? '';
		let modelInterface = state.curaiList.find((item) => item.value == state.curAIVModel)?.modelInterface;
		
		if (isNull(tempSP)) {
			tempSP = defaultSP
		}
		
		if (isNull(tempSP)) {
			tempSP = storyBoardSPListFirstSp.value
		}
		tempSP = tempSP.replace('{assetListContent}',assetListContent.value)
		
		// console.log("当前故事sp:" + tempSP)
		if (state.fenjiList[index].loadingVisible) {
			console.error(`当前分集第${state.fenjiList[index].collectId}集正在执行生成故事板任务，请不要重复执行...`)
			return
		}
		if (isNull(tempSP)) {
			uni.showToast({
				title: "分镜SP为空,请填写当前分镜SP或全局分镜SP",
				icon: 'none',
				duration: 3000
			})
			return
		}
		let params = {
			projectId:projectDetails.value.id,
			modelId: state.curAIVModel,
			max_tokens:32768,
			messages:[{
					"role": "system",
					"content": tempSP
				},
				{
					"role": "user",
					"content": curFenJi.content ?? ''
				},
			]
			
		}
			
		state.fenjiList[index].loadingVisible = true
		let requestFn;
		switch(modelInterface){
			case 'doubaoCreateWord': // 6 18 26
				requestFn = doubaoCreateWord
				break;
			case 'geminiCreateWord': // 19
				requestFn = geminiCreateWord
				break;
			case 'aliCreateWord': // 57
				requestFn = aliCreateWord
				break
			default:
				uni.showToast({
					title: '没有可用的分镜模型',
					icon: 'none'
				})
				state.fenjiList[index].loadingVisible = false
				return
		}

		state.createCameraStatus[index] = true;

		requestFn(params, (result) => {
			delete state.createCameraStatus[index];
			// console.log('生成分镜结果=', result)
			let parts = JSON.parse(result)?.choices?.[0].message?.content.split('####');
			parts = parts.map(part => part.trim()).filter(part => part !== '');
			// console.log('分镜列表=', parts)
			state.fenjiList[index].cameras = isNew ? [] : curFenjiCameraList.value		
			const camerasLen = state.fenjiList[index].cameras.length
			var curDate = Date.now()
			for (let i = 0; i < parts.length; i++) {
				const element = parts[i];
				let spParts = element.split('###')
				spParts = spParts.map(part1 => part1.trim()).filter(part1 => part1 !== '');
				var fenjingName = curFenJi.collectId + "_" + curFenJi.fieldId + "_" + (camerasLen + i + 1)
				var tempCameraConfig = newCameraConfig(fenjingName, curDate, i)
				console.log('分镜列表内容=', spParts)
				if (spParts.length > 0) {
					if (spParts.length >= 2) {
						tempCameraConfig.fenjinContent = spParts[1]
					}
					if (spParts.length >= 3) {
						tempCameraConfig.videoContentSP = spParts[2]
					}
					/* if (spParts.length >= 3) {
						tempCameraConfig.fenjinDialog = spParts[2]
					}
					if (spParts.length >= 4) {
						tempCameraConfig.rongtuSP = spParts[3]
					}
					if (spParts.length >= 5) {
						tempCameraConfig.videoContentSP = spParts[4]
					} */
				}
				state.fenjiList[index].cameras.push(tempCameraConfig)
			}
			state.fenjiList[index].loadingVisible = false
			// console.log('分镜列表=', state.fenjiList[index].cameras)
			saveFenji()
			handleSaveCurEpisodes(state.fenjiList[index])
		}, (errormsg) => {
			delete state.createCameraStatus[index];
			uni.showToast({
				title: errormsg,
				icon: 'none'
			})
			state.fenjiList[index].loadingVisible = false
		})
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

	function handleDeleteSelect(item) {
		if (item) {
			uni.showModal({
				title: '删除确认',
				content: `确定要删除第${item.collectId}集${item.fieldId}场吗？`,
				success: function(res) {
					if (res.confirm) {
						deleteProjectEpisodes(item.id, data => {
							uni.showToast({
								title: `删除${item.collectId}集${item.fieldId}场成功`
							})
							state.fenjiList = state.fenjiList.filter(p => p.id != item.id)
						}, () => {

						})
					}
				}
			})
		}
	}

	function selectAllji(isSelect) {
		state.fenjiList.forEach(item => {
			item.isSelect = isSelect
		});
		// saveFenji()
	}

	// 反选
	function handleInverseSelect() {
		state.fenjiList.forEach(item => {
			item.isSelect = item.isSelect == null ? true : !item.isSelect
		})
	}

	// 全选所有资产 (顶部按钮)
	function selectAllAssets(isSelect) {
		state.fenjiList.forEach(item => {
			item.isAssetSelected = isSelect
		});
	}

	function toggleAssetSelectionAll(item) {
		item.isAssetSelected = !item.isAssetSelected
	}

	// 提炼资产
	function handleExtractAssets() {
		var filterList = state.fenjiList.filter(p => p.isAssetSelected)
		if (filterList.length <= 0) {
			uni.showToast({
				title: '没有可提炼的资产,请勾选对应分集资产清单',
				icon: 'none',
				duration: 1500
			})
			return
		}
	}

	// 同步匹配资产
	function handleSyncMatchAssets() {
		var filterList = state.fenjiList.filter(p => p.isAssetSelected)
		if (filterList.length <= 0) {
			uni.showToast({
				title: '没有可同步匹配的资产,请勾选对应分集资产清单',
				icon: 'none',
				duration: 1500
			})
			return
		}
	}

	function readNovel(importType) {
		state.importType = importType
		if ([2, 3].includes(importType)) {
			showImportModal.value = true
			return
		}
		fileContent.value = '';
		// state.importType = importType
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
			console.log("state.importType:" + state.importType)
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
		console.log("读取的文本：", fenjingContent)
		var newfenjiList = splitDramaByEpisode(fenjingContent)
		// console.log(newfenjiList.length)
		// console.log(newfenjiList)

		// 兜底逻辑：如果无法按集分割，但有内容，则整体作为一集
		if (newfenjiList.length === 0 && fenjingContent && fenjingContent.trim().length > 0) {
			newfenjiList = [fenjingContent];
		}

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
					projectId: projectDetails.value.id,
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
		state.curfenjiIndex = index;
		const item = state.fenjiList[index];
		// 保存当前内容作为原始内容
		state.originalContents[item.id] = item.content;
	}

	function fenjingSPInput(e) {
		state.curSelectFenjingSPValue = e.detail.value
	}

	function fenjiInput(e) {
		// state.fenjiList[state.curfenjiIndex].detail = e.detail.value
		// state.fenjiList[state.curfenjiIndex].content = e.detail.value
		// saveFenji()
	}

	function handleFenjiBlur(index,e) {
		state.fenjiList[state.curfenjiIndex].content = e.detail.value;
		saveFenji();
		const item = state.fenjiList[index];
		const originalContent = state.originalContents[item.id];
		// 比对内容是否发生变化
		if (item.content !== originalContent) {
			// 内容发生变化，调用保存函数
			handleSaveCurEpisodes(item,2);
			// 更新原始内容
			state.originalContents[item.id] = item.content;
		}
	}


	let addFenjijubenCallback = null

	// 通用添加分集方法
	// isAfter: true=向后加集，false=向前加集
	// isScene: 是否是属于加场次
	function handleAddEpisode(index, isAfter, isScene = false) {
		var fenjiData = state.fenjiList[index]
		
		if (!isScene) {
			state.importBtnConfirmText = !isAfter ? '向前加一集' : '向后加一集'
		} else {
			state.importBtnConfirmText = !isAfter ? '向前加一场次' : '向后加一场次'
		}

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
						state.scrollTop = state.scrollTop + 1
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
	function handleSaveCurEpisodes(item,type) {
		// console.log("item:", item)
		if(type==2){
			updateStorySp(item, data => {}, () => {})
		}else{
			ModifyProjectEpisodes(item, data => {}, () => {})
		}
	}

	// 勾选/取消勾选资产
	function toggleAssetSelection(item, category, assetIndex) {
		// if (!item.isEditingAssets) return;
		// const asset = item.assets[category][assetIndex];
		// asset.isSelected = !asset.isSelected;

	}

	// 删除资产
	function removeAsset(item, category, assetIndex) {
		uni.showModal({
			title: '提示',
			content: '确定要移除该资产吗？',
			success: function(res) {
				if (res.confirm) {
					item.assets[category].splice(assetIndex, 1);
				}
			}
		});
	}

	// 新增资产
	function addAsset(item, category) {
		openAssetPicker(item, category)
	}

	// 打开资源选择器（替代原来的 addAsset）
	function openAssetPicker(item, category) {
		// 记录当前正在操作哪一集、哪个分类
		state.currentOperateItemIndex = state.fenjiList.indexOf(item);
		state.currentOperateCategory = category;

		const names = {
			roles: '角色',
			scenes: '场景',
			props: '道具'
		};
		state.pickerTitle = `添加${names[category]}`;
		state.showResourcePicker = true;
	}

	function getCategoryColor(category) {
		const colors = {
			roles: 'linear-gradient(0deg, #764BEE, #764BEE), linear-gradient(0deg, #409EFF, #409EFF), #8240FA',
			scenes: 'linear-gradient(0deg, #F78854, #F78854), linear-gradient(0deg, #409EFF, #409EFF), #8240FA',
			props: 'linear-gradient(0deg, #10BC00, #10BC00), linear-gradient(0deg, #409EFF, #409EFF), #8240FA'
		}
		return colors[category] || '#999'
	}

	function getCategoryName(category) {
		const names = {
			roles: '角色',
			scenes: '场景',
			props: '道具'
		}
		return names[category] || '未知'
	}

	function handleAssetHover(asset, isHover, itemIndex = -1) {
		console.log("asset:", asset)
		if (isHover) {
			asset.isHovering = true;
			// 清除隐藏定时器
			if (asset.hideTimer) {
				clearTimeout(asset.hideTimer);
				asset.hideTimer = null;
			}
			// 延迟显示详情弹窗
			if (!asset.showDetailPopup) {
				asset.showTimer = setTimeout(() => {
					// 判断是否是第一行 (第一集的角色和场景)
					// itemIndex 是分集列表的索引
					// 如果是第一集 (index 0) 且不是道具 (道具在第三行一般没事，除非第一行太高)
					// 简单判断：第一集的角色和场景向下显示
					if (itemIndex === 0) {
						asset.isBottomPopup = true;
					} else {
						asset.isBottomPopup = false;
					}
					asset.showDetailPopup = true;
				}, 200); // 缩短显示延迟，提升响应
			}
		} else {
			// asset.isHovering = false; // 不要立即设为 false，否则删除按钮会闪烁消失
			// 清除显示定时器
			if (asset.showTimer) {
				clearTimeout(asset.showTimer);
				asset.showTimer = null;
			}
			// 延迟隐藏详情弹窗，给用户移动鼠标的时间
			asset.hideTimer = setTimeout(() => {
				asset.showDetailPopup = false;
				asset.isHovering = false; // 在这里设为 false
			}, 300); // 300ms 延迟消失
		}
	}

	// 确认选择资源回调
	function handleResourceConfirm(filePaths) {
		if (!filePaths || filePaths.length === 0) return;

		const item = state.fenjiList[state.currentOperateItemIndex];
		const category = state.currentOperateCategory;

		filePaths.forEach(path => {
			// 提取文件名作为默认名称
			const fileName = path.substring(path.lastIndexOf('/') + 1);
			item.assets[category].push({
				id: Date.now() + Math.random(),
				name: fileName,
				coverUrl: path, // 新增：保存图片路径
				// isSelected: true,
				isHovering: false, // 初始化 hover 状态
				showDetailPopup: false // 初始化弹窗显示状态
			});
		});
	}

	// 处理导入逻辑
	function handleImportConfirm(params) {
		const {
			content,
			spId,
			resSpId
		} = params
		/* console.log('剧本内容:', content);
		console.log('选择的分集剧本SP:', spId);
		console.log('选择的资产清单SP:', resSpId); */

		/* var find = state.readResSPlist.find(p => p.value == resSpId)
		console.log("find:", find) */

		//在此处调用分割剧本或生成分镜的逻辑
		showImportModal.value = false;

		if (state.importType == 2) {
			addFenjijuben(content)
		} else if (state.importType == 3) {
			addFenjijubenInCurrentJuben(content)
		}
	}

	function getCreateCameraStatus(){
		return state.createCameraStatus
	}

	defineExpose({
		getCreateCameraStatus
	})
</script>

<style scoped lang="scss">
	@import "episodeScript.css"
</style>