import { defineConfig } from 'vite'
import uni from '@dcloudio/vite-plugin-uni'
// https://vitejs.dev/config/

export default defineConfig({
  plugins: [
    uni(),
  ],
  server: {
  		proxy: {
  			'/server': {
  				target: 'https://assetapi.jigentoys.net/', //https://assetapi.jigentoys.net/ //http://192.168.15.231:8080/ http://assetapi.meiai.store/
  				changeOrigin: true,
  				rewrite: (path) => path.replace(/^\/server/, ''), // 此处进行路径重写
				secure: false,
  			},
  			//  '/api-img': {
  			//         target: 'https://ark-content-generation-v2-cn-beijing.tos-cn-beijing.volces.com',
  			//         changeOrigin: true,
  			//         rewrite: (path) => path.replace(/^\/api-img/, '')
			  // },
			  '/aboard-doubao':{
				target:'https://ark.ap-southeast.bytepluses.com',
				changeOrigin: true,
				rewrite: (path) => path.replace(/^\/aboard-doubao/, ''),
			  },
			  '/api-img': {
			         target: 'https://ccyres.acgvr.com',
			         changeOrigin: true,
			         rewrite: (path) => path.replace(/^\/api-img/, '')
			   },
			   '/api-video': {
			         target: 'https://aires.jigentoys.net',
			         changeOrigin: true,
			         rewrite: (path) => path.replace(/^\/api-video/, '')
			   },
			   '/download-doubao': {
			         target: 'https://ark-content-generation-ap-southeast-1.tos-ap-southeast-1.volces.com',
			         changeOrigin: true,
			         rewrite: (path) => path.replace(/^\/download-doubao/, '')
			   },
			  '/martin': {
			  	target: 'https://cloud.vtrix.ai',
			  	changeOrigin: true,
			  	rewrite: (path) => path.replace(/^\/martin/, ''), // 此处进行路径重写
			  },
  		}
  	}
})
