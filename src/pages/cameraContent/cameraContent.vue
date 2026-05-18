<template>
	<view style="flex-direction: column;display: flex;width: 100%;overflow: hidden;height: 100%;background: #E7E7E7;">
		<view style="flex-direction: column;display: flex;height: 112rpx;display: flex;align-items: flex-start;justify-content: center;width: 100%;background: #ffffff;">
			<view style="flex-direction: row;display: flex;align-items: center;justify-content: space-between;width: 100%;">
				<view style="display: flex;flex-direction: row;justify-content: center;align-items: center;margin-left: 48rpx;">
					<image @click="gotoProjectPage()" style="width: 56rpx;height: 56rpx;margin-right: 16rpx;" src="/static/projecticon.png" mode="aspectFit"></image>
					<text @click="gotoProjectPage()" style="color: #333333;font-size: 48rpx;font-weight: 500;white-space: nowrap;text-overflow: ellipsis; overflow: hidden;display: inline-block;max-width: 360rpx;">
						{{state.projectConfig.name }}</text>
					<!-- <image style="width: 32rpx;height: 32rpx;margin-left: 16rpx;" src="/static/proDetaiIcon.png" mode="aspectFit"></image> -->
					<!-- <view style="margin-left: 16rpx;">已有{{state.projectConfig.episodeNum}}集剧本</view> -->
					 <view style="width: 480rpx;border-radius: 32rpx;height: 64rpx;background: #F3F3F3;border: 4rpx solid #E7E7E7;margin-left: 32rpx;display: flex;flex-direction: row;justify-content: space-between;align-items: center;">
						<text style="font-size: 28rpx;font-weight: 500;margin-left: 20rpx;">已完成/队列中：{{state.curFinishTask}}/{{state.queueTask}}</text>
						<view @click="cancelTask()" style="width: 128rpx;height: 60rpx;border-radius: 32rpx;background: #FF5757;display: flex;justify-content: center;align-items: center;">
							<text style="font-size: 28rpx;font-weight: 500;color: #ffffff;">撤销</text>
						</view>
					 </view>
				</view>
				<view style="flex-direction: row;display: flex;align-items: center;border-radius: 16rpx;overflow: hidden;">
					<block  v-for="(item,index) in state.titleList" :key="index">
						<view :style="'background:'+(item.type==state.tabType?'#F8BA38;':'#E7E7E7;')+'color:'+(item.type==state.tabType?'#333333;':'#666666;')" @click="onClickTabItem(item.type)" class="sp-item">{{item.name}}</view>
					</block>
				</view>
				<view style="flex-direction: row;display: flex;align-items: center;margin-right: 48rpx;">
					<button class="mgrButton" @click="state.showComputingPower = true">算力详情</button>
					<button class="mgrButton" style="margin-left: 16rpx;" @click="openSpManager">SP管理</button>
					<button class="mgrButton" style="margin-left: 16rpx;" @click="openProjectSetting">项目设置</button>
					<view style="border: 2rpx solid #E7E7E7;height: 64rpx;margin-left: 32rpx; display: flex;flex-direction: row;justify-content: flex-start;align-items: center;border-radius: 32rpx;">
						<image style="width: 48rpx;height: 48rpx;margin-left: 16rpx;border-radius: 50%;" src="/static/user.png" mode="aspectFit"></image>
						<image style="width: 40rpx;height: 40rpx;margin-left: 16rpx;" src="/static/tiliicon.png" mode="aspectFit"></image>
						<text style="font-size: 28rpx;font-weight: 500;color: #666666;margin-right: 16rpx;">99999999</text>
					</view>
					<!-- <button style="height: 36px;line-height: 36px;font-size: 16px;margin-left: 16px;" @click="logout">退出登录</button> -->
				</view>
			</view>
		</view>

		<episodeScript ref="episodeScriptRef" v-if="state.tabType==2" :projectConfig="state.projectConfig" @updateProjectSetting="updateProjectSetting"></episodeScript>
		<resourceCom ref="resourceRef" v-if="state.tabType==3" :projectConfig="state.projectConfig"></resourceCom>
		<story v-if="state.tabType==4" ref="storyRef" :projectConfig="state.projectConfig" @cancelTaskQueueSucceed="CheckTask"></story>
		<PopupComputingPower 
			:show="state.showComputingPower"
			@onClose="state.showComputingPower = false"
		/>
	</view>
	<PopupProjectSetting
		v-if="state.projectSettingPopupShow"
		:data="state.projectConfig"
		@onClose="closeProjectSetting" 
		@onUpdated="(data)=>{
			state.projectConfig=Object.assign(state.projectConfig,data)
		}" 
		@onDelete="()=>{
			uni.redirectTo({
				url: '/pages/project/project'
			})
		}">
	</PopupProjectSetting>
	<spmanager :parentId="20" v-if="state.isOpenSPmanager" @close="closeSPManager"></spmanager>

</template>

<script setup>
	import { onHide, onLoad, onShow, onUnload } from '@dcloudio/uni-app';
    import {ref, nextTick,onMounted,reactive, onUnmounted} from "vue";
	import spmanager from '../../components/spmanager.vue'
	import novel from '../../components/novel.vue'
	// import scriptCom from '@/components/script/script.vue'
	import story from '../../components/index/index.vue'
    import resourceCom from '../../components/resource.vue'
	import app from "@/App.vue";
	import { useStore } from "vuex";
	import { cancelTaskQueue, CheckTaskQueue, GetProjectDetail, } from '../../common/ProjectMgr';
	import { GetResourceList} from '@/common/ResourceMgr';
	import PopupProjectSetting from "../../components/PopupProjectSetting.vue";
	import PopupComputingPower from "../../components/PopupComputingPower.vue";
	const storyRef = ref(null);
	const resourceRef = ref(null);
	const episodeScriptRef = ref(null);

	const store = useStore();

	const _app = app;

	const state=reactive({
		titleList:[
			// {name:"小说",type:1},
			{name:"分集剧本",type:2},
			{name:"项目资产",type:3},
			{name:"故事板",type:4}
		],
		isOpenSPmanager:false,
		tabType:2,
		projectConfig:{},
		projectSettingPopupShow:false,	
		showComputingPower:false,
		curFinishTask:0,
		queueTask:0,
	})
	let checkintervalID = null

	onMounted(() => {
	})


	onLoad((options) => {
		state.projectConfig= uni.getStorageSync('currentProjectInfo') || {};
		GetProjectDetail(state.projectConfig.id,(data)=>{
			// 生图风格spid类型转换,否则类型对不上组件回显不了
			data.projectConfig.pictureConfig.promptSpId = Number(data.projectConfig.pictureConfig.promptSpId)
			state.projectConfig=data
			uni.setStorageSync("aimanju_current_projectdetail",data)
		})
	})

	onHide(()=>{
		clearEffect()
	})

	onUnload(()=>{
		clearEffect()
	})

	onShow(()=>{
		if(checkintervalID){
			clearInterval(checkintervalID)
		}

		checkintervalID = setInterval(()=>{
			CheckTask()
		},5000)

		uni.$emit('restartListenCreateImage')
	})

	function clearEffect(){
		// 清除故事板轮询
		clearInterval(checkintervalID)
		store.commit('process/CLEAR_TIMER',{
			tagName:'image'
		})

		// 卸载故事板页面的resize事件
		const listener_headerLayoutResize = store.state.process.listenerPointers['headerLayoutResize']
		if(listener_headerLayoutResize){
			window.removeEventListener(listener_headerLayoutResize.type, listener_headerLayoutResize.pointer);
		}
	}

	function CheckTask(){
		if(!store.state.token){
			return
		}
		CheckTaskQueue({
			projectId:state.projectConfig.id || _app.globalData.tempPageData.id,
		},(data)=>{
			if(Array.isArray(data.queue) && data.queue.length>0){
				var finsish=0
				var total=0
				for (let index = 0; index < data.queue.length; index++) {
					const element = data.queue[index];
					if(element.status==5){
						finsish++
						total++
					}
					else if(element.status==0 || element.status==2 || element.status==1 ){
						total++
					}
				}
				var isNeedUpdate = finsish!=state.curFinishTask
				if(storyRef.value){
					storyRef.value.updateTaskStatus(data.queue,isNeedUpdate);
				}
				state.curFinishTask=finsish
				state.queueTask=total
			}
			else{
				state.curFinishTask=0
				state.queueTask=0
			}
		})
	}

	function cancelTask(){
		cancelTaskQueue(state.projectConfig.id,()=>{
			state.curFinishTask=0
			state.queueTask=0
		})
	}

	function addEpisodeSucceed(data){
		state.projectConfig.episodeNum+=data.num
	}

	function openProjectSetting(){
		state.projectSettingPopupShow=true
	}
	function closeProjectSetting(){
		state.projectSettingPopupShow=false
	}

	function checkCreateCameraStatus(callback){
		const status = episodeScriptRef.value?.getCreateCameraStatus();
		if(status && Object.keys(status)?.length>0){
			uni.showModal({
				title:'提示',
				content:'当前有分镜任务正在进行中，会造成分镜无法生成，确认离开？',
				success:(res)=>{
					if(res.confirm){
						callback()
					}
				}
			})
		}else{
			callback()
		}
	}

	function onClickTabItem(type){	
		const currentType = state.tabType
		if(type==currentType){
			return
		}
		if(currentType==2){
			checkCreateCameraStatus(()=>state.tabType=type)			
		}else{
			state.tabType=type
		}
	}

	function gotoProjectPage(){
		checkCreateCameraStatus(()=>{
			// storyRef.value?.saveCameraConfig({checkEmpty:true})
			uni.redirectTo({
				url: '/pages/project/project?tabindex='+2
			})
		});	
	}

	function openSpManager(){
		state.isOpenSPmanager=true
	}
	function closeSPManager({updated}){
		// 如果SP管理有更新
		if(updated?.length>0 && updated.includes(9)){
			const projectSetting = state.projectConfig.projectConfig
			// 拿对应id，更新生图、融图、生视频画风SP最新值
			GetResourceList(1, 1000, 9, (resList) => {
				const pictureSetting = projectSetting.pictureConfig; //生图 promptSp
				const videoSetting = projectSetting.videoConfig; //生视频 rtSp
				const rtSetting = projectSetting.rtConfig; //融图 rtSp

				const pictureSPItem = resList.find(item=>item.id==pictureSetting.promptSpId)
				pictureSPItem && (pictureSetting.promptSp = pictureSPItem.content)

				const videoSPItem = resList.find(item=>item.id==videoSetting.rtSpId)
				videoSPItem && (videoSetting.rtSp = videoSPItem.content)
				console.log(pictureSPItem,videoSPItem)

				if(rtSetting){
					const rtSPItem = resList.find(item=>item.id==rtSetting.spId)
					rtSPItem && (rtSetting.sp = rtSPItem.content)
				}
			})
		}
		state.isOpenSPmanager=false;
	}

	function updateProjectSetting(data){
		data && (state.projectConfig.projectConfig = data)
	}

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
</script>

<style lang="scss" scoped>
	@import "cameraContent.css"
</style>