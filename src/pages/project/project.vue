<template>
	<view style="flex-direction: column;display: flex;height: 100%;width: 100%;position: fixed;">
		<view style="flex-direction: row;display: flex;width: 100%;">
			<view style=" display: flex;flex-direction: row;width: 464rpx;height: 112rpx; align-items: center;justify-content: center; background-color: #ffffff;">
				<image src="/static/logo.png" style="width: 56rpx;height: 56rpx;"></image>
				<text style="font-size: 40rpx;margin-left: 12rpx;font-weight: bold;">溯心AI剧</text>
			</view>
			<view style="display:flex;flex-direction: row;align-items: center;justify-content: space-between;background-color: #ffffff;margin-left: 4rpx;flex: 1;">
				<view style=" display: flex;flex-direction: row;width: 464rpx;height: 112rpx;flex: 1; align-items: center;">
					<view style="margin-left: 48rpx;background: #F3F3F3;height: 64rpx;width: 960rpx;border-radius: 16rpx;align-items: center;display: flex;flex-direction: row;">
						<image src="/static/searchicon.png" style="width: 40rpx;height: 40rpx;margin-left: 20rpx;"></image>
						<input @input="searchInput" type="text" placeholder="请输入搜索内容" style="height: 64rpx;width: 800rpx;margin-left: 16rpx;font-size: 28rpx;"/>
					</view>
				</view>
				<text style="font-size: 28rpx;margin-right: 48rpx;">工具版本：{{ state.version }}</text>
				<!-- <button style="height: 36px;line-height: 36px;font-size: 16px;margin-right: 16px;" @click="logout">退出登录</button> -->
			</view>

		</view>
		<view style="flex-direction: row;display: flex;flex:1; height: 0;">
			<view style=" display: flex;flex-direction: column;justify-content: space-between;width: 464rpx;margin-top: 4rpx;">
				<view style="background-color: #ffffff;padding-top: 40rpx;align-items: center;display: flex;flex-direction: column;">
					<block v-for="(item,index) in state.leftTitle" :key="index">
						<button :style="'background:'+(item.type==state.curLeftTitleType?'linear-gradient(90deg, #FFA600 0%, #FFDA3C 100%), #FFAB05':'#ffffff')" 
						@click="onChangeLeftTitle(item.type)" 
						class="leftButton"><image :src="item.icon" style="width: 40rpx;height: 40rpx;margin-right: 16rpx;"></image>{{item.name}}</button>
					</block>
				</view>
				<view style="height: 500rpx;flex: 1;background-color: #ffffff;margin-top: 4rpx;"></view>

				<view style="height: 80rpx; background-color: #ffffff;margin-top: 4rpx;margin-bottom: 4rpx;display: flex;justify-content: center; flex-direction: row;align-items: center;padding-top: 16rpx;padding-bottom: 16rpx;">
					<image src="/static/tiliicon.png" style="width: 40rpx;height: 40rpx;"></image>
					<text style="font-size: 32rpx;margin-left: 12rpx;color: #333333;font-weight: 500;">剩余积分：{{ store.getters.remainingPoints || '-' }}</text>
				</view>

				<view style="background-color: #ffffff;height: 100rpx;display: flex;justify-content: flex-start; flex-direction: row;align-items: center;padding-top: 16rpx;padding-bottom: 30rpx;">
					<image src="/static/normalhead.png" style="width: 64rpx;height: 64rpx;margin-left: 48rpx;border-radius: 50%;"></image>
					<text style="font-size: 32rpx;margin-left: 16rpx;color: #333333;font-weight: 500;">你的名字</text>
				</view>
			</view>
			<view v-if="state.curLeftTitleType==1" class="project-content" style="flex-direction: row;">
				<view style="display: flex;flex-direction: column; width: 100%;flex: 1;">
					<view style="display: flex;flex-direction: row;justify-content: space-between;align-items: center;width: 100%;margin-top: 48rpx;">
						<view>
							<text @click="changeResStatusTab(1)" class="titleText" :style="'margin-top: 0rpx;margin-right: 48rpx;font-weight:'+(state.curStatus==1?'bold;':'500;')+'color:'+(state.curStatus==1?'#333333;':'#999999;')">公共库</text>
							<text @click="changeResStatusTab(0)" class="titleText" :style="'position: relative;margin-top: 0rpx;margin-right: 48rpx;font-weight:'+(state.curStatus==0?'bold;':'500;')+'color:'+(state.curStatus==0?'#333333;':'#999999;')">
								待验收
								<!-- <view style="position: absolute;background: #FF5454;border-radius: 24rpx;right:-50rpx;top:0;display: flex;align-items: center;justify-content: center;padding: 6rpx 12rpx 6rpx 12rpx;font-size: 20rpx;color: #ffffff;">200</view> -->
							</text>
						</view>
						<view style="display: flex;flex-direction: row;margin-right: 32rpx;align-items: center;">
							<view class="timeButton" @click="resorderByCreateTime">创建时间<image src="/static/timeIcon.png" :style="'width: 32rpx;height: 32rpx;margin-left: 12rpx;'+(state.timeSortRes==1?'transform: scale(1,-1);':'')"></image></view>
							<button class="createProButton" @click="openBatchCreateRes" style="margin-right: 24rpx;"><image src="/static/newproIcon.png" style="width: 32rpx;height: 32rpx;margin-right: 12rpx;"></image>批量生成</button>
							<button class="createProButton" @click="addResItem"><image src="/static/newproIcon.png" style="width: 32rpx;height: 32rpx;margin-right: 12rpx;"></image>新建资产</button>
						</view>
					</view>
					<scroll-view style="display: flex;margin-left: 32rpx;white-space: nowrap;overflow: scroll;overflow-y: hidden;overflow-x: auto;margin-top: 40rpx;" scroll-x="true">
						<block  v-for="(item,index) in state.resTypeList" :key="index">
							<view :style="'background:'+(item.id==state.curResType?'#F8BA38;':'#E7E7E7;')+(index==0?'border-radius:16rpx 0 0 16rpx;':'')+(index==state.resTypeList.length-1?'border-radius:0 16rpx 16rpx 0;':'')" 
							@click="onClickResItem(item.id)" class="sp-item"> 
								<view style="display: flex;justify-content: center;align-items: center;width: 100%;height: 100%;">
									{{item.treeName}}
								</view>
							</view>
						</block>
					</scroll-view>

					<scroll-view style="display: flex;margin: 12rpx 0px;flex: 1;width: 100%; height: 0;" :scroll-y="true">
						<block v-for="(item,index) in state.curResList" :key="index">
							<view class="resItem" @click="onClickSelectRes(item)" 
							:style="'border: 4rpx solid '+(item.id==state.curResItemId?'#FCC34A;':'#FFFFFF;')+'background:'
							+(item.id==state.curResItemId?'#FFE3AF;':'#FFFFFF;')">
								<image style="width: 320rpx;height: 320rpx;margin-top: 12rpx;border-radius: 16rpx;" mode="aspectFit" :src="item.url" />
								<view style="display: flex;flex-direction: row;align-items: flex-end;width: 100%;justify-content: space-between;">
									<view style="display: flex;flex-direction: column;margin-left: 12rpx;width: 100%;">
										<view style="width: 100%;white-space: nowrap; overflow: hidden;text-overflow: ellipsis;">
											<text style="font-size: 32rpx;font-weight: 500;color: #333333;">{{ item.name }}</text>
										</view>
										<text style="font-size: 24rpx;color: #666666;">新增于{{item.createTime}}</text>
									</view>
									<image src="/static/normalhead.png" style="width: 48rpx;height: 48rpx;margin-right: 12rpx;border-radius: 50%;"></image>
								</view>
							</view>
						</block>
					</scroll-view>
				</view>

				<resourceDetail v-if="state.cureResItem?.id" :data="state.cureResItem" :typeMap="state.resTypeList" :createImageConfig="state.createImageConfig" :editable="true"
					@updated="() => { updateResourceList(state.curResType);}"
					@deleted="() => { updateResourceList(state.curResType); state.cureResItem = {}; }" />

				<!-- <view v-if="Object.keys(state.cureResItem).length!=0" style="width: 640rpx;background: #FFFFFF;height: 100%; margin-top: 4rpx;align-items: center;display: flex;flex-direction: column;padding-left: 40rpx;padding-right: 40rpx;">
					<view style="display: flex;flex-direction: row;justify-content: space-between;align-items: center;margin-top: 40rpx;width: 100%;">
						<text style="font-size: 32rpx;font-weight: bold;color: #FFA701;">资产详情</text>
						<view style="display: flex;flex-direction: row;">
							<view @click="deleteRes(state.curResItemId)" style="height: 64rpx;width: 128rpx;display: flex;justify-content: center;align-items: center;font-size: 28rpx;font-weight: 500;color: #333333;
							 border: 2rpx solid #FF5757;border-radius: 16rpx;margin-right: 16rpx;">删除</view>
							<view @click="saveRes(state.curResItemId)" style="height: 64rpx;width: 128rpx;display: flex;justify-content: center;font-size: 28rpx;font-weight: 500;color: #333333;
							align-items: center;background: linear-gradient(90deg, #FFA600 0%, #FFDA3C 100%), linear-gradient(90deg, #F8BA38 0%, #FFCA5A 100%);border-radius: 16rpx;">保存</view>
						</view>
					</view>
					<view style="width: 640rpx;height: 360rpx;background: linear-gradient(0deg, #F7F7F7, #F7F7F7), rgba(0, 0, 0, 0.2);
					margin-top: 32rpx;border-radius: 16rpx 16rpx 0px 0px;position: relative;display: flex;justify-content: center; align-items: center;">
						<image @click="fullScreen" style="width: 276rpx;height: 100%;" mode="aspectFit" :src="state.cureResItem.url" />
						<view @click="fullScreen" class="fullButton">全屏</view>
					</view>
					<view style="width: 640rpx;height: 64rpx;background: linear-gradient(0deg, #E7E7E7, #E7E7E7), rgba(0, 0, 0, 0.2);border-radius: 0px 0px 16px 16px;display: flex;align-items: center;">
						<text style="font-size: 32rpx;font-weight: 500;color: #333333;margin-left: 16rpx;">{{ state.cureResItem.name }}</text>
					</view>
					<view style="width: 640rpx;height: 64rpx;background: linear-gradient(0deg, #E7E7E7, #E7E7E7), #F7F7F7;border-radius: 16rpx;margin-top: 16rpx;display: flex;align-items: center;">
						<text style="font-size: 32rpx;font-weight: 500;color: #333333;margin-left: 16rpx;">配音：</text>
					</view>
					<view style="display: flex;flex-direction: row;justify-content: space-between;align-items: center;margin-top: 32rpx;">
						<button class="resOpButton" style="border-radius: 16rpx 0px 0px 16rpx; ">SP图片生成</button>
						<button class="resOpButton" style="border-radius: 0px 0rpx 0 0px;">公共库挑选</button>
						<button class="resOpButton" style="border-radius: 0px 16rpx 16rpx 0px;">上传图片</button>
					</view>
					<view style="display: flex;flex-direction: row;align-items: center;justify-content: flex-start;width: 100%;margin-top: 16rpx;">
						<image src="/static/proDetaiIcon.png" style="width: 32rpx;height: 32rpx;margin-right: 12rpx;"></image>
						<text style="font-size: 32rpx;font-weight: 500; color: #333333;">资产SP描述</text>
					</view>
					<textarea style="width: 592rpx;height: 240rpx;font-size: 28rpx;margin-top: 12rpx;border-radius: 16rpx;background: #F7F7F7;padding: 24rpx;" placeholder="请输入资产SP描述"></textarea>
					<view style="display: flex;flex-direction: row;align-items: center;justify-content: flex-start;width: 100%;margin-top: 16rpx;">
						<text style="font-size: 32rpx;font-weight: 500; color: #333333;">其他形象</text>
					</view>
					<view style="display: flex;margin-top: 16rpx;width: 100%; height: 300rpx; flex: 1;">
						<scroll-view style="display: flex;width: 100%;height: 85%;" :scroll-y="true">
							<block v-for="(item,index) in state.curResList" :key="index">
								<view class="detalResItem">
									<image style="width: 100%;height: 100%;border-radius: 16rpx;" mode="aspectFit" :src="item.url" />
									<image style="width: 40rpx;height: 40rpx;position: absolute;top: 0rpx;left: 0rpx;" mode="aspectFit" src="/static/sel_icon.png" />
								</view>
							</block>
						</scroll-view>
					</view>

				</view> -->
			</view>
			<view v-if="state.curLeftTitleType==2" class="project-content">
				<text class="titleText">我的项目</text>
				<view style="display: flex;flex-direction: row;justify-content: space-between;align-items: center;">
					<view style="margin-top: 40rpx;display: flex;flex-direction: row;">
						<view :style="'background:'+(state.curProjectStatusType==0?'#F8BA38':'#E7E7E7')" @click="onChangeProjectStatus(0)" class="statusButton">进行中</view>
						<view :style="'background:'+(state.curProjectStatusType==1?'#F8BA38':'#E7E7E7')" @click="onChangeProjectStatus(1)" class="statusButton1">已完成</view>
					</view>
					<view style="display: flex;flex-direction: row;margin-right: 32rpx;align-items: center;">
						<view class="timeButton" @click="orderByCreateTime">创建时间<image src="/static/timeIcon.png" :style="'width: 32rpx;height: 32rpx;margin-left: 12rpx;'+(state.timeSort==1?'transform: scale(1,-1);':'')"></image></view>
						<button class="createProButton" @click="openNewProject"><image src="/static/newproIcon.png" style="width: 32rpx;height: 32rpx;margin-right: 12rpx;"></image>新建项目</button>
					</view>
				</view>
				<scroll-view style="display: flex;margin: 12rpx 0px;flex: 1;width: 100%; height: 0;" :scroll-y="true">
					<block v-for="(item,index) in state.curProjectList" :key="index">
						<view @click="gotoCameraPage(item)" class="projectItem">
							<view class="deleteIcon">
								<image src="/static/tag_shanchu.png" style="width: 100%;height: 100%;" @click.stop="handleDeleteProject(item)" mode="widthFix"></image>
							</view>
							<view style="width: 384rpx;height: 512rpx;position: relative;border-radius: 16rpx;overflow: hidden;">
								<image style="width: 384rpx;height: 512rpx;margin-top: 12rpx; border-radius: 16rpx;" mode="aspectFill"  :src="item.url" />
								<view style="width: 100%;height: 80rpx;position: absolute;align-items: center; bottom: 0;left: 0;background: linear-gradient(180deg, rgba(0, 0, 0, 0) 0%, #000000 100%);display: flex;justify-content: flex-end;">
									<text style="font-size: 32rpx;font-weight: 500;color: #ffffff;margin-right: 24rpx;">{{item.episodeNum}}集{{item.cameraNum}}镜</text>
								</view>
							</view>
							<view style="width: 100%;display: flex;flex-direction: column;margin-top: 12rpx;">
								<text style="font-size: 32rpx;color: #333333;font-weight: 500;margin-left: 24rpx;">{{item.name}}</text>
								<text style="font-size: 24rpx;color: #666666;margin-left: 24rpx;">创建于{{item.createTime }}</text>
							</view>
						</view>
					</block>
				</scroll-view>
			</view>
			<SkillManagement v-if="state.curLeftTitleType==4" />
		</view>
	</view>
	<createProject v-if="state.isOpenCreateProject"  @close="closeCreateProject" @createSucceed="createSucceed"></createProject>
	<createOReditorRes v-if="state.isOpenEditorRes" :newResConfig="state.newResConfig" :isNewRes="state.isNewRes"
	 @close="closeEditorRes" @saveSucceed="saveEditorResSucceed"></createOReditorRes>
	<batchCreateRes v-if="state.isOpenBatchCreateRes"
	 @close="closeBatchCreateRes" @saveSucceed="saveEditorResSucceed"></batchCreateRes>
</template>

<script setup>
	import { onLoad } from "@dcloudio/uni-app";
    import {ref, nextTick,onMounted,reactive, onUnmounted} from "vue";
	import { DeleteResource, GetResourceStatusList, GetResourceTypeList,EditorResource } from "../../common/ResourceMgr";
	import createProject from "../../components/createProject.vue";
	import createOReditorRes from "../../components/createOReditorRes.vue";
	import batchCreateRes from "../../components/batchCreateRes.vue";
	import resourceDetail from "@/components/resourceDetail/resourceDetail.vue";
	import { GetProjectList,DeleteeProject } from "../../common/ProjectMgr";
	import { isNull } from "../../common/Tool";
	import app from "@/App.vue";
	import { useStore } from "vuex";
	import SkillManagement from "@/components/SkillManagement.vue";
	const store = useStore();
	const _app = app;
	const state=reactive({
		version:_app.globalData.version,
		leftTitle:[
			{name:"公共库",type:1,icon:"/static/publicIcon.png"},
			{name:"新建项目",type:3,icon:"/static/newProject.png"},
			{name:"我的项目",type:2,icon:"/static/proNameIcon.png"},
			{name:"SKILL管理",type:4,icon:"/static/publicIcon.png"}
		],
		curLeftTitleType:2,
		curProjectStatusType:0,
		curProjectList:[],

		curResType:1,
		resTypeList:[],
        curResList:[],
		newResConfig:{
			id:0,
			type:1,
			title:'',
			imageUrl:"",
			detail:'',
			projectId:0,
			episodesId:0,
		},
		isNewRes:false,
		isOpenEditorRes:false,
		isOpenBatchCreateRes:false,
		isOpenCreateProject:false,
		timeSort:0,
		timeSortRes:0,
		curResItemId:0,
		cureResItem:{},
		curStatus:1,

		createImageConfig:{
			promptSp:'',
			defaultModel:'13',
		}
	})

	onLoad((options)=>{
		if(options.tabindex){
			state.curLeftTitleType=parseInt(options.tabindex)
		}

		GetResourceTypeList(25,(resTypeList)=>{
			state.resTypeList=[]
			for (let index = 0; index < resTypeList.length; index++) {
				const element = resTypeList[index];
				if(element.id==2 || element.id==4 || element.id==3){
					state.resTypeList.push(element)
				}
			}
			// state.resTypeList=resTypeList
			if(resTypeList.length>0){
				state.curResType=resTypeList[0].id
				updateResourceList(state.curResType)
			}
		})
		updateProjectList()
	})

	function logout(){
		uni.showModal({
			title:'提示',
			content:'确定退出登录？',
			success:(res)=>{
				if(res.confirm){					
					store.commit('logout')
					uni.reLaunch({
						url: '/pages/login/login',
					})
				}
			}
		})	
	}

	function searchInput(e){
		var searchText=e.detail.value
		if(state.curLeftTitleType==1){
		}
		else if(state.curLeftTitleType==2){
			// state.curProjectList=searchByNameFuzzyIgnoreCase(state.curProjectList,searchText)
		}
	}
	function searchByNameFuzzyIgnoreCase(list, keyword) {
		const lowerKeyword = keyword.toLowerCase();
		return list.filter(item => 
			item.name.toLowerCase().includes(lowerKeyword)
		);
	}

	function onClickSelectRes(item){
		state.cureResItem=item
		state.curResItemId=item.id
		editorRes(item)
	}

	function fullScreen() {
		uni.previewImage({
				urls: [state.cureResItem.url],
				current: state.cureResItem.url
			})
	}

	function createSucceed(){
		state.isOpenCreateProject=false
		updateProjectList()
	}

	function updateProjectList(){
		GetProjectList(1,10000,state.curProjectStatusType,(projectList)=>{
			state.curProjectList=projectList
			for (let index = 0; index < state.curProjectList.length; index++) {
				const element = state.curProjectList[index];
				if(isNull(element.url)){
					element.url="/static/normalbg.png"
				}
			}
		})
	}

	function resorderByCreateTime(params) {
		state.timeSortRes=state.timeSortRes==0?1:0
		if(state.timeSortRes==1){
			state.curResList.sort((a, b) => {
				return new Date(b.createTime) - new Date(a.createTime);
			})
		}
		else{
			state.curResList.sort((a, b) => {
				return new Date(a.createTime) - new Date(b.createTime);
			})
		}
	}

	function orderByCreateTime() {
		state.timeSort=state.timeSort==0?1:0
		if(state.timeSort==1){
			state.curProjectList.sort((a, b) => {
				return new Date(b.createTime) - new Date(a.createTime);
			})
		}
		else{
			state.curProjectList.sort((a, b) => {
				return new Date(a.createTime) - new Date(b.createTime);
			})
		}
	}

	function openNewProject(){
		state.isOpenCreateProject=true
	}

	function closeCreateProject(){
		state.isOpenCreateProject=false
	}

	function onChangeLeftTitle(type){
		
		if(type==3){
			openNewProject()
		}
		else{
			state.curLeftTitleType=type
		}
	}

	function onChangeProjectStatus(type){
		state.curProjectStatusType=type
		updateProjectList()
	}

	function gotoCameraPage(item){
		_app.globalData.tempPageData=item
		uni.setStorageSync('currentProjectInfo',item)
		uni.navigateTo({
			url: '/pages/cameraContent/cameraContent',
			fail: (err) => {
				console.log(err)
			}
		})
	}

	function saveEditorResSucceed(){
		updateResourceList(state.curResType)
		state.isOpenEditorRes=false
	}
	 function openBatchCreateRes(){
		state.isOpenBatchCreateRes=true
	}

	function closeBatchCreateRes(){
		state.isOpenBatchCreateRes=false
	}

	function addResItem(){
		state.isOpenEditorRes=true
		state.isNewRes=true
		state.newResConfig={
			id:0,
			type:state.curResType,
			title:'',
			imageUrl:"",
			detail:'',
			projectId:0,
			episodesId:0,
		}
	}

	function editorRes(item){
		state.newResConfig={
			id:item.id,
			type:item.typeId,
			title:item.name,
			imageUrl:item.url,
			detail:item.content,
			projectId:item.projectId,
			episodesId:item.episodesId,
		}
	}

	function handleDeleteProject(item){	
		console.log(item)
		uni.showModal({
			title: '删除确认',
			content: `确定删除项目“${item.name}”吗？`,
			success: (res) => {
				if (res.confirm) {
					DeleteeProject(item.id,(res)=>{
						updateProjectList()
					})
				}
			}
		})
	}

	function deleteRes(id){
		uni.showModal({
			title: '确认删除',
			content: '确定删除该资源吗？',
			success: (res) => {
				if (res.confirm) {
					DeleteResource([id],(res)=>{
						updateResourceList(state.curResType)
					})
				}
			}
		})
	}

	function saveRes() {
		var config={
				id:state.newResConfig.id,
				typeId:state.newResConfig.type,
				name:state.newResConfig.title,
				url:state.newResConfig.imageUrl,
				content:state.newResConfig.detail,
				projectId:state.newResConfig.projectId,
				episodesId:state.newResConfig.episodesId,
			}
		EditorResource(config,(resData)=>{
			updateResourceList(state.curResType)
			uni.showToast({
				title: '保存成功',
				icon: 'success',
				duration: 2000
			})
		})
	}

	function closeEditorRes(){
		state.isOpenEditorRes=false
	}

	function onClickResItem(type){
		state.curResType=type
		updateResourceList(type)
	}

	function changeResStatusTab(status){
		state.curStatus=status
		updateResourceList(state.curResType)
	}

	function updateResourceList(type){
		GetResourceStatusList(1,10000,type,state.curStatus,(resList)=>{
			var findList=resList.filter(item=>item.typeId==state.curResType)??[]
			var publicRes=findList.filter(item=>item.projectId==0)??[]
			state.curResList=publicRes
		})
	}

	onMounted(() => {
	});

	onUnmounted(() => {
	});

</script>

<style scoped lang="scss">
	@import "project.css"
</style>
