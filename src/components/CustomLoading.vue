<template>
  <view v-if="visible" >
    <view class="custom-loading-content">
      <view class="loading-circle" :style="{ borderColor: circleColor, borderTopColor: 'transparent' }"></view>
      <view class="loading-title" :style="{ color: textColor, fontSize: textSize + 'rpx' }" v-if="title">
        {{ title }}
      </view>
    </view>
  </view>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue'

// 定义组件属性（父组件可传参自定义样式）
const props = defineProps({
  // 是否显示 loading
  visible: {
    type: Boolean,
    default: false
  },
  // 提示文字
  title: {
    type: String,
    default: '加载中...'
  },
  // 转圈颜色
  circleColor: {
    type: String,
    default: '#007aff'
  },
  // 文字颜色
  textColor: {
    type: String,
    default: '#333333'
  },
  // 文字大小（rpx）
  textSize: {
    type: Number,
    default: 28
  },
  // 转圈大小（rpx）
  circleSize: {
    type: Number,
    default: 60
  }
})

const emits = defineEmits([])
</script>

<style scoped>


.custom-loading-content {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  /* padding: 40rpx 60rpx; */
  background-color: #ffffff;
  border-radius: 16rpx;
}

.loading-circle {
  width: v-bind('circleSize + "rpx"');
  height: v-bind('circleSize + "rpx"');
  border: 4rpx solid;
  border-radius: 50%; 
  animation: loading-rotate 1s linear infinite;
  /* margin-bottom: 20rpx; */
}

@keyframes loading-rotate {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

.loading-title {
  /* margin-top: 20rpx; */
  margin-left: 24rpx;
  white-space: nowrap;
}
</style>