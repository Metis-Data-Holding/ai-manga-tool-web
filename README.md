## 安装所需：Node（npm版本建议V20）、包管理工具（yarn）

## 依赖安装（如发现安装不上，尝试删掉package-lock.json文件后重新安装）
```bash
yarn install
```
## 开发启动（H5客户端）
```bash
yarn dev:h5
```
## 打包（H5客户端）
```bash
yarn build:h5
```
##其它注意：本地调试下载资源涉及跨域时请在vite.config.js里配置代理
##如：
proxy: {
	'/server': {
		target: 'https://assetapi.jigentoys.net/', //https://assetapi.jigentoys.net/ //http://192.168.15.231:8080/
		changeOrigin: true,
		rewrite: (path) => path.replace(/^\/server/, ''), // 此处进行路径重写
		secure: false,
	},
	'/aboard-doubao':{
		target:'https://ark.ap-southeast.bytepluses.com',
		changeOrigin: true,
		rewrite: (path) => path.replace(/^\/aboard-doubao/, ''),
	},
}