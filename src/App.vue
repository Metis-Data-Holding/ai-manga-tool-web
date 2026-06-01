<script>
import { version } from 'vue';
import store from './store'

export default {
  onLaunch: function () {
    // const token = uni.getStorageSync('aigc_token')
    const lastPage = uni.getStorageSync('lastPage')
    // token && uni.reLaunch({
    //   url: lastPage || '/pages/project/project'
    // })
    store.commit('SET_PLATFORM',{
      origin:location.origin
    })
  },
  onShow: function () {
    console.log('App Show')
  },
  onHide: function () {
    const pages = getCurrentPages()
    uni.setStorageSync('lastPage',pages[pages.length-1].route)
  },
  globalData:{
    tempPageData:{},
    version:'1.5.3',
  },

  userInfoData:{
    accessToken:'',
  }
}
</script>

<style lang="scss">
/*每个页面公共css */
	.mark{
		position: fixed;
		width: 100%;
		height: 100%;
		top: 0; 
		background-color: rgba(0,0,0,0.6);
		display: flex;
		align-items: center;
		flex-direction: column;
		justify-content: flex-start;
		z-index: 9;
	}
 button,
.uni-button {
  outline: none !important;  
  border: none !important;  
  position: relative !important;
}
button::after,
.uni-button::after {
  content: none !important;
  border: none !important;
}

.icon-close-popup{
    cursor: pointer;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background-color: #FF5757;
    position: absolute;
    right: 16px;
    top: 16px;
    z-index: 10;
    &::before,
    &::after{
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        content: "";
        width: 20px;
        height: 2px;
        background-color: #fff;
    }
    &::before{
        transform: translate(-50%, -50%) rotate(45deg);
    }
    &::after{
        transform: translate(-50%, -50%) rotate(-45deg);
    }
}
</style>
