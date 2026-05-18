<template>
    <view class="popup-project-setting">
        <view class="headerTitle">项目设置</view>
        <view class="icon-close-popup" @click="handleClose"></view>
        <view class="contentWrapper">
            <!-- 基础设置 -->
            <view class="leftPart">
                <view class="field">
                    <view style="display: flex;align-items: center;">
                        <image src="/static/proNameIcon.png" style="width: 32rpx;height: 32rpx;margin-right: 8rpx;">
                        </image>
                        <text class="title">项目名称<text style="color:red">*</text></text>
                    </view>
                    <view style="
                            background-color: #fff;
                            padding: 12px;
                            border-radius: 12px;
                            color: #fff;
                            width: 100%;
                            box-sizing: border-box;
                            ">
                        <input class="uni-input" v-model.trim="state.form.name" maxlength="100"
                            placeholder-style="color: #999;" placeholder="输入项目名称" />
                    </view>
                </view>
                <view class="field">
                    <view style="display: flex;align-items: center;">
                        <image src="/static/proNameIcon.png" style="width: 32rpx;height: 32rpx;margin-right: 8rpx;">
                        </image>
                        <text class="title">项目模式<text style="color: red;font-size: 12px;">* 不可修改</text></text>
                    </view>
                    <view style="display: flex;padding-top: 8px;">
                        <view :class="'actionBtn flex ' + (props.data.type == 1 ? 'yellow' : 'white')">
                            多参流程</view>
                        <view :class="'actionBtn flex ' + (props.data.type == 2 ? 'yellow' : 'white')">
                            图生流程</view>
                    </view>
                </view>

                <view class="field">
                    <view style="display: flex;align-items: center;">
                        <image src="/static/proDetaiIcon.png" style="width: 32rpx;height: 32rpx;margin-right: 8rpx;">
                        </image>
                        <view class="title">项目介绍</view>
                    </view>

                    <view style="
                            background-color: #fff;
                            padding: 12px;
                            border-radius: 12px;
                            color: #fff;
                            width: 100%;
                            box-sizing: border-box;
                            max-width: 100%;
                            height: 204px;
                            ">
                        <textarea class="uni-input textarea" style="width: 100%;height: 100%;"
                            v-model.trim="state.form.content" maxlength="300" placeholder-style="color: #999;"
                            placeholder="请输入项目简介"></textarea>
                    </view>
                </view>
                <view class="field">
                    <view style="display: flex;align-items: center;">
                        <image src="/static/picture.png" style="width: 32rpx;height: 32rpx;margin-right: 8rpx;"></image>
                        <view class="title">项目封面（最佳尺寸3:4）</view>
                    </view>
                    <view class="upload holder" @click="handleSelectImg">
                        <image :src="state.form.url" class="uploadImg" mode="aspectFill" />
                    </view>
                </view>
                <!-- <view class="field">
                    <view class="title">旁白音色</view>
                    <view class="inputWrapper">
                        <uni-data-select  v-model="state.form.voice"
                            :localdata="dictConfig.project_timbre"></uni-data-select>
                    </view>
                </view> -->
                <!-- <view class="field row" style="margin-top: 12px;">
                    <checkbox-group
                        @change="(e) => { state.form.libraryId = e.detail.value.includes('libraryId') ? true : false }">
                        <checkbox value="libraryId" :checked="state.form.libraryId" /><text
                            style="color: #333">项目资产同步到公共库</text>
                    </checkbox-group>
                </view> -->
                <view class="actionBtn danger" @click="handleDelete" style="margin-top: 32px;">
                    删除项目</view>
            </view>

            <view class="rightPart">
                <view class="tabs row">
                    <view :class="['item', tabs.value == state.curTabValue ? 'active' : '']" v-for="tabs in state.tabs"
                        :key="tabs.value" @click="state.curTabValue = tabs.value">{{ tabs.name }}
                    </view>
                </view>
                <!-- 分集剧本页签 -->
                <!-- 分集剧本 -->
                <view v-if="state.curTabValue == 1" style="width: 100%; flex: 1;height: 100%;">
                    <scroll-view scroll-y style="height: 95%;margin-top: 24rpx;width: 100%;">
                        <view v-if="false"
                            style="width: 100%;background: #FFFFFF;border-radius: 16rpx;flex-direction: column;padding-bottom: 32rpx;padding-top: 32rpx;">
                            <view style="display: flex;flex-direction: row;">
                                <view class="row">
                                    <view
                                        style="display: flex;flex-direction: row;align-items: center;margin-left: 40rpx;">
                                        <image src="/static/createVideo.png"
                                            style="width: 40rpx;height: 40rpx;margin-right: 8rpx;"></image>
                                        <text class="title">默认分集剧本SP</text>
                                    </view>
                                    <view style="width: 400rpx;padding-left: 24rpx;">
                                        <uni-data-select
                                            v-model="state.form.projectConfig.txtConfig.createEpisodes.spId"
                                            :localdata="spConfig.episode"
                                            @change="(value) => handleSpChange(value, 'txtConfig', 'createEpisodes.sp', spConfig.episode)"></uni-data-select>
                                    </view>
                                </view>
                                <view class="row" style="margin-left: 58px;">
                                    <view class="title">默认模型</view>
                                    <view style="width: 400rpx;padding-left: 24rpx;">
                                        <uni-data-select
                                            v-model="state.form.projectConfig.txtConfig.createEpisodes.defaultModel"
                                            :localdata="aiModelConfig.text"
                                            @change="(e) => { handleSelectorChange(e, 'txtConfig.createEpisodes.modelList') }"></uni-data-select>
                                    </view>
                                </view>
                            </view>
                            <textarea v-model.trim="state.form.projectConfig.txtConfig.createEpisodes.sp"
                                :maxlength="-1" placeholder-style="color: #999;" placeholder="请选择资产生图SP"
                                style="height: 240rpx; width: 95%; background: #F7F7F7;margin-left: 40rpx;border-radius: 16rpx;padding: 16rpx;margin-top: 16rpx;"></textarea>
                        </view>
                        <view v-if="false"
                            style="width: 100%;background: #FFFFFF;border-radius: 16rpx;flex-direction: column;padding-bottom: 32rpx;padding-top: 32rpx;margin-top: 24rpx;">
                            <view style="display: flex;flex-direction: row;">
                                <view class="row">
                                    <view
                                        style="display: flex;flex-direction: row;align-items: center;margin-left: 40rpx;">
                                        <image src="/static/createVideo.png"
                                            style="width: 40rpx;height: 40rpx;margin-right: 8rpx;"></image>
                                        <text class="title">默认资产清单SP</text>
                                    </view>
                                    <view style="width: 400rpx;padding-left: 24rpx;">
                                        <uni-data-select v-model="state.form.projectConfig.txtConfig.createAssets.spId"
                                            :localdata="spConfig.asseOptimization"
                                            @change="(value) => handleSpChange(value, 'txtConfig', 'createAssets.sp', spConfig.asseOptimization)"></uni-data-select>
                                    </view>
                                </view>
                                <view class="row" style="margin-left: 58px;">
                                    <view class="title">默认模型</view>
                                    <view style="width: 400rpx;padding-left: 24rpx;">
                                        <uni-data-select
                                            v-model="state.form.projectConfig.txtConfig.createAssets.defaultModel"
                                            :localdata="aiModelConfig.text"
                                            @change="(e) => { handleSelectorChange(e, 'txtConfig.createAssets.modelList') }"></uni-data-select>
                                    </view>
                                </view>
                            </view>
                            <textarea v-model.trim="state.form.projectConfig.txtConfig.createAssets.sp" :maxlength="-1"
                                placeholder-style="color: #999;" placeholder="请选择生图风格SP"
                                style="height: 240rpx; width: 95%; background: #F7F7F7;margin-left: 40rpx;border-radius: 16rpx;padding: 16rpx;margin-top: 16rpx;"></textarea>
                        </view>
                        <view
                            style="width: 100%;background: #FFFFFF;border-radius: 16rpx;flex-direction: column;padding-bottom: 32rpx;padding-top: 32rpx;margin-top: 24rpx;">
                            <view style="display: flex;flex-direction: row;">
                                <view class="row">
                                    <view
                                        style="display: flex;flex-direction: row;align-items: center;margin-left: 40rpx;">
                                        <image src="/static/createVideo.png"
                                            style="width: 40rpx;height: 40rpx;margin-right: 8rpx;"></image>
                                        <text class="title">默认故事板SP</text>
                                    </view>
                                    <view style="width: 400rpx;padding-left: 24rpx;">
                                        <uni-data-select v-model="state.form.projectConfig.txtConfig.storyboard.spId"
                                            :localdata="spConfig.storyboard"
                                            @change="(value) => handleSpChange(value, 'txtConfig', 'storyboard.sp', spConfig.storyboard)"
                                            @clear="()=>{state.form.projectConfig.txtConfig.storyboard.sp = ''}"></uni-data-select>
                                    </view>
                                </view>
                                <view class="row" style="margin-left: 58px;">
                                    <view class="title">默认模型</view>
                                    <view style="width: 400rpx;padding-left: 24rpx;">
                                        <uni-data-select
                                            v-model="state.form.projectConfig.txtConfig.storyboard.defaultModel"
                                            :localdata="aiModelConfig.text"
                                            @change="(e) => { handleSelectorChange(e, 'txtConfig.storyboard.modelList') }"></uni-data-select>
                                    </view>
                                </view>
                            </view>
                            <textarea :value.trim="editable?state.form.projectConfig.txtConfig.storyboard.sp:'该智能体提示词仅调用，不可编辑'" :maxlength="-1"
                                :disabled="!editable"
                                @blur="(e)=>{state.form.projectConfig.txtConfig.storyboard.sp = e.detail.value}"
                                placeholder-style="color: #999;" placeholder="请选择故事板SP"
                                style="height: 740rpx; width: 95%; background: #F7F7F7;margin-left: 40rpx;border-radius: 16rpx;padding: 16rpx;margin-top: 16rpx;"></textarea>
                        </view>
                        <view
                            style="width: 100%;background: #FFFFFF;border-radius: 16rpx;flex-direction: column;padding-bottom: 32rpx;padding-top: 32rpx;margin-top: 24rpx;">
                            <view style="display: flex;flex-direction: row;">
                                <view class="row">
                                    <view
                                        style="display: flex;flex-direction: row;align-items: center;margin-left: 40rpx;">
                                        <image src="/static/createVideo.png"
                                            style="width: 40rpx;height: 40rpx;margin-right: 8rpx;"></image>
                                        <text class="title">资产总清单</text>
                                    </view>
                                </view>
                            </view>
                            <textarea v-model.trim="state.form.assetListContent" :maxlength="-1"
                                placeholder-style="color: #999;" placeholder="请输入资产清单详情"
                                style="height: 340rpx; width: 95%; background: #F7F7F7;margin-left: 40rpx;border-radius: 16rpx;padding: 16rpx;margin-top: 16rpx;"></textarea>
                        </view>
                    </scroll-view>
                </view>

                <!-- 项目资产页签 -->
                <view v-if="state.curTabValue == 2" style="width: 100%; flex: 1;height: 100%;">
                    <scroll-view scroll-y style="height: 95%;margin-top: 24rpx;width: 100%;">
                        <view v-if="false"
                            style="width: 100%;background: #FFFFFF;border-radius: 16rpx;flex-direction: column;padding-bottom: 32rpx;padding-top: 32rpx;">
                            <view style="display: flex;flex-direction: row;">
                                <view class="row">
                                    <view
                                        style="display: flex;flex-direction: row;align-items: center;margin-left: 40rpx;">
                                        <image src="/static/createVideo.png"
                                            style="width: 40rpx;height: 40rpx;margin-right: 8rpx;"></image>
                                        <text class="title">默认资产生图SP</text>
                                    </view>
                                    <view style="width: 400rpx;padding-left: 24rpx;">
                                        <uni-data-select v-model="state.form.projectConfig.pictureConfig.promptSpId"
                                            :localdata="spConfig.assetIdentification"
                                            @change="(value) => handleSpChange(value, 'pictureConfig', 'promptSp', spConfig.assetIdentification)"></uni-data-select>
                                    </view>
                                </view>
                                <view class="row" style="margin-left: 58px;">
                                    <view class="title">默认模型</view>
                                    <view style="width: 400rpx;padding-left: 24rpx;">
                                        <uni-data-select
                                            v-model="state.form.projectConfig.pictureConfig.promptDefaultModel"
                                            :localdata="aiModelConfig.text"
                                            @change="(e) => { handleSelectorChange(e, 'pictureConfig.promptModelList') }"></uni-data-select>
                                    </view>
                                </view>
                            </view>
                            <textarea v-model.trim="state.form.projectConfig.pictureConfig.promptSp" :maxlength="-1"
                                placeholder-style="color: #999;" placeholder="请选择资产生图SP"
                                style="height: 240rpx; width: 95%; background: #F7F7F7;margin-left: 40rpx;border-radius: 16rpx;padding: 16rpx;margin-top: 16rpx;"></textarea>
                            <!-- <view class="field">
                                <view class="row" style="padding-bottom: 12px;margin-left: 24px;">
                                    <view class="title">可选模型(多选)</view>
                                    <view style="width: 300px;padding-left: 12px;">
                                        <uni-data-select 
                                            v-model="state.form.projectConfig.pictureConfig.promptModelList"
                                            :localdata="aiModelConfig.text" multiple></uni-data-select>
                                    </view>
                                </view>
                            </view> -->
                        </view>
                        <view
                            style="width: 100%;background: #FFFFFF;border-radius: 16rpx;flex-direction: column;padding-bottom: 32rpx;padding-top: 32rpx;margin-top: 24rpx;">
                            <view style="display: flex;flex-direction: row;">
                                <view class="row">
                                    <view
                                        style="display: flex;flex-direction: row;align-items: center;margin-left: 40rpx;">
                                        <image src="/static/createVideo.png"
                                            style="width: 40rpx;height: 40rpx;margin-right: 8rpx;"></image>
                                        <text class="title">默认生图风格SP</text>
                                    </view>
                                    <view style="width: 400rpx;padding-left: 24rpx;">
                                        <uni-data-select v-model="state.form.projectConfig.pictureConfig.promptSpId"
                                            :localdata="spConfig.huafeng"
                                            @change="(value) => handleSpChange(value, 'pictureConfig', 'promptSp', spConfig.huafeng)"
                                            @clear="()=>{state.form.projectConfig.pictureConfig.promptSp = ''}"></uni-data-select>
                                    </view>
                                </view>
                            </view>
                            <textarea :value.trim="editable?state.form.projectConfig.pictureConfig.promptSp:'该智能体提示词仅调用，不可编辑'" :maxlength="-1"
                                :disabled="!editable"
                                @blur="(e)=>{state.form.projectConfig.pictureConfig.promptSp = e.detail.value}"
                                placeholder-style="color: #999;" placeholder="请选择生图风格SP"
                                style="height: 240rpx; width: 95%; background: #F7F7F7;margin-left: 40rpx;border-radius: 16rpx;padding: 16rpx;margin-top: 16rpx;"></textarea>
                        </view>
                        <view
                            style="width: 100%;background: #FFFFFF;border-radius: 16rpx;flex-direction: column;padding-bottom: 32rpx;padding-top: 32rpx;margin-top: 24rpx;">
                            <view style="display: flex;flex-direction: row;">
                                <view class="row">
                                    <view
                                        style="display: flex;flex-direction: row;align-items: center;margin-left: 40rpx;">
                                        <image src="/static/createVideo.png"
                                            style="width: 40rpx;height: 40rpx;margin-right: 8rpx;"></image>
                                        <text class="title">默认资产生图设置</text>
                                    </view>
                                </view>
                            </view>
                            <view
                                style="display: flex;display: flex;align-items: center;margin-top: 24rpx;margin-left: 72rpx;">
                                <view class="title" style="margin-right: 16rpx;">生图模型</view>
                                <view style="width: 400rpx;">
                                    <uni-data-select v-model="state.form.projectConfig.pictureConfig.defaultModel"
                                        :localdata="aiModelConfig.picture"
                                        @change="changeTextImageModel"></uni-data-select>
                                </view>
                            </view>
                            <view
                                style="display: flex;display: flex;align-items: center;margin-top: 16rpx;margin-left: 72rpx;">
                                <view class="title" style="margin-right: 16rpx;">图片质量</view>
                                <view
                                    style="display: flex;flex-wrap: wrap; align-items: center;gap: 10rpx;margin-top: 12rpx;">
                                    <block v-for="(resuitem, countindex) in state.resolutionList" :key="countindex">
                                        <view @click="changeResolutionImage(resuitem)"
                                            :style="'border-radius: 6rpx;border: 4rpx solid #DCDCDC;margin: 0; margin-right: 8rpx; width: 140rpx;height: 64rpx;display:flex;justify-content: center;align-items: center;font-size: 28rpx;background:' + (resuitem == state.form.projectConfig.pictureConfig.defaultResolution ? '#F8BA38' : '#F3F3F3') + ';color:' + (resuitem == state.form.projectConfig.pictureConfig.defaultResolution ? '#000000' : '#000000') + ';'">
                                            {{ resuitem }}</view>
                                    </block>
                                </view>
                            </view>
                            <view
                                style="display: flex;display: flex;align-items: center;margin-top: 16rpx;margin-left: 72rpx;">
                                <view class="title" style="margin-right: 16rpx;">生成数量</view>
                                <view
                                    style="display: flex;flex-wrap: wrap; align-items: center;gap: 10rpx;margin-top: 12rpx;">
                                    <block v-for="(countitem, countindex) in [1, 2, 3, 4]" :key="countindex">
                                        <view @click="changeCountImage(countitem)"
                                            :style="'border-radius: 6rpx;border: 4rpx solid #DCDCDC;margin: 0; margin-right: 8rpx; width: 140rpx;height: 64rpx;display:flex;justify-content: center;align-items: center;font-size: 28rpx;background:' + (countitem == state.form.projectConfig.pictureConfig.defaultNum ? '#F8BA38' : '#F3F3F3') + ';color:' + (countitem == state.form.projectConfig.pictureConfig.defaultNum ? '#000000' : '#000000') + ';'">
                                            {{ countitem }}</view>
                                    </block>
                                </view>
                            </view>
                            <view
                                style="display: flex;display: flex;align-items: center;margin-top: 16rpx;margin-left: 72rpx;">
                                <view class="title" style="margin-right: 16rpx;">画幅尺寸</view>
                                <view
                                    style="display: flex;flex-wrap: wrap; align-items: center;gap: 10rpx;margin-top: 12rpx;">
                                    <block v-for="(ratiotitem, countindex) in state.ratioList" :key="countindex">
                                        <view @click="changeRatioImage(ratiotitem)"
                                            :style="'border-radius: 6rpx;border: 4rpx solid #DCDCDC;margin: 0; margin-right: 8rpx; width: 140rpx;height: 64rpx;display:flex;justify-content: center;align-items: center;font-size: 28rpx;background:' + (ratiotitem == state.form.projectConfig.pictureConfig.defaultFrame ? '#F8BA38' : '#F3F3F3') + ';color:' + (ratiotitem == state.form.projectConfig.pictureConfig.defaultFrame ? '#000000' : '#000000') + ';'">
                                            {{ ratiotitem }}</view>
                                    </block>
                                </view>
                            </view>
                        </view>
                    </scroll-view>
                </view>
                <!-- 故事板页签 -->
                <view v-if="state.curTabValue == 3" style="width: 100%; flex: 1;height: 100%;">
                    <scroll-view scroll-y style="height: 95%;margin-top: 24rpx;width: 100%;">
                        <!-- 融图设置 -->
                        <template v-if="props.data.type==2">
                            <view
                                style="width: 100%;background: #FFFFFF;border-radius: 16rpx;flex-direction: column;padding-bottom: 32rpx;padding-top: 32rpx;margin-top: 24rpx;">
                                <view style="display: flex;flex-direction: row;">
                                    <view class="row">
                                        <view
                                            style="display: flex;flex-direction: row;align-items: center;margin-left: 40rpx;">
                                            <image src="/static/createVideo.png"
                                                style="width: 40rpx;height: 40rpx;margin-right: 8rpx;"></image>
                                            <text class="title">默认融图风格SP</text>
                                        </view>
                                        <view style="width: 400rpx;padding-left: 24rpx;">
                                            <uni-data-select v-model="state.form.projectConfig.rtConfig.spId"
                                                :localdata="spConfig.huafeng"
                                                @change="(value) => handleSpChange(value, 'rtConfig', 'sp', spConfig.huafeng)"></uni-data-select>
                                        </view>
                                    </view>
                                </view>
                                <textarea :value.trim="editable?state.form.projectConfig.rtConfig.sp:'该智能体提示词仅调用，不可编辑'" :maxlength="-1"
                                    @blur="(e)=>{state.form.projectConfig.videoConfig.rtSp = e.detail.value}"    
                                    :disabled="!editable"
                                    placeholder-style="color: #999;" placeholder="请选择默认融图风格SP"
                                    style="height: 240rpx; width: 95%; background: #F7F7F7;margin-left: 40rpx;border-radius: 16rpx;padding: 16rpx;margin-top: 16rpx;"></textarea>
                            </view>
                            <view
                                style="width: 100%;background: #FFFFFF;border-radius: 16rpx;flex-direction: column;padding-bottom: 32rpx;padding-top: 32rpx;">
                                <view style="display: flex;align-items: center;margin-left: 32rpx;">
                                    <image style="width: 40rpx;height: 40rpx;" src="/static/createVideo.png"></image>
                                    <text class="title">默认融图设置</text>
                                </view>
                                <view style="display: flex;flex-direction: column;margin-left: 64rpx;">
                                    <view style="display: flex;display: flex;align-items: center;margin-top: 32rpx;">
                                        <view class="title" style="margin-right: 16rpx;">图像模型</view>
                                        <view style="width: 600rpx;">
                                            <uni-data-select v-model="state.form.projectConfig.rtConfig.model"
                                                :localdata="aiModelConfig.rongtu"
                                                @change="changeRongtuModal"></uni-data-select>
                                        </view>
                                    </view>

                                    <!-- 分辨率 -->
                                    <view style="display: flex;display: flex;align-items: center;margin-top: 16rpx;">
                                        <view class="title" style="margin-right: 16rpx;">图像质量</view>
                                        <view
                                            style="display: flex;flex-wrap: wrap; align-items: center;gap: 10rpx;margin-top: 12rpx;">
                                            <block v-for="(resuitem, countindex) in state.resolutionList_rongtu"
                                                :key="countindex">
                                                <view @click="handleChangePropValue('rtConfig.resolution', resuitem)"
                                                    :style="'border-radius: 6rpx;border: 4rpx solid #DCDCDC;margin: 0; margin-right: 8rpx; width: 140rpx;height: 64rpx;display:flex;justify-content: center;align-items: center;font-size: 28rpx;background:' + (resuitem == state.form.projectConfig.rtConfig.resolution ? '#F8BA38' : '#F3F3F3') + ';color:' + (resuitem == state.form.projectConfig.rtConfig.resolution ? '#000000' : '#000000') + ';'">
                                                    {{ resuitem }}</view>
                                            </block>
                                        </view>
                                    </view>
                                    <!-- 画幅 -->
                                    <view style="display: flex;display: flex;align-items: center;margin-top: 16rpx;">
                                        <view class="title" style="margin-right: 16rpx;">画幅尺寸</view>
                                        <view
                                            style="display: flex;flex-wrap: wrap; align-items: center;gap: 10rpx;margin-top: 12rpx;">
                                            <block v-for="(ratiotitem, countindex) in state.ratioList_rongtu"
                                                :key="countindex">
                                                <view @click="handleChangePropValue('rtConfig.frame', ratiotitem)"
                                                    :style="'border-radius: 6rpx;border: 4rpx solid #DCDCDC;margin: 0; margin-right: 8rpx; width: 140rpx;height: 64rpx;display:flex;justify-content: center;align-items: center;font-size: 28rpx;background:' + (ratiotitem == state.form.projectConfig.rtConfig.frame ? '#F8BA38' : '#F3F3F3') + ';color:' + (ratiotitem == state.form.projectConfig.rtConfig.frame ? '#000000' : '#000000') + ';'">
                                                    {{ ratiotitem }}</view>
                                            </block>
                                        </view>
                                    </view>
                                    <!-- 数量 -->
                                    <view style="display: flex;display: flex;align-items: center;margin-top: 16rpx;">
                                        <view class="title" style="margin-right: 16rpx;">生成数量</view>
                                        <view
                                            style="display: flex;flex-wrap: wrap; align-items: center;gap: 10rpx;margin-top: 12rpx;">
                                            <block v-for="(countitem, countindex) in [1, 2, 3, 4]" :key="countindex">
                                                <view @click="handleChangePropValue('rtConfig.num', countitem)"
                                                    :style="'border-radius: 6rpx;border: 4rpx solid #DCDCDC;margin: 0; margin-right: 8rpx; width: 140rpx;height: 64rpx;display:flex;justify-content: center;align-items: center;font-size: 28rpx;background:' + (countitem == state.form.projectConfig.rtConfig.num ? '#F8BA38' : '#F3F3F3') + ';color:' + (countitem == state.form.projectConfig.rtConfig.num ? '#000000' : '#000000') + ';'">
                                                    {{ countitem }}</view>
                                            </block>
                                        </view>
                                    </view>
                                </view>
                            </view>
                        </template>

                        <!-- 生视频设置 -->
                        <view
                            style="width: 100%;background: #FFFFFF;border-radius: 16rpx;flex-direction: column;padding-bottom: 32rpx;padding-top: 32rpx;margin-top: 24rpx;">
                            <view style="display: flex;flex-direction: row;">
                                <view class="row">
                                    <view
                                        style="display: flex;flex-direction: row;align-items: center;margin-left: 40rpx;">
                                        <image src="/static/createVideo.png"
                                            style="width: 40rpx;height: 40rpx;margin-right: 8rpx;"></image>
                                        <text class="title">默认生视频风格SP</text>
                                    </view>
                                    <view style="width: 400rpx;padding-left: 24rpx;">
                                        <uni-data-select v-model="state.form.projectConfig.videoConfig.rtSpId"
                                            :localdata="spConfig.huafeng"
                                            @change="(value) => handleSpChange(value, 'videoConfig', 'rtSp', spConfig.huafeng)"
                                            @clear="()=>{state.form.projectConfig.videoConfig.rtSp = ''}"></uni-data-select>
                                    </view>
                                </view>
                            </view>
                            <textarea :value.trim="editable?state.form.projectConfig.videoConfig.rtSp:'该智能体提示词仅调用，不可编辑'" :maxlength="-1"
                                @blur="(e)=>{state.form.projectConfig.videoConfig.rtSp = e.detail.value}"
                                placeholder-style="color: #999;" placeholder="请选择默认生视频风格SP" :disabled="!editable"
                                style="height: 240rpx; width: 95%; background: #F7F7F7;margin-left: 40rpx;border-radius: 16rpx;padding: 16rpx;margin-top: 16rpx;"></textarea>
                        </view>

                        <view
                            style="width: 100%;background: #FFFFFF;border-radius: 16rpx;flex-direction: column;padding-bottom: 32rpx;padding-top: 32rpx;">
                            <view style="display: flex;align-items: center;margin-left: 32rpx;">
                                <image style="width: 40rpx;height: 40rpx;" src="/static/createVideo.png"></image>
                                <text class="title">默认生视频设置</text>
                            </view>
                            <view style="display: flex;flex-direction: column;margin-left: 64rpx;">
                                <view style="display: flex;display: flex;align-items: center;margin-top: 32rpx;">
                                    <view class="title" style="margin-right: 16rpx;">视频模型</view>
                                    <view style="width: 600rpx;">
                                        <uni-data-select v-model="state.form.projectConfig.videoConfig.defaultModel"
                                            :localdata="aiModelConfig.video"
                                            @change="changeVideoModal"></uni-data-select>
                                    </view>
                                </view>
                                <!-- 数量 -->
                                <!-- <view style="display: flex;display: flex;align-items: center;margin-top: 16rpx;">
                                    <view class="title" style="margin-right: 16rpx;">生成数量</view>
                                    <view style="display: flex;flex-wrap: wrap; align-items: center;gap: 10rpx;margin-top: 12rpx;">
                                        <block v-for="(countitem,countindex) in [1,2,3,4]" :key="countindex">
                                            <view @click="changeCount(countitem)" :style="'border-radius: 6rpx;border: 4rpx solid #DCDCDC;margin: 0; margin-right: 8rpx; width: 140rpx;height: 64rpx;display:flex;justify-content: center;align-items: center;font-size: 28rpx;background:'+(countitem==state.form.projectConfig.videoConfig.defaultNum?'#F8BA38':'#F3F3F3')+';color:'+(countitem==state.form.projectConfig.videoConfig.defaultNum?'#000000':'#000000')+';'">{{countitem}}</view>
                                        </block>
                                    </view>
                                </view> -->
                                <!-- 画幅 -->
                                <view style="display: flex;display: flex;align-items: center;margin-top: 16rpx;">
                                    <view class="title" style="margin-right: 16rpx;">画幅尺寸</view>
                                    <view
                                        style="display: flex;flex-wrap: wrap; align-items: center;gap: 10rpx;margin-top: 12rpx;">
                                        <block v-for="(ratiotitem, countindex) in state.ratioList_video"
                                            :key="countindex">
                                            <view @click="changeRatio(ratiotitem)"
                                                :style="'border-radius: 6rpx;border: 4rpx solid #DCDCDC;margin: 0; margin-right: 8rpx; width: 140rpx;height: 64rpx;display:flex;justify-content: center;align-items: center;font-size: 28rpx;background:' + (ratiotitem == state.form.projectConfig.videoConfig.defaultFrame ? '#F8BA38' : '#F3F3F3') + ';color:' + (ratiotitem == state.form.projectConfig.videoConfig.defaultFrame ? '#000000' : '#000000') + ';'">
                                                {{ ratiotitem }}</view>
                                        </block>
                                    </view>
                                </view>
                                <!-- 分辨率 -->
                                <view style="display: flex;display: flex;align-items: center;margin-top: 16rpx;">
                                    <view class="title" style="margin-right: 16rpx;">视频质量</view>
                                    <view
                                        style="display: flex;flex-wrap: wrap; align-items: center;gap: 10rpx;margin-top: 12rpx;">
                                        <block v-for="(resuitem, countindex) in state.resolutionList_video"
                                            :key="countindex">
                                            <view @click="changeResolution(resuitem)"
                                                :style="'border-radius: 6rpx;border: 4rpx solid #DCDCDC;margin: 0; margin-right: 8rpx; width: 140rpx;height: 64rpx;display:flex;justify-content: center;align-items: center;font-size: 28rpx;background:' + (resuitem == state.form.projectConfig.videoConfig.defaultResolution ? '#F8BA38' : '#F3F3F3') + ';color:' + (resuitem == state.form.projectConfig.videoConfig.defaultResolution ? '#000000' : '#000000') + ';'">
                                                {{ resuitem }}</view>
                                        </block>
                                    </view>
                                </view>
                            </view>
                        </view>
                    </scroll-view>
                </view>
            </view>
        </view>
        <view class="footer">
            <view class="actionBtn" @click="handleClose" style="margin-right: 32px;">取消</view>
            <view class="actionBtn primary" @click="submit">确定</view>
        </view>
    </view>
    <view v-show="state.showPreviewText">
        <view class="popup-text-preview">
            <view class="ptitle">SP内容</view>
            <textarea :value="state.previewText" disabled style="width: 100%;height: 100%;"></textarea>
            <view class="icon-close" @click="state.showPreviewText = false"></view>
        </view>
        <view class="mask" style="z-index: 101;"></view>
    </view>
    <view class="mask"></view>
</template>

<script setup name="PopupProjectSetting">
import { GetResourceList } from '@/common/ResourceMgr'
import { GetDict, GetAIModelList } from '@/common/Common'
import { UploadFile } from '@/common/Tool'
import { APIPath, getRequest, postRequest, putRequest } from "@/common/APIRequest";
import { DeleteeProject } from "@/common/ProjectMgr";
import {
    ref,
    reactive,
    defineEmits,
    defineProps,
    onMounted,
    watch,
    toRaw,
    computed,
} from "vue";
import { deleteRequest } from '../common/APIRequest';
import { isNull } from '../common/Tool';
import { cloneDeep, isEqual } from 'lodash';
import {getAiModelParamsMap} from '@/common/modelParamsConfig';
import {useStore} from 'vuex'
const store = useStore()
const modelParamsConfig = getAiModelParamsMap()

function getModelParams(modelId) {
    const target = modelParamsConfig.find(i=>i.id==modelId)
    return target?{resolution:target.resolution,ratio:target.ratio}:{resolution:[],ratio:[]}
}

function setObjValue(obj, path, value) {
    const keys = path.split('.');  // 将路径拆分为数组
    let current = obj;

    // 遍历路径的每一层
    for (let i = 0; i < keys.length; i++) {
        const key = keys[i];

        // 如果是最后一层则赋值
        if (i === keys.length - 1) {
            current[key] = value;
        } else {
            // 如果中间层不存在则创建空对象
            if (!current.hasOwnProperty(key) || typeof current[key] !== 'object') {
                current[key] = {};
            }
            current = current[key];
        }
    }
}

function getObjValue(obj, path) {
    return path.split('.').reduce((acc, key) => {
        return acc?.[key] ?? undefined;
    }, obj);
}

const emit = defineEmits(["onUpdated", "onDelete", "onClose", "update:show"]);
const props = defineProps({
    show: {
        type: Boolean,
        required: true,
        default: false,
    },
    data: {
        type: Object,
        default: () => { },
    }
});

const editable = computed(()=>{
    return !store.getters.roles.includes('demo_personal')
})

// 字典
const dictConfig = reactive({
    create_picture: [],//生图数量
    create_video: [],//生视频数量
    project_frame: [],//画幅
    project_resolution: [],//分辨率
    project_timbre: [],//音色
})

// SP
const spIdList = {
    9: 'huafeng',//画风
    // 6: 'fanqiu',//反求
    7: 'rongtu',// 融图
    // 19: 'fuxiang',// 负向
    14: 'shengshipin',//生视频
    21: 'asseOptimization',//资产提炼
    // 22: 'analysis',//分析评估 
    // 23: 'episode',//分集剧本
    24: 'storyboard',// 生分镜
    18: 'assetIdentification',//资产识别
}
const spConfig = reactive({
    // 画风
    huafeng: [],
    // 融图
    rongtu: [],
    // 负向
    fuxiang: [],
    //生视频
    shengshipin: [],
    // 反求
    fanqiu: [],
    // 资产提炼
    asseOptimization: [],
    // 分析评估
    analysis: [],
    // 分集剧本
    episode: [],
    // 生分镜
    storyboard: [],
    // 资产识别
    assetIdentification: [],

})

// 模型
const aiModelConfig = reactive({
    picture: [], // 文生图模型
    rongtu: [], // 融图模型
    video: [], // 生视频模型
    text: [], // 生文模型
})

const state = reactive({
    curTabValue: 1,
    tabs: [
        {
            name: "分集剧本",
            value: 1
        },
        {
            name: "项目资产",
            value: 2
        },
        {
            name: "故事板",
            value: 3
        }
    ],
    // 验证规则
    rule: [
        {
            field: "projectName",
            required: true,
            message: "请输入项目名称",
        },
        {
            field: "style_main",
            required: true,
            message: "请选择主风格",
        },
        {
            field: "style_sub",
            required: true,
            message: "请选择副风格",
        },
        {
            field: "projectCover",
            required: true,
            message: "请选择项目封面",
        },
        {
            field: "aspectRatio",
            required: true,
            message: "请选择画面比例",
        },
        {
            field: "voiceOverTimbre",
            required: true,
            message: "请选择旁白音色",
        },
        {
            field: "projectIntroduction",
            required: true,
            message: "请输入项目名称",
        },
    ],
    form: {}, // 表单
    loading: false, // 请求锁（防重复提交）
    previewText: '',// 预览文本
    showPreviewText: false,// 显示预览文本
    
    resolutionList: [],
    ratioList: [],
    
    resolutionList_rongtu: [],
    ratioList_rongtu: [],

    ratioList_video: [],
    resolutionList_video: [],
});

let initialForm = {};// 表单原始数据，用于对比数据是否有变更

function changeCount(countitem) {
    state.form.projectConfig.videoConfig.defaultNum = countitem;
}

function changeRatio(ratioitem) {
    state.form.projectConfig.videoConfig.defaultFrame = ratioitem;
}

function changeResolution(resuitem) {
    state.form.projectConfig.videoConfig.defaultResolution = resuitem;
}

function changeRongtuModal(e) {
    const {resolution,ratio} = getModelParams(e || state.form.projectConfig.rtConfig.model);
    state.resolutionList_rongtu = resolution;
    state.ratioList_rongtu = ratio;
    if (!state.resolutionList_rongtu.includes(state.form.projectConfig.rtConfig.resolution)) {
        state.form.projectConfig.rtConfig.resolution = state.resolutionList_rongtu[0]
    }
    if (!state.ratioList_rongtu.includes(state.form.projectConfig.rtConfig.frame)) {
        state.form.projectConfig.rtConfig.frame = state.ratioList_rongtu[0]
    }
}

function changeVideoModal(e) {
    const {resolution,ratio} = getModelParams(e || state.form.projectConfig.videoConfig.defaultModel);
    state.resolutionList_video = resolution;
    state.ratioList_video = ratio;
    if (!state.resolutionList_video.includes(state.form.projectConfig.videoConfig.defaultResolution)) {
        state.form.projectConfig.videoConfig.defaultResolution = state.resolutionList_video[0]
    }
    if (!state.ratioList_video.includes(state.form.projectConfig.videoConfig.defaultFrame)) {
        state.form.projectConfig.videoConfig.defaultFrame = state.ratioList_video[0]
    }
}

function changeTextImageModel(e) {
    state.form.projectConfig.pictureConfig.defaultModel = e;
    changeResolutionList()
}

function changeResolutionImage(resuitem) {
    state.form.projectConfig.pictureConfig.defaultResolution = resuitem;
}
function changeResolutionList() {
    const modelId = state.form.projectConfig.pictureConfig.defaultModel;
    const {resolution,ratio} = getModelParams(modelId);
    state.resolutionList = resolution;
    state.ratioList = ratio
    if (!state.resolutionList.includes(state.form.projectConfig.pictureConfig.defaultResolution)) {
        state.form.projectConfig.pictureConfig.defaultResolution = state.resolutionList[0]
    }
    if (!state.ratioList.includes(state.form.projectConfig.pictureConfig.defaultFrame)) {
        state.form.projectConfig.pictureConfig.defaultFrame = state.ratioList[0]
    }
}

function changeCountImage(resuitem) {
    state.form.projectConfig.pictureConfig.defaultNum = resuitem;
}
function changeRatioImage(resuitem) {
    state.form.projectConfig.pictureConfig.defaultFrame = resuitem;
}


const resetForm = () => {
    state.form = {
        id: '',// 项目id
        name: "", // 项目名称     
        voice: "", // 旁白音色
        content: "", // 项目介绍
        url: "", // 项目封面
        libraryId: false,// 项目资产同步到公共库 1是 0否
        assetListContent: '',
        projectConfig: {
            // 对应项目资产
            pictureConfig: {
                "defaultModel": "",
                "modelList": [],
                "defaultNum": "",
                "numList": [],
                "defaultFrame": "",
                "frameList": [],
                "defaultResolution": "",
                "resolutionList": [],
                "hfSpId": "",
                "hfSp": "",
                "rtSpId": "",
                "rtSp": "",
                "fxSpId": "",
                "fxSp": "",
                "promptSpId": "", //生图提示词sp 2026-2-25新增
                "promptSp": "", //生图提示词sp的内容 2026-2-25新增
                "promptDefaultModel": "", //生图提示词默认模型 2026-2-25新增
                "promptModelList": [], //生图提示词模型列表 2026-2-25新增
            },
            // 对应故事板
            videoConfig: {
                "defaultModel": "",
                "modelList": [],
                "defaultNum": "",
                "numList": [],
                "defaultFrame": "",
                "frameList": [],
                "defaultResolution": "",
                "resolutionList": [],
                "rtSpId": "",
                "rtSp": "",
                "fxSpId": "",
                "fxSp": ""
            },
            // 对应分集剧本
            txtConfig: {
                "createEpisodes": {
                    "defaultModel": "",
                    "modelList": [],
                    "spId": "",
                    "sp": ""
                },
                "createAssets": {
                    "defaultModel": "",
                    "modelList": [],
                    "spId": "",
                    "sp": ""
                },
                "createEvaluate": {
                    "defaultModel": "",
                    "modelList": [],
                    "spId": "",
                    "sp": ""
                },
                "storyboard": {
                    "defaultModel": "",
                    "modelList": [],
                    "spId": "",
                    "sp": ""
                },
                "videoReverse": {
                    "defaultModel": "",
                    "modelList": [],
                    "spId": "",
                    "sp": ""
                }
            }

        },
    };
};

// 获取模型
const getAIModel = () => {
    GetAIModelList().then((modelList) => {
        const data = [];
        for (const item of modelList) {
            data.push({
                value: item.id.toString(),
                text: item.name,
                modelType: item.modelType,
            })
        }
        aiModelConfig.picture = data.filter(i => i.modelType == '4')
        aiModelConfig.text = data.filter(i => i.modelType == '3')
        aiModelConfig.rongtu = data.filter(i => i.modelType == '2')

        const videoTypeList = aiModelConfig.video = data.filter(i => i.modelType == '1')

        // 项目类型过筛
        if (props.data.type == 1) {
            aiModelConfig.video = videoTypeList.filter(i => !['4','23','52'].includes(i.value))
        } else if (props.data.type == 2) {
            aiModelConfig.video = editable.value?videoTypeList.filter(i => ['4','10','23','50','51','52',].includes(i.value)):videoTypeList.filter(i => i.value=='16')
        }
    })
}

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

// 获取SP
const getSP = () => {
    // 拿spIdList的key遍历调接口存储数据到spConfig
    const projectSetting = state.form.projectConfig;
    Object.keys(spIdList).forEach(spId => {
        GetResourceList(1, 1000, spId, (resList) => {
            const spData = resList.map(i => {
                return {
                    value: i.id,
                    text: i.name,
                    content: i.content,
                }
            })
            spConfig[spIdList[spId]] = spData

            // 如果是故事板SP，且当前项目的storyboard.spId为空，则默认选中第一条
            if (spIdList[spId] === 'storyboard' && spData.length > 0) {
                if (!projectSetting.txtConfig.storyboard.spId) {
                    projectSetting.txtConfig.storyboard.spId = spData[0].value
                    projectSetting.txtConfig.storyboard.sp = spData[0].content
                }
            }
        })
    })
}

// 选择封面回调
const handleSelectImg = () => {
    uni.chooseImage({
        count: 1, //默认1
        sizeType: ["original", "compressed"], //可以指定是原图还是压缩图，默认二者都有
        sourceType: ["album"], //从相册选择
        success: function (res) {
            console.log("选择的图片信息:", res);
            UploadFile(res.tempFilePaths[0], (url) => {
                state.form.url = url
            })
        },
    });
};

// 关闭弹窗
const handleClose = () => {
    emit("onClose");
};

// 删除项目事件
const handleDelete = () => {
    uni.showModal({
        title: '确认删除',
        content: '确定删除该项目？',
        success: (res) => {
            if (res.confirm) {
                DeleteeProject(props.data.id, () => {
                    emit("onDelete");
                })
            }
        }
    })
};

// 选择SP回调
const handleSpChange = (value, typeStr, propStr, dataList) => {
    let target = dataList.find(i => i.value == value);
    target && setObjValue(state.form.projectConfig[typeStr], propStr, target.content);
}

// 部分默认下拉框onChange回调，如果多选框里不包含，追加
const handleSelectorChange = (id, propStr) => {
    try {
        const value = getObjValue(state.form.projectConfig, propStr)
        if (value && Array.isArray(value) && !value.includes(id)) {
            setObjValue(state.form.projectConfig, propStr, [...value, id])
        }
    } catch (error) {
        console.warn('handleSelectorChange error', error)
    }
}

const handleChangePropValue = (propStr, value) => {
    setObjValue(state.form.projectConfig, propStr, value)
}

// 获取项目详情，填充表单值
const getDetail = () => {
    const data = props.data;
    for (const key of Object.keys(state.form)) {
        state.form[key] = Object.prototype.toString.call(data[key]) == '[object Object]' ? cloneDeep(data[key]) : data[key];
    }

    // 项目资产同步到公共库字段，转换组件值
    state.form.libraryId = data.libraryId == 1 ? true : false;

    changeVideoModal()
    changeRongtuModal()
    changeResolutionList()

    // if(isNull(state.form.projectConfig.videoConfig.defaultFrame)){
    //     state.form.projectConfig.videoConfig.defaultFrame="9:16"
    // }
    // if(isNull(state.form.projectConfig.videoConfig.defaultResolution)){
    //     state.form.projectConfig.videoConfig.defaultResolution="720P"
    // }
    // if(isNull(state.form.projectConfig.videoConfig.defaultModel)){
    //     state.form.projectConfig.videoConfig.defaultModel="10"
    // }
    // if(isNull(state.form.projectConfig.txtConfig.storyboard.defaultModel)){
    //     state.form.projectConfig.txtConfig.storyboard.defaultModel="6"
    // }
    // // if(isNull(state.form.projectConfig.txtConfig.storyboard.sp)){
    // //     state.form.projectConfig.txtConfig.storyboard.spId=spConfig.storyboard[0].value??''
    // //     state.form.projectConfig.txtConfig.storyboard.sp=spConfig.storyboard[0].content??''
    // // }
    //  if(isNull(state.form.projectConfig.pictureConfig.defaultModel)){
    //     state.form.projectConfig.pictureConfig.defaultModel="11"
    //  }

    //  if(isNull(state.form.projectConfig.pictureConfig.defaultFrame)){
    //     state.form.projectConfig.pictureConfig.defaultFrame="9:16"
    //  }

    //  if(isNull(state.form.projectConfig.pictureConfig.defaultNum)){
    //     state.form.projectConfig.pictureConfig.defaultNum=1
    //  }

    // 保存表单原始数据，用于对比数据是否有变更
    initialForm = cloneDeep(state.form)

    changeResolutionList()
}

const previewText = (data) => {
    if (!data) {
        return
    }
    state.previewText = data
    state.showPreviewText = true
}

const submit = () => {
    if (isEqual(toRaw(state.form), initialForm)) {
        emit('onClose')
        return
    }

    const cloneData = cloneDeep(state.form)
    // 项目资产同步到公共库字段，转换组件值
    cloneData.libraryId = cloneData.libraryId == true ? 1 : 0
    //  console.log('提交表单的数据', cloneData)

    if (state.loading) {
        return
    }

    state.loading = true
    uni.showLoading({
        title: '处理中',
    })
    putRequest(APIPath.updateProjectSetting, cloneData, (data) => {
        state.loading = false;
        //uni.hideLoading();
        if (data.code == 200) {
            uni.showToast({
                title: '设置成功',
                icon: 'success',
                duration: 2000
            })
            emit('onUpdated', cloneData)
            emit('onClose')
            // uni.$emit('projectSettingUpdate', cloneData)
        }
    }, (error) => {
        state.loading = false
        // uni.hideLoading();
        uni.showToast({
            title: '项目设置更新失败，' + error,
            icon: 'none',
            duration: 3000
        })
    })
}

resetForm(); //初始化表单，这个函数必须在前面执行

onMounted(() => {
    getDetail();
    getSP();
    GetDicts();
    getAIModel();
});

</script>

<style lang="scss" scoped>
.uni-input {
    color: #333333;
}

.inputWrapper {
    border-radius: 8px;
    padding: 8px;
    background-color: #fff;
}

.uni-select {
    border: none;
}

.mask {
    position: fixed;
    z-index: 98;
    background: rgba(0, 0, 0, 0.6);
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
}

.icon-fullScreen {
    position: absolute;
    z-index: 2;
    cursor: pointer;
    right: 32px;
    bottom: 12px;
    width: 24px;
    height: 24px;
    background-image: url('/static/fullscreen.png');
    background-size: cover;
    background-repeat: no-repeat;
    background-position: center;
}

.selectorWrapper {
    width: 200px;
}

.popup-text-preview {
    position: fixed;
    background: #333;
    color: #fff;
    font-size: 16px;
    border-radius: 16px;
    z-index: 102;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    padding: 16px 32px 32px 32px;
    width: 50vw;
    min-height: 30vh;
    max-height: 80vh;
    overflow-y: auto;
    overflow-x: hidden;

    .ptitle {
        font-size: 24px;
        color: #fff;
        text-align: center;
        padding: 16px;
    }

    .icon-close {
        position: absolute;
        cursor: pointer;
        z-index: 10;
        right: 16px;
        top: 16px;
        padding: 16px;
        transform: rotate(45deg);

        &::after,
        &::before {
            content: '';
            display: block;
            width: 24px;
            height: 3px;
            border-radius: 2px;
            background: #fff;
            transform-origin: top;
        }

        &::after {
            transform: rotate(90deg);
        }
    }
}

.popup-project-setting {
    background: #fff;
    border-width: 0px;
    position: fixed;
    z-index: 99;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    min-width: 90vw;
    max-width: 95vw;
    height: 90vh;
    border: none;
    border-radius: 15px;
    padding: 24px;
    display: flex;
    flex-direction: column;

    .headerTitle {
        font-size: 30px;
        color: #F8BA38;
        font-weight: bold;
        margin-bottom: 16px;
    }

    .contentWrapper {
        display: flex;
        flex: 1;
        min-height: 0;
        align-items: flex-start;
    }

    .leftPart {
        background-color: #E7E7E7;
        padding: 24px;
        border-radius: 12px 0px 0px 12px;
        overflow-y: auto;
        height: 100%;
        box-sizing: border-box;
        width: 34%;
        max-width: 460px;
        flex-shrink: 0;
    }

    .rightPart {
        flex: 1;
        display: flex;
        flex-direction: column;
        background: #F7F7F7;
        padding: 24px;
        border-radius: 0px 12px 12px 0px;
        height: 100%;
        box-sizing: border-box;

        .title {
            word-break: keep-all;
        }

        .rightPartContent {
            margin-top: 24px;
            flex: 1;
            overflow-y: auto;
            border-radius: 16px;
            padding: 16px;
            background: #fff;
        }
    }

    .field {
        position: relative;
        margin-bottom: 12px;

        .title {
            display: flex;
            align-items: center;
            font-size: 16px;
            font-weight: bold;
            line-height: 200%;
            color: #333;

            .icon {
                width: 16px;
                height: 16px;
                margin-left: 8px;
            }
        }
    }

    .row {
        display: flex;
        align-items: center;
    }

    .footer {
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 16px 32px 0 32px;
    }

    .tabs {
        border-radius: 8px;

        .item {
            width: 144px;
            height: 40px;
            line-height: 40px;
            text-align: center;
            background-color: #E7E7E7;
            cursor: pointer;

            &:first-child {
                border-radius: 8px 0px 0px 8px;
            }

            &:last-child {
                border-radius: 0px 8px 8px 0px;
            }

            &.active {
                background-color: #F8BA38;
            }
        }
    }

    .actionBtn {
        font-size: 14px;
        font-weight: 500;
        line-height: 40px;
        height: 40px;
        width: 140px;
        background-color: #E7E7E7;
        color: #333;
        border-radius: 8px;
        text-align: center;
        cursor: pointer;

        &.flex {
            flex: 1;
        }

        &.primary {
            background-color: #F8BA38;
            color: #fff;
        }

        &.white {
            background-color: #fff;
        }

        &.yellow {
            background: linear-gradient(90deg, #F8BA38 0%, #FFCA5A 100%), #0052D9;
        }

        &.danger {
            background-color: transparent;
            border: 1px solid rgba(255, 69, 0, 1);
            color: rgba(255, 69, 0, 1);
        }
    }

    .upload {
        width: 110px;
        height: 130px;
        border-radius: 8px;
        background-color: #fff;
        cursor: pointer;
        position: relative;
        overflow: hidden;

        .uploadImg {
            width: 100%;
            height: 100%;
            z-index: 2;
            position: relative;
        }

        &.holder::before,
        &.holder::after {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            content: "";
            width: 40px;
            height: 2px;
            border-radius: 3px;
            background-color: #ccc;
        }

        &.holder::after {
            transform-origin: center;
            transform: translate(-50%, -50%) rotate(90deg);
        }
    }
}
</style>
