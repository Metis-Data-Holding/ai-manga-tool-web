<template>
	<view style="display: flex;flex-direction: column;margin-top: 24rpx;height: 360rpx;flex: 1;">
		<view style="display: flex;flex-direction: row; justify-content: space-between; width: 100%; height: 1000rpx;flex: 1;margin-left: 24rpx;">
			<view style="display: flex;flex-direction: column; width: 60%; height: 100%"> 
				<text>小说内容</text>
				<textarea :maxlength="-1" @input="novelInput"  style="width: 100%;height: 100%;
				overflow: hidden;border: 4rpx solid #999999;padding: 16rpx;" 
				:value="state.novelContent" placeholder="小说内容"></textarea>

				<text style="margin-top: 24rpx;">评估结果</text>
				<textarea :maxlength="-1" @input="novelResultInput"  style="width: 100%;height: 460rpx;overflow: hidden;
				border: 4rpx solid #999999;padding: 16rpx;" 
				:value="state.novelResult" placeholder="评估结果"></textarea>
			</view>

			<view style="display: flex;flex-direction: column; width: 38%; height: 100%"> 
				<view style="display: flex;flex-direction: row;height: 110rpx;">
					<block v-for="(item,index) in state.spTabs" :key="index">
						<button @click="clickSPType(item.type)" 
						:style="'height: 100rpx;margin: 0;margin-left: 16rpx;background:'+(item.type==state.curSPtype?'#73d373':'#ffffff')">{{item.name}}</button>
					</block>
				</view>
				<uni-section style="width: 90%;margin-top: 24rpx;" type="line">
					<uni-data-select v-model="state.curEditorContent" label="SP选择" :localdata="state.curSPList" @changeindex="SPChangeIndex" @change="SPChange"></uni-data-select>
				</uni-section>
				<textarea :maxlength="-1" @input="SPInput"  style="width: 90%;height: 100%;flex: 1; overflow: hidden;margin-top: 24rpx;
				border: 4rpx solid #999999;padding: 16rpx;" 
				:value="state.curEditorContent" placeholder="SP内容"></textarea>

				<view style="display: flex;flex-direction: row;margin-top: 16rpx;">
					<block v-for="(item,index) in state.resType" :key="index">
						<button @click="setResType(item)" :style="'margin: 0;margin-left: 16rpx;background:'+(item==state.curtypeName?'#73d373':'#ffffff')">{{item}}</button>
					</block>
				</view>
				<scroll-view style="margin-top: 20rpx;display: flex; background-color: #ddd;width: 95%; padding-left: 16rpx;" :scroll-x="true">
					<view style="display: flex;flex-direction: row;">
						<block v-for="(item,index) in state.refineListForType" :key="index">
							<view style="flex-direction: column; display: inline-block;  margin-right: 16rpx;margin-top: 16rpx;
							align-items: center;justify-content: center;position: relative;">
									<textarea :maxlength="-1" style=" height: 360rpx;overflow: hidden;border: 4rpx solid #999999;padding: 16rpx;" 
									:value="item.content" placeholder="清单详情"></textarea>
									<!-- <view style="display: flex;flex-direction: row;">
										<button style="margin-left: 16rpx;">生图</button>
										<button style="margin-left: 16rpx;">生图管理</button>
									</view> -->
							</view>
						</block>
					</view>
				</scroll-view>
			</view>

		</view>

		<view style="margin-top: 24rpx;height: 100rpx;display: flex;flex-direction: row;justify-content: space-between; margin-bottom: 36rpx;">
			<button @click="readNovel()" style="margin: 0;margin-left: 16rpx;">上传小说</button>
			<view style="display: flex;flex-direction: row;align-items: center;">
				<button @click="startAnalysis" style="margin: 0;margin-left: 16rpx;">分析评估</button>
				<CustomLoading
					v-model:visible="state.loadingAnalysis" 
					title="分析中..."
					circle-color="#ff6600"
					text-color="#666666"
					circle-size="50"
					/>
			</view>
			<view style="display: flex;flex-direction: row;align-items: center;">
				<button @click="refineResList" style="margin: 0;margin-left: 16rpx;">提炼资产清单</button>
				<CustomLoading
					v-model:visible="state.loadingVisible" 
					title="正在提炼中..."
					circle-color="#ff6600"
					text-color="#666666"
					circle-size="50"
					/>
			</view>
			

			<view style="display: flex;flex-direction: row;align-items: center;margin-left: 16rpx;">
				<text>起始生成集数：</text>
				<input type="number" style="width: 200rpx;height: 80rpx; background-color: #d9d9d9;padding-left: 16rpx;" 
				:value="state.startNum" @input="startNumInput"  placeholder="输入开始集数">
			</view>
			<view style="display: flex;flex-direction: row;align-items: center;margin-left: 16rpx;">
				<text>生成总集数：</text>
				<input type="number" style="width: 200rpx;height: 80rpx; background-color: #d9d9d9;padding-left: 16rpx;" 
				:value="state.generateNum" @input="generateNumInput"  placeholder="输入集数">
			</view>
			<view style="display: flex;flex-direction: row;align-items: center;">
				<button @click="startCreate" style="margin: 0; margin-left: 16rpx;margin-right: 16rpx;">生成分集剧本</button>
				<CustomLoading
					v-model:visible="state.loadingfenji" 
					title="生成中..."
					circle-color="#ff6600"
					text-color="#666666"
					circle-size="50"
					/>
			</view>
			
		</view>
	</view>
</template>

<script setup>
	import { defineProps, defineEmits,reactive, onMounted ,ref,onUnmounted} from 'vue'
	import { doubaoChatStream } from '../common/AIAgent';
	import CustomLoading from './CustomLoading.vue'
	import { GetResourceList } from '../common/ResourceMgr';
	import { isNull } from '../common/Tool';
	import { CreateProjectEpisodes } from '../common/ProjectMgr';
	const props = defineProps({
		projectConfig:{
			type:Object,
			default:()=>{}
		}
	})
   const emits = defineEmits(["addEpisode"])
   const fileContent = ref(''); 
   let fileInput = null;

   const state=reactive({
		spTabs:[
			{name:"分析评估SP",type:22},
			{name:"提炼资产清单SP",type:21},
			{name:"生成剧本SP",type:23},
		],
		resType:['角色','场景','道具'],
		curSPtype:1,
		novelContent:'',
		novelResult:'',
		refineListForType:[],
		refineList:[],
		curtypeName:"角色",
		curEditorContent:'',
		curFenxiSPcontent:'',
		curTilianSPcontent:'',
		curfenjiSPcontent:'',
		loadingAnalysis:false,
		loadingVisible:false,
		loadingfenji:false,
		spList:[],
		curSPList:[],
		generateNum:1,
		startNum:1,
	})
  	function generateNumInput(e){
		state.generateNum=e.detail.value
	}
	function startNumInput(e){
		state.startNum=e.detail.value
	}
  	function setResType(type){
		state.curtypeName=type
		for (let index = 0; index < state.refineList.length; index++) {
			const element = state.refineList[index];
			if(element.title.includes(state.curtypeName)){
				state.refineListForType=element.children
				break
			}
		}
	}

	function SPChange(e){
	    saveSPContent(e)
	}
	function SPChangeIndex(index){
		console.log('index=',index)
	}
	function SPInput(e){
		saveSPContent(e.detail.value)
	}

	function saveSPContent(content){
		state.curEditorContent=content
		switch(state.curSPtype){
			case 22:
				state.curFenxiSPcontent=content
				break
			case 21:
				state.curTilianSPcontent=content
				break
			case 23:
				state.curfenjiSPcontent=content
				break
		}
	}

	function startCreate(){
		if(isNull(state.novelContent)){
			uni.showToast({
				title: '请先上传或者编辑小说',
				icon: 'none'
			})
			return
		}
		if(isNull(state.curfenjiSPcontent)){
			uni.showToast({
				title: '请选择或者编辑生成剧本SP',
				icon: 'none'
			})
			return
		}
		var sp=state.curfenjiSPcontent
		var spcontent= sp.replace(/\{Num\}/g, state.generateNum).replace(/\{StartNum\}/g, state.startNum)
		var body=[
			{
				"role": "system",
				"content": spcontent
			},
			{
				"role": "user",
				"content": state.novelContent
			},
		]
        state.loadingfenji=true
		doubaoChatStream(body,(result)=>{
			// console.log('分集结果=',result)
			let parts=result.split('####')
			parts = parts.map(part => part.trim()).filter(part => part !== '');
			parts= parts.map(part => part.trim()).filter(part => !part.startsWith('###'));
			for (let index = 0; index < parts.length; index++) {
				var tempNum=state.startNum+index
				var item={
					projectId:props.projectConfig.id,
					name:'第'+tempNum+'集',
					content:parts[index],
				}
				CreateProjectEpisodes(item,(resData)=>{
					emits('createSucceed',{num:1})
				},(error)=>{

				})
			}
			state.loadingfenji=false
		},(chunk)=>{

		},(errormsg)=>{
			uni.showToast({
				title: errormsg,
				icon: 'none'
			})
			state.loadingfenji=false
		})
	}

	function refineResList(){
		if(isNull(state.novelContent)){
			uni.showToast({
				title: '请先上传或者编辑小说',
				icon: 'none'
			})
			return
		}
		if(isNull(state.curTilianSPcontent)){
			uni.showToast({
				title: '请选择或者编辑提炼资产清单SP',
				icon: 'none'
			})
			return
		}
		var body=[
			{
				"role": "system",
				"content": state.curTilianSPcontent
			},
			{
				"role": "user",
				"content": state.novelContent
			},
		]
		state.loadingVisible=true
		doubaoChatStream(body,(result)=>{
			// console.log('提炼结果=',result)
			try {
				var temp= parseTextHierarchically(result)
				state.refineList=temp
				uni.setStorageSync('aimanju_novel_resList', state.refineList)
				for (let index = 0; index < temp.length; index++) {
					const element = temp[index];
					if(element.title.includes(state.curtypeName)){
						state.refineListForType=element.children
						break
					}
				}

			 } catch (error) {
				state.refineList=[{title:'角色清单',children:[result]}]
			 }
			state.loadingVisible=false
		},(chunk)=>{

		},(errormsg)=>{
			uni.showToast({
				title: errormsg,
				icon: 'none'
			})
			state.loadingVisible=false
		})
	}

	function parseTextHierarchically(text) {
		const lines = text.split(/\r?\n/);
			const result = [];
			let currentLevel1 = null;
			let currentLevel2 = null;

			lines.forEach(line => {
				const trimmedLine = line.trim();
				if (!trimmedLine) return;

				if (trimmedLine.startsWith('###')) {
					const title = trimmedLine.replace(/^###\s*/, '').trim();
					currentLevel1 = {
						title: title,
						children: [] 
					};
					result.push(currentLevel1);
					currentLevel2 = null;
				}
				else if (trimmedLine.startsWith('##')) {
					if (!currentLevel1) return;
					currentLevel2 = {};
					currentLevel1.children.push(currentLevel2);
				}
				else {
					if (!currentLevel2) return;
					var oldContent=currentLevel2.content
					if(isNull(oldContent)){
						oldContent=''
					}
					currentLevel2.content=oldContent+trimmedLine+'\n'
					// const colonIndex = trimmedLine.indexOf('：');
					// if (colonIndex > -1) {
					// 	const key = trimmedLine.slice(0, colonIndex).trim();
					// 	const value = trimmedLine.slice(colonIndex + 1).trim();
					// 	currentLevel2[key] = value;
					// } else {
					// 	currentLevel2.content = (currentLevel2.content || []) + trimmedLine;
					// }
				}
			});
		//  console.log('提炼结果=', result);
		// for (let index = 0; index < result.length; index++) {
		// 	const element = result[index];
		// 	if(element.title.includes("道具")){
		// 			state.refineListForType=element.children
		// 	}
		// }
		// console.log('提炼结果=', state.refineListForType);

		return result;
	}

	function startAnalysis(){
		if(isNull(state.novelContent)){
			uni.showToast({
				title: '请先上传或者编辑小说',
				icon: 'none'
			})
			return
		}
		if(isNull(state.curfenjiSPcontent)){
			uni.showToast({
				title: '请选择或者编辑分析评估SP',
				icon: 'none'
			})
			return
		}
		var body=[
			{
				"role": "system",
				"content": state.curFenxiSPcontent
			},
			{
				"role": "user",
				"content": state.novelContent
			},
		]
		state.loadingAnalysis=true
		doubaoChatStream(body,(result)=>{
			state.loadingAnalysis=false
		},(chunk)=>{
			state.novelResult+=chunk
		},(errormsg)=>{
			uni.showToast({
				title: errormsg,
				icon: 'none'
			})
			state.loadingAnalysis=false
		})
	}

	function readNovel(){
		fileContent.value = '';
		initFileInput();
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
		if (document.getElementById('txtFileInput')) return;
		fileInput = document.createElement('input');
		fileInput.id = 'txtFileInput';
		fileInput.type = 'file';
		fileInput.accept = '.txt';
		fileInput.style.position = 'absolute';
		fileInput.style.top = '-9999px';
		fileInput.style.left = '-9999px';
		fileInput.style.opacity = '0';
		fileInput.addEventListener('change', handleFileUpload);
		document.body.appendChild(fileInput);
	};

	function clickSPType(type){
		state.curSPtype=type
		var tempsps= [...state.spList.find(item=>item.type==state.curSPtype).contents??[]]
		state.curSPList=selectSPbyType(type,tempsps)
		switch(type){
			case 22:
				state.curEditorContent=state.curFenxiSPcontent
				break
			case 21:
				state.curEditorContent=state.curTilianSPcontent
				break
			case 23:
				state.curEditorContent=state.curfenjiSPcontent
				break
		}
	}

    function novelInput(e){
		state.novelContent=e.detail.value
	}

  	function novelResultInput(e){
		state.novelResult=e.detail.value
	}

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
			state.novelContent=fileContent.value
			uni.showToast({
				title: '导入成功',
				icon: 'success'
			});
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
	
	function selectSPbyType(type,splist){
		var selectData=splist.map(item=>{
			return {
				value:item.content,
				text:item.title
			}
		})
		return selectData
	}

	function getSPList(){
		state.spList=[]
		GetResourceList(1,10000,20,(resList)=>{
			for (let index = 0; index < state.spTabs.length; index++) {
				const element = state.spTabs[index];
				var typeList=resList.filter(item=>item.typeId==element.type)
				var tempContents=[]
				for(let i=0;i<typeList.length;i++){
					var spitem={
						id:typeList[i].id,title:typeList[i].name,content:typeList[i].content,isNew:false,isChange:false
					}
					tempContents.push(spitem)
				}

				var spItem={
					name:element.treeName,
					type:element.type,
					contents:tempContents,
				}
				state.spList.push(spItem)
			}
			var tempsps= [...state.spList.find(item=>item.type==state.curSPtype).contents??[]]
			state.curSPList=selectSPbyType(state.curSPtype,tempsps)
		})
	}

	const updateSPManager=()=>{
		getSPList()
	}

    onMounted(() => {
		state.curSPtype=state.spTabs[0].type
		getSPList()

		var saveResList=uni.getStorageSync('aimanju_novel_resList') || []
		if(Array.isArray(saveResList) && saveResList.length>0){
			state.refineList=saveResList
			for (let index = 0; index < state.refineList.length; index++) {
				const element = state.refineList[index];
				if(element.title.includes(state.curtypeName)){
					state.refineListForType=element.children
					break
				}
			}
		}
  	})

    onUnmounted(() => {
		if (fileInput && fileInput.parentNode) {
			fileInput.removeEventListener('change', handleFileUpload);
			document.body.removeChild(fileInput);
			fileInput = null;
		}
	});

	defineExpose({
		updateSPManager
	})
</script>

<style scoped>
	.sp-input{
		overflow: hidden;
		background: #ffffff;
		padding-left: 16rpx; 
		border: 6rpx solid #8240FA;
    	margin-top: 16rpx;
	}
</style>