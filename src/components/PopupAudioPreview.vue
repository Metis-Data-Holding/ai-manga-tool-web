<template>
    <Teleport to="body">
        <!-- <view style="z-index: 999;position: fixed;width: 500px;height: 300px;background-color: antiquewhite;left: 0;top: 0;"></view> -->
        <view id="popup-audio-preview" @click.native="(e) => handleClose(e)">
            <view id="content"
                style="width: 600px;height: 400px; background-color: #000;border-radius: 8px;position: absolute;left: 50%;top: 50%;transform: translate(-50%,-50%);display: flex;flex-direction: column;overflow: hidden;">
                <view style="color: #fff;font-size: 18px; padding: 12px 16px;">{{ props.title }}</view>
                <view style="width: 100%;box-sizing: border-box; padding: 0 16px; position: absolute;bottom: 20px;display: flex;justify-content: space-between;align-items: center;color: #fff;font-size: 14px;">
                    <text>{{currentTime}}</text>
                    <text>{{duration}}</text>
                </view>
                <view @click.stop="handleProgressChange" style="cursor: pointer;;">
                    <view id="progress_bottom" style="position: absolute;bottom: 0;left: 0;width: 100%;height: 8px;background-color: #333;">
                    </view>
                    <view id="progress_top"
                        style="transform: all 16ms ease; position: absolute;bottom: 0;left: 0;height: 8px;background-color: rgba(255,255,255,.8);"
                        :style="{ width: config.currentTime / config.duration * 100 + '%' }"></view>
                </view>
                <image :src="config.isPlaying ? '/static/audio-pause.png' : '/static/audio-play.png'"
                    style="cursor: pointer; width: 48px;height: 48px;position: absolute;top: 50%;left: 50%;transform: translate(-50%,-50%);"
                    @click.stop="() => config.isPlaying ? config.instance.pause() : config.instance.play()">
                </image>
            </view>
        </view>
    </Teleport>
</template>

<script setup name="PopupAudioPreview">
import { reactive, ref, computed, onMounted, watch, onUnmounted } from "vue";

function formatSecondsToHMS(totalSeconds) {
  // 处理负数（可选：返回错误 or 取绝对值）
  if (totalSeconds < 0) throw new Error("秒数不能为负");
  
  const hours = Math.floor(totalSeconds / 3600);
  const remainingSecondsAfterHours = totalSeconds % 3600;
  const minutes = Math.floor(remainingSecondsAfterHours / 60);
  const seconds = Math.floor(remainingSecondsAfterHours % 60);
  
  // 补零格式化
  const padZero = (num) => num.toString().padStart(2, '0');
  
  return `${hours>0?padZero(hours)+':':''}${padZero(minutes)}:${padZero(seconds)}`;
}

const emit = defineEmits(["close",]);
const props = defineProps({
    show: {
        type: Boolean,
        required: true,
        default: false,
    },
    src: {
        type: String,
        default: ''
    },
    title: {
        type: String,
        default: ''
    }
});

const config = reactive({
    instance: null,
    isPlaying: false,
    currentTime: 0,
    duration: 0,
})

const currentTime = computed(() => formatSecondsToHMS(config.currentTime))
const duration = computed(() => formatSecondsToHMS(config.duration))

const handleClose = (e) => {
    if (e.target?.id != 'popup-audio-preview') {
        return
    }
    config.instance && config.instance.destroy();
    emit("close");
}

const handleProgressChange = (e) => {
    try {
        const progressRect = document.getElementById('progress_bottom')?.getBoundingClientRect();
        const precent = (e.detail.x - progressRect.left) / progressRect.width;
        config.currentTime = config.duration * precent;
        config.instance.seek(config.currentTime);
    } catch (error) {
        console.log(error)
    }
}

onMounted(() => {
    console.log('onMounted', props.src)
     if (props.src) {
        const innerAudioContext = uni.createInnerAudioContext();
        innerAudioContext.autoplay = true
        innerAudioContext.src = props.src
        innerAudioContext.onPlay(() => {
            config.isPlaying = true;
            config.duration = innerAudioContext.duration;
        });
        innerAudioContext.onPause(() => {
            config.isPlaying = false
        });
        innerAudioContext.onSeeked(() => {
            config.duration = innerAudioContext.duration
        })
        innerAudioContext.onTimeUpdate(() => {
            config.currentTime = innerAudioContext.currentTime
        })

        config.instance = innerAudioContext
    }
})
onUnmounted(() => {
    config.instance && config.instance.destroy()
})

</script>
<style scoped lang="scss">
#popup-audio-preview {
    position: fixed;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    background-color: rgba(0, 0, 0, 0.6);
    display: flex;
    flex-direction: column;
    z-index: 99;
}
</style>
