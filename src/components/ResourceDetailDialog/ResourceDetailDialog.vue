<template>
	<view v-if="visible" class="dialog-mark">
		<view class="dialog-content">
			<view style="display: flex;flex-direction: row; width: 100%; height: 100%;">
				<view
					style="display: flex;flex-direction: column; width: 55%; border-right: 2rpx solid #999999; padding: 24rpx;">
					<text style="font-size: 86rpx; font-weight: bold; margin: 24rpx;color:#d7d7d7;">资产详情</text>
					<text style="font-size: 32rpx; font-weight: bold;margin-left: 160rpx; color:#d7d7d7">资产图片</text>
					<scroll-view style="display: flex;flex:1; margin-top: 48rpx;height: 100rpx;" :scroll-y="true">
						<view class="resdetail-imageList">
							<view @click="handleAddImage" class="resdetail-item">
								<text style="font-size: 200rpx; color: #555555;">+</text>
								<image @click.stop="handleSelectImage(-1)"
									style="width: 60rpx; height: 60rpx; margin-right: 8rpx;position: absolute;right: 10rpx;top: 20rpx;"
									:src="isSelectCurrentIndex(-1)?'/static/adsel_icon2.png':'/static/nor_iconb.png'">
								</image>
							</view>
							<block v-for="(item, index) in formData.images" :key="index">
								<view class="resdetail-item">
									<text style="font-size: 200rpx; color: #555555;">+</text>
									<image v-if="false" style="width: 320rpx;height: 220rpx;position: absolute;"
										mode="aspectFit" src="/src/static/bg.png" />
									<!-- <view @click="handleDeleteImage(index)" style="width: 60rpx;height: 60rpx;background-color: #ff4d4f; font-size: 48rpx;font-weight: bold;color: #ffffff;
										display: flex;align-items: center;justify-content: center;position: absolute;top: 0;right: 0;">
										X
									</view> -->

									<image @click.stop="handleSelectImage(index)"
										style="width: 60rpx; height: 60rpx; margin-right: 8rpx;position: absolute;right: 10rpx;top: 20rpx;"
										:src="isSelectCurrentIndex(index)?'/static/adsel_icon2.png':'/static/nor_iconb.png'">
									</image>
								</view>
							</block>

						</view>
					</scroll-view>
				</view>
				<view style="display: flex;flex-direction: column; flex: 1; padding: 24rpx;align-items: center;">
					<view style="width: 100%;display: flex;justify-content: space-between;margin-top: 48rpx;">
						<view style="display: flex;flex-direction: column;">
							<view style="display: flex;flex-direction: row;align-items: center;  margin-bottom: 24rpx;">
								<text style="font-size: 32rpx; font-weight: bold;color:#d7d7d7">资产名称</text>
							</view>
							<input class="sp-input" style="width: 500rpx;height: 80rpx;" :value="formData.name"
								@input="handleNameInput" placeholder="请输入资产名称" />
						</view>

						<view style="display: flex;flex-direction: column;margin-right: 5%;">
							<view
								style="display: flex;flex-direction: row;align-items: center; width: 100%;margin-bottom: 24rpx;">
								<text style="font-size: 32rpx; font-weight: bold;color:#d7d7d7">类型</text>
							</view>
							<view
								style="display: flex;flex-direction: row;justify-content: center;align-items: flex-start;width:300rpx;">
								<uni-section style="width: 100%;flex: 1;" title="类型选择：" type="line">
									<view class="uni-px-5 uni-pb-5" style="position: relative;">
										<uni-data-select v-model="formData.type" :localdata="typeOptions"
											@change="handleTypeChange"></uni-data-select>
									</view>
								</uni-section>
							</view>
						</view>
					</view>

					<view
						style="display: flex;flex-direction: row;align-items: center; width: 100%; margin-top: 32rpx; margin-bottom: 24rpx;">
						<text style="font-size: 32rpx; font-weight: bold;color:#d7d7d7">资产简介</text>
					</view>
					<textarea :maxlength="-1" class="sp-input" style="width: 90%;height: 300rpx;align-self: flex-start;"
						:value="formData.description" @input="handleDescriptionInput" placeholder="输入资产简介"></textarea>

					<view
						style="display: flex;flex-direction: row;align-items: center; width: 100%; margin-top: 32rpx; margin-bottom: 24rpx;">
						<text style="font-size: 32rpx; font-weight: bold;color:#d7d7d7">资产SP</text>
					</view>
					<textarea :maxlength="-1" class="sp-input" style="width: 90%;height: 300rpx;align-self: flex-start;"
						:value="formData.sp" @input="handleSpInput" placeholder="输入资产SP"></textarea>


					<view
						style="width: 100%;display: flex;justify-content: space-between;margin-top: 48rpx;position:relative;align-items: flex-end;">
						<view style="display: flex;flex-direction: column;">
							<view
								style="display: flex;flex-direction: row;align-items: center; width: 100%; margin-top: 32rpx; margin-bottom: 24rpx;">
								<text style="font-size: 32rpx; font-weight: bold;color:#d7d7d7">音色配置</text>
							</view>
							<view
								style="display: flex;flex-direction: row;justify-content: center;align-items: flex-start;width: 300rpx;align-self: flex-start;">
								<uni-section style="width: 100%;flex: 1;" title="音色配置：" type="line">
									<view class="uni-px-5 uni-pb-5">
										<uni-data-select v-model="formData.voiceConfig" :localdata="voiceOptions"
											@change="handleVoiceChange"></uni-data-select>
									</view>
								</uni-section>
							</view>
						</view>

						<button @click="handleGenerateImage" class="camerabutton"
							style="height: 70%;width: 360rpx;margin-right: 6%;">生图</button>
					</view>



					<view
						style="display: flex;flex-direction: row;justify-content: space-between;align-items: center; width: 93%; margin-top: auto;margin-bottom:5%;align-self: flex-start;margin-left: 20rpx;">
						<!-- 	<button @click="handleDelete" style="margin-left: 16rpx; background-color: #ff4d4f;"
							class="camerabutton">删除</button> -->
						<button @click="handleCancel" class="camerabutton">取消</button>
						<button @click="handleSave" style="margin-left: 16rpx; background-color: #169bd5;color: white;"
							class="camerabutton">保存</button>
					</view>
				</view>
			</view>

		</view>
	</view>
</template>

<script setup>
	import {
		ref,
		reactive,
		watch,
		computed
	} from 'vue'
	import {
		UploadFile
	} from '@/common/Tool'

	const state = reactive({
		selectIndexs: []
	})

	const props = defineProps({
		visible: {
			type: Boolean,
			default: false
		},
		formData: {
			type: Object,
			default: () => ({
				name: '',
				description: '',
				sp: '',
				type: '',
				voiceConfig: '',
				images: []
			})
		}
	})

	const emits = defineEmits(['update:visible', 'save', 'delete', 'generate-image'])

	const typeOptions = ref([{
			value: 'role',
			text: '角色'
		},
		{
			value: 'scene',
			text: '场景'
		},
		{
			value: 'prop',
			text: '道具'
		}
	])

	const voiceOptions = ref([{
			value: 'male',
			text: '男声'
		},
		{
			value: 'female',
			text: '女声'
		},
		{
			value: 'child',
			text: '童声'
		}
	])

	function handleAddImage() {
		uni.chooseImage({
			count: 1,
			success: (res) => {
				UploadFile(res.tempFilePaths[0], (url) => {
					props.formData.images.push(url)
				})
			}
		})
	}

	function handleDeleteImage(index) {
		props.formData.images.splice(index, 1)
	}

	const isSelectCurrentIndex = computed(() => {
		return (index) => {
			return state.selectIndexs.includes(index)
		}
	})

	function handleSelectImage(index) {
		if (state.selectIndexs.includes(index)) {
			// 找到index在数组中的索引位置
			const findIndex = state.selectIndexs.indexOf(index);
			// 从findIndex位置开始，删除1个元素
			state.selectIndexs.splice(findIndex, 1);
		} else {
			state.selectIndexs.push(index)
		}
	}

	function handleNameInput(e) {
		props.formData.name = e.detail.value
	}

	function handleDescriptionInput(e) {
		props.formData.description = e.detail.value
	}

	function handleSpInput(e) {
		props.formData.sp = e.detail.value
	}

	function handleTypeChange(e) {
		props.formData.type = e
	}

	function handleVoiceChange(e) {
		props.formData.voiceConfig = e
	}

	function handleGenerateImage() {
		emits('generate-image', props.formData)
	}

	function handleDelete() {
		uni.showModal({
			title: '确认删除',
			content: '确定要删除该资产吗？',
			success: (res) => {
				if (res.confirm) {
					emits('delete', props.formData)
				}
			}
		})
	}

	function handleSave() {
		emits('save', props.formData)
	}

	function handleCancel() {
		emits('update:visible', false)
	}
</script>

<style scoped lang="scss">
	@import "ResourceDetailDialog.css"
</style>