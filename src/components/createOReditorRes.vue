<template>
	<view class="mark" style="justify-content:center;z-index: 12;">
		<view style="background: #ffffff;display: flex;flex-direction: column;justify-content: flex-start;align-items: flex-start;padding: 0 40rpx;border-radius: 24rpx;min-width: 840rpx; max-width: 60vw;">
			 <view style="display: flex;flex-direction: row;justify-content: center;align-items: center;width: 100%;margin-top: 48rpx;margin-bottom: 40rpx">
				<text style="font-size: 48rpx;font-weight: bold;color: #FFA600;">新建资产</text>
			 </view>
			
			<view style="display: flex;flex-direction: row;justify-content: space-between;align-items: flex-start;width: 100%;margin-bottom: 20rpx;">
				<view style="display: flex;flex-direction: column;justify-content: flex-start;align-items: flex-start;width: 100%;">
					<view style="display: flex;flex-direction: row;justify-content: center;align-items: center;">
						<image style="width: 32rpx;height: 32rpx;margin-right: 8rpx;" src="/static/proNameIcon.png"></image>
						<text style="font-size: 32rpx;">资产名称<text style="color: red;">*</text></text>
					</view>
					<input @input="resourceNameInput" class="sp-input" :value="state.newResConfig.title" placeholder="输入资产名称"/>
				</view>
			</view>
			<view style="display: flex;flex-direction: column;justify-content: space-between;align-items: flex-start;width: 100%;margin-bottom: 20rpx;">
				<view style="display: flex;flex-direction: column;justify-content: flex-start;align-items: flex-start;width: 100%;">
					<view style="display: flex;flex-direction: row;justify-content: center;align-items: center;">
						<image style="width: 32rpx;height: 32rpx;margin-right: 8rpx;" src="/static/proNameIcon.png"></image>
						<text style="font-size: 32rpx;">资产类型<text style="color: red;">*</text></text>
					</view>
				</view>
				<scroll-view style="display: flex;white-space: nowrap;overflow: scroll;overflow-y: hidden;overflow-x: auto;margin-top: 40rpx;" scroll-x="true">
					<block  v-for="(item,index) in props.typeMap" :key="index">
						<view :style="'background:'+(item.id==state.curResType?'#F8BA38;':'#E7E7E7;')+(index==0?'border-radius:16rpx 0 0 16rpx;':'')+(index==props.typeMap.length-1?'border-radius:0 16rpx 16rpx 0;':'')" 
						@click="onClickResItem(item.id)" class="sp-item"> 
							<view style="display: flex;justify-content: center;align-items: center;width: 100%;height: 100%;">
								{{item.treeName}}
							</view>
						</view>
					</block>
				</scroll-view>
			</view>

			<view v-if="!state.newResConfig.tempUrl" @click="uploadResource" style="width:100%;height: 212rpx;background: #F7F7F7;border-radius: 16rpx;
			display: flex;justify-content: center;align-items: center;flex-direction: column;">
				<text style="font-size: 28rpx;color: #333333;">点击添加</text>
				<text style="font-size: 28rpx;color: #777777;">支持jpg/jpeg/png/webp/mp4/mov/mp3/wav格式</text>
			</view>
			<template v-else>
				<image v-if="state.newResConfig._mideaType=='image'" @click="uploadResource" style="width:100%;height: 444rpx;" mode="aspectFit" :src="state.newResConfig.tempUrl" />
				<view  v-else-if="state.newResConfig._mideaType=='audio'" style="width: 100%;height: 444rpx;background-color: #ccc;position: relative;" @click.stop="uploadResource">
					<image style="width: 64px;height: 64px;position: absolute;top: 50%;left: 50%;transform: translate(-50%,-50%);;" mode="widthFix" src="/static/audio_black.png"></image>
					<view @click.stop="handlePreviewAudio" style="position: absolute;right: 16px;top: 16px;background-color: #999;color: #fff;font-size: 16px;padding:6px 0;border-radius: 8px;width: 60px;text-align: center;cursor: pointer;"><text>预览</text></view>
				</view>
				<view  v-else-if="state.newResConfig._mideaType=='video'" style="width: 100%;height: 444rpx;background-color: #ccc;position: relative;" @click.stop="uploadResource">
					<image style="width: 64px;height: 64px;position: absolute;top: 50%;left: 50%;transform: translate(-50%,-50%);;" mode="widthFix" src="/static/video_icon_black.png"></image>
					<view @click.stop="handlePreviewVideo" style="position: absolute;right: 16px;top: 16px;background-color: #999;color: #fff;font-size: 16px;padding:6px 0;border-radius: 8px;width: 60px;text-align: center;cursor: pointer;"><text>预览</text></view>
				</view>
			</template>
			<view style="display: flex;flex-direction: row;justify-content: center;align-items: center;width: 100%;margin-top: 48rpx;margin-bottom: 48rpx;">
				<button style="margin: 0;height: 88rpx;border-radius: 16rpx;width: 280rpx;background: #E7E7E7;margin-right: 48rpx;" @click="closeEditorRes">取消</button>
				<button style="margin: 0;height: 88rpx;border-radius: 16rpx;width: 336rpx;background: #FFA600;" @click="saveRes">保存</button>
			</view>
            
			<!-- <uni-section style="width: 100%;margin-top: 24rpx;"  type="line">
				<uni-data-select v-model="state.curSP" :localdata="state.spResList" label="资产识别SP" @change="SPChange"></uni-data-select>
			</uni-section>
			<textarea :maxlength="-1" @input="SPInput" class="sp-input" 
			style="width: 1024rpx;height: 300rpx;margin-top: 20rpx;" :value="state.curSP" placeholder="资产信息"></textarea>

			<text>资产信息：</text>
			<textarea :maxlength="-1" @input="resourceDetailInput" class="sp-input" 
			style="width: 1024rpx;height: 300rpx;margin-top: 20rpx;" :value="state.newResConfig.detail" placeholder="资产信息"></textarea>
			<view style="display: flex;flex-direction: row;width: 100%;justify-content: space-between;align-items: center;margin-top: 24rpx;">
				<button @click="readImageDetail">信息识别</button>
			</view> -->
		</view>
	</view>

	<!-- 音频预览弹窗 -->
    <PopupAudioPreview v-if="state.audioPreviewPopup.visible" @close="state.audioPreviewPopup.visible = false"
        :src="state.audioPreviewPopup.url" :title="state.audioPreviewPopup.title">
    </PopupAudioPreview>

	<!-- 视频预览弹窗 -->
    <PopupVideoPreview v-if="state.videoPreviewPopup.visible" @close="state.videoPreviewPopup.visible = false"
        :src="state.videoPreviewPopup.url" :title="state.videoPreviewPopup.title">
    </PopupVideoPreview>
</template>

<script setup>
	import { defineProps, defineEmits,reactive, onMounted } from 'vue'
	import { checkMediaType, UploadFile } from '../common/Tool'
	import { AddNewResource, EditorResource, GetResourceList } from '../common/ResourceMgr'
	import { doubaoSeed1_6 } from '../common/AIAgent'
	import PopupAudioPreview from '@/components/PopupAudioPreview.vue'
	import PopupVideoPreview from '@/components/PopupVideoPreview.vue'
  	const props = defineProps({
		newResConfig:{
			type:Object,
			default:()=>{
				return {
					id:0,
					type:1,
					title:'',
					imageUrl:"",
					detail:'',
					projectId:0,
					episodesId:0,
				}
			}
		},
		isNewRes:{
			type:Boolean,
			default:false,
		},
		typeMap: {
			type: Array,
			required: true,
		},
  })
  const emits = defineEmits(["close","saveSucceed"])

  const state=reactive({
		newResConfig:{
			id:0,
			type:1,
			title:'',
			imageUrl:"",
			detail:'',
			projectId:0,
			episodesId:0,
			_mideaType:'',
		},
		spResList:[],
		curSP:'',
		resTypeList:[
			{treeName:"角色",id:2},
			{treeName:"场景",id:3},
			{treeName:"道具",id:4},
		],
		curResType:2,

		audioPreviewPopup: {
			visible: false,
			url: '',
			title:'',
		},
		videoPreviewPopup:{
			visible: false,
			url: '',
			title:'',
		},

		manualInput:false, // 手工输入过的判断（如果用户手动输入了资产名称，后续资产名称不会因变更资源而变化）
  })
  onMounted(()=>{
	console.log('typeMap',props.typeMap)
	state.newResConfig=props.newResConfig
	state.curResType=state.newResConfig.type
	//资产识别SP
	GetResourceList(1,10000,18,(resList)=>{
		var selectData=resList.map(item=>{
			return {
				value:item.content,
				text:item.name
			}
		})
		state.spResList=selectData
		if(state.spResList.length>0){
			state.curSP=state.spResList[0].value
		}
	})
  })

  function onClickResItem(id){
	state.curResType=id
  }
	function SPChange(e){
	state.curSP=e
  }
	function SPInput(e){
		state.curSP=e.detail.value
	}
	function uploadResource(){
		uni.chooseFile({
			count: 1,
			success: (res) => {
				!state.manualInput&&(state.newResConfig.title=res.tempFiles[0].name.split('.')[0])
				state.newResConfig._mideaType = checkMediaType(res.tempFiles[0].name)
				state.newResConfig.tempUrl = res.tempFilePaths[0];
			}
		})
	}
  	function resourceNameInput(e){
		state.newResConfig.title=e.detail.value;
		state.manualInput=true;
	}
  	function resourceDetailInput(e){
		state.newResConfig.detail=e.detail.value
	}
	function closeEditorRes(){
		emits('close',{})
	}
	function readImageDetail(){
		uni.showLoading({
			title: '获取图片信息',
			mask: true,
		})
		doubaoSeed1_6(state.curSP,state.newResConfig.imageUrl,(result)=>{
			 uni.hideLoading()
			state.newResConfig.detail=result
		},(error)=>{
			uni.showToast({
				title: "获取失败，请重试或者自行填写",
				icon: 'none'
			})
 			uni.hideLoading()
		})
	}
	function saveRes(){
		if(props.isNewRes){
			let config={
				typeId:state.curResType,//state.newResConfig.type,
				name:state.newResConfig.title,
				content:state.newResConfig.detail,
				projectId:state.newResConfig.projectId,
				episodesId:state.newResConfig.episodesId,
				status:1,
			}
			if(state.newResConfig.tempUrl){	
				UploadFile(state.newResConfig.tempUrl,(url)=>{
					state.newResConfig.imageUrl=url
					config.url=url
					AddNewResource(config,(resData)=>{
						emits('saveSucceed',{})
					})
				})
			}else{
				AddNewResource(config,(resData)=>{
					emits('saveSucceed',{})
				})
			}
		}
		else{
			let config={
				id:state.newResConfig.id,
				typeId:state.curResType,//state.newResConfig.type,
				name:state.newResConfig.title,
				url:state.newResConfig.imageUrl,
				content:state.newResConfig.detail,
				projectId:state.newResConfig.projectId,
				episodesId:state.newResConfig.episodesId,
			}
			EditorResource(config,(resData)=>{
				emits('saveSucceed',{})
			})
		}
	}

	function handlePreviewAudio(){
		state.audioPreviewPopup.url=state.newResConfig.tempUrl
		state.audioPreviewPopup.title=state.newResConfig.title
		state.audioPreviewPopup.visible = true;
	}

	function handlePreviewVideo(){
		state.videoPreviewPopup.url=state.newResConfig.tempUrl
		state.videoPreviewPopup.title=state.newResConfig.title
		state.videoPreviewPopup.visible = true;
	}
</script>

<style scoped>
	.sp-input{
		background: #F7F7F7;
		padding-left: 32rpx; 
		width: 100%;
		height: 96rpx;
    	margin-top: 16rpx;
		border-radius: 16rpx;
	}
	.sp-item{
		display: inline-block;
		width: 200rpx;
		height: 72rpx;
		justify-content: center;
		align-items: center;
		margin-right: 4rpx;
	}
</style>