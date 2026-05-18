<template>
	<view style="flex-direction: column;display: flex;padding-bottom: 48rpx; flex: 1;height: 1000rpx;margin-top: 4rpx;">
		<Episode :datas="state.fenjiList" @change="onClickfenjiItem" :projectId="props.projectConfig.id"></Episode>
		<!-- 头部按钮组 -->
		<view class="actionHeader" style="display: flex;flex-direction: row;width: 100%;align-items: center;height: 112rpx;padding:0 32rpx 0 32rpx;box-sizing: border-box;margin-top: 24rpx;">
			<view style="flex-shrink: 0;width: 310px;height: 112rpx;background: #FFFFFF;border-radius: 24rpx 0px 0px 24rpx;display: flex;flex-direction: row;align-items: center;justify-content: space-between;">
				<view style="display: flex;flex-direction: row;align-items: center;">
					<image style="width: 32rpx;height: 32rpx;margin-left: 24rpx;" src="/static/tag_finished.png" mode="aspectFill"></image>
					<text style="font-size: 28rpx;margin-left: 12rpx;font-weight: 500;">完成进度：{{state.finishCount}}/{{state.cameraList.length}}</text>
				</view>
				<button v-debounce.click="{handler:()=>matchCameraItemResources(),immediate:true,delay:500}" style="width: 240rpx;height: 72rpx;background: #F3F3F3;border-radius: 8rpx;font-size: 28rpx;font-weight: 500; color: #333333;margin:0;margin-right:32rpx;">一键刷新资产</button>
			</view>

			<view id="ah-col2" style="display: flex;flex-direction: row;flex: 1; height: 112rpx;align-items: center;background: #FFFFFF;margin-left: 4rpx;" :style="{justifyContent: projectType!=2?'space-between':'flex-start' }">
				<view id="ah-col2-1" style="display: flex;flex-direction: row;">
					<button @click="selectAllRongtuOrVideoSP(true)" style="width: 128rpx;height: 72rpx;background: #409EFF;border-radius: 8rpx;font-size: 28rpx;font-weight: 500; color: #FFFFFF;margin:0;margin-left:24rpx;">全选</button>
					<button @click="selectAllRongtuOrVideoSP(false)" style="width: 128rpx;height: 72rpx;background: #F3F3F3;border-radius: 8rpx;font-size: 28rpx;font-weight: 500; color: #333333;margin:0;margin-left:16rpx;">取消</button>
					<button v-if="projectType==2" v-debounce.click="{handler:allCreateImage,immediate:true,delay:500}" style="width: 280rpx;height: 72rpx;background: #F8BA38;border-radius: 8rpx;font-size: 28rpx;font-weight: 500; color: #333333;margin:0;margin-left:16rpx;margin-right: 16rpx;">一键融图</button>
					<button v-debounce.click="{handler:()=>saveCameraConfig({showSuccessToast:true}),immediate:true,delay:500}" style="width: 128rpx;height: 72rpx;background: #409EFF;border-radius: 8rpx;font-size: 28rpx;font-weight: 500; color: #FFFFFF;margin:0;margin-left:16rpx;">保存</button>
				</view>
				<view id="ah-col2-2" style="display: flex;flex-direction: row;">
					<!-- <button  @click="getRongtuImage()" style="width: 240rpx;height: 72rpx;background: #F3F3F3;border-radius: 8rpx;font-size: 28rpx;font-weight: 500; color: #333333;margin:0;">重新匹配资产</button> -->
					<button v-if="projectType==2" @click="selectAllVideoSP(true)" style="width: 128rpx;height: 72rpx;background: #409EFF;border-radius: 8rpx;font-size: 28rpx;font-weight: 500; color: #FFFFFF;margin:0;margin-left:24rpx;">全选</button>
					<button v-if="projectType==2" @click="selectAllVideoSP(false)" style="width: 128rpx;height: 72rpx;background: #F3F3F3;border-radius: 8rpx;font-size: 28rpx;font-weight: 500; color: #333333;margin:0;margin-left:16rpx;">取消</button>
					<!-- <button v-if="projectType != 2" style="width: 220rpx;height: 72rpx;background: #E7E7E7;border-radius: 8rpx;font-size: 28rpx;font-weight: 500; color: #333333;margin:0;margin-left:16rpx;margin-right: 16rpx;" @click="()=>cameraOptimizationPopupOpen()">
						<image style="width: 16px;height: 16px;vertical-align: middle;margin-right: 6px;" src="/static/star_icon.png" mode="heightFix"></image>
						<text>分镜优化</text>
					</button> -->
					<button v-debounce.click="{handler:allCreateVideo,immediate:true,delay:500}" style="width: 280rpx;height: 72rpx;background: #F8BA38;border-radius: 8rpx;font-size: 28rpx;font-weight: 500; color: #333333;margin:0;margin-left:16rpx;margin-right: 16rpx;">一键生成视频</button>
				</view>
			</view>

			<view style="flex-shrink: 0;display: flex;flex-direction: row;width: 383px; height: 112rpx;align-items: center;justify-content: space-between;background: #FFFFFF;margin-left: 4rpx;border-radius: 0px 24rpx 24rpx 0px">
				<view style="display: flex;flex-direction: row;">
					<button @click="selectAllVideoResult(true)" style="width: 128rpx;height: 72rpx;background: #409EFF;border-radius: 8rpx;font-size: 28rpx;font-weight: 500; color: #FFFFFF;margin:0;margin-left:24rpx;">全选</button>
					<button @click="selectAllVideoResult(false)" style="width: 128rpx;height: 72rpx;background: #F3F3F3;border-radius: 8rpx;font-size: 28rpx;font-weight: 500; color: #333333;margin:0;margin-left:16rpx;">取消</button>
				</view>

				<view style="display: flex;flex-direction: row;">
					<button v-if="false" @click="AllVideo1080P()" style="width: 168rpx;height: 72rpx;background: #F8BA38;border-radius: 8rpx;font-size: 28rpx;font-weight: 500; color: #333333;margin:0;">一键超分</button>
					<button @click="downloadAllVideo()" style="min-width: 168rpx;height: 72rpx;background: #F8BA38;border-radius: 8rpx;font-size: 28rpx;font-weight: 500; color: #333333;margin:0;margin-left:16rpx;margin-right: 16rpx;display: flex;align-items: center;">
						<view v-if="state.downloadCount>0" class="loading-circle" :style="{ borderColor: '#000', borderTopColor: 'transparent',width:'16px',height:'16px' }"></view>
						<text style="padding-left: 6px;">一键下载</text>
					</button>
				</view>
			</view>
		</view>
		<!-- 分镜列表 -->
	    <view style="display: flex;flex-direction: row;width: 100%;margin-top: 12rpx;align-items: flex-start;height: 1200rpx;flex: 1;">
			<scroll-view style="display: flex;height: 100%;padding-left: 32rpx;padding-right: 32rpx;" :scroll-y="true" show-scrollbar>
				<block v-for="(item, index) in state.cameraList" :key="index">
					<view :class="['camera-item', { 'camera-item--hover': state.dragHoverIndex === index }]" 
						style="display: flex;flex-direction: row;margin-bottom: 24rpx;width: 100%;justify-content: flex-start;align-items: flex-start;height: 320px;position: relative;">
						<!-- 拖拽遮罩层 -->
						<view v-if="state.dragHoverIndex === index" class="drag-overlay" @click="state.dragHoverIndex = -1">
							<view class="drag-overlay-content">
								<view class="drag-zones">
									<view 
										v-for="(tab, tabIndex) in state.resourceTabs" 
										:key="tab.id"
										:class="['drag-zone', { 'drag-zone--hover': state.autoUploadHover === tab.name }]"
										:id="`${index}-${tab.name}-zone`"
										@dragenter.prevent="handleZoneDragEnter(tab.name, $event)"
										@dragover.prevent="handleZoneDragOver(tab.name, $event)"
										@dragleave.prevent="handleZoneDragLeave(tab.name, $event)"
									>
										<view class="drag-zone-title">{{ tab.name }}</view>
									</view>
								</view>
							</view>
						</view>
						<!-- 资产匹配列 310px-->
						<view class="col-item" style="display: flex;flex-direction: column;width: 310px;height: 100%; align-items: flex-start;">
							<view class="col-item-header" style="border-radius: 24rpx 0px 0px 0rpx;width: 100%;display: flex;justify-content: space-between;align-items: center;">
								<view style="display: flex;flex-direction: row;align-items: center;margin-left: 24rpx;">
									<image style="width: 40rpx;height: 40rpx;margin-right: 8rpx;" src="/static/subcamera.png"></image>
									<text style="font-size: 32rpx;font-weight: 500;">{{item.name}}</text>
								</view>
								<view @click="markComplete(index)" :style="'display: flex;flex-direction: row;align-items: center;justify-content: center; width: 184rpx;height: 72rpx;border-radius: 8rpx;margin-right: 24rpx;background:'+ (item.completeStatus==0?'#F3F3F3':'#F3F3F3')+';'">
									<image style="width: 32rpx;height: 32rpx;margin-right: 8rpx;" :src="item.completeStatus==0?'/static/tag_pending.png':'/static/tag_finished.png'"></image>
									<text style="font-size: 24rpx;">标记完成</text>
								</view>
								<image style="width:24px;height: 24px;margin-right: 4px; cursor: pointer;" mode="widthFix" src="/static/add_up.png" @click="handleAddReduceCamera('prev',index)"></image>
								<image style="width:24px;height: 24px;margin-right: 4px; cursor: pointer;" mode="widthFix" src="/static/add_down.png" @click="handleAddReduceCamera('next',index)"></image>
								<image style="width:24px;height: 24px; cursor: pointer;" mode="widthFix" src="/static/tag_shanchu.png" @click="handleRemoveCamera(index,item)"></image>
							</view>
							<view class="col-item-content" style="border-radius: 0rpx 0px 0px 24rpx;width: 100%;display: flex;padding-top: 24rpx;padding-bottom: 24rpx;margin-top: 4rpx;flex-direction: column;">
								<view style="display: flex;justify-content: space-between;align-items: center;">
									<text style="font-size: 24rpx;margin-left: 24rpx;">多参资产</text>
									<text @click="matchCameraItemResources(index,index+1)" style="height: 22px;line-height: 22px;width: 80px;border-radius: 4px;background: #F3F3F3;color: #333;text-align: center;font-size: 14px;cursor: pointer;border: 1rpx solid rgb(238,238,238);">刷新资产</text>
								</view>
								<view class="light-bg-1" style="display: flex;flex-direction: row;align-items: center;width: 100%;box-sizing: border-box; height: 206rpx;border-radius: 16rpx;margin-top: 16rpx;">
									<view style="display: flex;flex-direction: row;align-items: center;justify-content: center; background: #409EFF;border-radius: 8rpx;width: 36rpx;height: 140rpx;margin-top: 16rpx;margin-left: 16rpx;margin-bottom: 16rpx;">
										<text style="font-size: 20rpx;writing-mode: vertical-lr;color: #FFFFFF;font-weight: bold;letter-spacing: 2px;">自动匹配</text>
									</view>
									<scroll-view style="display: flex;white-space: nowrap;overflow: scroll;overflow-y: hidden;overflow-x: auto;flex: 1;height: 100%;" scroll-x="true">
										<block v-for="(autoItem, autoIndex) in item.rongtuImages" :key="autoIndex">
											<view style="cursor: pointer;margin-left:12rpx;display: inline-block;margin-top: 30rpx;max-width: 120rpx;">
												<view style="display: flex;flex-direction: column;align-items: center;">
													<view @click="handlePreviewResource(autoItem)" style=" width: 96rpx;height: 96rpx;background: #E7E7E7;border-radius: 8rpx;border: 2rpx dashed #999999;display: flex;align-items: center;justify-content: center;position: relative;">
														<image v-if="autoItem._type=='image'" style="width: 96rpx;height: 96rpx;" mode="aspectFill" :src="autoItem.url"></image>
														<view style="position: absolute;background: rgba(0, 0, 0, 0.6);width: 100%;height: 12px;bottom: 0;left: 0;line-height: 12px;color: #fff;font-size: 10px;text-align: center;">
															{{ autoItem._tagName }}
														</view>				 
														<view class="icon-reduce" @click.stop="removeRongtuRes(index, autoIndex,autoItem,'rongtuImages')"></view>
													</view>
													<view style="width: 100%;overflow: hidden;text-overflow: ellipsis;text-align: center;">
														<text style="font-size: 20rpx;margin-top: 4rpx;white-space: nowrap;">{{ autoItem.name }}</text>
													</view>
												</view>
											</view>
										</block>
									</scroll-view>
								</view>
								<view class="light-bg-1" style="display: flex;flex-direction: row;align-items: center;justify-content: center;width: 566rpx;height: 206rpx;border-radius: 16rpx;margin-top: 16rpx;">
									<view style="display: flex;flex-direction: row;align-items: center;justify-content: center; background: #409EFF;border-radius: 8rpx;width: 36rpx;height: 140rpx;margin-top: 16rpx;margin-left: 16rpx;margin-bottom: 16rpx;">
										<text style="font-size: 20rpx;writing-mode: vertical-lr;color: #FFFFFF;font-weight: bold;letter-spacing: 2px;">额外参考</text>
									</view>								
									<scroll-view :scroll-left="item.scrollLeft" style="display: flex;white-space: nowrap;overflow: scroll;overflow-y: hidden;overflow-x: auto;flex: 1;height: 100%;" scroll-x="true">
										<view @click="addRongtuRes(index,{uploadFileType:2,tabsIndex:1,})" style="cursor: pointer;display: inline-block;margin-left:12rpx;">
											<view style="display: flex;flex-direction: column;align-items: center;margin-top: 30rpx;">
												<view style="width: 96rpx;height: 96rpx;display: flex;align-items: center;justify-content: center;position: relative;">
													<image style="width: 100%;height: 100%;" src="/static/plus.png"></image>
												</view>
												<text style="font-size: 20rpx;margin-top: 4rpx;">新增参考</text>
											</view>
										</view>
										<block v-for="(resItem, resIndex) in item.cankaoVieoImages" :key="resIndex">
											<view style="display: inline-block;margin-left:12rpx;max-width: 120rpx;">
												<view style="display: flex;flex-direction: column;align-items: center;margin-top: 30rpx;cursor: pointer;">
													<view @click="handlePreviewResource(resItem)" style="width: 96rpx;height: 96rpx;border-radius: 8rpx;display: flex;align-items: center;justify-content: center;position: relative;">
														<image v-if="resItem._type=='image'" style="width: 100%;height: 100%;" mode="aspectFill" :src="resItem.url"></image>
														<view class="holder-video" v-else-if="resItem._type=='video'" style="width: 100%;height: 100%;background-color: #ccc;"></view>
														<view style="position: absolute;background: rgba(0, 0, 0, 0.6);width: 100%;height: 12px;bottom: 0;left: 0;line-height: 12px;color: #fff;font-size: 10px;text-align: center;">
															{{ resItem._tagName }}
														</view>				 
														<view class="icon-reduce" @click.stop="removeRongtuRes(index, resIndex,resItem,'cankaoVieoImages')"></view>
													</view>
													<view style="width: 100%;overflow: hidden;text-overflow: ellipsis;text-align: center;">
														<text style="font-size: 20rpx;margin-top: 4rpx;white-space: nowrap;">{{ resItem.name }}</text>
													</view>
												</view>
											</view>
										</block>
									</scroll-view>
								</view>
							</view>
						</view>

						<scroll-view style="display: flex;white-space: nowrap;overflow: scroll;overflow-y: hidden;overflow-x: auto;flex: 1;height: 100%;padding-left: 3rpx;" scroll-x="true">
							<view style="display: flex;flex-direction: row;height: 100%;">
								<!-- 分镜基础 / 融图提示词-->
								<view id="col2" class="col-item coherent-right" style="flex:2;min-width: 300px;flex-shrink: 0;display: flex;flex-direction: column;align-items: flex-start;">
										<view class="col-item-header" style="display: flex;flex-direction: row;align-items: center;width: 100%;">
											<image @click="selectRongtuOrVideoSP(index,1)" style="cursor: pointer; width: 36rpx; height: 36rpx; margin-right: 8rpx;"
												:src="(projectType==1?item.isSelectVideo:item.isSelectRongtu)?'/static/sel_icon_2.png':'/static/nor_iconb.png'">
											</image>
											<text style="font-size: 32rpx;font-weight: 500;">{{ projectType == 2 ? '融图提示词' : '分镜基础' }}</text>
										</view>
										<view :class="['col-item-content','light-bg-1',{'border-right':projectType != 2}]" style="flex:1;min-height: 0;display: flex;flex-direction: column;align-items: flex-start;border-radius: 16rpx 0px 0px 16rpx;width: 100%;border-right: 1px solid #E7E7E7;">
											<textarea :maxlength="-1" style="width: 100%;overflow: hidden;padding: 16rpx;box-sizing: border-box;flex: 1;min-height: 0;" 
												@blur="fenjingContentEditor"
												@focus="inCameraNameFocus(index)"
												:value="item.fenjinContent" :placeholder="projectType == 2 ? '融图提示词' : '分镜基础'"></textarea>
											<view style="display: flex;align-items: center;width: 100%;border-bottom-left-radius: 16rpx;" :style="{backgroundColor: projectType == 2 ? '#E7E7E7' : 'transparent'}">
												<text style="font-size: 48rpx;font-weight: bold;margin:12rpx;display: inline-block;">@</text>
												<template v-if="projectType == 2">
													<view class="selector" style="flex: 1;min-width: 0;margin-right: 0;"
														@click="handleOpenRongtuSetting(item,index)">
														{{item.rongtuStyle || rongtuConfig.resolution }}<text style="padding: 0 2px;">|</text>{{ item.resolutionratio || rongtuConfig.ratio }}<text
															style="padding: 0 2px;">|</text>{{ item.rongtuCount || rongtuConfig.count }}张
													</view>
													<button v-debounce.click="{handler:()=>createImageQueue(index,1),immediate:true,delay:500}" style="width: 100px;height: 72rpx;background: #F8BA38;border-radius: 8rpx;font-size: 28rpx;font-weight: 500; color: #333333;margin:0;margin-left:16rpx;margin-right: 16rpx;">生图</button>
												</template>												
											</view>
										</view>
								</view>
								<!-- 融图结果--> 
								<template v-if="projectType == 2">
									<view id="col3" class="col-item coherent-left" style="display: flex;flex-direction: column;width: 368px;align-items: flex-start;">
										<view class="col-item-header" style="display: flex;flex-direction: row;align-items: center;width: 100%;">
											<text style="font-size: 32rpx;font-weight: 500;">融图结果</text>
										</view>
										<view class="col-item-content light-bg-1" style="flex:1;min-height: 0;display: flex;flex-direction: column; width: 712rpx;border-radius: 16rpx 16rpx 0px 0px;">
											<scroll-view style="flex:1;min-height: 0;display: flex;white-space: nowrap;overflow: scroll;overflow-y: hidden;overflow-x: auto;height: 100%;border-radius: 16rpx 16rpx 0px 0px;" scroll-x="true">
												<block v-for="(statusitem,statusindex) in item.imageStatusList" :key="statusindex">
													<view v-if="statusitem.status==3 || statusitem.status==11 || statusitem.status==12" style="display: flex;flex-direction: column;align-items: center;margin-left:16rpx;display: inline-block;margin-top: 30rpx;position: relative;">
														<view style="width: 152rpx;height: 340rpx;background: #666666;border-radius: 8rpx;display: flex;align-items: center;justify-content: center;position: relative;overflow: hidden;flex-direction: column;">
															<view style="position: absolute;top: 40%;display: flex;justify-content: center;flex-direction: column;align-items: center;">
																<image src="/static/erroricon.png" style="width: 48rpx;height: 48rpx;margin-bottom: 10rpx;"></image>
																<text style="color:#FFFFFF;font-size: 24rpx;font-weight: 500;margin-bottom: 10rpx;" >{{ statusTextMap[statusitem.status] }}</text>
																<view @click="getTaskInfo(statusitem.taskId)" style="font-size: 20rpx;color: #FFFFFF;font-weight: 500;width: 108rpx;height: 36rpx;line-height: 36rpx; background: #FF5757;border-radius: 18rpx;display: flex;justify-content: center;align-items: center;cursor: pointer;">查看原因</view>
															</view>
														</view>
														<image @click="deleteTask(index,statusindex,statusitem.taskId,4)" style="width: 60rpx; height: 60rpx;position: absolute;top: 6px;right: 6px;cursor: pointer;" src="/static/tag_shanchu.png"></image>
													</view>
													<view v-else-if="statusitem.status==2 || statusitem.status==0" style="display: flex;flex-direction: column;align-items: center;margin-left:16rpx;display: inline-block;margin-top: 30rpx;">
														<view style="width: 152rpx;height: 340rpx;background: #666666;border-radius: 8rpx;display: flex;align-items: center;justify-content: center;position: relative;overflow: hidden;flex-direction: column;">
															<view style="position: absolute;top: 40%;display: flex;justify-content: center;flex-direction: column;align-items: center;">
																<view class="loading-circle" :style="{ borderColor: '#ffffff', borderTopColor: 'transparent' }"></view>
																<text style="color:#FFFFFF;font-size: 24rpx;font-weight: 500;margin-bottom: 10rpx;" >{{ statusTextMap[statusitem.status] }}</text>
																<view v-if="statusitem.status==2" @click="cancelTaskQueue(index,statusitem.taskId)" style="font-size: 20rpx;color: #FFFFFF;font-weight: 500;width: 84rpx;height: 36rpx;background: #FF5757;border-radius: 18rpx;display: flex;justify-content: center;align-items: center;cursor: pointer;">撤销</view>
															</view>
														</view>
													</view>
													<view v-else-if="statusitem.status==5" style="display: flex;flex-direction: column;align-items: center;margin:16rpx 0 0 16rpx;display: inline-block;">
														<view :style="'width: 152rpx;height: 340rpx;background: #E7E7E7;border-radius: 8rpx;display: flex;align-items: center;justify-content: center;position: relative;border: 4px solid ' + (item.rongtyResultImage==statusitem.url?'#FCC34A':'rgba(0, 0, 0, 0)') + ';overflow: hidden;'">
															<image @click="handleSelectRongtuImage(statusitem.url,imgIndex,index)" style="width: 100%;height: 100%" :src="statusitem.url" mode="aspectFill"></image>
															<view style="position: absolute;top: 0;width: 100%;display: flex;justify-content: flex-end;z-index: 2;">
																<image @click="deleteTask(index,statusindex,statusitem.taskId,4)" style="width: 60rpx; height: 60rpx;cursor: pointer;top: 6px;right: 6px;" src="/static/tag_shanchu.png">
																</image>
															</view>
														</view>
													</view>
												</block>
											</scroll-view>
											<view style="display: flex;flex-direction: row;align-items: center;justify-content: flex-end; background:#E7E7E7;border-radius: 0 0 16rpx 0;height: 94rpx;">
												<button @click="addRongtuRes(index,{uploadFileType:1,tabsIndex:0,type:2,title:'添加融图图片',availableType:['jpg', 'jpeg', 'png', 'webp']})" style="margin: 0;margin-right: 12rpx; height: 60rpx;min-width: 120rpx;display: flex;justify-content: center;align-items: center;font-size: 14px;color: #333333;">
													<text>上传</text>
												</button>
											</view>
										</view>
									</view>
								</template>
								<!-- 镜头内容列-->
								<view id="col4" :class="['col-item coherent-right',{'coherent-left':projectType != 2}]" style="flex:3;min-width: 300px;flex-shrink: 0;display: flex;flex-direction: column;align-items: flex-start;height: 100%;" :style="{marginLeft:projectType == 2 ? '3rpx' : '0'}">
									<view class="col-item-header" style="display: flex;flex-direction: row;align-items: center;width: 100%;">
										<image v-if="projectType==2" @click="selectVideoSP(index,1)" style="cursor: pointer; width: 36rpx; height: 36rpx; margin-right: 8rpx;"
											:src="item.isSelectVideo?'/static/sel_icon_2.png':'/static/nor_iconb.png'">
										</image>
										<view style="display: flex;align-items: center;">								
											<text style="font-size: 32rpx;font-weight: 500;">镜头内容</text>
											<!-- <button v-if="projectType != 2" style="height: 60rpx;background: #E7E7E7;border-radius: 8rpx;font-size: 14px;font-weight: 500; color: #333333;margin:0;margin-left:16rpx;display: flex;align-items: center;justify-content: center;padding: 0 8px;" @click="()=>cameraOptimizationPopupOpen(index)">
												<image style="width: 14px;height: 14px;vertical-align: middle;margin-right: 6px;" src="/static/star_icon.png" mode="heightFix"></image>
												<text>分镜优化</text>
											</button> -->
										</view>
									</view>
									<view class="col-item-content light-bg-1" style="flex: 1;width: 100%;min-height: 0;overflow: hidden;" :style="{borderRadius:projectType==2?'16rpx 0 016rpx':'0'}">
										<textarea :maxlength="-1" style="width: 96%;height: 100%;overflow: hidden;margin: 0 16rpx; padding: 16rpx 0;box-sizing: border-box;" 
											@blur="videoSPOutInput"
											@focus="inCameraNameFocus(index)"
											:value="item.videoContentSP" placeholder="镜头内容"></textarea>
									</view>
								</view>
								<!-- 视频设置列-->
								<view id="col5" :class="['col-item','coherent-left',{'coherent-right':projectType == 2}]" style="display: flex;flex-direction: column;align-items: flex-start;height: 100%;width: 245px;flex-shrink: 0;">
									<view class="col-item-header" style="display: flex;flex-direction: row;align-items: center;width: 100%;">
										<text style="font-size: 32rpx;font-weight: 500;">视频设置</text>
									</view>
									<view class="col-item-content" style=" flex: 1;min-height: 0;display: flex;flex-direction: column;width: 100%;height: 100%;">
										<view style="flex:1;min-height: 0;overflow-y: auto;background: #E7E7E7;">
											<text style="font-size: 24rpx;margin-left: 16rpx;">生成秒数</text>
											<view style="margin-left: 16rpx;display: flex;flex-wrap: wrap; align-items: center;gap: 10rpx;margin-top: 12rpx;">
												<block v-for="(seconditem,secondindex) in [4,5,6,7,8,9,10,11,12,13,14,15]" :key="secondindex">
													<button @click="selectVideoTime(index,seconditem)" :style="'margin: 0; margin-right: 8rpx; font-size: 24rpx;width: 120rpx;height: 50rpx;display:flex;justify-content: center;align-items: center;background:'+(seconditem==item.videotime?'#F8BA38':'#FFFFFF')+';color:'+(seconditem==item.videotime?'#FFFFFF':'#000000')+';'">{{seconditem}}S</button>
												</block>
											</view>
											<text style="font-size: 24rpx;margin-left: 16rpx;">生成数量</text>
											<view style="margin-left: 16rpx;display: flex;flex-wrap: wrap; align-items: center;gap: 10rpx;margin-top: 12rpx;">
												<block v-for="(countitem,countindex) in [1,2]" :key="countindex">
													<button @click="videoCountInput(index,countitem)" :style="'margin: 0; margin-right: 8rpx; font-size: 24rpx;width: 120rpx;height: 50rpx;display:flex;justify-content: center;align-items: center;background:'+(countitem==item.createVideoCount?'#F8BA38':'#FFFFFF')+';color:'+(countitem==item.createVideoCount?'#FFFFFF':'#000000')+';'">{{countitem}}</button>
												</block>
											</view>
										</view>
										<view style="padding: 0 16rpx;box-sizing: border-box; background: #E7E7E7;height: 94rpx;display: flex;flex-direction: column;align-items: center;justify-content: center;" :style="{borderBottomRightRadius:projectType!=2?'16rpx':'0'}">
											<button v-debounce.click="{handler:()=>onClickcreateVideo(index),immediate:true,delay:500}" style="width: 100%;height: 60rpx;background: #F8BA38;font-size: 24rpx;font-weight: 500;display:flex;justify-content: center;align-items: center;">生视频</button>
										</view>
									</view>									
								</view>
								<!-- 视频生成结果列-->
								<view id="col6" :class="['col-item',{'coherent-left':projectType == 2}]" style="display: flex;flex-direction: column;width: 368px;border-radius: 0rpx 24rpx 24rpx 0rpx;align-items: flex-start;" :style="{marginLeft:projectType != 2 ? '3rpx' : '0'}">
									<view class="col-item-header" style="display: flex;flex-direction: row;align-items: center;">
										<image @click="selectVideoResult(index,1)" style="cursor: pointer; width: 36rpx; height: 36rpx; margin-right: 8rpx;"
											:src="item.isSelectVideoResult?'/static/sel_icon_2.png':'/static/nor_iconb.png'">
										</image>
										<text style="font-size: 32rpx;font-weight: 500;">视频生成结果<text style="font-size: 24rpx;color: #666666;margin-left: 6rpx;">*选择视频进行二次编辑</text></text>
									</view>
									<view class="col-item-content light-bg-1" style="flex:1;min-height: 0;width: 712rpx;border-radius: 16rpx 16rpx 0px 0px;display: flex;flex-direction: column;">
										<scroll-view style="flex:1;min-height: 0; display: flex;white-space: nowrap;overflow: scroll;overflow-y: hidden;overflow-x: auto;height: 420rpx;border-radius: 16rpx 16rpx 0px 0px;" scroll-x="true">
											<block v-for="(statusitem,statusindex) in item.videoStatusList" :key="statusindex">
												<view v-if="[3,11,12,14].includes(statusitem.status)" style="display: flex;flex-direction: column;align-items: center;margin-left:16rpx;display: inline-block;margin-top: 16rpx;position: relative;">
													<view style="width: 152rpx;height: 340rpx;background: #666666;border-radius: 8rpx;display: flex;align-items: center;justify-content: center;position: relative;overflow: hidden;flex-direction: column;">
														<view style="position: absolute;top: 35%;display: flex;justify-content: center;flex-direction: column;align-items: center;">
															<image src="/static/erroricon.png" style="width: 48rpx;height: 48rpx;margin-bottom: 10rpx;"></image>
															<text style="color:#FFFFFF;font-size: 24rpx;font-weight: 500;margin-bottom: 10rpx;" >{{statusTextMap[statusitem.status]}}</text>
															<view @click="getTaskInfo(statusitem.taskId)" style="font-size: 20rpx;color: #FFFFFF;font-weight: 500;width: 108rpx;height: 36rpx;line-height: 36rpx; background: #FF5757;border-radius: 18rpx;display: flex;justify-content: center;align-items: center;cursor: pointer;">查看原因</view>
														</view>
													</view>
														<image @click="deleteTask(index,statusindex,statusitem.taskId,5)" style="width: 60rpx; height: 60rpx;position: absolute;top: 6px;right: 6px;cursor: pointer;" src="/static/tag_shanchu.png">
															</image>
												</view>
												<view v-else-if="[0,2,13,15].includes(statusitem.status)" style="display: flex;flex-direction: column;align-items: center;margin-left:16rpx;display: inline-block;margin-top: 16rpx;">
													<view style="width: 152rpx;height: 340rpx;background: #666666;border-radius: 8rpx;display: flex;align-items: center;justify-content: center;position: relative;overflow: hidden;flex-direction: column;">
														<view style="position: absolute;top: 40%;display: flex;justify-content: center;flex-direction: column;align-items: center;">
      														<view class="loading-circle" :style="{ borderColor: '#ffffff', borderTopColor: 'transparent' }"></view>
															<text style="color:#FFFFFF;font-size: 24rpx;font-weight: 500;margin-bottom: 10rpx;" >{{statusTextMap[statusitem.status]}}</text>
															<view v-if="statusitem.status==2" @click="cancelTaskQueue(index,statusitem.taskId)" style="font-size: 20rpx;color: #FFFFFF;font-weight: 500;width: 84rpx;height: 36rpx;background: #FF5757;border-radius: 18rpx;display: flex;justify-content: center;align-items: center;cursor: pointer;">撤销</view>
														</view>
													</view>
												</view>
												<view v-else-if="statusitem.status==5" style="display: flex;flex-direction: column;align-items: center;margin-left:16rpx;display: inline-block;margin-top: 16rpx;">
													<view :style="'width: 152rpx;height: 340rpx;background: #E7E7E7;border-radius: 8rpx;display: flex;align-items: center;justify-content: center;position: relative;border: 4px solid ' + (item.videoResultUrl==statusitem.url?'#FCC34A':'rgba(0, 0, 0, 0)') + ';overflow: hidden;'">
														<video @click="selectResultVideo(index,statusitem.url)" style="width: 100%;height: 100%" :src="statusitem.url" :controls="false" :show-fullscreen-btn="false" :show-center-play-btn="false" object-fit="contain"></video>
														<view style="position: absolute;top: 0;width: 100%;display: flex;justify-content: flex-end;z-index: 2;">
															<image @click="deleteTask(index,statusindex,statusitem.taskId,5)" style="width: 60rpx; height: 60rpx;cursor: pointer;top: 6px;right: 6px;" src="/static/tag_shanchu.png">
															</image>
														</view>
														<view style="display: flex;flex-direction: column;align-items: flex-end; color: #FFFFFF;position: absolute;bottom: 0;width: 100%;z-index: 2;border-radius: 6rpx;background: rgba(0, 0, 0, 0.4);">
															<view v-if="statusitem.enhanceStatus===1&&statusitem.templateId" style="width: 112rpx;height: 32rpx;background: linear-gradient(89deg, #2BE851 0%, #A5ED48 72%);border-radius: 6rpx;font-size: 20rpx;color: #333;display: flex;justify-content: center;align-items: center;">超分{{ state.enchanceMap[statusitem.templateId] }}</view>
															<view v-if="statusitem.subtitlesStatus===1" style="width: 60rpx;height: 32rpx;background: rgba(0, 0, 0, 0.4);border-radius: 6rpx;font-size: 20rpx;color: #FFFFFF;display: flex;justify-content: center;align-items: center;margin-top: 2px;">去字幕</view>
															<!-- <view style="width: 60rpx;height: 32rpx;background: rgba(0, 0, 0, 0.4);border-radius: 6rpx;font-size: 20rpx;color: #FFFFFF;display: flex;justify-content: center;align-items: center;">草稿</view> -->
														</view>
													</view>
												</view>
											</block>
										</scroll-view>
										<view style="display: flex;flex-direction: row;align-items: center;justify-content: flex-end; background: #E7E7E7;height: 94rpx;" :style="{borderRadius:projectType == 2 ? ' 0 0 16rpx 0' : ' 0 0 16rpx 16rpx'}">
											<!-- <button @click="openEditorVideo(index)" style="margin: 0;margin-right: 12rpx; height: 60rpx;width: 120rpx;display: flex;justify-content: center;align-items: center;font-size: 24rpx;color: #333333;">修改</button> -->
											<!-- <button @click="VideoTimeExtend(index)" style="margin: 0;margin-right: 12rpx;height: 60rpx;width: 120rpx;display: flex;justify-content: center;align-items: center;font-size: 24rpx;color: #333333;">延长</button> -->
											<!-- <button @click="Vidoe1080P(true)" style="margin: 0;margin-right: 20rpx; height: 60rpx;width: 120rpx;display: flex;justify-content: center;align-items: center;font-size: 24rpx;color: #333333;">超分</button> -->
											<!-- <button @click="openVideoDetail(index)" style="margin: 0;margin-right: 12rpx; height: 60rpx;width: 120rpx;display: flex;justify-content: center;align-items: center;font-size: 24rpx;color: #333333;">展开详情</button> -->
											<view :class="['dropdownBtn',{'active':state.enchancedVideoIndex===index}]" @click="enchancedVideoPopup(index)" style="border-radius: 4px 0 0 4px;">
												<text>{{state.enchancedVideoConfig[item.superResolution].dictLabel}}</text>
												<view class="list">
													<view :class="['item',{'active':item.superResolution===dictIndex}]" v-for="(dict,dictIndex) in state.enchancedVideoConfig" :key="dictIndex" @click="enchancedVideoChange(dictIndex,index)">{{ dict.dictLabel }}</view>
												</view>
											</view>
											<view style="background-color: #fff;height: 30px;line-height: 30px;text-align: center;width: 52px;border-radius: 0 4px 4px 0;margin-right: 12rpx;border-left: 1px solid rgb(231, 231, 231);cursor: pointer;" @click="enchancedVideo(index,item.videoResultUrl,item.videoStatusList)">超分</view>
											<button @click="subtitlesVideo(index,item.videoResultUrl,item.videoStatusList)" style="margin: 0;margin-right: 12rpx; height: 60rpx;min-width: 120rpx;display: flex;justify-content: center;align-items: center;font-size: 14px;color: #333333;">
												<text>去字幕</text>
											</button>
											<button @click="downloadVideo(index,item.videoResultUrl)" style="margin: 0;margin-right: 12rpx; height: 60rpx;min-width: 120rpx;display: flex;justify-content: center;align-items: center;font-size: 14px;color: #333333;">
												<image src="/static/download.png" style="width: 14px;height: 14px;" mode="widthFix"></image>
												<text>下载</text>
											</button>
										</view>
									</view>
								</view>
							</view>
						</scroll-view>
					</view>
				</block>
			</scroll-view>
		</view>
	</view>

	<!-- 视频详情 -->
    <VideoDetail 
		v-if="state.showVideoDetail" 	
		:name="state.cameraList[state.curCameraIndex].name"
		:data="state.cameraList[state.curCameraIndex].videoStatusList"
		:cameraIndex="state.curCameraIndex"
		:videoResultUrl="state.cameraList[state.curCameraIndex].videoResultUrl"
		:statusTextMap="statusTextMap"
		:enchanceMap="state.enchanceMap"
		@close="state.showVideoDetail = false"
		@getTaskInfo="getTaskInfo"
		@cancelTaskQueue="({index,taskId})=>cancelTaskQueue(index,taskId)"
		@deleteTask="({index,statusindex,taskId,typeId})=>deleteTask(index,statusindex,taskId,typeId)">
	</VideoDetail>

	<!-- 公共库资源选择器 -->
    <PopupResourcePicker v-if="state.isOpenResmanager" :uploadFileType="resourcePickerConfig.uploadFileType" :tabsIndex="resourcePickerConfig.tabsIndex" :title="resourcePickerConfig.title" :projectId="props.projectConfig.id" :availableType="resourcePickerConfig.availableType" @close="closeResManager"
        @confirm="saveExtractResources">
    </PopupResourcePicker>

	<!-- 视频预览播放 -->
	<view class="mark" v-if="state.ispreviewVideo">
		<video object-fit="contain" style="height: 100%;width: 100%;z-index: 10;" autoplay :src="state.previewVideourl" id="preVideo"
			:loop="true" :autoplay="true" :controls="true">
		</video>
		<view  @click="closePreviewVideo()" style="z-index:11;position: absolute;top: 64rpx;right: 64rpx;width: 100rpx;height: 100rpx;background-color: #ffffff; border-radius: 50%; font-size: 48rpx;font-weight: bold;color: #333;display: flex;align-items: center;justify-content: center;">
			X
		</view>
	</view>

	<!-- 音频预览播放 -->
	<PopupAudioPreview v-if="audioPreviewPopup.visible" :src="audioPreviewPopup.url" :title="audioPreviewPopup.title" @close="closePreviewAudio"></PopupAudioPreview>

	<!-- 融图参数选择弹窗 -->
	<PopupRongtuSetting v-if="rongtuConfig.visible" :value="rongtuConfig" @close="rongtuConfig.visible = false" @confirm="handleRongtuSettingConfirm"></PopupRongtuSetting>

	<!-- 分镜优化弹窗 -->
	<PopupCameraOptimization
		v-if="cameraOptimizationPopup.visible" 
		:data="cameraOptimizationPopup.data" 
		:projectId="props.projectConfig.id" 
		@close="cameraOptimizationPopup.visible = false"
		@update="handleCameraContentUpdate">
	</PopupCameraOptimization>

	<Teleport to="body" v-if="cameraEditorDialogConfig.visible">
		<view style="display: flex;flex-direction: column;align-items: center; width: 360px;min-height: 180px;border-radius: 8px; background: #fff;position: fixed;left: 50%;top: 50%;z-index: 103;transform: translate(-50%,-50%);box-shadow: 0 0 10rpx rgba(0, 0, 0, 0.1);padding: 16px;box-sizing: border-box;">
			<view style="color: #333;font-weight: 500;font-size: 16px;line-height: 32px;margin-bottom: 18px;">{{ cameraEditorDialogConfig.title }}</view>
			<view style="flex: 1;min-height: 0;width: 100%;text-align: center;font-size: 16px;color: #666;">{{ cameraEditorDialogConfig.content }}</view>
			<view style="display: flex;align-items: center;margin-top: 8px;">
				<checkbox-group @change="(e)=>{cameraEditorDialogConfig.checked = e.detail.value.includes('copy')}">
					<checkbox value="copy" :checked="cameraEditorDialogConfig.checked" color="#409eff"  style="transform: scale(0.83);"/>
				</checkbox-group>
				<text style="color: #999;font-size: 16px;">复制本分镜内容</text>
			</view>
			<view style="display: flex;align-items: center;margin-top: 12px;">
				<view style="height: 36px;width: 80px;line-height: 36px;text-align: center;background-color: #fff;color: rgb(96, 98, 102);border: 1px solid rgb(220, 223, 230);border-radius: 4px;cursor: pointer;" @click="cameraEditorDialogConfig.visible = false">取消</view>
				<view style="height: 36px;width: 80px;line-height: 36px;text-align: center;background-color: #409eff;color: #fff;border-radius: 4px;cursor: pointer;margin-left: 16px;" @click="handleGlobalDialogConfirm">确认</view>
			</view>
		</view>
		<view style="position: fixed;z-index: 102; background-color: rgba(0, 0, 0, 0.5);width: 100vw;height: 100vh;left: 0;top: 0;"></view>
	</Teleport>
</template>

<script setup>
	import { onLoad } from "@dcloudio/uni-app";
    import {defineProps,ref, nextTick,onMounted,reactive, onUnmounted,defineEmits, computed, watch, onDeactivated} from "vue";
	import { AddNewResource, DeleteResource, EditorResource, GetResourceTypeList,GetResourceList,GetResourceListByProject } from "../../common/ResourceMgr";
	import { isNull, UploadFile, uploadFileToServer, checkMediaType } from "../../common/Tool";
	import { cancelSingleTaskQueue, GetCamereDetail, GetProjectEpisodesList, MarkCompleteCamera, ModifyProjectEpisodes, newCameraConfig,CheckTaskQueue, DeleteTask, DeleteCameraVideoHistory,DeleteCameraRongtuHistory,getTaskBaseInfo } from "../../common/ProjectMgr";
	import { ImageIdentify, seedance2Video, ViduQ2Video,ViduQ3Video,ViduQ2ProVideo,DoubaoSeedance1_5Video,BananaImage,BananaProImage,Doubaoseedream4_5Image, KirinV3OmniVideo,KirinV3TextImage,aliToVideo } from "../../common/AIAgentForServer";
	import { aboardDoubaoseedance1_5,aboardDoubaoSeedream4_5 } from "@/common/AIAgent";
	import { GetAIModelList } from "../../common/Common";
	import Episode from "@/components/Episode.vue";
	import VideoDetail from "@/components/VideoDetail.vue";
	import PopupResourcePicker from '@/components/PopupResourcePicker.vue'
	import PopupRongtuSetting from '@/components/PopupRongtuSetting.vue'
	import PopupAudioPreview from '@/components/PopupAudioPreview.vue'
	import { debounce,cloneDeep } from "lodash";
	import { useStore } from "vuex";
	import { APIPath, getRequest, postRequest } from "../../common/APIRequest";
	import {GetDict} from "@/common/Common";
	import PopupCameraOptimization from '@/components/PopupCameraOptimization.vue';	
	
	const store = useStore();

  	const emits = defineEmits(["cancelTaskQueueSucceed"])

	const props = defineProps({
		projectConfig:{
			type:Object,
			default:()=>{}
		}
	})
	const state=reactive({
		ispreviewVideo:false,
		ispreviewAudio:false,
		previewVideourl:"",
		previewAudiourl:"",

		fenjiList:[],
		spList:[],
		videoTimes:[4,5,6,8,10,12],
		videoFpss:[8,12,24],
		resourceTopTab:[
			{name:"本集",type:1},
			{name:"本项目",type:2},
			{name:"公共库",type:3},
			{name:"所有",type:4},
		],

		isOpenResmanager:false,
		curResType:1,
		resTypeList:[
			{name:"角色",type:2,resList:[]},
			{name:"场景",type:3,resList:[]},
			{name:"道具",type:4,resList:[]},
		],
        curResList:[],
		newResConfig:{
			id:0,
			type:1,
			title:'',
			imageUrl:"",
			detail:'',
		},
		isNewRes:false,
		curResIndex:0,

		cameraList:[],		
		camerasFirstLoaded:false, // 当前集至少成功加载一次分镜数据，用于保存时进行判断，避免数据没加载然后调用保存结果分镜被清空

		curCameraIndex:0,
		dragHoverIndex: -1, // 拖拽悬停的camera-item索引

		curfanqiuSP:[],
		curSelectFanqiuSPValue:'',

		isOpenSelectEndCamera:false,
		curhuafengSP:[],
		currongtuSP:[],
		curjiweiSP:[],
		curgoutuSP:[],
		curfenweiSP:[],
		curguanxianSP:[],
		curyunjingSP:[],
		curCamContentSP:[],
		cureffectSP:[],
		isOpenRongtuSP:false,
		curSelectRongtuSPValue:'',
		curHuafengContent:'',
		curRongtuContent:'',
		curSelectRongtuSenceValue:'',
		rongtuImageurl:'',
		curRongtuIamges:[],
		curjiweiContent:'',
		curgoutuContent:'',
		curfenweiContent:'',
		curguangxianContent:'',
		curRongtuEditorType:1,

		isOpenHistory:false,
		curHistoryList:[],
		curDownloadType:1,
		
		isOpenVideSP:false,
		curSelectVideoSPValue:'',
		curVideoSP:[],
		curSelecteffectSP:'',
		curSelectyunjingSP:'',
		curSelectjingtouSP:'',
		importType:0,
		
		curfinishCount:0,
		rongtuResolutionList:[{value:'1K',text:'1K'},{value:'2K',text:'2K'}],
		resolution:[{value:'16:9',text:'16:9'},{value:'9:16',text:'9:16'}],
		curResolution:'16:9',

		curVideoIamges:[],
		curCankaoVideo:[],
		isMulitVideoSP:false,
		videoAgent:[],
		curVideoAgent:'vidu_q2',
		imageAgent:[],

		isChangContent:false,
		agentList:[],
		showVideoDetail:false,
		curvideoDetail:{},
		finishCount:0,

		downloadCount:0, // 一键下载视频loading状态,大于0显示，等于0隐藏
		selectedVideoIds:[], // 选中的视频ID集合
		selectedStoryBoardIds:[], // 选中的分镜列ID集合
		selectedRongtuIds:[], // 选中的融图列ID集合
		resourceTabs:[],
		autoUploadHover:null,

		spContent:{
			rongtu_huafeng:'', //融图画风
			video_huafeng:'', // 视频画风
		},

		enchancedVideoConfig:[], // 超分配置字典数据
		enchancedVideoIndex:-1, // 当前选中的超分配置索引
		
		showCameraOptimization:true, // 分镜优化弹窗显示状态

		enchanceMap:{
			101560:'2k',
			101580:'4k',
			101520:'720p',
			101540:'1080p',
		}
	})

	// 分镜优化弹窗配置
	const cameraOptimizationPopup = reactive({
		visible:false,
		data:[]
	})

	// 分镜添加弹窗配置
	const cameraEditorDialogConfig = reactive({
		visible:false,
		title:'提示',
		content:'',
		checked:false
	})

	// 图生流程融图设置弹窗配置
	const rongtuConfig = reactive({
		visible:false,
		resolution:'1K',
		ratio:'9:16',
		count:1,
		extract:{
			index:null, // 分镜的索引
		}
	})

	const audioPreviewPopup = reactive({
		url:null,
		visible:false,
		title:''
	})

	// 资源选择器弹窗配置
	const resourcePickerConfig = reactive({
		uploadFileType:2,
		tabsIndex:1,
		type:'', //2 上传资源到融图列表
		title:'添加额外参考内容',
	})

	const statusTextMap = reactive({
		0:'生成中',
		2:'队列中',
		3:'生成失败',
		11:'图像违规',
		12:'文本违规',
		13:'去字幕中',
		14:'去字幕失败',
		15:'超分中',
	})

	const projectType = computed(()=>{
		return props.projectConfig?.type
	})

	watch(()=>props.projectConfig.projectConfig,(newVal)=>{
		if(newVal){
			const {rtConfig} = newVal
			rongtuConfig.resolution=rtConfig.resolution
			rongtuConfig.ratio=rtConfig.frame
			rongtuConfig.count=rtConfig.num

			// 如果有新的值，清空spContent，后续使用最新的项目设置的值
			state.spContent = {}
		}
	},{
		deep:true,
		immediate:true,
	})

	let saveintervalID=null

	onLoad((options)=>{
		GetProjectEpisodesList(1,500,props.projectConfig.id,(data)=>{		
			sortFenjiList(data.rows);
			
			// 统计每集的场次数，如果场次大于1，该集全部场次后面追加场次名称
			const collects = {};
			for(let citem of data.rows){
				!collects[citem.collectId] && (collects[citem.collectId]=0);
				collects[citem.collectId]++;
			}
			for(let citem of data.rows){
				if(collects[citem.collectId]>1){
					citem.extractName = `（${citem.fieldId}场）`
				}
			}
			state.fenjiList= data.rows;

			if(state.fenjiList.length>0){
				let lastEpisodeId=null;
				const lastSelectedEpisodeInfo = uni.getStorageSync('lastSelectedEpisodeInfo');
				if(lastSelectedEpisodeInfo && lastSelectedEpisodeInfo.projectId==props.projectConfig.id && lastSelectedEpisodeInfo.episodeId){
					const targetEpisodeIndex = data.rows.findIndex(item=>item.id==lastSelectedEpisodeInfo.episodeId)
					if(targetEpisodeIndex>-1){
						lastEpisodeId = data.rows[targetEpisodeIndex].id;
					}
				}			
				state.curepisodesId = lastEpisodeId || state.fenjiList[0].id;
				updateEpisodes(state.curepisodesId)
			}
		},(error)=>{

		})
		state.curResType=state.resTypeList[0].type
		// saveintervalID = setInterval(()=>{
		// 	// console.log('是否需要保存==>',state.isChangContent)
		// 	// if(state.isChangContent && !state.isOpenRongtuSP && !state.isOpenVideSP){
		// 	// 	state.isChangContent=false
		// 	// 	saveCameraConfig();
		// 	// }
		// 	state.isChangContent && saveCameraConfig()
		// },20000)

		// 获取超分列表
		GetDict('enhanced_video').then((data)=>{
			state.enchancedVideoConfig = data
		})

	})

	// 同步一遍分集里面资源的最新数据
	function updateCameraResourceInfo(cameras){
		return new Promise((resolve,reject)=>{
			if(cameras.length==0){
				resolve()
			}
			GetResourceListByProject({projectId:props.projectConfig.id},(resList)=>{
				for(let ritem of resList){
					for(let citem of cameras){
						for( let autoItem of citem.rongtuImages){
							if(autoItem.id==ritem.id){
								// 补充seedance2的审核ID
								autoItem.value=ritem.value
								// 更新其余字段
								autoItem.coreFeature=ritem.coreFeature
								autoItem.voiceName=ritem.voiceName
								autoItem.voiceDetail=ritem.voiceDetail
								autoItem.typeId=ritem.typeId
								autoItem.name=ritem.name
								autoItem.url = ritem.url
								autoItem.assets = ritem.assets
							}
						}
						for( let ckItem of citem.cankaoVieoImages){
							if(ckItem.id==ritem.id){
								// 补充seedance2的审核ID
								ckItem.value=ritem.value
								// 更新其余字段
								ckItem.coreFeature=ritem.coreFeature
								ckItem.voiceName=ritem.voiceName
								ckItem.voiceDetail=ritem.voiceDetail
								ckItem.typeId=ritem.typeId
								ckItem.name=ritem.name
								ckItem.url = ritem.url
								ckItem.assets = ritem.assets
							}
						}
					}
				}
				resolve()
			})
		})	
	}

	// 排序 fenjiList 函数(先按集数collectId排、再按场次fieldId排)
	function sortFenjiList(listData) {
		// 先按 collectId 排序，再按 fieldId 排序
		listData.sort((a, b) => {
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
		// console.log('排序后的 fenjiList:', listData)
	}

	function deleteTask(index,statusindex,taskId,typeId) {
		const cameraItem = state.cameraList[index];
		const list = typeId==4?cameraItem.imageStatusList:cameraItem.videoStatusList;
		const fn = ()=>{
			DeleteTask(taskId,()=>{	
				list.splice(statusindex, 1)
				if(typeId==4){
					cameraItem.rongtyResultImage = '';
				}else{
					cameraItem.videoResultUrl = '';
				}
				saveCameraConfig()
			})
		}
		if(list[statusindex].status==5){
			uni.showModal({
				title: '提示',
				content: '确定删除？',
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

	function openVideoDetail(index){
		state.curvideoDetail=state.cameraList[index]
		state.showVideoDetail=true
	}

	function extractContentByColon(str) {
		if(!str){
			return []
		}

		const lines = str.split('\n');
		const result = [];
		lines.forEach(line => {
			let label,content='';
			const trimmedLine = line.trim();
			if (!trimmedLine) return;
			const colonIndex = trimmedLine.search(/[:：]/);
			if (colonIndex !== -1){			
				label = trimmedLine.substring(0, colonIndex).trim();
			}
			content = trimmedLine.substring(colonIndex + 1).trim();
			
			result.push({
				title:label,
				content:content
			})
		});

		return result;
	}
	function extractSecondAndRemoveDuration(content) {
		if(!content){
			return { secondNum: 4, cleanContent: '' };
		}
		const regex = /时长：\s*[\d.]+\s*(秒|s)/i;
		const numRegex = /时长：\s*([\d.]+)\s*(秒|s)/i;
		const numMatch = content.match(numRegex);
		let secondNum = numMatch ? Math.ceil(numMatch[1]) : 4;
		secondNum = secondNum>15?15:secondNum
		const cleanContent = content
			.replace(regex, '') 
			.replace(/^\s+|\s+$/gm, '')
			.trim();

		return { secondNum, cleanContent };
	}

	function onClickfenjiItem(e){
		if(state.isChangContent){
			saveCameraConfig()
		}
		state.camerasFirstLoaded = false;
		if(state.curepisodesId==e.id){
			return
		}
		state.curepisodesId=e.id
		updateEpisodes(e.id)
	}
	
	// 格式化自动匹配的图片，额外参考，增加标签
	function formatCameraResources(cameraElement){
		const mediasCount = {};
		const mediaMap = {
			'image':'图片',
			'video':'视频',
			'audio':'音频',
			'unknown':'未知',
		}
		const mediaList = cameraElement.rongtuImages.concat(cameraElement.cankaoVieoImages)
		for(let i=0;i<mediaList.length;i++){
			const mediaItem = mediaList[i];
			const mediaType = checkMediaType(mediaItem.url);
			if(!mediasCount[mediaType]){
				mediasCount[mediaType]=1
			}else{
				mediasCount[mediaType]++
			}
			mediaItem._type=mediaType
			mediaItem._typeName=mediaMap[mediaType]
			mediaItem._tagName = `${mediaItem._typeName}${mediasCount[mediaType]}`
		}
	}

	// 单独更新融图。视频生成结果相关
	function updateCameraQeueueLoopResult(episodeId){
		state.finishCount=0;
		GetCamereDetail(episodeId,(data)=>{
			if(state.curepisodesId!=data.id){
				return
			}
			// state.cameraList=data.cameras || []

			for (let index = 0; index < data.cameras.length; index++) {
				const element ={...data.cameras[index]}

				if(element.completeStatus==1){
					state.finishCount++
				}
				state.cameraList[index].rongtuHistory = element.rongtuHistory;
				state.cameraList[index].rongtyResultImage = element.rongtyResultImage;
				state.cameraList[index].videoHistory = element.videoHistory;
				state.cameraList[index].videoResultUrl = element.videoResultUrl;
				state.cameraList[index].selectVideoResult = element.selectVideoResult;
				state.cameraList[index].selectVideo = element.selectVideo;
			}
			
			// CheckTaskQueue({
			// 	projectId:props.projectConfig.id,
			// },(data)=>{
			// 	updateTaskStatus(data.queue,false);
			// })	
		},(errormsg)=>{

		})

	}

	function updateEpisodes(id,isUpdateResource){
		state.finishCount=0;
		GetCamereDetail(id,(data)=>{
			state.camerasFirstLoaded=true;

			// 防止快速切换分集后，被上一个分集详情接口数据覆盖
			if(state.curepisodesId!=data.id){
				return
			}
			const fn = ()=>{
				state.cameraList=[]

				for (let cindex = 0; cindex < data.cameras.length; cindex++) {
					const element ={...data.cameras[cindex]}

					formatCameraResources(element)

					element.videoStatusList=[];
					element.imageStatusList = [];
					element.superResolution = 0;		

					var extractContent= extractContentByColon(element.fenjinContent);
					let rs = cloneDeep(element.rongtuImages.concat(element.cankaoVieoImages||[])).sort((prev,next)=>next.name?.length-prev.name?.length);
					for (let index = 0; index < extractContent.length; index++) {
						const item = extractContent[index];
						// if(item.title=='核心人物' || item.title=='关键道具' || item.title=='场景背景'){
						if(['角色','场景','道具','运镜','音频'].includes(item.title)){
							var roles= item.content.split(/[，,、]{1}/);
							for (let i = 0; i < roles.length; i++) {
								const regex = /[@]?(图片|视频|音频|未知)\d?/g;
								const roleName = roles[i].replace(regex, '').replace(/[\u200B\uFEFF\s]+/g, '').trim();
								// const roleName = roles[i];
								if(item.title=='音频'){
									rs = rs.filter(item=>item._type=='audio')
								}else{
									rs = rs.filter(item=>item._type!='audio')
								}
								var findIndex= rs.findIndex(item=>roleName.includes(item.name));
								var findImageName='';
								if(findIndex>-1){
									findImageName=rs[findIndex]._tagName
									roles[i]=`${roleName}@${findImageName}`
								}else{
									roles[i]=roleName
								}
								// console.log('角色==',roles[i])
							}
							item.content=roles.join('、')
							// console.log('匹配后的名字',item.content)
						}
					}

					extractContent.length>0 && (element.fenjinContent=extractContent.map(item=>{
						if(item.title){
							return item.title+':'+item.content
						}else{
							return item.content
						}
					}).join('\n'))
					
					var { secondNum, cleanContent } = extractSecondAndRemoveDuration(element.videoContentSP);
					//  console.log('时长==',secondNum)
					if(element.videotime<=0){
						element.videotime=secondNum
					}
					element.videoContentSP=cleanContent

					// 还原视频选中状态
					if(state.selectedVideoIds.includes(element.id)){
						element.isSelectVideoResult=true
					}
					// 还原分镜选中状态
					if(state.selectedStoryBoardIds.includes(element.id)){
						element.isSelectVideo=true
					}
					// 还原融图选中状态
					if(state.selectedRongtuIds.includes(element.id)){
						element.isSelectRongtu=true
					}

					// element.videoSP=element.videoContentSP
					// console.log('资产==',element.rongtuImages)
					// if(element.rongtuImages.length>0){
					// 	var voice=''
					// 	for(let i=0;i<element.rongtuImages.length;i++){
					// 		if(!isNull(element.rongtuImages[i].voiceName) && !isNull(element.rongtuImages[i].voiceDetail)){
					// 			voice+= `${element.rongtuImages[i].voiceName}:${element.rongtuImages[i].voiceDetail}\n`
					// 		}
					// 	}
					// 	element.videoSP = element.videoContentSP+ '\n'+voice
					// }

					// console.log('分镜基础内容切割==',extractContent)

					if(isNull(element.endCamera)){
						element.endCamera={}
					}
					if(element.completeStatus==1){
						state.finishCount++
					}
					// 添加滚动位置属性
					element.scrollLeft = 0;
					state.cameraList.push(element)
				}
			}

			updateCameraResourceInfo(data.cameras).then(()=>{
				fn()
				CheckTaskQueue({
					projectId:props.projectConfig.id,
				},(data)=>{
					updateTaskStatus(data.queue,false);
				})
			})	
		},(errormsg)=>{

		})
	}

	// 融图、分镜列单个选择，根据项目类型匹配
	function selectRongtuOrVideoSP(index){
		if(projectType.value==1){
			selectVideoSP(index)
		}
		else if(projectType.value==2){
			selectRongtu(index)
		}
	}

	function selectAllRongtuOrVideoSP(isSelect){
		if(projectType.value==1){
			selectAllVideoSP(isSelect)
		}
		else if(projectType.value==2){
			selectAllRongtu(isSelect)
		}
	}

	// 单个融图选择
	function selectRongtu(index){
		const _value = !state.cameraList[index].isSelectRongtu;
		state.cameraList[index].isSelectRongtu = _value;
		if(_value==true){
			const _id = state.cameraList[index].id
			if(state.selectedRongtuIds.includes(_id)){
				for(let i=0;i<state.selectedRongtuIds.length;i++){
					if(state.selectedRongtuIds[i]==_id){
						state.selectedRongtuIds.splice(i,1)
						break;
					}
				}
			}else{
				 state.selectedRongtuIds.push(_id)
			}
		}
		state.isChangContent=true
	}

	//一键选中融图
	function selectAllRongtu(isSelect){
		state.selectedRongtuIds = []; // 清空已选中的视频ID
		state.cameraList.forEach(item=>{
			item.isSelectRongtu=isSelect
			if(isSelect){
				state.selectedRongtuIds.push(item.id)
			}
		})
		state.isChangContent=true
	}

	//一键选中视频
	function selectAllVideoSP(isSelect){
		state.selectedStoryBoardIds = []; // 清空已选中的视频ID
		state.cameraList.forEach(item=>{
			item.isSelectVideo=isSelect
			if(isSelect){
				state.selectedStoryBoardIds.push(item.id)
			}
		})
		state.isChangContent=true
	}

	//选中单个视频生成
	function selectVideoSP(index){
		const _value = !state.cameraList[index].isSelectVideo;
		state.cameraList[index].isSelectVideo = _value;
		if(_value==true){
			const _id = state.cameraList[index].id
			if(state.selectedStoryBoardIds.includes(_id)){
				for(let i=0;i<state.selectedStoryBoardIds.length;i++){
					if(state.selectedStoryBoardIds[i]==_id){
						state.selectedStoryBoardIds.splice(i,1)
						break;
					}
				}
			}else{
				 state.selectedStoryBoardIds.push(_id)
			}
		}
		state.isChangContent=true
	}

	//一键选中视频结果
	function selectAllVideoResult(isSelect){
		state.selectedVideoIds = []; // 清空已选中的视频ID
		state.cameraList.forEach(item=>{
			item.isSelectVideoResult=isSelect
			if(isSelect){
				state.selectedVideoIds.push(item.id)
			}
		})
		state.isChangContent=true
	}

	//选中单个视频结果
	function selectVideoResult(index){
		const _value = !state.cameraList[index].isSelectVideoResult
		state.cameraList[index].isSelectVideoResult = _value
		if(_value==true){
			const _id = state.cameraList[index].id
			if(state.selectedVideoIds.includes(_id)){
				for(let i=0;i<state.selectedVideoIds.length;i++){
					if(state.selectedVideoIds[i]==_id){
						state.selectedVideoIds.splice(i,1)
						break;
					}
				}
			}else{
				 state.selectedVideoIds.push(_id)
			}
		}
		state.isChangContent=true
	}

	//标记完成
	function markComplete(index){
		MarkCompleteCamera({
			"handelId": state.curepisodesId,
			"cameraId": state.cameraList[index].id
		},(data)=>{
			state.cameraList[index].completeStatus=data;	
			data==1?state.finishCount+=1:state.finishCount-=1;	
			uni.showToast({
				title:data==1?"已标记完成":"已取消标记",
				icon:'none',
				duration:2000
			})
		},(err)=>{
		})
	}

	function updateVideoSp(){
		state.curvideoSPbottom=state.curSelectjingtouSP+"\n"+
		state.curSelectyunjingSP+"\n"+state.curfenweiContent+"\n"+state.curSelecteffectSP
	}

	//视频内容SP编辑
	function videoSPOutInput(e){
		state.cameraList[state.curCameraIndex].videoContentSP=e.detail.value
		state.isChangContent=true
	}

	function selectVideoTime(index,time){
		state.cameraList[index].videotime=time
		state.isChangContent=true
		//state.selectvideotimeValue=item
	}

	//改变视频生成次数
	function videoCountInput(index,count){
		state.cameraList[index].createVideoCount=count
		state.isChangContent=true
		//state.selectvideocountValue=e
	}

	//一键下载视频结果
	function downloadAllVideo(){
		state.cameraList.forEach(item=>{
			if(item.isSelectVideoResult && !isNull(item.videoResultUrl)){
				var imageName=item.name;
				state.downloadCount+=1;
				saveVideoToLocalH5(item.videoResultUrl,imageName);
			}
		})
	}

	//一键下载融图
	function downloadAllRongtuImage(){
		state.cameraList.forEach(item=>{
			if(item.isSelectRongtuResult){
				var imageName=item.name
				saveImageToLocalH5(item.rongtyResultImage,imageName)
			}
			if(Object.keys(item.endCamera).length!=0){
				if(item.endCamera.isSelectRongtuResult){
					var imageNameend=item.endCamera.name+'_尾帧'
					saveImageToLocalH5(item.endCamera.rongtyResultImage,imageNameend)
				}
			}
		})
	}

	//下载单个视频结果
	function downloadVideo(index,url){
		if(isNull(url)){
			return
		}
		var videoName=state.cameraList[index].name
		saveVideoToLocalH5(url,videoName)
	}

	function downloadOtherRongtuImage(url,index){
		var imageName=state.cameraList[state.curCameraIndex].name+"_"+index
		 saveImageToLocalH5(url,imageName)
	}


 function saveImageToLocalH5(imgUrl, fileName) {
	// const proxyImgUrl = imgUrl.replace(
	// 	'https://ccyres.acgvr.com',
	// 	'/api-img'
	// 	);
	proxyImgUrl=imgUrl
  	return new Promise(async (resolve, reject) => {
    try {
       let blob;
		const response = await fetch(proxyImgUrl, {
          mode: 'cors',
          headers: {
            'Access-Control-Allow-Origin': '*'
          }
        });
        blob = await response.blob();

       const url = window.URL.createObjectURL(blob);
       const a = document.createElement('a');
       a.href = url;
      
       const fileExt = blob.type.split('/')[1] || 'jpeg';
       a.download = `${fileName}.${fileExt}`; 
      
      document.body.appendChild(a);
      a.click();
      
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
      
      resolve({
        success: true,
        message: '图片保存成功，请在浏览器下载文件夹中查看'
      });
    } catch (error) {
      reject({
        success: false,
        message: '图片保存失败：' + error.message
      });
    }
  });
}

 function saveVideoToLocalH5(imgUrl, fileName) {
	// console.log('触发 saveVideoToLocalH5',imgUrl, fileName)
	// const proxyImgUrl = imgUrl.replace(
	// 	'https://ccyres.acgvr.com',
	// 	'/api-img'
	// 	);
	const proxyImgUrl = imgUrl
  	return new Promise(async (resolve, reject) => {
    try {
       let blob;
		const response = await fetch(proxyImgUrl, {
          mode: 'cors',
          headers: {
            'Access-Control-Allow-Origin': '*'
          }
        });
        blob = await response.blob();

       const url = window.URL.createObjectURL(blob);
       const a = document.createElement('a');
       a.href = url;
      
       const fileExt = blob.type.split('/')[1] || 'mp4';
       a.download = `${fileName}.${fileExt}`; 
      
      document.body.appendChild(a);
      a.click();
      
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
      
      resolve({
        success: true,
        message: '视频保存成功，请在浏览器下载文件夹中查看'
      });
    } catch (error) {
      reject({
        success: false,
        message: '视频保存失败：' + error.message
      });
    } finally {
		state.downloadCount-=1
    }
  });
}

//选择视频结果
  function selectResultVideo(index,videoUrl){
		state.showVideoDetail = true;
		state.curCameraIndex = index;

	    if(state.cameraList[index].videoResultUrl==videoUrl){
		    return
		}
		state.cameraList[index].videoResultUrl=videoUrl;
		state.isChangContent=true
	}

	// 融图图片点击事件
	function handleSelectRongtuImage(imgItem,itemIndex,index){
		state.cameraList[index].rongtyResultImage=imgItem
		state.isChangContent=true
		uni.previewImage({
			urls: [imgItem],
			current: imgItem
		})
	}

	function closePreviewVideo(){
		state.previewVideourl=''
		state.ispreviewVideo=false
	}

	function closePreviewAudio(e){
		audioPreviewPopup.visible = false
	}

	//一键生视频
	function allCreateVideo(){
		allNeedCreate=[]
		createImageIndex=0
		state.curfinishCount=0

		for (let index = 0; index < state.cameraList.length; index++) {
			const element = state.cameraList[index];
			if(element.isSelectVideo){
				var count=element.createVideoCount??1
				for (let i = 0; i < count; i++) {
					allNeedCreate.push({index:index,type:1})
				}
			}
		}

		if(allNeedCreate.length == 0){
			uni.showToast({
				title: '请选择要生成视频的分镜',
				icon: 'none',
				duration: 2000
			})
			return
		}

		for (let index = 0; index < allNeedCreate.length; index++) {
			const element = allNeedCreate[index];
			createVideoQueue(element.index)
		}
		// for (let i = 0; i < maxCreateVideoCount; i++) {
		// 	setTimeout(() => {
		// 		createNextVideo()
		// 	}, i * 2000);
		// }
	}

	function cancelTaskQueue(index,taskId){
		cancelSingleTaskQueue(props.projectConfig.id,state.curepisodesId,state.cameraList[index].id,taskId,()=>{
			state.cameraList[index].videoStatus=1;
			emits('cancelTaskQueueSucceed',{})
		})
	}

	function getTaskInfo(taskId){
		getTaskBaseInfo(taskId)
	}

	// 去字幕
	function subtitlesVideo(index,videoUrl,videoStatusList){
		if(isNull(videoUrl) || videoStatusList.length == 0){
			uni.showToast({
				title: '请先选择视频',
				icon: 'none',
				duration: 2000
			})
			return
		}

		const params = {};

		for(let item of videoStatusList){
			if(videoUrl==item.url){			
				params.id = item.taskId	
				break;
			}
		}
		postRequest(APIPath.subtitlesVideo,params,(resData)=>{
			if(resData.code==200){
				uni.showToast({
					title: '已提交处理，请耐心等待',
					icon: 'none',
					duration: 2000
				})
			}
		})
	}

	// 超分视频
	function enchancedVideo(index,videoUrl,videoStatusList){
		const cameraItem = state.cameraList[index]
		if(isNull(videoUrl) || videoStatusList.length == 0){
			uni.showToast({
				title: '请先选择视频',
				icon: 'none',
				duration: 2000
			})
			return
		}

		const params = {
			templateId:state.enchancedVideoConfig?.[cameraItem.superResolution]?.dictValue || '',
		};
		params.templateId && (params.templateId=Number(params.templateId))

		for(let item of videoStatusList){
			if(videoUrl==item.url){			
				params.id = item.taskId	
				break;
			}
		}

		postRequest(APIPath.enhancedVideo, params, (resData) => {
			console.log(resData)
			if(resData.code==200){
				uni.showToast({
					title: '已提交处理，请耐心等待',
					icon: 'none',
					duration: 2000
				})
			}
		})

	}

	function createVideoQueue(index){

		const failToast = (errMsg)=>{	
			uni.showToast({
				title: errMsg || '请求异常，请稍后重试',
				icon: 'none',
				duration: errMsg?4000:2000
			})
		}

		createImageIndex++
		const cameraItem = state.cameraList[index];

		let voice='';
		let feature = '';
		let combineSP = '';
		// var tempVideoSP=state.cameraList[index].videoSP
		var styleSP= state.spContent.video_huafeng || props.projectConfig.projectConfig.videoConfig.rtSp;
		let modelId = props.projectConfig.projectConfig.videoConfig.defaultModel;
		let modelInterface = state.agentList.find((item) => item.id == modelId)?.modelInterface;
		let reviewPlatform = state.agentList.find((item) => item.id == modelId)?.reviewPlatform;
		const isSeedance2 = ['16','17'].includes(modelId); // 是seedance2且适用于仿真人id的模型的id集合
		// if(isNull(tempVideoSP)){
		// 	tempVideoSP=props.projectConfig.projectConfig.videoConfig.rtSp
		// }
		
		// state.cameraList[index].videoStatusList.push(0);
		var time=cameraItem.videotime??4
		// var tempRatio=state.curResolution

        var tempimages=[];
		var tempvideos=[];
		let tempaudios=[];
		var autos=cameraItem.rongtuImages //自动匹配
		var adds=cameraItem.cankaoVieoImages//额外添加
		
		// 多参类型
		if(projectType.value==1){
			combineSP = getFengjingContentForAImodel(cameraItem.fenjinContent)+"\n"+cameraItem.videoContentSP;
			// 传入多参资源
			for (let i = 0; i < autos.length; i++) {
				if(isNull(autos[i].url)){
					continue
				}
				var urlType=checkMediaType(autos[i].url)
				const targetReviewItem = autos[i].assets?.find((item) => item.platform == reviewPlatform);
				if(urlType=='image'){									
					if(isSeedance2 && targetReviewItem?.content){
						tempimages.push(`asset://${targetReviewItem.content}`)
					}else{
						tempimages.push(autos[i].url)
					}
				}
				else if(urlType=='video'){
					if(isSeedance2 && targetReviewItem?.content){
						tempvideos.push(`asset://${targetReviewItem.content}`)
					}else{
						tempvideos.push(autos[i].url)
					}
				}
				else if(urlType=='audio'){
					tempaudios.push(autos[i].url)
				}

			}
			for (let i = 0; i < adds.length; i++) {
				if(isNull(adds[i].url)){
					continue
				}
				var urlType=checkMediaType(adds[i].url)
				const targetReviewItem = adds[i].assets?.find((item) => item.platform == reviewPlatform);
				if(urlType=='image'){
					if(isSeedance2 && targetReviewItem?.content){
						tempimages.push(`asset://${targetReviewItem.content}`)
					}else{
						tempimages.push(adds[i].url)
					}
				}
				else if(urlType=='video'){
					if(isSeedance2 && targetReviewItem?.content){
						tempvideos.push(`asset://${targetReviewItem.content}`)
					}else{
						tempvideos.push(adds[i].url)
					}
				}
				else if(urlType=='audio'){
					tempaudios.push(adds[i].url)
				}
			}
		}
		// 图生类型，传融图
		else if(projectType.value==2){
			combineSP=cameraItem.videoContentSP;
			const rtImg = cameraItem.rongtyResultImage;
			rtImg && (tempimages = [rtImg]);
		}

		// 加入音色、角色特征
		const _resources = autos.concat(adds);
		for(let i=0;i<_resources.length;i++){
			const item = _resources[i];
			if(!isNull(item.voiceDetail)){
				// 人工手动新增的资源，音色可能会漏字
				let _voiceName = item.voiceName || `${item.name}音色`;
				_voiceName = _voiceName.includes('音色')?_voiceName:`${_voiceName}音色`;
				voice+= `${_voiceName}:${item.voiceDetail}\n`;
			}
			if(!isNull(item.coreFeature)){
				feature+= `${item.name}特征：${item.coreFeature}\n`;
			}
		}

		if(!isNull(voice)){
			combineSP=combineSP+"\n"+voice.slice(0,-1)
		}

		if(!isNull(feature)){
			combineSP=combineSP+"\n"+feature.slice(0,-1)
		}

		// 加入画风
		if(!isNull(styleSP)){
			combineSP=combineSP+"\n画面风格："+styleSP
		}

		var tempConfig={
			sp:combineSP,
			// imageurls:state.cameraList[index].cankaoVieoImages.map(item=>item.url),
			imageurls:tempimages,
			time:time,
			//ratio:tempRatio,
			// resolution:'720p',
			ratio:props.projectConfig.projectConfig.videoConfig.defaultFrame,
			resolution:props.projectConfig.projectConfig.videoConfig.defaultResolution,
			// videos:state.cameraList[index].cankaoVideo.map(item=>item.trim()).filter(url => url !== ''),
			videos:tempvideos,
			audios:tempaudios,
			projectId:props.projectConfig.id,
			episodesId:state.curepisodesId,
			cameraId:cameraItem.id,
			//modelId:state.cameraList[index].videoAgentName,
			modelId,
			// imageurlF:cameraItem.rongtyResultImage,
			// imageurlE:cameraItem.endCamera.rongtyResultImage??''
		}

		console.log(tempConfig,state.agentList,modelId)
		return

		if(projectType.value==2 && tempimages.length==0){
			uni.showToast({
				title: `分镜${cameraItem.name}未选择首帧图`,
				icon: 'none',
				duration: 3000
			})
			return
		}

		// 多参流程
		if(projectType.value==1){
			switch(modelInterface){
				case 'seedance2': // seedance2 16 17 44 45 46 47 78 49 50 51
					if(tempConfig.imageurls.length>9 || tempConfig.videos.length>3 || tempConfig.audios.length>3){
						uni.showToast({
							title: 'seedance2模型参数已达上限，仅允许9张图片、3个视频、3个音频',
							icon: 'none',
							duration: 4000
						})
						return
					}
					seedance2Video(tempConfig,(data)=>{
						cameraItem.videoStatusList.unshift({taskId:data.taskId[0],status:0});
					},(error)=>{
						failToast()
						console.error("生成视频失败", error)
					})
					break;
				case 'aliToVideo':// 阿里云百炼多参生视频 53
					aliToVideo(tempConfig,(data)=>{
						cameraItem.videoStatusList.unshift({taskId:data.taskId[0],status:0});
					},(error)=>{
						failToast()
						console.error("生成视频失败", error)					
					})
					break;
				case 'ViduQ3Video': // viduQ3 20
					ViduQ3Video(tempConfig,(data)=>{
						cameraItem.videoStatusList.unshift({taskId:data.taskId[0],status:0});
					},(error)=>{
						failToast()
						console.error("生成视频失败", error)					
					})
					break;
				// case '1':
				// 	ViduQ2Video(tempConfig,(data)=>{
				// 		cameraItem.videoStatusList.unshift({taskId:data.taskId[0],status:0});
				// 	},(error)=>{
				// 		failToast()
				// 		console.error("生成视频失败", error)
				// 	})
				// 	break;
				// case '2':
				// 	ViduQ2ProVideo(tempConfig,(data)=>{
				// 		cameraItem.videoStatusList.unshift({taskId:data.taskId[0],status:0});
				// 	},(error)=>{
				// 		failToast()
				// 		console.error("生成视频失败", error)
				// 	})
				// 	break;
				case 'KirinV3Omni': // kirinV3Omni 10
					KirinV3OmniVideo(tempConfig,(data)=>{
						cameraItem.videoStatusList.unshift({taskId:data.taskId[0],status:0});
					},(error)=>{
						failToast()
						console.error("生成视频失败", error)
					})
					break;
			}
		}
		// 图生流程
		else if(projectType.value==2){
			switch(modelInterface){
				case 'seedance2': 
					seedance2Video(tempConfig,(data)=>{
						state.cameraList[index].videoStatusList.unshift({taskId:data.taskId[0],status:0});
					},(error)=>{
						failToast()
						console.error("生成视频失败", error)
					},{
						projectType:2
					})
					break;
				case 'DoubaoSeedance1_5Video': // 4 23
					DoubaoSeedance1_5Video(tempConfig,(data)=>{
						state.cameraList[index].videoStatusList.unshift({taskId:data?.taskId?.[0]||'', status:0});
					},(error)=>{
						failToast()
						console.error("生成视频失败", error)
					})
					break;
				// case '23':
				// 	aboardDoubaoseedance1_5(tempConfig).then((data)=>{
				// 		state.cameraList[index].videoStatusList.unshift({taskId:data.id, status:0});									
				// 	}).catch((errMsg)=>{
				// 		failToast(errMsg)
				// 		console.error("生成视频失败", errMsg)
				// 	})
				// 	break;
				case 'aliToVideo': // 阿里云百炼图生视频 52
					aliToVideo(tempConfig,(data)=>{
						cameraItem.videoStatusList.unshift({taskId:data.taskId[0],status:0});
					},(error)=>{
						failToast()
						console.error("生成视频失败", error)					
					},{type:'image'})
					break;
				case 'KirinV3Omni': // kirinV3Omni 10
					KirinV3OmniVideo(tempConfig,(data)=>{
						cameraItem.videoStatusList.unshift({taskId:data.taskId[0],status:0});
					},(error)=>{
						failToast()
						console.error("生成视频失败", error)
					},{type:2})
					break;
			}
		}
	}

	let createImageIndex=0
	let maxCreateCount=5
	let maxCreateVideoCount=2
	let allNeedCreate=[]

	//一键生图
	function allCreateImage(){
		allNeedCreate=[]
		createImageIndex=0
		state.curfinishCount=0

		for (let index = 0; index < state.cameraList.length; index++) {
			const element = state.cameraList[index];
			if(element.isSelectRongtu){
				allNeedCreate.push({index:index,type:1})
			}
			if(Object.keys(element.endCamera).length!=0){
				if(element.endCamera.isSelectRongtu){
					var counte=element.endCamera.rongtuCount??1
					for (let j = 0; j < counte; j++) {
						allNeedCreate.push({index:index,type:2})
					}
				}
			}
		}
		for (let index = 0; index < allNeedCreate.length; index++) {
			const element = allNeedCreate[index];
			createImageQueue(element.index,element.type)
		}
		// for (let i = 0; i < maxCreateCount; i++) {
		// 	setTimeout(() => {
		// 		createNextImage()
		// 	}, i * 2000);
		// }
		// console.log(allNeedCreate)
	}

	function createImageQueue(index,type){
		const cameraItem = state.cameraList[index];

		const failToast = ()=>{	
			uni.showToast({
				title: '请求异常，请稍后重试',
				icon: 'none'
			})
		}

		createImageIndex++
		var combineSP=''
		var tempratio=rongtuConfig.ratio??'9:16';
		let tempResolution = rongtuConfig.resolution??'1K';
		let createNum = cameraItem.rongtuCount || props.projectConfig.projectConfig.rtConfig.num || 1;
		var images=[];
		let agentName = props.projectConfig.projectConfig.rtConfig.model??'';
		let modelInterface = state.agentList.find((item) => item.id == agentName)?.modelInterface;
		var temphuafeng= state.spContent.rongtu_huafeng || props.projectConfig.projectConfig.rtConfig.sp;
		// var tempstyle=state.cameraList[index].rongtuStyle??''
		// var temprongtusp=state.cameraList[index].rongtuSP??''
		// var temprongtucankao=state.cameraList[index].rongtucankaosp??''
		// var tempscene=state.cameraList[index].rongtuSPScene??''
		// var tempfuxiang=state.cameraList[index].rongtuFuxiangSP??''

		if(type==1){
			const allResources = cameraItem.rongtuImages.concat(cameraItem.cankaoVieoImages)
			images= allResources.filter(item=>!isNull(item.url)).map(item=>item.url)
			// images.unshift(state.cameraList[index].imageUrl)
		}	
		combineSP = getFengjingContentForAImodel(state.cameraList[index].fenjinContent);
		if(!isNull(temphuafeng)){
			combineSP= combineSP+"\n风格："+temphuafeng
		}

		var config={
			sp:combineSP,
			imageurls:images,
			ratio:tempratio,
			resolution:tempResolution,
			projectId:props.projectConfig.id,
			episodesId:state.curepisodesId,
			cameraId:state.cameraList[index].id,
			modelId:agentName,
		}

		for(let j=0;j<createNum;j++){
			switch(modelInterface){
				case 'BananaImage': // 9
					BananaImage(config,(data)=>{
						state.cameraList[index].imageStatusList.unshift({taskId:data.taskId[0],status:0});
					},(error)=>{
						failToast();
						console.error("生成图片失败", error)
					})
					break;
				case 'BananaProImage': // 3
					BananaProImage(config,(data)=>{
						state.cameraList[index].imageStatusList.unshift({taskId:data.taskId[0],status:0});
					},(error)=>{
						failToast();
						console.error("生成图片失败", error)
					},{
						kirin:config.modelId==22?true:false
					})
					break;
				case 'Doubaoseedream4_5Image': // 5 21 24
					Doubaoseedream4_5Image(config,(data)=>{
						state.cameraList[index].imageStatusList.unshift({taskId:data.taskId[0],status:0});
					},(error)=>{
						failToast();
						console.error("生成图片失败", error)
					})
					break;
				// case '24':
				// 	// 本地调海外
				// 	aboardDoubaoSeedream4_5(config).then((data)=>{
				// 		state.cameraList[index].imageStatusList.unshift({taskId:data.id, status:5,url:data.url});
				// 		state.cameraList[index].rongtyResultImage=data.url
				// 		state.isChangContent = true
				// 	}).catch((errMsg)=>{
				// 		failToast(errMsg)
				// 		console.error("生成视频失败", errMsg)
				// 	})
				// 	break;							
				default:
					Doubaoseedream4_5Image(config,(data)=>{
						state.cameraList[index].imageStatusList.unshift({taskId:data.taskId[0],status:0});
					},(error)=>{
						failToast();
						console.error("生成图片失败", error)
					})
					break;
			}
		}
	}

	//点击生视频
	function onClickcreateVideo(index){
		allNeedCreate=[]
		createImageIndex=0
		state.curfinishCount=0
		var count= state.cameraList[index].createVideoCount??1
		// if(count<=0){
		// 	count=props.projectConfig.projectConfig.videoConfig.defaultNum
		// }
		for (let i = 0; i < count; i++) {
			allNeedCreate.push({index:index,type:1})
		}
		for (let index = 0; index < allNeedCreate.length; index++) {
			const element = allNeedCreate[index];
			createVideoQueue(element.index)
		}
		// for (let i = 0; i < maxCreateVideoCount; i++) {
		// 	setTimeout(() => {
		// 		createNextVideo()
		// 	}, i * 2000);
		// }
	}

	function matchCameraItemResources(startIndex=0,lastIndex=state.cameraList.length){
		var allRes=[];
		GetResourceListByProject({projectId:props.projectConfig.id},(resList)=>{
			allRes=resList
			// var des=state.curHuafengContent+"\n"+state.curRongtuContent+"\n"+ state.curSelectRongtuSPValue+"\n"+state.curSelectRongtuSenceValue
			// var findRes= fuzzySearchInDescription(des,allRes)
			// for(let i=0;i<findRes.length;i++){
			// 	addToRongtu(findRes[i])
			// }
			for (let index = startIndex; index < lastIndex; index++) {
				const cameraItem = state.cameraList[index];
				var des=state.cameraList[index].fenjinContent; //+'\n'+state.cameraList[index].videoContentSP
				var findRes= fuzzySearchInDescription(des,cloneDeep(allRes))
				cameraItem.rongtuImages=findRes

				// 自动匹配和额外参考去重
				for(let rtItem of cameraItem.rongtuImages){
					for(let i =0; i<cameraItem.cankaoVieoImages.length;i++){
						if(rtItem.name==cameraItem.cankaoVieoImages[i].name){
							cameraItem.cankaoVieoImages.splice(i,1)
						}
					}
				}

                // console.log('融图资源==',state.cameraList[index].rongtuImages)
				formatCameraResources(state.cameraList[index])
				var extractContent= extractContentByColon(state.cameraList[index].fenjinContent)
				let rs = cloneDeep(state.cameraList[index].rongtuImages.concat(state.cameraList[index].cankaoVieoImages||[])).sort((prev,next)=>next.name?.length-prev.name?.length);
				for (let j = 0; j < extractContent.length; j++) {
					const item = extractContent[j];
					// if(item.title=='核心人物' || item.title=='关键道具' || item.title=='场景背景'){
					if(['角色','场景','道具','运镜','音频'].includes(item.title)){
						var roles= item.content.split(/[，,、]{1}/);
						for (let i = 0; i < roles.length; i++) {
							const regex = /[@]?(图片|视频|音频|未知)\d?/g;
							const roleName = roles[i].replace(regex, '').replace(/[\u200B\uFEFF\s]+/g, '').trim();
							if(item.title=='音频'){
								rs = rs.filter(item=>item._type=='audio')
							}else{
								rs = rs.filter(item=>item._type!='audio')
							}
							var findIndex= rs.findIndex(item=>roleName.includes(item.name));
							var findImageName='';
							if(findIndex>-1){
								findImageName=rs[findIndex]._tagName
								roles[i]=`${roleName}@${findImageName}`
							}else{
								roles[i]=roleName
							}							
						}
						item.content=roles.join('、')
						// console.log('匹配后的名字',item.content)
					}
				}
				extractContent.length>0 && (state.cameraList[index].fenjinContent=extractContent.map(item=>{
					if(item.title){
						return item.title+':'+item.content
					}else{
						return item.content
					}					
				}).join('\n'))

				// state.cameraList[index].videoSP=state.cameraList[index].videoContentSP
				// if(findRes.length>0){
				// 	var voice=''
				// 	for(let i=0;i<findRes.length;i++){
				// 		if(!isNull(findRes[i].voiceName) && !isNull(findRes[i].voiceDetail)){
				// 			voice+= `${findRes[i].voiceName}:${findRes[i].voiceDetail}\n`
				// 		}
				// 	}
				// 	state.cameraList[index].videoSP = state.cameraList[index].videoContentSP+ '\n'+voice
				// }
			}
			saveCameraConfig()
		})
	}

	function fuzzySearchInDescription(description, resourceList, caseSensitive = false) {
		if (!description || !Array.isArray(resourceList) || resourceList.length === 0) {
			return [];
		}
		const processedDesc = caseSensitive ? description : description.toLowerCase();
		
		const matchedResources = resourceList.filter(resource => {
			if (!resource || typeof resource.name !== 'string') {
            	return false;
        	}

			 const processedName = caseSensitive ? resource.name : resource.name.toLowerCase();
			 if(isNull(processedName)){
				return false;
			 }
			 return processedDesc.includes(processedName);
		});

		return matchedResources;
	}

	function addRongtuRes(index,pickerConfig){
		state.curCameraIndex=index;
		resourcePickerConfig.uploadFileType = pickerConfig.uploadFileType;
		resourcePickerConfig.tabsIndex = pickerConfig.tabsIndex;
		resourcePickerConfig.type = pickerConfig.type;
		resourcePickerConfig.title = pickerConfig.title || '添加额外参考内容';
		resourcePickerConfig.availableType = pickerConfig.availableType || undefined;
		ResManager()
	}

	// 自动匹配资产删除
	function removeRongtuRes(index, childIndex,childItem,propsStr){
		state.cameraList[index][propsStr].splice(childIndex,1)
		formatCameraResources(state.cameraList[index])
		saveCameraConfig()
	}

	//分镜基础编辑
	function fenjingContentEditor(e){
		state.cameraList[state.curCameraIndex].fenjinContent=e.detail.value
		state.isChangContent=true
	}

	function inCameraNameFocus(index){
		state.curCameraIndex=index
		state.isOpenSelectEndCamera=false
	}

	//保存相机配置
	function saveCameraConfig(config={showSuccessToast:false,checkEmpty:false}){
		if(process.env.NODE_ENV=='development'){
			return
		}
		if(state.fenjiList.length==0 || state.camerasFirstLoaded==false){
			return
		}
		const curepisodesId = state.curepisodesId;
		const _index = state.fenjiList.findIndex(item=>item.id==curepisodesId)
		const episodesItem = cloneDeep(state.fenjiList[_index])
		const cameraList = cloneDeep(state.cameraList)
		episodesItem.cameras=[]
		for (let index = 0; index < cameraList.length; index++) {
			const element = {...cameraList[index]};
			if(isNull(element.endCamera) || Object.keys(element.endCamera).length==0){
				element.endCamera=null
			}
			episodesItem.cameras.push(element)
		}
		
		if(config.checkEmpty && (episodesItem.cameras.length==0 || state.isChangContent==false)){
			return
		}
		// console.log('保存数据==',state.fenjiList[_index])
		ModifyProjectEpisodes(episodesItem,(data)=>{
			state.isChangContent=false
			if(config.showSuccessToast){
				uni.showToast({
					title: '保存成功',
					icon: 'success',
				})
			}
		},(error)=>{

		})
	}

	function ResManager(){
		state.isOpenResmanager=true
	}
	function closeResManager(){
		state.isOpenResmanager=false
	}
	function saveExtractResources(data){
		const temps = [];
		let isExist = false;
		const cameraItem = state.cameraList[state.curCameraIndex];

		if(resourcePickerConfig.type==2){
			// 添加资源到融图列表
			const createPromise = (url)=>{
				return new Promise((resolve,reject)=>{
					postRequest(APIPath.aiTask,{
						projectId:props.projectConfig.id,
						episodesId:state.curepisodesId,
						cameraId:cameraItem.id,
						ossUrl:url,
						type:3,
						status:5,
						typeId:4,
					},(res)=>{
						cameraItem.imageStatusList.unshift({
							taskId:res.data,
							url,
							status:5,
							typeId:4,
						})
						cameraItem.rongtyResultImage = url
						resolve(res)
					},(err)=>{reject(err)})
				})
			}
			const promiseTasks = data.map((item)=>createPromise(item.url))
			Promise.all(promiseTasks).then((res)=>{
				console.log('上传融图任务完成',res)
			}).catch((err)=>{
				console.error('上传融图任务有失败', err)
			}).finally(()=>{
				saveCameraConfig()
			})
						
		}else{
			// 添加额外参考资源
			const resources = cameraItem.rongtuImages.concat(cameraItem.cankaoVieoImages)
			for(const addItem of data){
				const exist = resources.find((item)=>item.url==addItem.url)
				if(!exist){
					temps.push(addItem)
				}else{
					isExist=true;
				}
			}
			if(isExist){
				uni.showToast({
					title: '已自动过滤重复资源',
					icon: 'none',
					duration: 2000
				});
			}
			const res = temps.map((i,index)=>{
				return {
					...i,
					// _desc:'图片'+(cameraItem.rongtuImages.length+cameraItem.cankaoVieoImages.length+index+1)
				}
			})
			// console.log('最终添加',res)
			cameraItem.cankaoVieoImages.push(...res)
			formatCameraResources(cameraItem)
			saveCameraConfig()
		}	
	}

	const updateTaskStatus=(params,isUpdate)=>{
		// console.log('收到更新任务状态',params)
		var findEpisodes=params.filter((item)=>item.episodesId==state.curepisodesId)??[]
		// console.log("本集进行的任务数量："+ findEpisodes.length)

		const addStatusList=(obj,item,typeId)=>{
			if(typeId == 4){
				obj['imageStatusList'].unshift(item)
			}else if(typeId == 5){
				obj['videoStatusList'].unshift(item)
			}
		}

		for (let i = 0; i < state.cameraList.length; i++)  {
			const camItem = state.cameraList[i];
			camItem.videoStatusList=[];
			camItem.imageStatusList=[];
			for (let index = 0; index < findEpisodes.length; index++) {
				const statusItem = findEpisodes[index];
				if(camItem.id==statusItem.cameraId){
					let itemData = {
						subtitlesStatus:statusItem.subtitlesStatus,
						enhanceStatus:statusItem.enhanceStatus,
						templateId:statusItem.templateId
					};
					//完成
					if(statusItem.status==5 ){
						itemData = {...itemData,taskId:statusItem.id,status:5,url:statusItem.ossUrl}
						addStatusList(camItem,itemData,statusItem.typeId)
					}
					//排队
					else if(statusItem.status==0 || statusItem.status==-1){
						// camItem.videoStatus=2
						itemData = {...itemData,taskId:statusItem.id,status:2}
						addStatusList(camItem,itemData,statusItem.typeId)
					}
					//生成中
					else if(statusItem.status==2 || statusItem.status==1 || statusItem.status==4 || statusItem.status==9){
						// camItem.videoStatus=0
						itemData = {...itemData,taskId:statusItem.id,status:0}
						addStatusList(camItem,itemData,statusItem.typeId)
					}
					//失败
					else if(statusItem.status==3){
						// camItem.videoStatus=3
						itemData = {...itemData,taskId:statusItem.id,status:3}
						addStatusList(camItem,itemData,statusItem.typeId)
					}
					else{
						itemData = {...itemData,taskId:statusItem.id,status:statusItem.status}
						addStatusList(camItem,itemData,statusItem.typeId)
					}				
					
					// console.log("镜头任务队列长度："+ camItem.videoStatusList.length)
				}
			}
		}

		if(isUpdate){
			updateCameraQeueueLoopResult(state.curepisodesId)
		}
	}
	const handleShowResourcePreview=(event,resItem)=>{
		console.log(event,r)
		const tag = event.target.dataset.tag
	}

	const handleRongtuSettingConfirm=(params)=>{
		const index = rongtuConfig.extract.index;
		rongtuConfig.extract.index = null;

		state.cameraList[index].rongtuStyle = params.resolution;
		state.cameraList[index].rongtuCount = params.count;
		state.cameraList[index].resolutionratio = params.ratio;
	}

	const handleOpenRongtuSetting=(item,index)=>{
		item.rongtuStyle && (rongtuConfig.resolution = item.rongtuStyle)
		item.resolutionratio && (rongtuConfig.ratio = item.resolutionratio)
		item.rongtuCount && (rongtuConfig.count = item.rongtuCount)
		rongtuConfig.visible = true
		rongtuConfig.extract.index = index
	}

	const handlePreviewResource=(resItem)=>{
		const {_type,url,name} = resItem
		if(_type=='image'){
			uni.previewImage({
				urls: [url],
				current: url
			})
		}else if(_type=='video'){
			state.previewVideourl=url
			state.ispreviewVideo=true
		}else if(_type=='audio'){
			audioPreviewPopup.url=url;
			audioPreviewPopup.visible=true;
			audioPreviewPopup.title=name;
		}
	}

	// 头部操作按钮布局变更
	const headerLayoutResize=debounce(()=>{
		if(projectType.value!=2 && typeof document === 'undefined'){
			 return
		}
		let count_resize = 8;
		let time = 50;
		const fn = ()=>{
			try{
				const header_col2_1 = document.getElementById('ah-col2-1')
				const col2_rect = document.getElementById('col2').getBoundingClientRect()
				const col4_rect = document.getElementById('col4').getBoundingClientRect()
				header_col2_1.style.width=col4_rect.left-col2_rect.left+'px'
			}
			catch(err){
				count_resize>0 && setTimeout(fn,time) && count_resize-- 
				// console.warn('变更头部布局失败',err,count_resize)
			}
		}

		setTimeout(fn,time)
	},300,{leading: true})

	const resetCameraListName = (startChangeIndex)=>{
		for(let i=startChangeIndex; i<state.cameraList.length; i++){
			const cameraItem = state.cameraList[i];
			cameraItem.name = cameraItem.name.split('_').slice(0,-1).join('_')+'_'+(i+1)
		}
		saveCameraConfig();
	}

	const handleAddReduceCamera=(type,index)=>{
		
		cameraEditorDialogConfig.visible = true
		cameraEditorDialogConfig.content = `确定在${type=='prev'?'上方':'下方'}增加分镜？`
		cameraEditorDialogConfig.data = {
			type,
			index
		}
	}

	const handleGlobalDialogConfirm = ()=>{
		const {type,index} = cameraEditorDialogConfig.data;

		cameraEditorDialogConfig.visible = false
		const startChangeIndex = type=='prev'?index:index+1;
		const targetIndexOfItem = state.cameraList[index];
		const episodeName = targetIndexOfItem.name?.split('_').slice(0,-1).join('_') || '';
		const _newCameraConfig = newCameraConfig(episodeName+'_'+(startChangeIndex+1),Date.now(),index);

		if(cameraEditorDialogConfig.checked){
			const excludeProps = ['name','id','videoHistory','videoResultUrl']
			const cloneData = cloneDeep(targetIndexOfItem)
			for(let key in _newCameraConfig){
				if(!excludeProps.includes(key)){
					_newCameraConfig[key] = cloneData[key]
				}
			}
		}

		state.cameraList.splice(startChangeIndex,0,_newCameraConfig);
		resetCameraListName(startChangeIndex);
	}

	const handleRemoveCamera=(index,item)=>{
		uni.showModal({
			title: '提示',
			content: `确定删除${item.name}该分镜吗？`,
			success: (res) => {
				if (res.confirm) {
					state.cameraList.splice(index,1)
					resetCameraListName(index);
				}
			}
		})
	}

	// 把分镜基础内容 转化成AI模型的格式
	const getFengjingContentForAImodel = (str)=>{
		if(isNull(str)){
			return ''
		}

		const decomposed = extractContentByColon(str)
		for (let j = 0; j < decomposed.length; j++) {
			const item = decomposed[j];
			// if(item.title=='核心人物' || item.title=='关键道具' || item.title=='场景背景'){
			if(['角色','场景','道具','运镜','音频'].includes(item.title)){
				var roles= item.content.split(/[，,、]{1}/);
				for (let i = 0; i < roles.length; i++) {
					const regex = /[@]?(图片|视频|音频)\d?/g; // /[@]([图片]+|[视频]+|[音频]+)[0-9]?/g
					if(roles[i].match(regex)){
						roles[i] = roles[i].split('@').reverse().join('')
					}
				}
				item.content=roles.join('、')
				// console.log('匹配后的名字',item.content)
			}
		}

		return decomposed.map(item=>{
			if(item.title){
				return item.title+':'+item.content
			}else{
				return item.content
			}
		}).join('\n')
	}

	// 注册全局拖拽事件
	function registerDragEvents() {
		if (typeof window === 'undefined') return
		window.removeEventListener('dragenter', handleWindowDragEnter)
		window.removeEventListener('dragover', handleWindowDragOver)
		window.removeEventListener('drop', handleWindowDrop)
		window.addEventListener('dragenter', handleWindowDragEnter)
		window.addEventListener('dragover', handleWindowDragOver)
		window.addEventListener('drop', handleWindowDrop)
	}

	// 移除全局拖拽事件
	function removeDragEvents() {
		if (typeof window === 'undefined') return
		window.removeEventListener('dragenter', handleWindowDragEnter)
		window.removeEventListener('dragover', handleWindowDragOver)
		window.removeEventListener('drop', handleWindowDrop)
	}

	// 处理窗口拖拽进入事件
	function handleWindowDragEnter(e) {
		e.preventDefault();
	}

	// 处理窗口拖拽悬停事件
	function handleWindowDragOver(e) {
		e.preventDefault();
		// 更新悬停的 camera-item
		updateDragHoverByPoint(e.clientX, e.clientY);
		// 如果悬停在 camera-item 上，更新拖拽区域的 hover 状态
		if (state.dragHoverIndex >= 0) {
			updateAutoUploadHoverByPoint(e.clientX, e.clientY);
		}
	}

	// 处理窗口拖拽释放事件
	function handleWindowDrop(e) {
		e.preventDefault();
		// console.log("e:",e)
		// console.log("autoUploadHover:",state.autoUploadHover)
		const files = e.dataTransfer?.files;
		if (files && files.length > 0) {
			const hoverIndex = state.dragHoverIndex;
			// console.log("hoverIndex:"+hoverIndex)
			if (hoverIndex >= 0 && !isNull(state.autoUploadHover)) {
				// 过滤出图片和视频文件
				const validFiles = Array.from(files).filter(file => 
					file.type?.startsWith('image/') || file.type?.startsWith('video/') || file.type?.startsWith('audio/')
				);
				// console.log("validFiles:",validFiles)
				
				if (validFiles.length === 0) {
					uni.showToast({
						title: '拖拽文件只能是符合图片、视频、音频的格式',
						mask: false,
						icon: 'none'
					});
					// 清除悬停状态
					state.dragHoverIndex = -1;
					return;
				}
				
				// 上传队列处理
				handleFileUploadQueue(validFiles, hoverIndex);
			}			
		}
		state.dragHoverIndex = -1;
	}

	// 处理文件上传队列
	async function handleFileUploadQueue(files, hoverIndex) {
		const dragCameraItem = state.cameraList[hoverIndex];
		const typeId = state.resourceTabs.find(p=>p.name == state.autoUploadHover)?.id || -1;
		
		// 显示上传开始提示
		uni.showToast({
			title: `开始上传 ${files.length} 个文件`,
			icon: 'none'
		});
		
		try {
			// 顺序执行上传
			for (const file of files) {
				await uploadFile(file, dragCameraItem, hoverIndex, typeId);
			}

			// 格式化资源
			formatCameraResources(dragCameraItem);
			// 保存配置
			saveCameraConfig();
			
			// 上传完成提示
			uni.showToast({
				title: `成功上传 ${files.length} 个文件`,
				icon: 'success'
			});
		} catch (error) {
			// 上传失败提示
			uni.showToast({
				title: '上传失败，请重试',
				icon: 'none'
			});
			console.error('上传失败:', error);
		}
	}
	
	// 上传单个文件（使用 uploadFileToServer，替代 CreateObjectURL+UploadFile）
	function uploadFile(file, dragCameraItem, hoverIndex, typeId) {
		return new Promise((resolve, reject) => {
			if (!file) return reject(new Error('无效的文件'));

			uploadFileToServer(file).then(newUrl => {
				try {
					// 去掉文件名后缀作为资源名称
					const nameWithoutExt = (file.name || '').replace(/\.[^/.]+$/, '');
					// 创建新的资源对象，并自动补充 _type/_typeName/_tagName
					const newUploadFile = {
						id: new Date().getTime() + (Math.random() * 10000).toString().slice(-5),
						name: nameWithoutExt,
						url: newUrl
					};

					// 自动生成类型和标签参考 formatCameraResources 的逻辑
					try {
						const mediaMap = { image: '图片', video: '视频', audio: '音频', unknown: '未知' };
						const mediaType = checkMediaType(newUrl) || 'unknown';
						newUploadFile._type = mediaType;
						newUploadFile._typeName = mediaMap[mediaType] || mediaMap.unknown;

						// 统计已有相同类型资源数量（包含自动匹配与额外参考），用于生成标签序号
						const existing = (dragCameraItem.rongtuImages || []).concat(dragCameraItem.cankaoVieoImages || []);
						let count = 0;
						for (const it of existing) {
							if (it && it._type === mediaType) count++;
						}
						// 本项为第 count+1 个
						newUploadFile._tagName = `${newUploadFile._typeName}${count + 1}`;
					} catch (e) {
						// 忽略类型标注错误，保持基础字段
						console.warn('生成资源标签失败', e);
					}
					// console.log("newUploadFile:", newUploadFile);
					// 添加到额外参考资源列表
					dragCameraItem.cankaoVieoImages.push(newUploadFile);
				
					nextTick(()=>{
						// 只更新当前 item 的 scrollLeft
						dragCameraItem.scrollLeft = 999999;
						nextTick(()=>{
							// 触发更新
							dragCameraItem.scrollLeft = dragCameraItem.scrollLeft + 1;
						});
					})

					if (typeId != -1) {
						// 角色2 场景3 道具4 运镜26 音色
						const newConfig = {
							typeId: typeId,
							name: nameWithoutExt,
							url: newUrl,
							projectId: props.projectConfig.id
						};

						AddNewResource(newConfig, resData => {
							resolve();
						
						}, error => {
							reject(error);
						});
					} else {
						resolve();
					}
				} catch (error) {
					reject(error);
				}
			}).catch(err => {
				reject(err);
			});
		});
	}

	// 根据鼠标坐标更新悬停的 camera-item
	function updateDragHoverByPoint(x, y) {
		try {
			for (let i = 0; i < state.cameraList.length; i++) {
				const element = document.querySelector(`.camera-item:nth-child(${i + 1})`);
				if (element && element.getBoundingClientRect) {
					const rect = element.getBoundingClientRect();
					if (x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom) {
						state.dragHoverIndex = i;
						return;
					}
				}
			}
			// 没有悬停在任何 camera-item 上
			state.dragHoverIndex = -1;
			state.autoUploadHover = null;
		} catch (err) {
			// 忽略错误
		}
	}

	// 根据鼠标坐标更新悬停的拖拽区域
	function updateAutoUploadHoverByPoint(x, y) {
		try {
			const hoverIndex = state.dragHoverIndex;
			if (hoverIndex < 0) return;
			
			const zones = state.resourceTabs.map(tab => ({
				name: tab.name,
				el: document.getElementById(`${hoverIndex}-${tab.name}-zone`)
			}));
			
			let hit = null;
			for (const z of zones) {
				if (!z.el || !z.el.getBoundingClientRect) continue;
				const r = z.el.getBoundingClientRect();
				if (x >= r.left && x <= r.right && y >= r.top && y <= r.bottom) {
					hit = z.name;
					break;
				}
			}
			if (state.autoUploadHover !== hit) {
				state.autoUploadHover = hit;
			}
		} catch (err) {
			// 忽略错误
		}
	}

	// 处理区域拖拽进入事件
	function handleZoneDragEnter(area, e) {
		e.preventDefault();
		state.autoUploadHover = area;
	}

	// 处理区域拖拽悬停事件
	function handleZoneDragOver(area, e) {
		e.preventDefault();
		state.autoUploadHover = area;
	}

	// 处理区域拖拽离开事件
	function handleZoneDragLeave(area, e) {
		e.preventDefault();
		state.autoUploadHover = null;
	}

	function enchancedVideoPopup(index){
		if(state.enchancedVideoIndex==-1){
			state.enchancedVideoIndex = index;
		}else{
			state.enchancedVideoIndex = -1;
		}
	}

	function enchancedVideoChange(dictIndex,cameraIndex){
		state.cameraList[cameraIndex].superResolution = dictIndex;
	}

	function cameraOptimizationPopupOpen(index){
		if(typeof index=='number'){
			cameraOptimizationPopup.data = cloneDeep([state.cameraList[index]].map(i=>{
				return{
					fenjinContent:i.fenjinContent,
					videoContentSP:i.videoContentSP,
					id:i.id,
					name:i.name
				}
			}));
		}else{
			cameraOptimizationPopup.data = cloneDeep(state.cameraList.map(i=>{
				return{
					fenjinContent:i.fenjinContent,
					videoContentSP:i.videoContentSP,
					id:i.id,
					name:i.name
				}
			}));
		}	
		cameraOptimizationPopup.visible = true;
	}

	function handleCameraContentUpdate(data){
		for(let item of state.cameraList){
			for(let n=0; n<data.length; n++){
				if(item.id==data[n].id){
					item.fenjinContent = data[n].fenjinContent;
					item.videoContentSP = data[n].videoContentSP;
					data.splice(n,1);
					break;
				}
			}
		}
		// saveCameraConfig();
	}

	onMounted(() => {
		GetAIModelList().then((data)=>{
			state.agentList=data
		})

		// 获取画风设置内容最新值
		GetResourceList(1, 100, 9, (resList) => {
			const rongtuSpId = props.projectConfig.projectConfig.rtConfig.spid;// 融图画风
			const videoSpId = props.projectConfig.projectConfig.videoConfig.rtSpId;// 视频画风
			state.spContent.rongtu_huafeng = resList.find(item => item.id == rongtuSpId)?.content;
			state.spContent.video_huafeng = resList.find(item => item.id == videoSpId)?.content;
		})

		headerLayoutResize();
		if(projectType.value==2 ){
			window.addEventListener('resize', headerLayoutResize);
			store.commit('process/REGISTER_LISTENER',{tagName:'headerLayoutResize',type:'resize',pointer:headerLayoutResize})
		}
		
		// 注册全局拖拽事件
		registerDragEvents();
		
		GetResourceTypeList(25, (resTypeList) => {
		    state.resourceTabs = resTypeList.map(item => ({ name: item.treeName, id: item.id }))
			// console.log("state.resourceTabs:",state.resourceTabs)
		})
	});

	onUnmounted(() => {
		console.log('index onUnmounted')
		if(saveintervalID){
			clearInterval(saveintervalID)
		}

		// 组件卸载前再保存一遍
		state.isChangContent && saveCameraConfig();

		projectType.value==2 && window.removeEventListener('resize', headerLayoutResize);
		
		// 移除全局拖拽事件
		removeDragEvents();
	});
	
	onDeactivated(()=>{
		// 移除全局拖拽事件
		removeDragEvents();
	})

	defineExpose({
		updateTaskStatus,
		saveCameraConfig
	})

</script>

<style scoped lang="scss">
	@import "index.css"
</style>
