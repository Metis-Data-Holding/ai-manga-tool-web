<template>
    <Teleport to="body">
        <!-- 视频预览播放 -->
        <view id="popup-video-preview">
            <video object-fit="contain" style="height: 100%;width: 100%;z-index: 10;" autoplay
                :src="props.src" id="preVideo" :loop="props.loop" :autoplay="props.autoplay" :controls="props.controls">
            </video>
            <view @click="handleClose"
                style="z-index:11;position: absolute;top: 64rpx;right: 64rpx;width: 100rpx;height: 100rpx;background-color: #ffffff; border-radius: 50%; font-size: 48rpx;font-weight: bold;color: #333;display: flex;align-items: center;justify-content: center;">
                X
            </view>
        </view>
    </Teleport>
</template>

<script setup name="PopupVideoPreview">
const emit = defineEmits(["close",]);
const props = defineProps({
    src: {
        type: String,
        default: ''
    },
    title: {
        type: String,
        default: ''
    },
    loop: {
        type: Boolean,
        default: true
    },
    autoplay: {
        type: Boolean,
        default: true
    },
    controls: {
        type: Boolean,
        default: true
    }
});

const handleClose = () => {
    emit("close");
}

</script>
<style scoped lang="scss">
#popup-video-preview {
    position: fixed;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    background-color: rgba(0, 0, 0, 0.6);
    display: flex;
    flex-direction: column;
    z-index: 9999;
    background: red;
}
</style>
