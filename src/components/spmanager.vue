<template>
	<view class="mark" style="z-index: 99;">
		<view class="mainContent">			
			<view class="headerTitle">SP提示词库管理</view>
			<view class="icon-close-popup" @click="closeSPManager"></view>
			<!-- <view class="tabs">
				<view :class="['item', { 'active': item.type == state.curTabType }]"
					v-for="(item, index) in state.tabList" :key="index" @click="onClickTabItem(item.type)">{{ item.name
					}}</view>
			</view> -->
			<!-- <view class="tabs" style="margin-top: 16px;">
				<view :class="['item', { 'active': item.type == state.curSPType }]"
					v-for="(item, index) in state.spList" :key="index" @click="onClickspItem(item.type)">{{ item.name }}
				</view>
			</view> -->
			<view class="tabs" style="margin-top: 16px;">
				<view :class="['item', { 'active': item.type == state.curSPType }]"
					v-for="(item, index) in state.sptabList" :key="index" @click="onClickspItem(item.type)">{{ item.name }}
				</view>
			</view>
			<view class="content">
				<scroll-view class="aside" scroll-y>
					<view :class="['item', { 'active': index == state.curEditorIndex }]"
						v-for="(item, index) in state.curSPContents" :key="index" @click="onClickEditorSPItem(index)">{{
							item.title }}</view>
				</scroll-view>
				<view class="rightContent">
					<view class="head">
						<input class="uni-input inputWrapper" style="width: 480px;color: #333333;" @input="spTitleInput"
							:value="state.curSpTitle" maxlength="100" placeholder-style="color: #999;"
							placeholder="请输入SP名称" :disabled="!editable" />
						<view style="display: flex;" v-if="editable">
							<view class="actionBtn danger" @click="deleteSPItem">删除</view>
							<view class="actionBtn primary" @click="saveSPConfig">保存</view>
							<view class="actionBtn light" @click="addSPItem">新增</view>
						</view>
					</view>
					<view class="inputWrapper uni-input" style="margin-top: 12px;flex: 1;padding: 16px;">
						<textarea class="uni-input" style="width: 100%;height: 100%;" :style="{color:!editable&&state.curSPType!=27 ? '#FF5757' : '#333333'}" :value="!editable&&state.curSPType!=27 ?'*该智能体提示词仅调用且不可编辑': state.curSpContent "
							:maxlength="-1" @input="spContentInput" placeholder-style="color: #999;"
							placeholder="请输入内容" :disabled="!editable"></textarea>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script setup>
import { defineProps, defineEmits, reactive, onMounted, computed } from 'vue'
import { useStore } from 'vuex';
import { AddNewResource, EditorResource, GetResourceList, GetResourceTypeList,DeleteResource} from '../common/ResourceMgr'
const emit = defineEmits(['close']);
const store = useStore()

const props = defineProps({
	parentId: {
		type: Number,
		default: 5
	}
})

const state = reactive({
	tabList: [{ name: '小说', type: 20 }, { name: '故事板', type: 5 }],
	curTabType: 20,
	spList: [],
	curSPType: 24,
	curSPContents: [],
	curEditorIndex: 0,
	curSpTitle: '',
	curSpContent: '',
    sptabList: [{ name: '故事板', type: 24 },{name: '生图画风', type: 9 },{name: '生视频画风', type: 31 },{name: '生图预设', type: 27 },{name: '分镜Agent', type: 29 },{name: '分镜深化风格', type: 30 }],

	updated: [], // 新增或变更保存后增加父类typeid，关闭弹窗时传入值，父组件更新全局的项目设置SP
	
})

const editable = computed(()=>!store.getters.roles.includes('demo_personal'))

function closeSPManager() {
	CheckSaveStatus(() => {
		emit('close', {updated: state.updated})
	})
}

function CheckSaveStatus(callback) {
	var isTip = false
	for (let index = 0; index < state.curSPContents.length; index++) {
		const element = state.curSPContents[index];
		if (element.isNew || element.isChange) {
			isTip = true
			break
		}
	}
	if (isTip) {
		uni.showModal({
			title: '提示',
			content: '当前修改没有保存,是否保存？',
			confirmText: '保存',
			cancelText: '不保存',
			success: (res) => {
				if (res.confirm) {
					saveSPConfig()
				}
				if (callback) {
					callback()
				}
			}
		})
	}
	else {
		if (callback) {
			callback()
		}

	}
}

function onClickTabItem(type) {
	state.curTabType = type
	CheckSaveStatus(() => {
		ChangeSPTab(state.curTabType)
	})
}

function deleteSPItem() {
	const data = state.curSPContents[state.curEditorIndex];
	const index = state.curEditorIndex;
	uni.showModal({
		title: '确认删除',
		content: `确定删除”${data.title}“吗？`,
		success: (res) => {
			if (res.confirm) {
				state.curEditorIndex = null;
				state.curSpTitle = '';
				state.curSpContent = '';
				
				if (data.isNew) {
					state.curSPContents.splice(index, 1)
				}
				else {
					DeleteResource([data.id], (res) => {
						state.curSPContents.splice(index, 1)
						for (var i = 0; i < state.spList.length; i++) {
							if (state.spList[i].type == state.curSPType) {
								state.spList[i].contents.splice(index, 1)
								break
							}
						}
					})
				}
			}
		}
	})
}
function addSPItem() {
	var spitem = {
		id: 0, title:'请输入标题', content:'', isNew: true, isChange: true
	}
	state.curSPContents.push(spitem)
	onClickEditorSPItem(state.curSPContents.length-1)
}
function onClickspItem(type) {
	CheckSaveStatus(() => {
		state.curSPType = type
		// var findContents = state.spList.find(item => item.type == type).contents ?? []
		// state.curSPContents = []
		// for (let i = 0; i < findContents.length; i++) {
		// 	state.curSPContents.push({ ...findContents[i] })
		// }
		//onClickEditorSPItem(0)
		state.curEditorIndex=0
		updateSPManager(() => {
		})
	})
}

function onClickEditorSPItem(index) {
	state.curEditorIndexData = state.curSPContents[index]
	state.curEditorIndex = index
	if (state.curSPContents.length <= 0) {
		state.curSpTitle = ''
		state.curSpContent = ''
		return
	}
	state.curSpTitle = state.curSPContents[index].title ?? ''
	state.curSpContent = state.curSPContents[index].content ?? ''
}
function spTitleInput(e) {
	if(state.curSPContents.length>0){
		state.curSPContents[state.curEditorIndex].title = e.detail.value
		state.curSPContents[state.curEditorIndex].isChange = true
	}else{
		state.form.title = e.detail.value
	}
}

function spContentInput(e) {
	if(state.curSPContents.length>0){
		state.curSPContents[state.curEditorIndex].content = e.detail.value
		state.curSPContents[state.curEditorIndex].isChange = true
	}else{
		state.form.content = e.detail.value
	}
}

function saveSPConfig() {
	for (let index = 0; index < state.curSPContents.length; index++) {
		const element = state.curSPContents[index];
		//console.log('SP配置==',element)
		if (element.isNew) {
			var config = {
				typeId: state.curSPType,
				name: element.title,
				content: element.content,
			}
			AddNewResource(config, (resData) => {
				!state.updated.includes(state.curSPType) && state.updated.push(state.curSPType)
				updateSPManager(() => {
				})
				uni.showToast({
					title: '保存成功',
					icon: 'success',
					duration: 2000
				})
			})
		}
		else {
			if (element.isChange) {
				var config = {
					id: element.id,
					typeId: state.curSPType,
					name: element.title,
					content: element.content,
				}
				EditorResource(config, (resData) => {
					!state.updated.includes(state.curSPType) && state.updated.push(state.curSPType)
					updateSPManager(() => {
					})
					uni.showToast({
						title: '保存成功',
						icon: 'success',
						duration: 2000
					})
				})
			}else{
				uni.showToast({
					title: '当前内容未变更',
					icon: 'none',
					duration: 2000
				})
			}
		}
	}
}
function updateSPManager(callback) {
	GetResourceList(1, 10000, state.curSPType, (resList) => {
		// for (let index = 0; index < state.spList.length; index++) {
		// 	const element = state.spList[index];
		// 	var typeList = resList.filter(item => item.typeId == element.type)
		// 	var tempContents = []
		// 	for (let i = 0; i < typeList.length; i++) {
		// 		var spitem = {
		// 			id: typeList[i].id, title: typeList[i].name, content: typeList[i].content, isNew: false, isChange: false
		// 		}
		// 		tempContents.push(spitem)
		// 	}
		// 	element.contents = tempContents
		// }
		// var findContents = state.spList.find(item => item.type == state.curSPType).contents ?? []
		// state.curSPContents = []
		// for (let i = 0; i < findContents.length; i++) {
		// 	state.curSPContents.push({ ...findContents[i] })
		// }

		state.curSPContents = []
		for (let i = 0; i < resList.length; i++) {
			const element = resList[i];
			var spitem = {
				id: element.id, title: element.name, content: element.content, isNew: false, isChange: false
			}
			state.curSPContents.push(spitem)
		}
		onClickEditorSPItem(state.curEditorIndex)
	})
}

function ChangeSPTab(parentId) {
	state.spList = []
	GetResourceTypeList(parentId, (resTypes) => {
		GetResourceList(1, 1000, parentId, (resList) => {
			for (let index = 0; index < resTypes.length; index++) {
				const element = resTypes[index];
				var typeList = resList.filter(item => item.typeId == element.id)
				var tempContents = []
				for (let i = 0; i < typeList.length; i++) {
					var spitem = {
						id: typeList[i].id, title: typeList[i].name, content: typeList[i].content, isNew: false, isChange: false
					}
					tempContents.push(spitem)
				}

				var spItem = {
					name: element.treeName,
					type: element.id,
					contents: tempContents,
				}
				state.spList.push(spItem)
				if (index == 0) {
					state.curSPType = element.id
				}
			}
			var findContents = state.spList.find(item => item.type == state.curSPType).contents ?? []
			// state.curSPContents=[...findContents]
			state.curSPContents = []
			for (let i = 0; i < findContents.length; i++) {
				state.curSPContents.push({ ...findContents[i] })
			}
			if (state.curEditorIndex >= state.curSPContents.length || state.curEditorIndex < 0) {
				state.curEditorIndex = 0
			}
			onClickEditorSPItem(state.curEditorIndex)
		})
	})
}

onMounted(() => {
	state.spList = []
	// ChangeSPTab(props.parentId)
	updateSPManager(() => {
	})
})

defineExpose({
	updateSPManager
})

</script>

<style scoped lang="scss">
.uni-input {
	color: #999;
}

.inputWrapper {
	border-radius: 8px;
	padding: 8px;
	background-color: #fff;
}

.mark {
	position: fixed;
	width: 100vw;
	height: 100vh;
	top: 0;
	background-color: rgba(0, 0, 0, 0.6);
	display: flex;
	align-items: center;
	flex-direction: column;
	justify-content: flex-start;
	z-index: 105;
}

.mainContent {
	width: 90vw;
	height: 90vh;
	background-color: #fff;
	border-radius: 12px;
	margin-top: 2.5vh;
	padding: 24px 30px;
	position: relative;
	display: flex;
	flex-direction: column;

	.headerTitle {
		font-size: 30px;
		color: #333;
		font-weight: bold;
		flex-shrink: 0;
		height: 44px;
	}

	.content {
		display: flex;
		flex: 1;
		min-height: 0;
		margin-top: 16px;
	}
}

.tabs {
	border-radius: 8px;
	display: flex;
	overflow-x: auto;
	height: 40px;
	flex-shrink: 0;

	.item {
		width: 144px;
		height: 40px;
		line-height: 40px;
		text-align: center;
		background-color: #E7E7E7;
		cursor: pointer;
		color: #666666;

		&:first-child {
			border-radius: 8px 0px 0px 8px;
		}

		&:last-child {
			border-radius: 0px 8px 8px 0px;
		}

		&.active {
			background-color: #2A2A2A;
			color: #fff;
			border-radius: 8px;
		}
	}
}

.rightContent {
	background-color: #F7F7F7;
	flex: 1;
	display: flex;
	flex-direction: column;
	padding: 24px;
	border-radius: 0 12px 12px 0;
	min-width: 0;

	.head {
		display: flex;
		justify-content: space-between;

		.actionBtn {
			font-size: 14px;
			font-weight: 500;
			line-height: 40px;
			height: 40px;
			width: 140px;
			color: #fff;
			background-color: #E7E7E7;
			color: #333;
			border-radius: 8px;
			text-align: center;
			cursor: pointer;
			margin-right: 8px;

			&:last-child {
				margin-right: 0px;
			}

			&.primary {
				background-color: #2A2A2A;
				color: #fff;
			}

			&.danger {
				color: rgba(255, 69, 0, 1);
				border: 1px solid rgba(255, 69, 0, 1);
				background-color: transparent;
			}

			&.light {
				background-color: #FFDC00;
				color: #2A2A2A;
			}
		}
	}
}

.aside {
	width: 200px;
	border-radius: 12px 0px 0px 12px;
	background-color: #E7E7E7;
	padding: 24px 8px;
	flex-shrink: 0;

	.item {
		width: 184px;
		height: 40px;
		line-height: 40px;
		border-radius: 8px;
		color: #333;
		font-weight: 500;
		margin-bottom: 16px;
		text-align: center;
		color: #2A2A2A;

		&:last-child {
			margin-bottom: 0px;
		}

		&.active {
			background-color: #2A2A2A;
			color: #fff;
		}
	}
}

.sp-item {
	display: inline-block;
	margin-left: 24rpx;
}

.spItemNormal {
	display: flex;
	flex-direction: row;
	justify-content: space-between;
	align-items: center;
	width: 98%;
	background-color: burlywood;
	border: 4rpx solid #000000;
	margin-top: 24rpx;
}

.spItemSelected {
	display: flex;
	flex-direction: row;
	justify-content: space-between;
	align-items: center;
	width: 98%;
	background-color: rgb(49, 151, 235);
	border: 4rpx solid #000000;
	margin-top: 24rpx;
}

.sp-input {
	overflow: hidden;
	background: #ffffff;
	padding-left: 16rpx;
	border: 6rpx solid #8240FA;
}
</style>