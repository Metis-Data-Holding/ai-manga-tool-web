<template>
	<view class="mark" style="justify-content:center;z-index: 12;">
		<view style="background: #ffffff;display: flex;flex-direction: column;justify-content: flex-start;align-items: center;padding: 48rpx;border-radius: 24rpx;width: 95%;height: 90%;">
      <view style="width: 100%;display: flex;flex-direction: row;justify-content: flex-start;align-items: center;">
        <text style="font-size: 48rpx;font-weight: bold;color: #FFA600;">批量生成公共库资源</text>
      </view>
      <view style="display: flex;flex-direction: row;width: 100%;height: 100%;">
        <view style="display: flex;flex-direction: column;justify-content: flex-start;align-items: flex-start;margin-top: 40rpx;width: 60%;height: 98%; background: #F7F7F7;border-radius: 24rpx 0rpx 0rpx 24rpx;">
            <button @click="importFile()" class="modalactive"><image src="/static/importIcon.png" style="width: 32rpx;height: 32rpx;margin-right: 16rpx;"></image> 导入excel文件</button>
            <textarea @input="DetailInput" :value="state.readFileText" disabled style="background: #FFFFFF;width: 96%;height: 90%;margin-left: 48rpx;" placeholder="导入资源文件"></textarea>
        </view>
        <view style="display: flex;flex-direction: column;justify-content: space-between;align-items: flex-start;margin-top: 40rpx;width: 40%;height: 98%;background: #E7E7E7;border-radius: 0px 24rpx 24rpx 0px;">
            <view style="display: flex;flex-direction: column;align-items: flex-start; margin-left: 48rpx;width: 100%;">
              <view style="display: flex;flex-direction: row;align-items: center; margin-top: 48rpx;">
                <image src="/static/proNameIcon.png" style="width: 32rpx;height: 32rpx;margin-right: 16rpx;"></image>
                <text style="font-size: 32rpx;font-weight: 500;color: #333333;">文件信息</text>
              </view>
              <textarea class="sp-input" style="width: 93%;height: 268rpx;"
                  :value="state.fileInfo" placeholder="文件信息" disabled></textarea>
              <view style="display: flex;flex-direction: column;margin-top: 32rpx;">
                  <view style="display: flex;flex-direction: row;align-items: center;">
                      <text style="font-size: 32rpx;font-weight: 500;color: #333333;">生图模型选择</text>
                  </view>
                  <view style="width: 400rpx;margin-top: 8rpx;">
                      <uni-data-select 
                          v-model="state.curModelId"
                          :localdata="state.ailist"
                          @change="onModelChange"></uni-data-select>
                  </view>
              </view>
                 <text style="font-size: 32rpx;font-weight: 500;color: #333333;margin-top: 32rpx;">生成数量</text>
                 <view style="display: flex;flex-direction: row;justify-content: flex-start;align-items: center;margin-top: 8rpx;">
                    <block v-for="(item,index) in [1,2,3,4]" :key="index">
                      <button @click="countChange(item)" class="buttonc" :style="{'background-color': state.curCount==item?'#FFA600':'#FFFFFF'}">{{item}}</button>
                    </block>
                 </view>
                <text style="font-size: 32rpx;font-weight: 500;color: #333333;margin-top: 32rpx;">分辨率</text>
                <view style="display: flex;flex-direction: row;justify-content: flex-start;align-items: center;margin-top: 8rpx;">
                  <block v-for="(item,index) in state.resolutionList" :key="index">
                    <button @click="resolutionChange(item)" class="buttonc" :style="{'background-color': state.curresolution==item?'#FFA600':'#FFFFFF'}">{{item}}</button>
                  </block>
                </view>
                <text style="font-size: 32rpx;font-weight: 500;color: #333333;margin-top: 32rpx;">画幅</text>
                <view style="display: flex;flex-direction: row;justify-content: flex-start;align-items: center;margin-top: 8rpx;">
                  <block v-for="(item,index) in state.ratioList" :key="index">
                    <button @click="ratioChange(item)" class="buttonc" :style="{'background-color': state.curratio==item?'#FFA600':'#FFFFFF'}">{{item}}</button>
                  </block>
                </view>
                 <text style="font-size: 32rpx;font-weight: 500;color: #FF5454;margin-top: 32rpx;">*生成完毕后，在公共库待验收栏进行确认。</text>
            </view>
            <view style="display: flex;flex-direction: row;width: 100%;justify-content: center;align-items: center;margin-bottom: 48rpx;">
              <button @click="closeEditor" class="buttono" style="margin-right: 40rpx;">关闭</button>
              <button @click="startRawImage" class="buttono" style="color: #FFFFFF; background: #409EFF;">执行生图</button>
            </view>
        </view>
      </view>
		</view>
	</view>
</template>

<script setup>
	import { defineProps, defineEmits,reactive, onMounted,ref,onUnmounted } from 'vue'
  import { getImageSize, isNull } from '../common/Tool';
  import * as XLSX from 'xlsx'
  import { GetAIModelList } from '../common/Common';
import { BananaTextImage, Doubaoseedream5_0liteTextImage } from '../common/AIAgentForServer';
  const excelData = ref([])
	let fileInput = null;
  const props = defineProps({
    
  })
  const emits = defineEmits(["close","createSucceed"])

  const state=reactive({
    fileInfo:'',
    curCount:1,
    resolutionList:['1K','2K','3k','4k'],
    curresolution:'2K',
    ratioList:['9:16','16:9','3:4','4:3','1:1'],
    curratio:'9:16',
    ailist:[],
    readFileText:'',
    curModelId:'',
    rawItems:[],
  })

  function countChange(item){
    state.curCount=item
  }

  function resolutionChange(item){
    state.curresolution=item
  }

  function ratioChange(item){
    state.curratio=item
  }

  function DetailInput(e){
		state.readFileText=e.detail.value
	}

  function onModelChange(e){
    state.curModelId=e
    changeResolution();
  }

  function closeEditor(){
		emits('close',{})
  }

  function startRawImage(){
    if(state.rawItems.length<=0){
      uni.showToast({
        title: '请输入导入文件',
        icon: 'none'
      })
      return
    }
    var configs=[]

    switch(state.curModelId){
      case '11': //豆包seedream5.0lite
      case '12': //豆包seedream4.5
        for(let i=0;i<state.rawItems.length;i++){
          var resItem=state.rawItems[i]
          configs.push({
            modelId:state.curModelId,
            prompt:resItem.sp + resItem.style,
            size:getImageSize(state.curratio,state.curresolution),
            // output_format: 'png',
            watermark: false,
            name: resItem.name,
            typeId: getResTypeId(resItem.type),
            num: state.curCount,
          })
        }
        Doubaoseedream5_0liteTextImage(configs,()=>{
          uni.showToast({
            title: '执行成功，请耐心等候！',
            icon: 'none'
          })
        },(error)=>{
          uni.showToast({
            title: '执行失败'+error,
            icon: 'none'
          })
        })
        break;
      case '13': //香蕉2
      case '14': //香蕉pro
        for(let i=0;i<state.rawItems.length;i++){
          var resItem=state.rawItems[i]
          configs.push({
            modelId:state.curModelId,
            input:[{
              params:{
                prompt:resItem.sp + resItem.style,
                resolution:state.curresolution,
                aspect_ratio:state.curratio,
                watermark:false
              }
            }],
            name: resItem.name,
            typeId: getResTypeId(resItem.type),
            num: state.curCount,
          })
        }
       BananaTextImage(configs,()=>{
          uni.showToast({
            title: '执行成功，请耐心等候！',
            icon: 'none'
          })
        },(error)=>{
          uni.showToast({
            title: '执行失败'+error,
            icon: 'none'
          })
        })
        break;
      case '15': //KirinV3Omni
        for(let i=0;i<state.rawItems.length;i++){
          var resItem=state.rawItems[i]
          configs.push({
            modelId:state.curModelId,
            input:[{
              params:{
                prompt:resItem.sp + resItem.style,
                resolution:state.curresolution.toLocaleLowerCase(),
                aspect_ratio:state.curratio,
                watermark_info:{
                    enabled:false,
                }
              }
            }],
            name: resItem.name,
            typeId: getResTypeId(resItem.type),
            num: state.curCount,
          })
        }
        KirinV3TextImage(configs,()=>{
          uni.showToast({
            title: '执行成功，请耐心等候！',
            icon: 'none'
          })
        },(error)=>{
          uni.showToast({
            title: '执行失败'+error,
            icon: 'none'
          })
        })
        break;
      default:  //豆包seedream5.0lite
          uni.showToast({
            title: '请选择生图模型',
            icon: 'none'
          })
        break;
    }
  }

  function getResTypeId(typeName){
    switch(typeName){
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
		const existingInput = document.getElementById('xlsxFileInput');
		if (existingInput) {
			fileInput = existingInput;
			// 移除旧的事件监听器，避免重复绑定
			fileInput.removeEventListener('change', handleFileChange );
		} else {
			fileInput = document.createElement('input');
			fileInput.id = 'xlsxFileInput';
			fileInput.type = 'file';
			fileInput.accept = '.xlsx';
			fileInput.style.position = 'absolute';
			fileInput.style.top = '-9999px';
			fileInput.style.left = '-9999px';
			fileInput.style.opacity = '0';
			document.body.appendChild(fileInput);
		}

		// 绑定新的事件监听器
		fileInput.addEventListener('change', handleFileChange );

	};

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
           var col0text=''
           var col1text=''
           var col2text=''
           var col3text=''
           var col4text=''

           var tempResList=[]
           var roleCount=0
           var sceneCount=0
           var propCount=0
           var unknowCount=0
           excelData.value.forEach((row, rowIndex) => {
            // console.log(`第 ${rowIndex + 1} 行：`)
            if(rowIndex==0){
              col0text=row[0] //index
              col1text=row[1] //类型
              col2text=row[2] //名称
              col3text=row[3] //生图sp
              col4text=row[4] //生图风格
            }
            else{
              var item={
                index:`${col0text}:${row[0]}`,
                type:`${row[1]??''}`,
                name:`${row[2]??''}`,
                sp:`${col3text}:${row[3]??''}`,
                style:`${col4text}:${row[4]??''}`,
              }
              if(row[1]=='角色'){
                roleCount++
              }
              else if(row[1]=='场景'){
                sceneCount++
              }
              else if(row[1]=='道具'){
                propCount++
              }
              else{
                unknowCount++
              }

              tempResList.push(item)
              state.readFileText+=`${col0text}:${row[0]}\n${col1text}:${row[1]??''}\n${col2text}:${row[2]??''}\n${col3text}:${row[3]??''}\n${col4text}:${row[4]??''}\n\n`
            }
            // row.forEach((cell, colIndex) => {
            //   console.log(`  第 ${colIndex + 1} 列：`, cell || '空值')
            // })
          })
          state.rawItems=tempResList
          state.fileInfo=`角色数量：${roleCount}个\n场景数量：${sceneCount}个\n道具数量：${propCount}个\n未知数量：${unknowCount}个`
          e.target.value = ''
        } catch (error) {
          console.error('Excel 解析失败：', error)
          alert('Excel 文件解析失败，请检查文件是否损坏！')
        }
        finally{
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

  function changeResolution(){
    switch(state.curModelId){
      case '11': //豆包seedream5.0lite
        state.resolutionList=['2K','3k']
        break;
      case '12': //豆包seedream4.5
       state.resolutionList=['2K','4k']
        break;
      case '13': //香蕉2
      case '14': //香蕉pro
      case '15': //KirinV3Omni
       state.resolutionList=['1K','2K','4k']
        break;
      default:  //豆包seedream5.0lite
      state.resolutionList=['2K','3k']
        break;
    }
    if(!state.resolutionList.includes(state.curresolution)){
      state.curresolution=state.resolutionList[0]
    }
  }

  onMounted(() => {
      GetAIModelList().then((modelList) => {
        const data = [];
        for (const item of modelList) {
            data.push({
                value: item.id.toString(),
                text: item.name,
                modelType: item.modelType,
            })
        }
        state.ailist = data.filter(i => i.modelType == '4')
        state.curModelId=state.ailist[0].value
        changeResolution();
    })
  })

  onUnmounted(() => {
	});
</script>

<style scoped>
	.sp-input{
		overflow: hidden;
		background: #F7F7F7;
    border-radius: 16rpx;
		padding-left: 16rpx; 
    margin-top: 16rpx;
    font-size: 28rpx;
	}

  .modalactive{
    width: 380rpx;
    height: 72rpx;
    border-radius: 16rpx;
    background: #409EFF;
    display: flex;
    justify-content: center;
    align-items: center;
    color: #FFFFFF;
    font-size: 28rpx;
    font-weight: 500;
    margin: 0;
    font-size: 32rpx;
    margin-left: 48rpx;
    margin-top: 48rpx;
    margin-bottom: 28rpx;
  }
  .buttonc{
    border-radius: 8rpx;
    margin: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 32rpx;
    font-weight: 500;
    color: #333333;
    height: 64rpx;
    width: 160rpx;
    margin-right: 16rpx;
  }
  .buttono{
    margin: 0; 
    font-size: 28rpx;
    font-weight: 500;
    width: 280rpx;
    height: 72rpx;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 8rpx;
  }
</style>