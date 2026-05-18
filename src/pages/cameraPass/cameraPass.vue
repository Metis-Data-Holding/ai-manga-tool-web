<template>
	<view style="flex-direction: column;display: flex;width: 100%;height: 100%;overflow: hidden;">
		<view style="flex-direction: column;display: flex;padding-left: 32rpx; padding-top: 16rpx;padding-right: 32rpx;">
			<view style=" display: flex;flex-direction: row;justify-content: flex-start;">
				<view style="display: flex;flex-direction: row;">
					<button @click="gotoJubenPage">切到故事板</button>
					<button @click="gotoContentPage" style="margin-left: 16rpx;">切到编剧模块</button>
				</view>
			</view>
		</view>
		<scroll-view style="display: flex;margin-left: 32rpx;white-space: nowrap;overflow: scroll;overflow-y: hidden;overflow-x: auto;margin-top: 32rpx;" scroll-x="true">
			<block v-for="(item,index) in state.fenjiList" :key="index">
				<button :style="'background:'+(index==state.curjiIndex?'#73d373':'#ffffff')" @click="onClickfenjiItem(index)" class="sp-item">{{'第'+(index+1)+'集'}}</button>
			</block>
		</scroll-view>
		<view style="display: flex;flex-direction: row; justify-self: flex-start;align-items: center; width: 100%;margin-left: 16rpx;">
			<button style="margin: 0;margin-left: 16rpx;" @click="selectAllji(true)">一键全选</button>
			<button style="margin: 0;margin-left: 16rpx;"  @click="selectAllji(false)">取消全选</button>
			<!-- <button style="margin: 0;margin-left: 16rpx;"  @click="allCopyCameraSP">一键复制到故事板</button> -->
		</view>
		<scroll-view style="display: flex;margin-top: 24rpx;flex: 1;height: 1000rpx;" :scroll-y="true">
			<block v-for="(item, index) in state.cameraList" :key="index">
				<view style="display: flex;flex-direction: row;margin-bottom: 24rpx;background-color: #999999;padding-top: 20rpx;padding-bottom: 20rpx;">
					<scroll-view style="display: flex;margin-left: 32rpx;white-space: nowrap;overflow: scroll;overflow-y: hidden;overflow-x: auto;" scroll-x="true">
						<view style="display: flex;flex-direction: row;">
							<view style="display: flex;flex-direction: row;align-items: center;">
								<text style="font-size: 40rpx;">{{index+1}}</text>
								<image @click="selectCamera(index)" style="width: 80rpx; height: 80rpx; margin-right: 20rpx;margin-left: 20rpx; "
									:src="item.isSelect?'/static/adsel_icon2.png':'/static/nor_iconb.png' ">
								</image>
								<input class="markText" placeholder="输入镜头名" :value="item.name" 
									@input="cameraNameInput" 
									@focus="setCamIndex(index)" placeholder-style="font-size: 28rpx;color: #666666;" />
							</view>
							<view class="camera-item">
								<textarea :maxlength="-1" style="width: 640rpx;height: 360rpx;overflow: hidden;background: #ffffff;" 
									@input="camContentInput"
									@focus="setCamIndex(index)"
								:value="item.camContent" placeholder="镜头内容和对白"></textarea>
							</view>
							<view class="camera-item" style="margin-left: 16rpx;">
								<textarea :maxlength="-1" @input="rongtuSPOutInput"  @focus="setCamIndex(index)" style="width: 640rpx;height: 360rpx;overflow: hidden;background: #ffffff;" 
								:value="item.rongtcontentSP" placeholder="分镜图SP"></textarea>
								<view class="cameraButtonb">
									<!-- <button @click="CopyCameraSP(index)" class="camerabutton1">复制到故事板</button> -->
									<button @click="openSPEditor(index)" class="camerabutton1">分镜图SP</button>
								</view>
							</view>
							<view class="camera-item" style="margin-left: 16rpx;">
								<textarea :maxlength="-1" @input="videoSPOutInput"  @focus="setCamIndex(index)" style="width: 640rpx;height: 360rpx;overflow: hidden;background: #ffffff;" 
								:value="item.videocontentSP" placeholder="视频SP"></textarea>
								<view class="cameraButtonb">
									<!-- <button @click="CopyCameraSP(index)" class="camerabutton1">复制到故事板</button> -->
									<button @click="openVideoSP(index)" class="camerabutton1">视频SP</button>
								</view>
							</view>
						</view>
					</scroll-view>
				</view>
			</block>
		</scroll-view>
	</view>

	<view v-if="state.isOpenCamSP" class="mark" style="justify-content:center;z-index: 11;">
		<view style="background: #ffffff;display: flex;flex-direction: column;justify-content: flex-start;align-items: flex-start;padding: 24rpx;">
			<view style="display: flex;flex-direction: row;">
				<view>
					<view style="display:flex;flex-direction: row; width: 800rpx;">
						<view style="display: flex;flex-direction: column;">
							<view style="display: flex;flex-direction: row;justify-content: space-between;align-items: flex-start;width: 100%;">
								<view style="display: flex;flex-direction: row;justify-content: center;align-items: flex-start;width: 100%;">
									<text>画风选择：</text>
									<uni-section style="width: 100%;flex: 1;" title="画风SP选择：" type="line">
										<view class="uni-px-5 uni-pb-5">
											<uni-data-select v-model="value" :localdata="state.curhuafengSP" @change="huafengSPChange"></uni-data-select>
										</view>
									</uni-section>
								</view>
							</view>
							<textarea :maxlength="-1" @input="editorRongtuhuafengSP" class="sp-input" style="width: 1000rpx;height: 250rpx;" 
							:value="state.curHuafengContent" placeholder="请选择或者编辑"></textarea>
						</view>

						<view style="display: flex;flex-direction: column; width: 800rpx;margin-left: 24rpx;">
							<view style="display: flex;flex-direction: row;justify-content: space-between;align-items: flex-start;width: 100%;">
								<view style="display: flex;flex-direction: row;justify-content: center;align-items: flex-start;width: 100%;">
									<text>融图SP选择：</text>
									<uni-section style="width: 100%;flex: 1;" title="融图SP选择：" type="line">
										<view class="uni-px-5 uni-pb-5">
											<uni-data-select v-model="value" :localdata="state.currongtuSP" @change="rongtuSPChange"></uni-data-select>
										</view>
									</uni-section>
								</view>
							</view>
							<textarea :maxlength="-1" @input="editorRongtuSPModel" class="sp-input" style="width: 1000rpx;height: 250rpx;" 
							:value="state.curRongtuContent" placeholder="请选择或者编辑"></textarea>
						</view>

					</view>

					
					<view style="display: flex;flex-direction: row;justify-content: space-between;align-items: flex-start;width: 100%;margin-top: 20rpx;">
						<view style="display: flex;flex-direction: row;justify-content: flex-start;align-items: flex-start;width: 100%;">
							<text>融图内容SP：</text>
						</view>
					</view>
					<textarea :maxlength="-1" @input="editorRongtuSP" class="sp-input" style="width: 2048rpx;height: 350rpx;" 
					:value="state.curSelectRongtuSPValue" placeholder="请编辑"></textarea>
					
					<view style="display: flex;flex-direction: row;justify-content: space-between;align-items: flex-start;width: 100%;margin-top: 20rpx;">
						<view style="display: flex;flex-direction: row;justify-content: center;align-items: flex-start;width: 100%;">
							<text>机位选择：</text>
							<uni-section style="width: 100%;flex: 1;" title="机位选择:" type="line">
								<view class="uni-px-5 uni-pb-5">
									<uni-data-select v-model="value" :localdata="state.curjiweiSP" @change="jiweiSPChange"></uni-data-select>
								</view>
							</uni-section>
						</view>
						<view style="display: flex;flex-direction: row;justify-content: center;align-items: flex-start;width: 100%;">
							<text>构图选择：</text>
							<uni-section style="width: 100%;flex: 1;" title="构图选择:" type="line">
								<view class="uni-px-5 uni-pb-5">
									<uni-data-select v-model="value" :localdata="state.curgoutuSP" @change="goutuSPChange"></uni-data-select>
								</view>
							</uni-section>
						</view>
						<view style="display: flex;flex-direction: row;justify-content: center;align-items: flex-start;width: 100%;">
							<text>氛围选择：</text>
							<uni-section style="width: 100%;flex: 1;" title="氛围选择:" type="line">
								<view class="uni-px-5 uni-pb-5">
									<uni-data-select v-model="value" :localdata="state.curfenweiSP" @change="fenweiSPChange"></uni-data-select>
								</view>
							</uni-section>
						</view>
						<view style="display: flex;flex-direction: row;justify-content: center;align-items: flex-start;width: 100%;">
							<text>光线选择：</text>
							<uni-section style="width: 100%;flex: 1;" title="光线选择：" type="line">
								<view class="uni-px-5 uni-pb-5">
									<uni-data-select v-model="value" :localdata="state.curguanxianSP" @change="guanxianSPChange"></uni-data-select>
								</view>
							</uni-section>
						</view>
					</view>
					<textarea :maxlength="-1" @input="editorRongtuSPSence" class="sp-input" style="width: 2048rpx;height: 400rpx;" 
					:value="state.curSelectRongtuSenceValue" placeholder="请选择或者编辑"></textarea>
					<view style="display: flex;flex-direction: row;justify-content: space-between;align-items: flex-start;width: 100%;margin-top: 16rpx;">
						<view style="display: flex;flex-direction: row;justify-content: center;align-items: flex-start;width: 100%;">
						<text>负向SP选择：</text>
						<uni-section style="width: 100%;flex: 1;" title="负向SP选择：" type="line">
							<view class="uni-px-5 uni-pb-5">
								<uni-data-select :localdata="state.curfuxiangSPs" @change="rongtufuxiangSPChange"></uni-data-select>
							</view>
						</uni-section>
						</view>
					</view>
					<textarea :maxlength="-1" @input="editorRongtufuxiangSP" class="sp-input" 
					style="width: 2048rpx;height: 280rpx;" :value="state.currongtufuxiangSP" placeholder="请选择或者编辑"></textarea>
				</view>
				<view style="margin-left: 36rpx;">
					<view style="display: flex;flex-direction: row;justify-content: flex-start;align-items: center;width: 100%; margin-top: 20rpx;">
						<view style="margin-right: 70rpx;">
							<button @click="getRongtuImage">资产检索</button>
						</view>
					</view>
					<scroll-view style="margin-top: 20rpx;display: flex; background-color: #ddd;width: 1080rpx; height: 900rpx;flex: 1;padding-left: 16rpx;" :scroll-y="true">
						<block v-for="(item,index) in state.curRongtuIamges" :key="index">
							<view style="flex-direction: column;float: left; flex-shrink: 0; box-sizing: border-box; display: flex;  margin-right: 16rpx;margin-top: 16rpx;
							align-items: center;justify-content: center;position: relative;">
								<image style="width: 320rpx;height: 220rpx;" mode="aspectFit" :src="item.imageUrl" />
								<view style="display: flex;align-items: center;justify-content: center;">{{ item.title }}</view>
								<view @click="removeRongtu(index)" 
								style="width: 60rpx;height: 60rpx;background-color: #ff4d4f; font-size: 48rpx;font-weight: bold;color: #ffffff;
								display: flex;align-items: center;justify-content: center;position: absolute;top: 0;right: 0;">
									X
								</view>
							</view>
						</block>
					</scroll-view>
					<button style="margin-top: 20rpx;" @click="addRongtuRes">添加资产</button>
			    </view>

			</view>

			<view style="display: flex;flex-direction: row;width: 100%;justify-content: space-between;align-items: center;margin-top: 24rpx;">
				<button @click="saveRongtuSPEditor">保存</button>
				<button @click="closeSPEditorSP">取消</button>
			</view>
		</view>
	</view>

	<view v-if="state.isOpenVideSP" class="mark" style="justify-content:center;z-index: 11;">
		<view style="background: #ffffff;display: flex;flex-direction: column;justify-content: flex-start;align-items: flex-start;padding: 24rpx;">
			<view style="display: flex;flex-direction: row;">
				<view>
					<view style="display: flex;flex-direction: row;justify-content: space-between;align-items: flex-start;width: 100%;">
						<view style="display: flex;flex-direction: row;justify-content: center;align-items: flex-start;width: 100%;">
						<text>视频SP选择：</text>
						<uni-section style="width: 100%;flex: 1;" title="反求SP选择：" type="line">
							<view class="uni-px-5 uni-pb-5">
								<uni-data-select v-model="value" :localdata="state.curVideoSP" @change="videoSPChange"></uni-data-select>
							</view>
						</uni-section>
						</view>
					</view>
					<textarea :maxlength="-1" @input="videoSPInput" class="sp-input" 
					style="width: 2048rpx;height: 300rpx;" :value="state.curSelectVideoSPValue" placeholder="请选择或者编辑"></textarea>

					<view style="display: flex;flex-direction: row;justify-content: space-between;align-items: flex-start;width: 100%;margin-top: 16rpx;">
						<view style="display: flex;flex-direction: row;justify-content: flex-start;align-items: flex-start;width: 100%;">
							<text>视频内容SP：</text>
						</view>
					</view>
					<textarea :maxlength="-1" @input="videoSPContentInput" class="sp-input" 
					style="width: 2048rpx;height: 300rpx;" :value="state.curVideoSPContent" placeholder="请编辑"></textarea>

					<view style="display: flex;flex-direction: row;justify-content: space-between;align-items: flex-start;width: 100%;margin-top: 16rpx;">
						<view style="display: flex;flex-direction: row;justify-content: center;align-items: flex-start;width: 100%;">
							<text>镜头内容：</text>
							<uni-section style="width: 100%;flex: 1;" title="镜头内容：" type="line">
								<view class="uni-px-5 uni-pb-5">
									<uni-data-select  :localdata="state.curCamContentSP" @change="jingtouSPChange"></uni-data-select>
								</view>
							</uni-section>
						</view>
						<view style="display: flex;flex-direction: row;justify-content: center;align-items: flex-start;width: 100%;">
							<text>运镜：</text>
							<uni-section style="width: 100%;flex: 1;" title="运镜:" type="line">
								<view class="uni-px-5 uni-pb-5">
									<uni-data-select  :localdata="state.curyunjingSP" @change="yunjingSPChange"></uni-data-select>
								</view>
							</uni-section>
						</view>
						<view style="display: flex;flex-direction: row;justify-content: center;align-items: flex-start;width: 100%;">
							<text>氛围：</text>
							<uni-section style="width: 100%;flex: 1;" title="氛围：" type="line">
								<view class="uni-px-5 uni-pb-5">
									<uni-data-select  :localdata="state.curfenweiSP" @change="videofenweiSPChange"></uni-data-select>
								</view>
							</uni-section>
						</view>
						<view style="display: flex;flex-direction: row;justify-content: center;align-items: flex-start;width: 100%;">
							<text>特效：</text>
							<uni-section style="width: 100%;flex: 1;" title="反求SP选择：" type="line">
								<view class="uni-px-5 uni-pb-5">
									<uni-data-select :localdata="state.cureffectSP" @change="effectSPChange"></uni-data-select>
								</view>
							</uni-section>
						</view>
					</view>
					<textarea :maxlength="-1" @input="videoSPbottomInput" class="sp-input" 
					style="width: 2048rpx;height: 450rpx;" :value="state.curvideoSPbottom" placeholder="请选择或者编辑"></textarea>
					<view style="display: flex;flex-direction: row;justify-content: space-between;align-items: flex-start;width: 100%;margin-top: 16rpx;">
						<view style="display: flex;flex-direction: row;justify-content: center;align-items: flex-start;width: 100%;">
						<text>负向SP选择：</text>
						<uni-section style="width: 100%;flex: 1;" title="负向SP选择：" type="line">
							<view class="uni-px-5 uni-pb-5">
								<uni-data-select :localdata="state.curfuxiangSPs" @change="videofuxiangSPChange"></uni-data-select>
							</view>
						</uni-section>
						</view>
					</view>
					<textarea :maxlength="-1" @input="videofuxiangSPInput" class="sp-input" 
					style="width: 2048rpx;height: 280rpx;" :value="state.curvideofuxiangSP" placeholder="请选择或者编辑"></textarea>
				</view>
			</view>

			<view style="display: flex;flex-direction: row;width: 100%;justify-content: space-between;align-items: center;margin-top: 24rpx;">
				<button @click="closeVidoeSP">取消</button>
				<button @click="saveVideoSP">保存</button>
			</view>
		</view>
	</view>

	<view v-if="state.isOpenResmanager" class="mark" style="z-index: 12;">
		<view style="display: flex;flex-direction: row;justify-content: space-between;width: 100%;align-items: center;">
			<scroll-view style="display: flex;margin-left: 32rpx;white-space: nowrap;overflow: scroll;overflow-y: hidden;overflow-x: auto;margin-top: 32rpx;" scroll-x="true">
				<block  v-for="(item,index) in state.resTypeList" :key="index">
					<button :style="'background:'+(item.type==state.curResType?'#73d373':'#ffffff')" 
					@click="onClickResItem(item.type)" class="sp-item">{{item.name}}</button>
				</block>
			</scroll-view>
			<button style="margin-right: 32rpx;width: 160rpx;height: 80rpx;display: flex;justify-content: center;align-items: center;" @click="closeResManager">关闭</button>
		</view>
		<scroll-view style="display: flex;margin-top: 24rpx; background: #ffffff;flex: 1;width: 98%; height: 500rpx;" :scroll-y="true">
			<block v-for="(item,index) in state.curResList" :key="index">
				<view style="margin-left: 24rpx; float: left; width: 400rpx;height: 260rpx;display: flex;flex-direction: column;
				justify-content: center;align-items: center;margin-top: 24rpx;background-color:chartreuse;flex-shrink: 0;box-sizing: border-box;">
					<image @click="addToRongtu(item)" style="width: 360rpx;height: 240rpx;" mode="aspectFit" :src="item.imageUrl" />
				</view>
			</block>
		</scroll-view>
	</view>
</template>

<script setup>
	import { onLoad } from '@dcloudio/uni-app';
    import {ref, nextTick,onMounted,reactive, onUnmounted} from "vue";

	const state=reactive({
		cameraList:[],
		fenjiList:[],
		curfenjiIndex:0,
		isOpenCamSP:false,
		isOpenVideSP:false,
		spList:[],
		curjiIndex:0,
		currongtuSP:'',
		curhuafengSP:'',
		curjiweiSP:'',
		curgoutuSP:'',
		curfenweiSP:[],
		curguanxianSP:'',
		curfuxiangSPs:'',
		curSelectRongtuSenceValue:'',
		curjiweiContent:'',
		curgoutuContent:'',
		curfenweiContent:'',
		curguangxianContent:'',
		curHuafengContent:'',
		curRongtuContent:'',
		editorRongtuSP:'',
		
		isOpenResmanager:false,
		curResList:[],
		isOpenEditorRes:false,
		resTypeList:[],
		curResType:1,
		curRongtuIamges:[],
		
		curVideoSP:[],
		curCamContentSP:[],
		curyunjingSP:[],
		curSelectVideoSPValue:'',
		curSelectjingtouSP:'',
		curSelectyunjingSP:'',
		curfenweiContent:'',
		curSelecteffectSP:'',
	})

	onLoad(() => {
		state.fenjiList=uni.getStorageSync('aimanju_novel_fenjiList') || []
		var saveSPList=uni.getStorageSync('aimanju_spList') || []
		if(Array.isArray(saveSPList) && saveSPList.length>0){
			state.spList=saveSPList
		}
		if(state.fenjiList.length>0){
			var curId= state.fenjiList[state.curjiIndex].id??0
			state.cameraList=state.fenjiList[state.curjiIndex].cameras || []
			var saveCameras= uni.getStorageSync(curId) || []
			if(Array.isArray(saveCameras) && saveCameras.length>0){
				for (let i = 0; i < saveCameras.length; i++) {
					const s1 = saveCameras[i];
					for (let j = 0; j < state.cameraList.length; j++) {
						const t1 = state.cameraList[j];
						if(t1.id==s1.id){
							t1.name=s1.name
							t1.rongtuhuafengStyle=s1.rongtuhuafengStyle
							t1.rongstyleSP=s1.rongtuStyle
							t1.rongtcontentSP=s1.rongtuSP
							t1.rongtcamSP=s1.rongtuSPScene
							t1.rongtfuxiangSP=s1.rongtuFuxiangSP
							t1.images=s1.rongtuImages

							t1.videostyleSP=s1.videoSP
							t1.videocontentSP=s1.videoContentSP
							t1.videoeffectSP=s1.videoSPbottom
							t1.videofuxiangSP=s1.videofuxiangSP
						}
					}
				}
			}
		}
		var tempResTypeList =uni.getStorageSync('aimanju_resList') || []
		if(Array.isArray(tempResTypeList) && tempResTypeList.length>0){
			state.resTypeList=tempResTypeList
		}
	})
	function gotoJubenPage(){
		uni.navigateTo({
			url: '/pages/index/index?index='+state.curjiIndex + '&id='+state.fenjiList[state.curjiIndex].id??0,
		})
	}
	function gotoContentPage(){
		uni.navigateTo({
			url: '/pages/cameraContent/cameraContent',
		})
	}
	function onClickfenjiItem(index){
		state.curjiIndex=index
		state.cameraList=state.fenjiList[state.curjiIndex].cameras || []
	}

	function setCamIndex(index){
		state.curfenjiIndex=index
	}
	function cameraNameInput(e){
		state.cameraList[state.curfenjiIndex].name=e.detail.value
		saveFenji()
	}
	function camContentInput(e){
		state.cameraList[state.curfenjiIndex].camContent=e.detail.value
		saveFenji()
	}
	function selectCamera(index){
		state.cameraList[index].isSelect=!state.cameraList[index].isSelect
		saveFenji()
	}
	function selectAllji(isSelect){
		state.cameraList.forEach(item => {
			item.isSelect=isSelect
		});
		saveFenji()
	}
	function allCopyCameraSP(){
		state.cameraList.forEach(item => {
			if(item.isSelect){
			}
		});
	}
	function CopyCameraSP(index){
	}

	function openVideoSP(index){
		state.curfenjiIndex=index
		state.isOpenVideSP=true

		state.curVideoSP=selectSPbyType(8)
		state.curCamContentSP=selectSPbyType(9)
		state.curyunjingSP=selectSPbyType(10)
		state.curfenweiSP=selectSPbyType(6)
		state.cureffectSP=selectSPbyType(11)
		state.curfuxiangSPs=selectSPbyType(13)

		state.curSelectVideoSPValue=state.cameraList[state.curfenjiIndex].videostyleSP
		state.curVideoSPContent=state.cameraList[state.curfenjiIndex].videocontentSP
		state.curvideoSPbottom=state.cameraList[state.curfenjiIndex].videoeffectSP
		state.curvideofuxiangSP=state.cameraList[state.curfenjiIndex].videofuxiangSP

	}

	function selectSPbyType(type){
		var tempsp=state.spList.find(item=>item.type==type).contents
		var selectData=tempsp.map(item=>{
			return {
				value:item.content,
				text:item.title
			}
		})
		return selectData
	}

	function openSPEditor(index){
		state.curfenjiIndex=index
		state.isOpenCamSP=true

		state.currongtuSP=selectSPbyType(2)
		state.curhuafengSP=selectSPbyType(3)
		state.curjiweiSP=selectSPbyType(4)
		state.curgoutuSP=selectSPbyType(5)
		state.curfenweiSP=selectSPbyType(6)
		state.curguanxianSP=selectSPbyType(7)
		state.curfuxiangSPs=selectSPbyType(13)

		state.curHuafengContent =state.cameraList[state.curfenjiIndex].rongtuhuafengStyle
		state.curRongtuContent =state.cameraList[state.curfenjiIndex].rongstyleSP
		state.curSelectRongtuSPValue =state.cameraList[state.curfenjiIndex].rongtcontentSP
		state.curSelectRongtuSenceValue=state.cameraList[state.curfenjiIndex].rongtcamSP
		state.currongtufuxiangSP=state.cameraList[state.curfenjiIndex].rongtfuxiangSP
		state.curRongtuIamges=state.cameraList[state.curfenjiIndex].images
	}

	function huafengSPChange(e){
		state.curHuafengContent="画风："+e 
	}
	function rongtuSPChange(e){
		state.curRongtuContent="融图："+e 
	}
	function jiweiSPChange(e){
		state.curjiweiContent="机位："+e 
		updateRongtuSceneSp()
	}
	function goutuSPChange(e){
		state.curgoutuContent="构图："+e 
		updateRongtuSceneSp()
	}
	function fenweiSPChange(e){
		state.curfenweiContent="氛围："+e 
		updateRongtuSceneSp()
	}

	function rongtuSPOutInput(e){
		state.cameraList[state.curfenjiIndex].rongtcontentSP=e.detail.value
		saveFenji()
	}
	function videoSPOutInput(e){
		state.cameraList[state.curfenjiIndex].videocontentSP=e.detail.value
		saveFenji()
	}

	function guanxianSPChange(e){
		state.curguangxianContent="光线："+e 
		updateRongtuSceneSp()
	}
	function editorRongtuSPSence(e){
		state.curSelectRongtuSenceValue=e.detail.value
	}
	function rongtufuxiangSPChange(e){
		state.currongtufuxiangSP=e 
	}
	function editorRongtuSP(e){
		state.curSelectRongtuSPValue=e.detail.value
	}
	function editorRongtuSPModel(e){
		state.curRongtuContent=e.detail.value
	}
	function editorRongtuhuafengSP(e){
		state.curHuafengContent=e.detail.value
	}

	function editorRongtufuxiangSP(e){
		state.currongtufuxiangSP=e.detail.value
	}
	function updateRongtuSceneSp(){
		state.curSelectRongtuSenceValue=state.curjiweiContent+"\n"+
		state.curgoutuContent+"\n"+state.curfenweiContent+"\n"+state.curguangxianContent
	}
	function addRongtuRes(){
		state.isOpenResmanager=true
		state.curResList=state.resTypeList.find(item=>item.type==state.curResType).resList??[]
		state.isOpenEditorRes=false
	}
	function onClickResItem(type){
		state.curResType=type
		state.curResList=state.resTypeList.find(item=>item.type==type).resList??[]
	}
	function addToRongtu(additem){
		if(state.curRongtuIamges.findIndex(item=>item.imageUrl==additem.imageUrl)>-1){
			uni.showToast({
				title: '已添加',
				icon: 'success',
				duration: 2000
			})
			return
		}
		uni.showToast({
			title: '添加成功',
			icon: 'success',
			duration: 2000
		})
		state.curRongtuIamges.push(additem)
	}
	function removeRongtu(index){
		state.curRongtuIamges.splice(index,1)
	}
	function getRongtuImage(){
		var allRes=[]
		state.resTypeList.forEach(item=>{
			allRes=allRes.concat(item.resList)
		})
		var des=state.curHuafengContent+"\n" + state.curRongtuContent + "\n"+state.curSelectRongtuSPValue+"\n"+state.curSelectRongtuSenceValue
		var findRes= fuzzySearchInDescription(des,allRes)
		for(let i=0;i<findRes.length;i++){
			addToRongtu(findRes[i])
		}
	}
	function fuzzySearchInDescription(description, resourceList, caseSensitive = false) {
		if (!description || !Array.isArray(resourceList) || resourceList.length === 0) {
			return [];
		}
		const processedDesc = caseSensitive ? description : description.toLowerCase();
		
		const matchedResources = resourceList.filter(resource => {
			if (!resource || typeof resource.title !== 'string') {
            	return false;
        	}

			 const processedName = caseSensitive ? resource.title : resource.title.toLowerCase();
			 return processedDesc.includes(processedName);
		});

		return matchedResources;
	}
	function closeResManager(){
		state.isOpenResmanager=false
	}
	function saveRongtuSPEditor(){
		state.cameraList[state.curfenjiIndex].rongtuhuafengStyle=state.curHuafengContent
		state.cameraList[state.curfenjiIndex].rongstyleSP=state.curRongtuContent
		state.cameraList[state.curfenjiIndex].rongtcontentSP=state.curSelectRongtuSPValue
		state.cameraList[state.curfenjiIndex].rongtcamSP=state.curSelectRongtuSenceValue
		state.cameraList[state.curfenjiIndex].rongtfuxiangSP=state.currongtufuxiangSP
		state.cameraList[state.curfenjiIndex].images=state.curRongtuIamges
		saveFenji()
		state.isOpenCamSP=false
		uni.showToast({
			title: '保存成功',
			icon: 'success',
			duration: 2000
		})
	}

	function saveVideoSP(){
		state.cameraList[state.curfenjiIndex].videostyleSP=state.curSelectVideoSPValue
		state.cameraList[state.curfenjiIndex].videocontentSP=state.curVideoSPContent
		state.cameraList[state.curfenjiIndex].videoeffectSP=state.curvideoSPbottom
		state.cameraList[state.curfenjiIndex].videofuxiangSP=state.curvideofuxiangSP
		state.isOpenVideSP=false
		saveFenji()
		uni.showToast({
			title: '保存成功',
			icon: 'success',
			duration: 2000
		})
	}
	function closeSPEditorSP(){
		state.isOpenCamSP=false
	}
	function closeVidoeSP(){
		state.isOpenVideSP=false
	}

	function saveFenji(){
		uni.setStorageSync('aimanju_novel_fenjiList', state.fenjiList)
	}


	function videoSPChange(e){
		state.curSelectVideoSPValue=e
	}

	function jingtouSPChange(e){
		state.curSelectjingtouSP="镜头内容："+e
		updateVideoSp()
	}
	function yunjingSPChange(e){
		state.curSelectyunjingSP="运镜："+e
		updateVideoSp()
	}

	function videofenweiSPChange(e){
		state.curfenweiContent="氛围："+e 
		updateVideoSp()
	}
	function effectSPChange(e){
		state.curSelecteffectSP="特效："+e
		updateVideoSp()
	}
	function videofuxiangSPInput(e){
		state.curvideofuxiangSP=e.detail.value
	}

	function videoSPInput(e){
		state.curSelectVideoSPValue=e.detail.value
	}

	function videoSPbottomInput(e){
		state.curvideoSPbottom=e.detail.value
	}

	function videoSPContentInput(e){
		state.curVideoSPContent=e.detail.value
	}
	function updateVideoSp(){
		state.curvideoSPbottom=state.curSelectjingtouSP+"\n"+
		state.curSelectyunjingSP+"\n"+state.curfenweiContent+"\n"+state.curSelecteffectSP
	}
	function videofuxiangSPChange(e){
		state.curvideofuxiangSP=e
	}

</script>

<style lang="scss">
@import "cameraPass.css"
</style>