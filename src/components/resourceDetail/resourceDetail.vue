<template>
    <view class="sliderSection">
        <view class="head" style="margin-top: 40rpx;">
            <view style="font-size: 40rpx;font-weight: bold; color: #FFA701;">资产详情</view>
            <view>
                <view class="btn" style="margin-right: 8px;width: 80px;" @click="handlerDownload(state.selectedImageURL)">下载资源</view>
                <view class="btn" style="margin-right: 8px" @click="getDetail(true)">刷新</view>
                <template v-if="props.editable">
                    <view class="btn danger" @click="handleDeleteResource">删除</view>
                    <view class="btn light" style="margin-left: 8px" @click="handleUpdateResource()">保存</view>
                </template>
            </view>
        </view>
        <view class="cell">
            <view class="leftContent">
                <view style="
                width: 42px;
                height: 18px;
                line-height: 18px;
                text-align: center;
                background-color: #764BEE;
                color: #fff;
                border-radius: 8px;
                font-size: 12px;
            ">
                    {{ typeName }}</view>
                <view style="
                font-size: 16px;
                color: #333;
                flex: 1;
                margin: 0 6px;
                font-weight: bold;
                display: flex;
                align-items: center;
                flex-wrap: wrap;
            ">
                    <text>{{ form.name }}</text>
                    <image v-if="props.editable" src="/static/proDetaiIcon.png"
                        style="padding-left: 4px;width: 20px; height: 20px;cursor: pointer;" mode="aspectFit"
                        @click="handleModifyResourceShow"></image>
                </view>
            </view>
            <!-- <view class="rightContent">
            <view style="width: 40px;
                height: 16px;
                line-height: 16px;
                text-align: center;
                background: rgba(0, 0, 0, 0.4);
                color: #fff;
                border-radius: 4px;
                font-size: 12px;
            ">
                详情</view>
        </view> -->
        </view>
        <view style="display: flex;overflow: hidden;">
            <view class="preview" :style="{ width: props.data.typeId == 2 ? '320px' : '100%' }">
                <image v-if="currentMediaType == 'image'"
                    @click.stop="handleOpenResourceEditorPopup(state.selectedImageURL, null, form.name)"
                    :src="state.selectedImageURL" style="width: 100%; height: 100%;cursor: pointer;" mode="heightFix">
                </image>
                <video v-else-if="currentMediaType == 'video'" :src="state.selectedImageURL"
                    style="width: 100%; height: 100%;cursor: pointer;" mode="heightFix" controls></video>
                <view v-else-if="currentMediaType == 'audio'" :src="state.selectedImageURL"
                    style="width: 100%; height: 100%;background-color: #000000;position: relative;">
                    <image :src="'/static/audio-play.png'"
                        style="cursor: pointer; width: 48px;height: 48px;position: absolute;top: 50%;left: 50%;transform: translate(-50%,-50%);"
                        @click="handlePreviewAudio"></image>
                </view>
                <!-- <view class="btn"
                    style="font-size: 12px;display: flex;align-items: center;justify-content: center; width: 60px;"
                    @click="handleOpenResourceEditorPopup(state.selectedImageURL, form.name)">
                    <image src="/static/proDetaiIcon_white.png" style="width: 16px; height: 16px;" mode="aspectFit"></image>
                    <text style="padding-left: 4px;">预览</text>
                </view> -->
                <view class="overlay" v-if="false">
                    <view>作者：user1524</view>
                    <view>编号：22222</view>
                    <view>日期：2026-02-06</view>
                    <view>所属：33333</view>
                </view>
            </view>
            <!-- 配音 特征-->
            <view class="timbre" style="flex: 1;" v-if="props.data.typeId == 2">
                <view class="tabs" style="margin: 0;border-radius: 4px;">
                    <view :class="['item', { 'active': state.curSubTabsIndex === 0 }]" @click="handleSubTabChange(0)">音色
                    </view>
                    <view :class="['item', { 'active': state.curSubTabsIndex === 1 }]" @click="handleSubTabChange(1)">特征
                    </view>
                </view>
                <template v-if="state.curSubTabsIndex == 0">
                    <view style="margin-top: 8px;width: 100%;">
                        <input style="background: #FFFFFF; padding: 8rpx;font-size: 24rpx;"
                            @input="handleVoiceNameChange" :value="form.voiceName" placeholder="请输入音色名称"
                            :disabled="!props.editable"></input>
                    </view>
                    <textarea style="flex:1;width: 100%;box-sizing: border-box;" :disabled="!props.editable"
                        @input="handleVoiceDetailChange" class="desc" placeholder="请输入音色描述"
                        :value="form.voiceDetail"></textarea>
                </template>
                <template v-else-if="state.curSubTabsIndex == 1">
                    <textarea style="flex:1;width: 100%;box-sizing: border-box;" :disabled="!props.editable"
                        @input="handleCoreFeatureChange" class="desc" placeholder="请输入核心特征"
                        :value="form.coreFeature"></textarea>
                </template>
            </view>
        </view>
        <view
            style="border-radius: 0 0 8px 8px;line-height: 42px;height: 42px;display: flex;align-items: center;background-color: #E7E7E7;padding: 0 8px;">
            <!-- <text style="font-size: 14px;font-weight: 500;">仿真人ID：</text>
            <input v-model="form.value" placeholder="请填写后点击保存"
                style="flex:1;background: #FFFFFF; padding: 8rpx;font-size: 14px" :disabled="!props.editable"></input> -->
            <view @click="()=>seedance2ResourceReviewSubmit()"
                style="cursor: pointer;height: 30px;display: flex;align-items: center;">
                <image src="/static/shield_icon_blue.png" style="width: 16px; height: 16px;" mode="widthFix"></image>
                <text style="padding-left: 4px;">合规检测</text>
            </view>
            <scroll-view scroll-x
                style="flex: 1;white-space: nowrap;min-width: 0;align-items: flex-start;padding: 0 8px;">
                <view v-for="reviewItem in form.assets" :key="reviewItem.id" class="imageButton" @click="seedance2ResourceReviewSubmit(reviewItem)">
                    <image :src="`/static/${seedance2ReviewStatusMap[reviewItem.status].iconName}.png`" class="img"
                        mode="widthFix">
                    </image>
                    <text class="text" :style="{ color: seedance2ReviewStatusMap[reviewItem.status].color }">{{
                        reviewItem.platformName }}</text>
                    <view class="tooltip" style="display: flex;align-items: center;"
                        @click.stop="() => copyText(reviewItem.content)">
                        <text style="white-space: nowrap;">合规ID: {{
                            reviewItem.content ? reviewItem.content : seedance2ReviewStatusMap[reviewItem.status].text
                        }}</text>
                        <image src="/static/copy_icon.png" v-if="reviewItem.content"
                            style="width: 20px; height: 20px;padding-left: 8px;cursor: pointer;" mode="heightFix">
                        </image>
                    </view>
                </view>
            </scroll-view>
            <view class="imageButton" @click="showSeedance2AuditPopup">
                <image src="/static/proDetaiIcon.png" class="img" mode="widthFix">
                </image>
                <text class="text">填写</text>
            </view>
        </view>
        <view class="tabs" v-if="props.editable">
            <view :class="['item', { 'active': index == state.curTabsIndex }]" v-for="(value, index) in state.tabs"
                :key="index" @click="handleTabChange(index)">{{ value.name }}</view>
        </view>
        <view class="tabContent">
            <!-- SP生图页签 -->
            <template v-if="state.curTabsIndex == 0">
                <view class="section">
                    <view class="title">
                        <image src="/static/proDetaiIcon.png" class="icon" mode="widthFix"></image>
                        <text class="text">资产SP生图描述</text>
                        <text v-show="form.expand.imgUrls?.length > 1"
                            style="color: #FF4D4F;font-size: 14px;">（多参考图下需要自行拼上图片1、图片2等序号）</text>
                    </view>
                    <view class="textarea">
                        <textarea style="width: 100%; height: 100%;overflow-x: hidden;" placeholder-style="color:#999"
                            :disabled="!props.editable" :value="form.content" @blur="handleContentSPInput"
                            placeholder="请填写图片生成的SP描述" :maxlength="-1"></textarea>
                    </view>
                    <!-- 画风参考图设置 -->
                    <view
                        style="display: flex;align-items: center;padding: 6px 8px;background-color: #f7f7f7;cursor: pointer;">
                        <template v-if="props.editable">
                            <view
                                style="margin-bottom: 6px; margin-right: 6px; width: 40px;height: 40px;border-radius: 4px;background-color: #FFE3AF;display: flex;flex-direction: column;align-items: center;justify-content: center;"
                                @click="state.paintingStylePopupShow = true">
                                <image src="/static/painting.png" style="width: 16px;height: 16px;" mode="widthFix">
                                </image>
                                <view style="font-size: 12px;color: #333;margin-top: 2px;">画风</view>
                            </view>
                            <view
                                style="margin-bottom: 6px; width: 40px;height: 40px;border-radius: 4px;background-color: #FFE3AF;display: flex;flex-direction: column;align-items: center;justify-content: center;"
                                @click="state.appendPresetPopupShow = true">
                                <image src="/static/files.png" style="width: 16px;height: 16px;" mode="widthFix">
                                </image>
                                <view style="font-size: 12px;color: #333;margin-top: 2px;">预设</view>
                            </view>
                            <!-- 分割线 -->
                            <view
                                style="width: 1px;height: 20px;background-color: #999999;margin-left: 6px;align-self: center;">
                            </view>
                        </template>

                        <!-- 已选择的参考图列表 -->
                        <view style="flex: 1;display: flex;flex-wrap: wrap;align-items: center;">
                            <view
                                style="margin-left: 6px;width: 40px;height: 40px;position: relative;margin-bottom: 6px;"
                                v-for="(item, index) in form.expand.imgUrls" :key="item.id">
                                <image @click="uni.previewImage({ urls: [item.url] })" :src="item.url"
                                    style="width: 100%; height: 100%;border-radius: 4px;border: 1px dashed #e3e3e3;box-sizing: border-box;"
                                    mode="aspectFill"></image>
                                <view v-show="form.expand.imgUrls?.length > 1"
                                    @click="uni.previewImage({ urls: [item.url] })"
                                    style="position: absolute;bottom: 0;left: 0;width: 100%;height: 16px;color: #fff;font-size: 12px;text-align: center;background-color: rgba(0,0,0,0.7);">
                                    图片{{ index + 1 }}</view>
                                <view v-if="props.editable" class="icon-reduce"
                                    @click="handleRemoveReferenceImage(item, index)"></view>
                            </view>
                            <!-- 选图按钮 -->
                            <view v-if="props.editable" @click="state.resourcePickerShow = true"
                                style="margin-bottom: 6px;margin-left: 6px;width: 40px;height: 40px;border-radius: 4px;background-color: #E7E7E7;border: 1px dashed #999;box-sizing: border-box; display: flex;flex-direction: column;align-items: center;justify-content: center;cursor: pointer;">
                                <view style="font-size: 20px;font-weight: 500;line-height: 100%;">+</view>
                                <view style="font-size: 12px;color: #333;">图片</view>
                            </view>
                        </view>
                    </view>
                    <!-- 模型参数设置 -->
                    <view v-if="props.editable"
                        style="display: flex; align-items: center; padding: 8px;background-color: #E7E7E7;position: relative;z-index: 4;">
                        <view style="flex: 5;margin-right: 8px;">
                            <uni-data-select v-model="state.curModelId" :localdata="state.ailist"
                                @change="handleModelChange"></uni-data-select>
                        </view>
                        <view class="selector" style="flex: 3;margin-right: 8px;"
                            @click="handleShowImageGenerationParamsPopup">
                            {{ state.rawResolution }}<text style="padding: 0 2px;">|</text>{{ state.rawRatio }}<text
                                style="padding: 0 2px;">|</text>{{ state.rawCount }}张
                        </view>
                        <view class="button" style="cursor: pointer;border-radius: 4px;width: 120px"
                            v-debounce.click="{ handler: startRawImage, immediate: true, delay: 500 }">生图</view>
                    </view>
                </view>
                <!-- 历史生图 -->
                <view class="section">
                    <view class="title">
                        <image src="/static/picture.png" class="icon" mode="widthFix"></image>
                        <text class="text">历史生图</text>
                    </view>
                    <scroll-view class="resourceList" scroll-y :show-scrollbar="false">
                        <block v-for="(item, index) in form.historyUrl.filter(item => item.status != 8)" :key="index">
                            <view
                                @click="() => { selectFile(item.ossUrl); handleOpenResourceEditorPopup(form.historyUrl, index, form.name); }"
                                :class="'item ' + (state.selectedImageURL == item.ossUrl ? 'active' : '')"
                                style="background-color: #666666;">
                                <template v-if="[-1, 0, 1, 2, 3, 4].includes(item.status)">
                                    <view
                                        style="width: 100%;position: absolute;z-index: 1;top: 50%;left: 50%;transform: translate(-50%, -50%);color: #fff;display: flex;flex-direction: column;align-items: center;">
                                        <image v-show="item.status == 3" src="/static/erroricon.png"
                                            style="width: 32px;height: 32px;margin-bottom: 8px;" mode="widthFix">
                                        </image>
                                        <view style="text-align: center;">
                                            <text v-show="[-1, 0].includes(item.status)">队列中</text>
                                            <text v-show="[1, 2, 4].includes(item.status)">生成中</text>
                                            <text v-show="item.status == 3">生成失败</text>
                                        </view>
                                        <view v-show="[-1, 0].includes(item.status) && props.editable"
                                            @click.stop="handleCancelImageGeneration(item, index)"
                                            style="margin-top: 5px;width: 42px;height: 18px;border-radius: 21px;line-height: 18px;text-align: center;font-size: 12px;background-color: #FF5757;cursor: pointer;">
                                            撤销</view>
                                        <view v-show="[3].includes(item.status)" @click.stop="getTaskInfo(item.id)"
                                            style="margin-top: 5px;width: 60px;height: 18px;border-radius: 21px;line-height: 18px;text-align: center;font-size: 12px;background-color: #FF5757;cursor: pointer;">
                                            查看原因</view>
                                        <view v-show="[1, 2, 4].includes(item.status)" class="loadingIcon"></view>
                                    </view>
                                </template>
                                <template v-else-if="item.status == 5">
                                    <image :src="item.ossUrl" style="width: 100%; height: 100%;cursor: pointer;"
                                        mode="aspectFit">
                                    </image>
                                    <!-- <view class="textTag" @click.stop="handleOpenResourceEditorPopup(item, form.name)">
                                        <image src="/static/proDetaiIcon_white.png" style="width: 12px; height: 12px;"
                                            mode="aspectFit"></image>
                                        <text style="padding-left: 4px;">预览</text>
                                    </view> -->
                                    <!-- <view class="desc">{{ item.name }}</view> -->
                                </template>
                                <view v-if="[3, 5].includes(item.status) && props.editable" class="deleteIcon"
                                    @click.stop="handleRemoveHistoryImage(item, index)">
                                </view>
                            </view>
                        </block>
                    </scroll-view>
                </view>
            </template>
            <!-- 公共库页签 -->
            <template v-else-if="state.curTabsIndex == 1">
                <CommonResources @confirm="selectPublicRes" :typeId="props.data.typeId"></CommonResources>
            </template>
            <!-- 上传页签 -->
            <template v-else-if="state.curTabsIndex == 2">
                <view class="uploder" @click="handleSelectUploadResource">
                    <image src="/static/upload.png" style="width: 26px; height: 26px;" mode="widthFix"></image>
                    <!-- @dragenter.prevent="()=>{console.log('dragenter')}"
                        @dragover.prevent="()=>{console.log('dragover')}"
                        @dragleave.prevent="()=>{console.log('dragleave')}" -->
                    <view
                        style="font-size: 14px;color: #333;line-height: 180%;font-weight: 500;text-align: center;margin-top: 12px;">
                        单击选择文件进行上传</view>
                    <view style="font-size: 14px;color: #666;line-height: 180%;text-align: center;">
                        支持{{ state.availableUploadFilePrefix.join('/') }}格式
                    </view>
                </view>
                <!-- 已上传资源 -->
                <view class="section">
                    <view class="title">
                        <image src="/static/picture.png" class="icon" mode="widthFix"></image>
                        <text class="text">已上传资源</text>
                    </view>
                    <scroll-view class="resourceList" scroll-y :show-scrollbar="false">
                        <block v-for="(item, index) in form.expand?.historyUrl" :key="item.id">
                            <view
                                @click="() => { selectFile(item.url); handleOpenResourceEditorPopup(item.url, null, form.name) }"
                                :class="'item ' + (state.selectedImageURL == item.url ? 'active' : '')"
                                style="background-color: #666666;">
                                <image v-if="item._mediaType == 'image'" :src="item.url"
                                    style="width: 100%; height: 100%;cursor: pointer;" mode="aspectFit">
                                </image>
                                <image v-else-if="item._mediaType == 'video'" src="/static/video_icon_white.png"
                                    style="width: 40%; height: 40%;cursor: pointer;position: absolute;top: 50%;left: 50%;transform: translate(-50%, -50%);;"
                                    mode="widthFix">
                                </image>
                                <image v-else-if="item._mediaType == 'audio'" src="/static/audio.png"
                                    style="width: 40%; height: 40%;cursor: pointer;position: absolute;top: 50%;left: 50%;transform: translate(-50%, -50%);;"
                                    mode="widthFix">
                                </image>
                                <view class="deleteIcon" @click.stop="handleRemoveHistoryImageByUpload(item, index)">
                                </view>
                            </view>
                        </block>
                    </scroll-view>
                </view>
            </template>
        </view>
    </view>
    <!-- 生图参数弹窗 -->
    <Teleport to="body" v-if="state.imageGenerationShow">
        <view class="popup-imageGeneration">
            <view class="tagSelector" style="margin-top: 12px;">
                <view class="title">图片质量</view>
                <view class="list">
                    <view class="item" v-for="(item, index) in state.resolutionList" :key="item.value"
                        :class="{ 'active': item == state.curresolution }" @click="resolutionChange(item)">{{ item }}
                    </view>
                </view>
            </view>
            <view class="tagSelector" style="margin-top: 12px;">
                <view class="title">画幅尺寸</view>
                <view class="list">
                    <view class="item" v-for="(item, index) in state.ratioList" :key="item.value"
                        :class="{ 'active': item == state.curratio }" @click="ratioChange(item)">{{ item }}</view>
                </view>
            </view>
            <view class="tagSelector" style="margin-top: 12px;">
                <view class="title">生成数量</view>
                <view class="list">
                    <view class="item" v-for="(item, index) in [1, 2, 3, 4]" :key="item.value"
                        :class="{ 'active': item == state.curCount }" @click="countChange(item)">{{ item }}</view>
                </view>
            </view>
            <view class="footer">
                <view class="btn" @click="rawCancel">取消</view>
                <view class="btn light" @click="rawConfirm">确定</view>
            </view>
        </view>
        <view class="mask"></view>
    </Teleport>
    <!-- 修改资源参数弹窗 -->
    <Teleport to="body" v-if="state.modifyPopupShow">
        <view
            style="z-index: 101;position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%);width: 420px;padding: 20px;background: #fff;border-radius: 12px;">
            <view style="font-size: 24px;color: #FFA600;text-align: center;font-weight: 600;">修改资产</view>
            <view style="font-size: 18px;color: #333;">资产名称</view>
            <view style="padding: 8px;background-color: #f7f7f7;margin-top: 8px;border-radius: 6px;">
                <input style="padding-left: 6px;flex: 1;" placeholder="请输入资产名称" v-model="form_updatePopup.name"
                    :disabled="!props.editable" />
            </view>
            <view style="display: flex;align-items: center;padding: 24px;">
                <view
                    style="flex:1;text-align: center;height: 44px;line-height: 44px;margin-right: 24px;background: #E7E7E7;border-radius: 8px;cursor: pointer;"
                    @click="state.modifyPopupShow = false">取消</view>
                <view
                    style="flex:1;text-align: center;height: 44px;line-height: 44px;color: #fff;background: #FFA600;border-radius: 8px;cursor: pointer;"
                    @click="handleModifyResource">确认</view>
            </view>
        </view>
        <view class="mask"></view>
    </Teleport>
    <!-- 修改seedance2合规ID弹窗 -->
    <Teleport to="body" v-if="state.seedance2AuditPopup.visible">
        <view
            style="z-index: 101;position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%);width: 500px;padding: 20px;background: #fff;border-radius: 12px;">
            <view style="font-size: 24px;color: #FFA600;text-align: center;font-weight: 600;">手动添加合规ID</view>
            <view style="display: flex;align-items: center;margin-top: 16px;">
                <view style="width:150px">
                    <view style="font-size: 14px;color: #333;">选择渠道</view>
                    <view style="padding: 8px;background-color: #f7f7f7;border-radius: 6px 0 0 6px;">
                        <uni-data-select style="height: 32px;line-height: 32px;"
                            v-model="state.seedance2AuditPopup.platform" mode="none" :clear="false"
                            :localdata="seedance2ChannelList"
                            @change="seedance2AuditPopupSelectorChange"></uni-data-select>
                    </view>
                </view>
                <view style="flex: 1;">
                    <view style="font-size: 14px;color: #333;">合规ID</view>
                    <view style="padding: 8px;background-color: #f7f7f7;border-radius: 0 6px 6px 0;">
                        <input style="height: 32px;line-height: 32px; padding-left: 6px;flex: 1;" placeholder="请输入合规ID"
                            v-model="state.seedance2AuditPopup.inputValue" :disabled="!props.editable" />
                    </view>
                </view>
            </view>
            <view style="display: flex;align-items: center;padding: 24px;">
                <view
                    style="flex:1;text-align: center;height: 44px;line-height: 44px;margin-right: 24px;background: #E7E7E7;border-radius: 8px;cursor: pointer;"
                    @click="seedance2AuditPopupCancel">取消</view>
                <view
                    style="flex:1;text-align: center;height: 44px;line-height: 44px;color: #fff;background: #FFA600;border-radius: 8px;cursor: pointer;"
                    @click="seedance2AuditPopupConfirm">确认</view>
            </view>
        </view>
        <view class="mask"></view>
    </Teleport>

    <!-- 公共库资源选择器 -->
    <PopupResourcePicker v-if="state.resourcePickerShow" uploadFileType="1" :typeId="props.data.typeId" :limit="5"
        :projectId="props.data.projectId" @close="state.resourcePickerShow = false" @confirm="handleSelectResource">
    </PopupResourcePicker>

    <!-- 音色选择弹窗 -->
    <PopupTimbre v-if="state.timbrePopupShow" @close="state.timbrePopupShow = false"></PopupTimbre>

    <!-- 生图风格选择弹窗 -->
    <PopupSP v-if="state.paintingStylePopupShow" @close="state.paintingStylePopupShow = false" typeId="9"
        @confirm="handleSelectPaintingStyle" title="选择生图风格">
    </PopupSP>

    <!-- 生图预设选择弹窗 -->
    <PopupAppendPreset v-if="state.appendPresetPopupShow" @close="state.appendPresetPopupShow = false"
        @confirm="handleSelectAppendPreset">
    </PopupAppendPreset>

    <!-- 资源编辑弹窗 -->
    <PopupResourceEditor v-if="state.resourceEditorPopupConfig.visible" :data="form.historyUrl"
        :index="state.resourceEditorPopupConfig.index" :name="state.resourceEditorPopupConfig.name"
        @close="state.resourceEditorPopupConfig.visible = false"
        @cancelGeneration="({ item, index }) => handleCancelImageGeneration(item, index)" @getTaskInfo="getTaskInfo">
    </PopupResourceEditor>

    <!-- 音频预览弹窗 -->
    <PopupAudioPreview v-if="state.audioPreviewPopup.visible" @close="state.audioPreviewPopup.visible = false"
        :src="state.audioPreviewPopup.url" :title="state.audioPreviewPopup.title">
    </PopupAudioPreview>

    <!-- 视频预览弹窗 -->
    <PopupVideoPreview v-if="state.videoPreviewPopup.visible" @close="state.videoPreviewPopup.visible = false"
        :src="state.videoPreviewPopup.url">
    </PopupVideoPreview>
</template>

<script setup name="resourceDetail">
import { EditorResource, DeleteResource, GetResourceList } from '@/common/ResourceMgr'
import { UploadFile } from "@/common/Tool";
import {
    APIPath,
    getRequest,
    postRequest,
    putRequest,
} from "@/common/APIRequest";
import { ref, reactive, defineEmits, defineProps, onMounted, watch, toRefs, computed, onUnmounted, onBeforeUnmount } from "vue";
import { GetDict, GetAIModelList } from '@/common/Common'
import { useStore } from "vuex";

import PopupResourcePicker from '@/components/PopupResourcePicker.vue'
import PopupTimbre from './components/popupTimbre.vue'
import PopupSP from '@/components/popupSP.vue'
import PopupResourceEditor from './components/PopupResourceEditor.vue'
import PopupAppendPreset from './components/popupAppendPreset.vue'
import PopupAudioPreview from '@/components/PopupAudioPreview.vue'
import PopupVideoPreview from '@/components/PopupVideoPreview.vue'

import CommonResources from './components/commonResources.vue';
import { isNull, checkMediaType, deepEqualFast, copyText,downloadFile,urlToFile } from '../../common/Tool';
import { BananaTextImage, Doubaoseedream5_0liteTextImage, KirinV3TextImage } from '../../common/AIAgentForServer';
import { getTaskBaseInfo } from '@/common/ProjectMgr';
import { cloneDeep } from 'lodash';
import {getAiModelParamsMap} from '@/common/modelParamsConfig';

const modelParamsConfig = getAiModelParamsMap();
const props = defineProps({
    data: {
        type: Object,
        default: () => { },
        required: true,
    },
    createImageConfig: {
        type: Object,
        default: () => { },
    },
    typeMap: {
        type: Array,
        required: true,
    },
    huafengSp: {
        type: String,
        default: '',
    },
    // 是否可编辑
    editable: {
        type: Boolean,
        default: true,
    },
})

const store = useStore();

const emit = defineEmits(["updated", "deleted"]);

const typeName = computed(() => {
    return props.typeMap.find((item) => item.id == props.data.typeId)?.treeName || ""
})

const seedance2ReviewStatusMap = {
    0: {
        text: '待送审',
        color: '#666666',
        iconName: 'shield_icon_gray'
    },
    1: {
        text: '审核通过',
        color: '#10BC00',
        iconName: 'shield_icon_green'
    },
    2: {
        text: '审核中',
        color: '#F78854',
        iconName: 'shield_icon_orange'
    },
    3: {
        text: '审核审核不通过',
        color: '#FF5757',
        iconName: 'shield_icon_red'
    },
}

let historyCreatorListener = null; // 轮询历史生图指针
let listeningTaskIds = null; // 正在生图的id集合
const state = reactive({
    tabs: [
        { name: "SP图片生成", },
        { name: "公共库挑选", },
        { name: "上传文件", },
    ],
    curTabsIndex: 0, // 页签索引
    imageGenerationShow: false, // 生图参数设置弹窗显示状态
    resourcePickerShow: false, // ”SP生图“页签，选择参考图弹窗显示状态

    curSubTabsIndex: 0, // 音色0，特征1

    modifyPopupShow: false, // 修改资源参数弹窗显示状态

    timbrePopupShow: false, // 音色选择弹窗显示状态

    paintingStylePopupShow: false, // 生图风格选择弹窗显示状态
    appendPresetPopupShow: false, // 生图预设选择弹窗显示状态

    selectedImageURL: '', // 历史生图选中的图片

    ailist: [],
    curCount: 1,

    ratioList: ['16:9', '9:16', '3:4', '4:3', '1:1'],
    curratio: '16:9',
    resolutionList: ['1K', '2K', '3K', '4K'],
    curresolution: '2K',

    rawRatio: '16:9',
    rawResolution: '2K',
    rawCount: 1,

    resourceEditorPopupConfig: {
        visible: false, // 资源编辑弹窗显示状态
        data: '', // 资源编辑弹窗显示的图片url
        index: 0, // 资源编辑弹窗显示的图片索引
        name: '', // 资源编辑弹窗显示的图片名称
    },

    audioPreviewPopup: {
        visible: false,
        url: '',
        title: '',
    },

    videoPreviewPopup: {
        visible: false,
        url: '',
    },

    // 修改seedance2合规ID弹窗
    seedance2AuditPopup: {
        visible: false,
        id: '',
        platform: '',
        inputValue: '',
    },

    availableUploadFilePrefix: ['jpg', 'jpeg', 'png', 'webp', 'mp4', 'mov', 'mp3', 'wav'],
})

// 资源数据的拷贝，避免直接修改props.data
const form = ref({})
//修改资源弹窗数据源
const form_updatePopup = ref({})

const currentMediaType = computed(() => checkMediaType(state.selectedImageURL))

const seedance2ChannelList = computed(() => {
    return form.value?.assets.map(i => {
        return {
            text: i.platformName,
            value: i.platform,
            content: i.content,
            id: i.id,
        }
    }) || []
})

watch(() => props.data, (newVal, oldVal) => {
    const isEuqalProps = deepEqualFast(newVal, form.value)
    if (newVal?.id == oldVal?.id && isEuqalProps) {
        console.log('重复触发了')
        return
    }
    form.value = cloneDeep(newVal);

    // console.log('form.value', form.value)
    getDetail()

    claerHistoryCreatorListener()
    listeningTaskIds = [];
    startListenHistoryUrlRefresh();

    state.curTabsIndex = 0;
    state.curCommonResourceIndex = null;
    state.selectedImageURL = form.value.url ?? '';
}, {
    immediate: true,
    deep: true,
})

function handleVoiceNameChange(e) {
    form.value.voiceName = e.detail.value
}

function handleVoiceDetailChange(e) {
    form.value.voiceDetail = e.detail.value
}

function handleCoreFeatureChange(e) {
    form.value.coreFeature = e.detail.value
}

// function createRawImageListener(taskId) {
//     console.log('taskId', taskId)
//     form.value.expand?.urls.push('')
//     store.dispatch('process/addTaskListener', {
//         tagName: 'image',
//         type: 2,
//         taskId: taskId,
//         extract: {
//         }
//     })
// }

function addListeningTaskId(taskId) {
    listeningTaskIds.push(taskId)
}

function addImageCreatorTask(id) {
    addListeningTaskId(id)
    startListenHistoryUrlRefresh(true)
}

function handleContentSPInput(e) {
    form.value.content = e.detail.value
}

function startRawImage() {
    // form.value.expand.urls.push('')

    if (isNull(form.value.content)) {
        uni.showToast({
            title: '请输入SP描述',
            icon: 'none'
        })
        return
    }
    var styleSP = props.huafengSp || props.createImageConfig.promptSp;
    if (!isNull(styleSP) && !form.value.content.match('/风格及光线[:：]{1}/')) {
        styleSP = "\n风格：" + styleSP
    }

    const modelInterface = state.ailist.find(i => i.value == state.curModelId)?.modelInterface
    const params = [{
        projectId: props.data.projectId,
        modelId: state.curModelId,
        prompt: form.value.content + styleSP,
        ratio: state.rawRatio,
        resolution: state.rawResolution,
        watermark: false,
        name: form.value.name,
        typeId: props.data.typeId,
        num: state.rawCount,
        itemId: form.value.id,
        imageUrls: form.value.expand?.imgUrls?.map(i => i.url) || []
    }]

    switch (modelInterface) {
        case 'Doubaoseedream5_0liteTextImage':
            Doubaoseedream5_0liteTextImage(params, (data) => {
                addImageCreatorTask(data.taskList[0])
                uni.showToast({
                    title: '执行成功，请耐心等候！',
                    icon: 'none'
                })
            }, (error) => {
                uni.showToast({
                    title: '执行失败' + error,
                    icon: 'none'
                })
            })
            break;
        case 'BananaTextImage':
            BananaTextImage(params, (data) => {
                addImageCreatorTask(data.taskList[0])
                uni.showToast({
                    title: '执行成功，请耐心等候！',
                    icon: 'none'
                })
            }, (error) => {
                uni.showToast({
                    title: '执行失败' + error,
                    icon: 'none'
                })
            })
            break;
        case 'KirinV3TextImage': //KirinV3Omni
            KirinV3TextImage(params, (data) => {
                addImageCreatorTask(data.taskList[0])
                uni.showToast({
                    title: '执行成功，请耐心等候！',
                    icon: 'none'
                })
            }, (error) => {
                uni.showToast({
                    title: '执行失败' + error,
                    icon: 'none'
                })
            })
            break;
        default:
            params.modelId = '13'
            BananaTextImage(params, (data) => {
                addImageCreatorTask(data.taskList[0])
                uni.showToast({
                    title: '执行成功，请耐心等候！',
                    icon: 'none'
                })
            }, (error) => {
                uni.showToast({
                    title: '执行失败' + error,
                    icon: 'none'
                })
            })
            break;
    }

}

function countChange(count) {
    state.curCount = count
}
function ratioChange(item) {
    state.curratio = item
}
function resolutionChange(item) {
    state.curresolution = item
}
function handleModelChange(e) {
    state.curModelId = e
    changeResolution();
}

function getDetail(showLoading = false) {
    showLoading && uni.showLoading({
        title: '加载中',
    })
    getRequest(`${APIPath.resourceDetail}/${form.value.id}`, (data) => {
        showLoading && uni.hideLoading()
        if (data.code == 200) {
            //快速切换资源时，上次的请求可能是别的资源，判断资源id是否一致
            if (data.data.id == form.value.id) {
                data.data?.expand?.historyUrl.forEach(item => {
                    item._mediaType = checkMediaType(item.url)
                })
                form.value = data.data;
            }
            showLoading && uni.showToast({
                title: '已刷新',
                icon: 'none'
            })
            // emit('updated',form.value)
        }
    })
}

function startListenHistoryUrlRefresh(refresh = false) {
    const fn = () => {
        getRequest(`${APIPath.resourceDetail}/${props.data.id}`, (data) => {
            if (data.code == 200) {
                const historyUrl = data.data.historyUrl;
                if (data.data.id == form.value.id) {
                    form.value.historyUrl = data.data.historyUrl;
                    form.value.assets = data.data.assets;
                }
                if (listeningTaskIds.length) {
                    for (let i = 0; i < listeningTaskIds.length; i++) {
                        for (const urlItem of historyUrl) {
                            if (urlItem.id == listeningTaskIds[i] && urlItem.status == 5 && urlItem.ossUrl) {
                                form.value.url = state.selectedImageURL = urlItem.ossUrl;
                                listeningTaskIds.splice(i, 1)
                                // 更新外面列表
                                emit('updated')
                                break;
                            }
                        }
                    }
                }
            }
        })
    }
    // 点击生图立马执行并重新监听
    if (refresh) {
        clearInterval(historyCreatorListener)
        fn()
        historyCreatorListener = setInterval(fn, 5000)
        store.commit('process/REGISTER_TIMER', {
            tagName: 'image',
            interval: historyCreatorListener
        })
    } else {
        historyCreatorListener = setInterval(fn, 5000)
        store.commit('process/REGISTER_TIMER', {
            tagName: 'image',
            interval: historyCreatorListener
        })
    }
}

function selectPublicRes(item) {
    state.selectedImageURL = item.data.url
    handleOpenResourceEditorPopup(item.data.url)
}

function selectFile(url) {
    url && (state.selectedImageURL = url)
}

// 生图功能的部分
const ImageGeneration = reactive({
    curQualityValue: '',
    curRatioValue: '',
    curQuantityValue: '',
    imgs: [], // 参考图已选列表
})

// 字典
const dictConfig = reactive({
    create_picture: [],//生图数量
    project_frame: [],//画幅
    project_resolution: [],//分辨率
    project_timbre: [],//音色
})

// 获取所有字典数据
const GetDicts = () => {
    for (const dictItem of Object.keys(dictConfig)) {
        GetDict(dictItem).then((datalist) => {
            dictConfig[dictItem] = datalist.map(i => {
                return {
                    value: i.dictValue,
                    text: i.dictLabel,
                }
            })
        })
    }
}

const handleTabChange = (index) => {
    state.curTabsIndex = index;
}

const handleSubTabChange = (index) => {
    state.curSubTabsIndex = index;
}

const handleShowImageGenerationParamsPopup = () => {
    state.curratio = state.rawRatio
    state.curresolution = state.rawResolution
    state.curCount = state.rawCount
    state.imageGenerationShow = true
}

function rawConfirm() {
    state.rawRatio = state.curratio
    state.rawResolution = state.curresolution
    state.rawCount = state.curCount
    state.imageGenerationShow = false
}

function rawCancel() {
    state.imageGenerationShow = false
}

// 选择资源确认
const handleSelectResource = (selectedFiles) => {
    // console.log(selectedFiles, form.value.expand?.imgUrls)
    let existUnknownFile = false;
    let existRepeatFile = false;

    const filtered = [];
    for (let item of selectedFiles) {
        const mediaType = checkMediaType(item.url);
        let _existRepeat = false;
        if (mediaType != 'image') {
            existUnknownFile = true;
            continue
        }

        for (let hItem of form.value.expand?.imgUrls || []) {
            if (hItem.url == item.url) {
                existRepeatFile = _existRepeat = true;
                break;
            }
        }

        !_existRepeat && filtered.push(item)
    }

    form.value.expand.imgUrls?.push(...filtered)

    existUnknownFile && uni.showToast({
        title: '已去除非图片资源',
        icon: 'none'
    })

    existRepeatFile && uni.showToast({
        title: '已去除重复资源',
        icon: 'none'
    })

    handleUpdateResource({ showToast: false, refreshList: false })
}
// 删除参考图
const handleRemoveReferenceImage = (item, index) => {
    postRequest(APIPath.deleteImgUrls, { id: form.value.id, itemHistoryId: item.id }, (resData) => {
        form.value.expand.imgUrls?.splice(index, 1)
        // 单独更外面列表对应Item
        // emit('updated', form.value)
    })
}

// 删除SP生图历史
const handleRemoveHistoryImage = (item, index) => {
    const fn = () => {
        postRequest(`${APIPath.deleteHistorylmages}?id=${item.id}`, null, (resData) => {
            if (resData.code == 200) {
                form.value.historyUrl.splice(index, 1)
            }
        })
    }

    if (item.status == 5) {
        uni.showModal({
            title: '提示',
            content: '确定删除？',
            success: (res) => {
                if (res.confirm) {
                    fn()
                }
            }
        })
    } else {
        fn()
    }
}

// 删除上传图片历史
const handleRemoveHistoryImageByUpload = (item, index) => {
    uni.showModal({
        title: '提示',
        content: '确定删除？',
        success: (res) => {
            if (res.confirm) {
                postRequest(APIPath.deleteUploadHistory, { id: form.value.id, itemHistoryId: item.id }, (resData) => {
                    if (resData.code == 200) {
                        form.value?.expand?.historyUrl.splice(index, 1)
                    }
                })
            }
        }
    })
}

const handleOpenResourceEditorPopup = (data, index, name) => {
    if (!data) return;
    if (typeof data == 'object') {
        if (data[index].status == 5) {
            state.resourceEditorPopupConfig.visible = true
            state.resourceEditorPopupConfig.index = index
            state.resourceEditorPopupConfig.name = name
        }
    } else {
        const mediaType = checkMediaType(data)
        if (mediaType == 'image') {
            uni.previewImage({
                urls: [data],
                current: data
            })
        }
        if (mediaType == 'audio') {
            state.audioPreviewPopup.visible = true
            state.audioPreviewPopup.url = data
            state.audioPreviewPopup.title = name
        } else if (mediaType == 'video') {
            state.videoPreviewPopup.visible = true
            state.videoPreviewPopup.url = data
        }
    }
}

const handlePreviewAudio = () => {
    state.audioPreviewPopup.url = state.selectedImageURL;
    state.audioPreviewPopup.visible = true;
    state.audioPreviewPopup.title = form.value.name;
}

// 上传图片页签，选择图片
const handleSelectUploadResource = () => {
    uni.chooseFile({
        count: 1, //默认1
        success: (res) => {
            try {
                let prefix = res.tempFiles[0]?.name.match(/\.([0-9a-zA-Z]+)/)?.[1] //item.type.split('/').pop();
                if (!state.availableUploadFilePrefix.includes(prefix?.toLocaleLowerCase())) {
                    uni.showToast({
                        title: `仅支持上传${state.availableUploadFilePrefix.join('、')}文件`,
                        icon: 'none',
                        duration: 3000
                    })
                    return
                }

                UploadFile(res.tempFilePaths[0], (url) => {
                    selectFile(url);
                    form.value.url = url;
                    form.value?.expand?.historyUrl.push({
                        id: new Date().getTime() + (Math.random() * 10000).toString().slice(-5),
                        name: res.tempFiles[0]?.name,
                        url,
                        _mediaType: checkMediaType(url)
                    })
                    handleUpdateResource({ showToast: false, refreshList: true })
                })

            } catch (error) {
                console.error('上传文件失败', error)
            }
        },
    });
}

const handleModifyResourceShow = () => {
    form_updatePopup.value = JSON.parse(JSON.stringify(form.value))
    state.modifyPopupShow = true
}

// 修改资源名称等
const handleModifyResource = () => {
    form.value.name = form_updatePopup.value.name
    state.modifyPopupShow = false
    handleUpdateResource({ showToast: false, refreshList: false })
}

// 右上角保存
const handleUpdateResource = (config = { showToast: true, refreshList: true }) => {
    var params = {
        ...form.value,
        url: state.selectedImageURL ?? '',
        status: 1,
    }
    EditorResource(params, (resData) => {
        config.showToast && uni.showToast({
            title: '保存成功',
            icon: 'success',
            duration: 2000
        })

        // 刷新外面列表或进行单个更新
        if (config.refreshList) {
            emit('updated')
        } else {
            emit('updated', params)
        }
    })
}

const handleDeleteResource = () => {
    const id = props.data.id;
    uni.showModal({
        title: "确认删除",
        content: "确定删除该资源吗？",
        success: (res) => {
            if (res.confirm) {
                DeleteResource([id], (res) => {
                    emit('deleted')
                });
            }
        },
    });
}

function changeResolution() {
    const target = modelParamsConfig.find(item => item.id == state.curModelId)

    state.resolutionList = target.resolution
    state.ratioList = target.ratio

    if (!state.resolutionList.includes(state.curresolution)) {
        state.rawResolution = state.curresolution = state.resolutionList[0]

    }
    if (!state.ratioList.includes(state.curratio)) {
        state.rawRatio = state.curratio = state.ratioList[0]
    }
}

function handleCancelImageGeneration(item, index) {
    postRequest(APIPath.cancelTaskQueue, { id: item.id }, (data) => {
        if (data.code == 200) {
            form.value.historyUrl[index].status = 8
            uni.showToast({
                title: '取消任务成功',
                icon: 'none',
            });
        }
        else {
            uni.showToast({
                title: '取消任务失败:' + data.msg,
                icon: 'none',
                duration: 2000
            });
        }
    }, (error) => {
        uni.showToast({
            title: '取消任务失败' + error,
            icon: 'none',
            duration: 2000
        });
    })
}

function getTaskInfo(taskId) {
    getTaskBaseInfo(taskId)
}

function claerHistoryCreatorListener() {
    store.commit('process/CLEAR_TIMER', {
        tagName: 'image'
    })
}

function handleSelectPaintingStyle(spItem) {
    if (!form.value.content.includes(spItem.content)) {
        form.value.content = (form.value.content == '' ? spItem.content : form.value.content + '\n' + spItem.content)
    } else {
        uni.showToast({
            title: '已添加该风格，无需重复添加',
            icon: 'none',
            duration: 2000
        })
    }
}

function handleSelectAppendPreset(spList) {
    let showRepeatToast = false;
    for (const item of spList) {
        if (!form.value.content.includes(item.content)) {
            form.value.content = (form.value.content == '' ? item.content : form.value.content + '\n' + item.content)
        } else {
            showRepeatToast = true
        }
    }
    showRepeatToast && uni.showToast({
        title: '已跳过重复选取的预设',
        icon: 'none',
        duration: 3000
    })
}

function showSeedance2AuditPopup() {
    const firstChannel = seedance2ChannelList.value.filter(i => i.content != '')?.[0]
    if (firstChannel) {
        state.seedance2AuditPopup.id = firstChannel.id
        state.seedance2AuditPopup.inputValue = firstChannel.content
        state.seedance2AuditPopup.platform = firstChannel.value
    }

    state.seedance2AuditPopup.visible = true
}

function seedance2AuditPopupSelectorChange(value) {
    const channel = seedance2ChannelList.value.find(i => i.value == value)
    if (channel) {
        state.seedance2AuditPopup.inputValue = channel.content
    }
}

function seedance2AuditPopupCancel() {
    state.seedance2AuditPopup.visible = false;
    state.seedance2AuditPopup.inputValue = '';
    state.seedance2AuditPopup.platform = '';
    state.seedance2AuditPopup.id = '';
}

function seedance2AuditPopupConfirm() {
    if (!state.seedance2AuditPopup.id) {
        uni.showToast({
            title: '请先选择渠道',
            icon: 'none',
            duration: 2000
        })
        return
    }
    postRequest(APIPath.seedance2ResourcReviewUpdate, {
        id: state.seedance2AuditPopup.id,
        platform: state.seedance2AuditPopup.platform,
        content: state.seedance2AuditPopup.inputValue,
    }, (data) => {
        if (data.code == 200) {
            uni.showToast({
                title: '更新成功',
                icon: 'none',
                duration: 2000
            })
            form.value.assets.some(i => {
                if (i.id == state.seedance2AuditPopup.id) {
                    i.content = state.seedance2AuditPopup.inputValue
                    return true
                }
            })
            seedance2AuditPopupCancel()

        } else {
            uni.showToast({
                title: '更新失败:' + data.msg,
                icon: 'none',
                duration: 2000
            })
        }
    }, (error) => {
        uni.showToast({
            title: '更新失败,' + error,
            icon: 'none',
            duration: 2000
        })
    })
}

function seedance2ResourceReviewSubmit(item) {
    if(item && ![0,3].includes(item.status)){
        return
    }
    const isByChannel = item && [0,3].includes(item.status);
    uni.showModal({
        title: "确认提交",
        content: isByChannel?`将对${item.platformName}渠道提交审核，确认继续？`:"将对所有渠道提交审核，确认继续？",
        success: (res) => {
            if (res.confirm) {
                const requestUrl = isByChannel?`${APIPath.seedance2ResourcReviewByChannel}/${item.id}`:`${APIPath.seedance2ResourcReview}/${props.data.id}`
                postRequest(requestUrl, null, (data) => {
                    if (data.code == 200) {
                        uni.showToast({
                            title: '提交成功',
                            icon: 'none',
                            duration: 2000
                        })
                    }
                    else {
                        uni.showToast({
                            title: '提交失败:' + data.msg,
                            icon: 'none',
                            duration: 2000
                        })
                    }
                }, (error) => {
                    uni.showToast({
                        title: '提交失败' + error,
                        icon: 'none',
                        duration: 2000
                    })
                })
            }
        },
    })

}

function getCurrentData() {
    return cloneDeep(form.value)
}

async function handlerDownload(url){
    if(process.env.NODE_ENV=='development'){
        url = url.replace('https://aires.jigentoys.net','/api-video')
    }
    const file = await urlToFile(url)
    if(file){   
        const prefix = file.type.split('/')[1];
        downloadFile(file, `${form.value.name}.${prefix.toLowerCase()}`);
    }
}

onMounted(() => {
    if (props.createImageConfig) {
        const { defaultModel, defaultFrame, defaultNum, defaultResolution } = props.createImageConfig
        defaultModel && (state.curModelId = defaultModel)
        defaultFrame && (state.rawRatio = state.curratio = defaultFrame);
        defaultResolution && (state.rawResolution = state.curresolution = defaultResolution);
        defaultNum && (state.rawCount = state.curCount = defaultNum)
    }

    GetDicts()

    GetAIModelList().then((modelList) => {
        const data = [];
        for (const item of modelList) {
            data.push({
                value: item.id.toString(),
                text: item.name,
                modelType: item.modelType,
                modelInterface: item.modelInterface,
            })
        }
        state.ailist = data.filter(i => i.modelType == '4')
        if (!props.createImageConfig) {
            state.curModelId = state.ailist.find(i => i.value == 13)?.value ?? state.ailist[0].value
        }
        changeResolution();
    })

    uni.$on('restartListenCreateImage', () => {
        // console.log('重新监听')
        startListenHistoryUrlRefresh()
    })
})

onBeforeUnmount(() => {
    claerHistoryCreatorListener()
    uni.$off('restartListenCreateImage')
})

defineExpose({
    addListeningTaskId,
    getCurrentData,
})
</script>

<style scoped lang="scss">
::v-deep .uni-stat-box {
    border-radius: 4px;
}

.mask {
    position: fixed;
    z-index: 98;
    background: rgba(0, 0, 0, .6);
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
}

.popup-imageGeneration {
    border-width: 0px;
    position: fixed;
    z-index: 99;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    min-width: 420px;
    min-height: 248px;
    background-color: #FFF;
    border-radius: 12px;
    padding: 20px 16px;
    box-sizing: border-box;

    .footer {
        display: flex;
        align-items: center;
        justify-content: flex-end;
        margin-top: 12px;

        .btn {
            cursor: pointer;
            width: 120px;
            height: 36px;
            line-height: 36px;
            text-align: center;
            border-radius: 5px;
            color: #333;
            background: #E7E7E7;
            font-size: 14px;
            font-weight: 500;
            margin-right: 8px;

            &.light {
                background: #F8BA38;
            }
        }
    }
}

.tagSelector {
    margin-top: 20px;

    &:first-child {
        margin-top: 0;
    }

    .title {
        font-size: 16px;
        font-weight: bold;
        color: #333;
    }

    .list {
        margin-top: 8px;
        display: flex;
        flex-wrap: wrap;

        .item {
            min-width: 70px;
            height: 32px;
            line-height: 32px;
            border: 1px solid #DCDCDC;
            padding: 0 8px;
            text-align: center;
            border-radius: 5px;
            color: #333;
            background: linear-gradient(0deg, #F3F3F3, #F3F3F3), #FFFFFF;
            margin-right: 6px;
            margin-bottom: 6px;
            box-sizing: border-box;
            font-size: 14px;
            font-weight: 500;

            &.active {
                background: #F8BA38;
            }
        }
    }
}

.selector {
    cursor: pointer;
    position: relative;
    height: 35px;
    line-height: 35px;
    box-sizing: border-box;
    font-size: 14px;
    color: rgba(0, 0, 0, 0.9);
    background: #fff;
    border-radius: 4px;
    border: none;
    margin-right: 8px;
    padding: 0 8px;
    padding-right: 24px;

    &::after {
        content: '';
        position: absolute;
        right: 10px;
        top: 10px;
        z-index: 2;
        width: 6px;
        height: 6px;
        border-left: 2px solid rgba(0, 0, 0, 0.9);
        border-bottom: 2px solid rgba(0, 0, 0, 0.9);
        transform: rotate(-45deg);
    }
}

.sliderSection {
    width: 542px;
    background-color: #fff;
    display: flex;
    flex-direction: column;
    margin-top: 4rpx;
    padding-left: 40rpx;
    padding-right: 40rpx;
    box-sizing: border-box;
    overflow-y: scroll;

    .head {
        display: flex;
        justify-content: space-between;

        .title {
            font-size: 16px;
            color: #ffa701;
            font-weight: bold;
        }

        .btn {
            width: 64px;
            height: 32px;
            line-height: 32px;
            text-align: center;
            border-radius: 8px;
            background-color: #e7e7e7;
            box-sizing: border-box;
            display: inline-block;
            cursor: pointer;

            &.danger {
                background: transparent;
                border: 1px solid #ff5757;
                color: #ff5757;
            }

            &.light {
                background: linear-gradient(90deg, #FFA600 0%, #FFDA3C 100%), linear-gradient(90deg, #F8BA38 0%, #FFCA5A 100%);
            }
        }
    }

    .preview {
        width: 320px;
        height: 180px;
        background: #999999;
        position: relative;
        display: flex;
        justify-content: center;
        align-items: center;
        border: 1px solid #E7E7E7;
        border-top: none;

        .overlay {
            display: flex;
            flex-direction: column;
            justify-content: center;
            position: absolute;
            z-index: 3;
            bottom: 0;
            left: 0;
            box-sizing: border-box;
            width: 100%;
            height: 90px;
            background: rgba(0, 0, 0, 0.6);
            backdrop-filter: blur(10px);
            border-radius: 8px 8px 0px 0px;
            padding: 0 12px;
            color: #fff;
            font-size: 12px;
            line-height: 160%;
            font-weight: 400;
        }

        .btn {
            position: absolute;
            left: 6px;
            top: 6px;
            width: 40px;
            height: 20px;
            line-height: 20px;
            border-radius: 4px;
            background: rgba(0, 0, 0, 0.4);
            color: #fff;
            text-align: center;
            cursor: pointer;
        }
    }

    .cell {
        display: flex;
        align-items: center;
        padding: 8px;
        margin-top: 8px;
        background: linear-gradient(0deg, #FCC34A, #FCC34A), linear-gradient(0deg, #FFA701, #FFA701), linear-gradient(0deg, #E7E7E7, #E7E7E7), rgba(0, 0, 0, 0.2);
        border-radius: 8px 8px 0 0;
        overflow: hidden;

        .leftContent {
            flex: 1;
            display: flex;
            align-items: center;
        }
    }

    .timbre {
        display: flex;
        flex-direction: column;
        background: #F3F3F3;
        padding: 9px;
        padding-bottom: 0;

        .desc {
            margin-top: 8px;
            padding: 6px;
            border-radius: 4px;
            background-color: #fff;
            font-size: 28rpx;
            color: #666666
        }
    }

    .tabs {
        margin-top: 16px;
        border-radius: 8px;
        overflow: hidden;
        display: flex;
        border: 1px solid #e7e7e7;

        .item {
            flex: 1;
            height: 32px;
            line-height: 32px;
            text-align: center;
            background-color: #e7e7e7;
            color: #666666;
            font-weight: bold;
            position: relative;

            &::after {
                position: absolute;
                top: 0;
                right: 0;
                content: "";
                height: 32px;
                width: 1px;
                background: #e7e7e7;
            }

            &:last-child::after {
                display: none;
            }

            &.active {
                background-color: #f8ba38;
                color: #333333;
            }
        }
    }

    .tabContent {
        flex: 1;
        min-height: 0;

        .section {
            margin-top: 8px;

            .head {
                display: flex;
                justify-content: space-between;
                align-items: center;
            }

            .title {
                display: flex;
                align-items: center;

                .icon {
                    height: 16px;
                    width: 16px;
                }

                .text {
                    padding-left: 4px;
                    font-size: 16px;
                    color: #333;
                    font-weight: bold;
                }
            }
        }

        .textarea {
            background: #f7f7f7;
            padding: 12px;
            width: 100%;
            height: 216px;
            box-sizing: border-box;
        }

        .button {
            width: 140px;
            height: 36px;
            line-height: 36px;
            text-align: center;
            border-radius: 8px;
            color: #333;
            background: linear-gradient(90deg, #f8ba38 0%, #ffca5a 100%);
        }

        .uploder {
            margin-top: 8px;
            background: #F7F7F7;
            height: 120px;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            cursor: pointer;
        }
    }
}

.resourceList {
    margin-top: 10px;
    height: 480px;

    .item {
        display: inline-block;
        vertical-align: top;
        position: relative;
        width: 105px;
        height: 105px;
        box-sizing: border-box;
        border-radius: 4px;
        overflow: hidden;
        margin: 0 5px;
        margin-bottom: 10px;
        vertical-align: top;

        .thumbnail {
            width: 100%;
            height: 100%;
        }

        &.active::after {
            cursor: pointer;
            position: absolute;
            left: 0;
            top: 0;
            content: '';
            width: 100%;
            height: 100%;
            box-sizing: border-box;
            z-index: 2;
            border: 3px solid #FCC34A;
        }

        &.active::before {
            position: absolute;
            content: '';
            left: 0;
            top: 0;
            background-image: url('/static/sel_icon.png');
            background-size: 100% 100%;
            background-position: center;
            background-repeat: no-repeat;
            width: 20px;
            height: 20px;
            z-index: 3;
        }

        .desc {
            position: absolute;
            bottom: 0;
            left: 0;
            width: 100%;
            height: 24px;
            line-height: 24px;
            text-align: center;
            font-size: 12px;
            color: #fff;
            background: rgba(0, 0, 0, 0.6);
            backdrop-filter: blur(10px);
        }

        .textTag {
            cursor: pointer;
            position: absolute;
            left: 50%;
            bottom: 6px;
            transform: translateX(-50%);
            font-size: 12px;
            color: #fff;
            display: flex;
            align-items: center;
            justify-content: center;
            width: 60px;
            height: 20px;
            background: rgba(0, 0, 0, 0.6);
            border-radius: 4px;
            z-index: 3;
        }

        .deleteIcon {
            visibility: hidden;
            cursor: pointer;
            position: absolute;
            top: 6px;
            right: 6px;
            width: 24px;
            height: 24px;
            background-image: url('/static/tag_shanchu.png');
            background-repeat: no-repeat;
            background-size: 100% 100%;
            background-position: center;
            z-index: 3;
        }

        &:hover {
            .deleteIcon {
                visibility: visible;
            }
        }
    }
}

.icon-reduce {
    cursor: pointer;
    width: 14px;
    height: 14px;
    border-radius: 50%;
    background-color: #FF5757;
    position: absolute;
    right: 3%;
    top: 3%;
    transform: translate(50%, -50%);
    z-index: 10;

    &::before {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        content: "";
        width: 8px;
        height: 3px;
        background-color: #fff;
    }

    &::before {
        transform: translate(-50%, -50%);
    }
}

.loadingIcon {
    margin-top: 8px;
    width: 20px;
    height: 20px;
    border: 4rpx solid;
    border-radius: 50%;
    border-color: #fff;
    border-top-color: transparent;
    animation: loading-rotate 1s linear infinite;
}

@keyframes loading-rotate {
    0% {
        transform: rotate(0deg);
    }

    100% {
        transform: rotate(360deg);
    }
}

.imageButton {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 60px;
    height: 24px;
    border-radius: 4px;
    background-color: #FFFFFF;
    font-weight: 500;
    display: inline-flex;
    margin: 0 4px;
    position: relative;
    cursor: pointer;

    .img {
        width: 14px;
        height: 14px;
    }

    .text {
        padding-left: 5px;
        font-size: 14px;
        color: #666666;

        &.blue {
            color: #409EFF;
        }
    }

    .tooltip {
        position: fixed;
        z-index: 999;
        transform: translate(-100px, -34px);
        height: 36px;
        line-height: 36px;
        min-width: 200px;
        background-color: #FFE3AF;
        border-radius: 8px;
        border: 2px solid #FCC34A;
        visibility: hidden;
        padding: 0 16px;
        box-shadow: 0 0 6px rgba(0, 0, 0, 0.1);
    }
}

.imageButton:hover .tooltip {
    visibility: visible;
}
</style>
