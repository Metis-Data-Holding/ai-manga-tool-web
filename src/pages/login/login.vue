<template>
	<view style="height: 100%;width: 100%;background-color: rgba(0,0,0,0.5);display: flex; align-items: center;justify-content: center;">
		<view class="bg">
			<text style="font-size: 48rpx;margin-bottom: 48rpx;margin-top: 40rpx;color: #FFA600;font-weight: bold;">登录</text>
			<view style="width: 100%;display: flex; justify-content: center;flex-direction: column;align-items: flex-start;">
				<view style="display: flex; flex-direction: row;align-items: center;margin-left: 40rpx;">
					<image src="/static/accounticon.png" style="width: 32rpx;height: 32rpx;margin-right: 12rpx;"></image>
					<text style="font-weight: 500;font-size: 32rpx;">账号</text>
				</view>
				<input type="text" placeholder="请输入账号" @input="inputUserName" :value="state.username"
					style="width: 760rpx;height: 96rpx;margin-top: 16rpx;background: #F7F7F7;padding-left: 24rpx;border-radius: 16rpx;margin-left: 40rpx;">

				<view style="display: flex; flex-direction: row;align-items: center;margin-left: 40rpx;margin-top: 40rpx;">
					<image src="/static/passwordicon.png" style="width: 32rpx;height: 32rpx;margin-right: 12rpx;"></image>
					<text style="font-weight: 500;font-size: 32rpx;">密码</text>
				</view>
				<input type="text" placeholder="请输入密码"  :password="true" @input="inputPassword" :value="state.password"
					style="width: 760rpx;height: 96rpx;margin-top: 16rpx;background: #F7F7F7;padding-left: 24rpx;border-radius: 16rpx;margin-left: 40rpx;">

				<!-- <view style="display: flex; flex-direction: row;align-items: center;margin-top: 48rpx;">
					<text style="font-size: 48rpx;margin-right: 24rpx;">密码:</text>
					<input type="text" placeholder="请输入密码" :password="true" @input="inputPassword" :value="state.password"
					style="width: 600rpx;height: 80rpx;margin-top: 24rpx;border: 1rpx solid #000000;padding-left: 24rpx;">
				</view> -->
				<button @click="startlogin" class="loginButton">登录</button>
			</view>
		</view>
	</view>

</template>

<script setup>
	import { onLoad, onUnload ,onHide, onShow} from "@dcloudio/uni-app";
    import {ref, nextTick,onMounted,reactive, onUnmounted} from "vue";
	import { postRequestAsync,APIPath,getRequestAsync  } from "../../common/APIRequest";
	import { isNull } from "../../common/Tool";
	import app from "@/App.vue";
	import { useStore } from "vuex";

	const store = useStore();
	const _app = app;
    const state = reactive({
		username:'',
		password:''
	})

	onLoad((options) => {
		var saveinfo=uni.getStorageSync('aigc_userinfo') || {}
		state.username=saveinfo.username || ''
		state.password=saveinfo.password || ''
	})

	onShow(() => {
		document.addEventListener('keydown', handleKeyDown)
	})

	onHide(() => {
		document.removeEventListener('keydown', handleKeyDown)
	})

	onUnload(() => {
		document.removeEventListener('keydown', handleKeyDown)
	})

	const handleKeyDown = (e) => {
	if (e.keyCode === 13 || e.key === 'Enter') {
		e.preventDefault()
		startlogin()
	}
	}


	function inputUserName(e){
		state.username=e.detail.value
	}

	function inputPassword(e){
		state.password=e.detail.value
	}

	async function startlogin(){
		if(state.username==''||state.password==''){
			uni.showToast({
				title:'账号或密码不能为空',
				icon:'none'
			})
			return
		}

		let resp = await postRequestAsync(APIPath.login,{
			username:state.username,
			password:state.password,
			clientId:'e5cd7e4891bf95d1d19206ce24a7b32e'
		})

		if(!isNull(resp.error)){
			uni.showToast({
				title:'登录失败:'+resp.error,
				icon:'none'
			})
			return
		}
		uni.setStorageSync('aigc_userinfo',{
			username:state.username,
			password:state.password
		})
		if(resp.data.code==200){
			var respData=resp.data.data
			_app.userInfoData.accessToken=respData.access_token
					
			store.commit('login',{
				token:respData.access_token
			})
			uni.reLaunch({
				url: '/pages/project/project'
			})

			let userInfo = await getRequestAsync(APIPath.getInfo,3,{sleepTime:1000})
			store.commit('SET_USER_INFO',userInfo?.responseJson?.data || {})
		}
		else{
			uni.showToast({
				title:'登录失败:'+resp.data.msg,
				icon:'none'
			})
		}
	}

</script>

<style>
	page {
		height: 100%;
		width: 100%;
	}
	.bg{
		width: 840rpx;
		display: flex; 
		align-items: center;
		justify-content: center;
		flex-direction: column;
		 border-radius: 24rpx;
		background: #FFFFFF;
	}
	.loginButton{
       width: 336rpx;
	   height: 88rpx;
	   margin-top: 60rpx;
	   display: flex;
	   align-items: center;
	   justify-content: center;
	   background: #FFA600;
	  color: #FFFFFF;
	  font-size: 32rpx;
	  font-weight: 500;
	  margin-bottom: 48rpx;
	}
</style>
