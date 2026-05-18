<template>
	<view class="import-modal-mask">
		<view class="import-modal-content">
			<!-- Header -->
			<view class="modal-header">
				<text class="step-tag">STEP.1</text>
				<text class="modal-title">导入已有剧本</text>
			</view>

			<!-- Body -->
			<view class="modal-body">
				<view class="textarea-wrapper">
					<textarea class="script-textarea" placeholder="复制粘贴已有剧本或点击下方按钮上传剧本" :maxlength="-1"
						v-model="scriptContent"></textarea>
				</view>
			</view>

			<!-- Footer -->
			<view class="modal-footer">
				<view class="footer-left">
					<button class="btn-cancel" @click="close">关闭</button>
				</view>

				<!-- <view class="footer-center">
					<view class="select-wrapper">
						<uni-data-select v-model="selectedSpId" :localdata="spOptions" :clear="false"
							placeholder="请选择分集剧本SP" @change="onSpChange"></uni-data-select>
					</view>
					<view class="select-wrapper">
						<uni-data-select v-model="selectedResSpId" :localdata="resSpOptions" :clear="false"
							placeholder="请选择资产清单SP" @change="onResSpChange"></uni-data-select>
					</view>
				</view> -->

				<view class="footer-right">
					<view class="btn-upload" @click="triggerFileUpload">
						<image style="width: 32rpx;height: 32rpx;margin-right: 16rpx;" src="/static/importIcon.png"
							mode="aspectFit"></image>
						上传剧本
					</view>
					<button class="btn-confirm" @click="confirm">{{confirmText}}</button>
				</view>
			</view>
		</view>
	</view>
</template>

<script setup>
	import {
		onShow
	} from '@dcloudio/uni-app';
	import {
		ref,
		defineProps,
		defineEmits,
		onMounted,
		watch
	} from 'vue';

	const props = defineProps({
		spOptions: {
			type: Array,
			default: () => []
		},
		resSpOptions: {
			type: Array,
			default: () => []
		},
		confirmText: {
			type: String,
			default: "执行分集"
		}
	});

	const emits = defineEmits(['close', 'confirm']);

	const scriptContent = ref('');
	const selectedSpId = ref('');
	const selectedResSpId = ref('');
	let fileInput = null;

	const checkAndSetDefaults = () => {
		if (!selectedSpId.value && props.spOptions.length > 0) {
			selectedSpId.value = props.spOptions[0].value;
		}
		if (!selectedResSpId.value && props.resSpOptions.length > 0) {
			selectedResSpId.value = props.resSpOptions[0].value;
		}
	}

	// Watch visible changes to initialize default values if needed
	watch(() => props.spOptions, () => {
		checkAndSetDefaults();
	}, {
		deep: true,
		immediate: true
	});

	watch(() => props.resSpOptions, () => {
		checkAndSetDefaults();
	}, {
		deep: true,
		immediate: true
	});

	const onSpChange = (e) => {
		selectedSpId.value = e;
	}

	const onResSpChange = (e) => {
		selectedResSpId.value = e;
	}

	onMounted(() => {
		initFileInput();
	});


	onShow(function() {
		/* console.log(props.spOptions)
		console.log(props.resSpOptions) */
	})

	const close = () => {
		// emits('update:visible', false);
		emits('close');
	};

	const confirm = () => {
		/* if (!scriptContent.value.trim()) {
			uni.showToast({
				title: '请输入或导入剧本内容',
				icon: 'none'
			});
			return;
		} */
		emits('confirm', {
			content: scriptContent.value,
			spId: selectedSpId.value,
			resSpId: selectedResSpId.value
		});
	};

	// File Upload Logic
	const initFileInput = () => {
		const existingInput = document.getElementById('importScriptFileInput');
		if (existingInput) {
			fileInput = existingInput;
			fileInput.removeEventListener('change', handleFileUpload);
		} else {
			fileInput = document.createElement('input');
			fileInput.id = 'importScriptFileInput';
			fileInput.type = 'file';
			fileInput.accept = '.txt';
			fileInput.style.position = 'absolute';
			fileInput.style.top = '-9999px';
			fileInput.style.left = '-9999px';
			fileInput.style.opacity = '0';
			document.body.appendChild(fileInput);
		}
		fileInput.addEventListener('change', handleFileUpload);
	};

	const triggerFileUpload = () => {
		if (fileInput) {
			fileInput.value = '';
			fileInput.click();
		}
	};

	const handleFileUpload = (e) => {
		const file = e.target.files[0];
		if (!file) return;

		if (file.type !== 'text/plain' && !file.name.endsWith('.txt')) {
			uni.showToast({
				title: '请选择txt格式的文件',
				icon: 'none'
			});
			return;
		}

		const reader = new FileReader();
		reader.onload = (event) => {
			scriptContent.value = event.target.result;
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
		};
		reader.readAsText(file, 'utf-8');
	};
</script>

<style scoped>
	@import "./ImportScript.css";
</style>