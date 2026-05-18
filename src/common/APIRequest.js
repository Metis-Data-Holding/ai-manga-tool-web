import { isNull } from "./Tool"
import app from "@/App.vue";
const _app = app;
import store from '@/store/index.js'

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const APIPath = {
    login:'auth/login',
	getInfo:'system/user/getInfo',
    resourceList:'config/item/list',
    addResource:'config/item',
	deleteResource:'config/item',
	resourceDetail:'config/item',
	deleteImgUrls:'config/item/deleteImgUrls', // 融图参考图片列表删除
	deleteUploadHistory:'config/item/deleteUploadHistory',
	deleteHistorylmages:'config/item/deleteHistoryImages',
	resourceTypeList:'config/itemType/list',
	createProject:'config/episodesProject',
	getProjectList:'config/episodesProject/list',
	getProjectDetail:'config/episodesProject',
	addProjectEpisodes:'config/episodes',
	updateStorySp:'config/episodes/updateStorySp', // 更新分集、分镜内容，忽略camera字段被覆盖删除
	getEpisodesList:'config/episodes/list',//查询剧本管理列表
	getDict:'system/dict/data/list', // 查询字典
	getAIModelList:'config/aiModel/list', // 查询模型（生图、视频、生文等）
	getProjectSetting:'config/episodesProject',// 项目详情
	updateProjectSetting:'config/episodesProject',// 更新项目
	deleteProject:'config/episodesProject',// 删除项目
	doubaoSeed1_6:'config/modelApi/doubaoSeed1_6',
	seedance2Video:'config/modelApi/seedance2',
	viduQ2Video:'config/modelApi/ViduQ2',
	viduQ2ProVideo:'config/modelApi/ViduQ2PRO',
	doubaoseedance1_5Video:'config/modelApi/doubaoCreateVideo',
	bananaImage:'config/modelApi/Banana',
	bananaProImage:'config/modelApi/BananaPro',
	doubaoseedream4_5Image:'config/modelApi/createImageFunc',
	kirinV3:'config/modelApi/kirinV3',
	cancelTaskQueue:'config/aiTask/undoQueue',
	checkTask:'config/aiTask/listQueue',
	doubaoseedream5_0lite:'config/modelApi/seedreamLite',
	addBacthResPath:'config/item/batch',
	completeCamera:'config/episodes/acceptanceStory',
	bananaTextImagePath:'config/modelApi/BananaTextToImag',
	kirinV3TextImagePath:'config/modelApi/KirinTextToImag',
	aiTask:'config/aiTask',
	deleteVideoHistoryPath:'config/episodes/removeVideoHistory',
	deleteRongtuHistoryPath:'config/episodes/removeRongtuHistory',
	doubaoCreateWord:'config/modelApi/doubaoChatStream',
	geminiCreateWord:'config/modelApi/vtWords',
	subtitlesVideo:'config/aiTask/subtitlesVideo', // 去字幕
	getOssListForUser:'resource/oss/userList',// 查询oss列表
	ossFile:'resource/oss',// oss资源相关
	projectStatistics:'config/tokenUsage/projectStatistics',// 项目token使用统计列表
	projectModelStatistics:'config/tokenUsage/projectModelStatistics',// 项目模型token使用统计详情
	aiTaskInfo:'config/aiTask/queue',// 任务详情
	aliToVideo:'config/modelApi/aliToVideo',// 阿里视频生成
	aliWords:'config/modelApi/aliWords',// 阿里文字生成
	enhancedVideo:'config/aiTask/enhancedVideo',// 超分视频
	seedance2ResourcReview:'config/item/review',// seedance2资源提交审核
	seedance2ResourcReviewByChannel:'config/item/reviewOne',// seedance2资源提交审核（按单个渠道）
	seedance2ResourcReviewUpdate:'config/itemAsset/updateInfo',// 更新seedance2资源审核ID
}

let serverUrl = "/server/"

export function getRequest(apiPath, callback, errorCallback) {
	var requestUrl = `${serverUrl}${apiPath}`
	uni.request({
		url: requestUrl,
		method: "GET",
		header: requestHeader(),
		dataType: "json",
		timeout: 30000,
		success: (requestData) => {
			responseJson(requestData, callback, errorCallback)
		},
		fail: (error) => {
			if (errorCallback) {
				errorCallback(error.errMsg)
			}
		}
	})
}
export async function getRequestAsync(apiPath, retryMaxCount = 3,config={sleepTime:5000}) {
	var requestUrl = serverUrl + apiPath;
	var execute = true;
	var retryCount = retryMaxCount;
	var responseJson = null;
	var errorMsg = '';
	var header = requestHeader();
	do {
		await requestAsync(requestUrl, "GET", header)
			.then((requestData) => {
				var result = decryptData(requestData.data.data)
				if (result != '') {
					try {
						requestData.data.data = JSON.parse(result)
					} catch (error) {
						requestData.data.data = result
					}
				}
				responseJson = requestData.data
				execute = false;
			})
			.catch((error) => {
				if (retryCount > 0) {
					console.log(requestUrl, '\n', '====网络请求异常====：', '\n', error);
					retryCount--;
				} else {
					errorMsg = error;
					console.error(requestUrl, '\n', '====网络请求异常====：', '\n', error);
					execute = false;
				}
			})
		if (execute) {
			//重试等待时间
			await sleep(config.sleepTime || 5000);
			var index = retryMaxCount - retryCount;
			console.log(requestUrl, '\n', '====网络请求第' + index + '次重试====');
		}
	} while (execute);
	return {
		error: errorMsg,
		responseJson: responseJson
	}
}

export function postRequest(apiPath, jsondata, callback, errorCallback,config={}) {
	var requestUrl = `${serverUrl}${apiPath}`
	uni.request({
		url: requestUrl,
		method: "POST",
		header: requestHeader(),
		dataType: "json",
		timeout: config.timeout || 30000,
		data: jsondata,
		success: (requestData) => {
			responseJson(requestData, callback, errorCallback)
		},
		fail: (error) => {
			console.error("响应错误", error)
			if (errorCallback) {
				errorCallback(error.errMsg)
			}
		},
		complete: (msg) => {}
	})
}

export async function postRequestAsync(apiPath, jsondata, retryMaxCount = 3) {
	var requestUrl = serverUrl + apiPath
	var execute = true;
	var retryCount = retryMaxCount;
	var responseJson = null;
	var errorMsg = '';
	var header = requestHeader();
	do {
		await requestAsync(requestUrl, "POST", header, jsondata)
			.then((requestData) => {
				var result = decryptData(requestData.data.data)
				if (result != '') {
					try {
						requestData.data.data = JSON.parse(result)
					} catch (error) {
						requestData.data.data = result
					}
				}
				responseJson = requestData.data
				execute = false;
			})
			.catch((error) => {
				if (retryCount > 0) {
					console.log(requestUrl, '\n', '====网络请求异常====：', '\n', error);
					retryCount--;
				} else {
					errorMsg = error;
					console.error(requestUrl, '\n', '====网络请求异常====：', '\n', error);
					execute = false;
				}
			})
		if (execute) {
			//重试等待时间
			await sleep(5000);
			var index = retryMaxCount - retryCount;
			console.log(requestUrl, '\n', '====网络请求第' + index + '次重试====');
		}
	} while (execute);
	return {
		error: errorMsg,
		data: responseJson,
	}
}

export function putRequest(apiPath, jsondata, callback, errorCallback) {
	var requestUrl = `${serverUrl}${apiPath}`
	uni.request({
		url: requestUrl,
		method: "PUT",
		header: requestHeader(),
		dataType: "json",
		timeout: 30000,
		data: jsondata,
		success: (requestData) => {
			responseJson(requestData, callback, errorCallback)
		},
		fail: (error) => {
			console.error("响应错误", error)
			if (errorCallback) {
				errorCallback(error.errMsg)
			}
		},
		complete: (msg) => {}
	})
}

export function deleteRequest(apiPath, callback, errorCallback) {
var requestUrl = `${serverUrl}${apiPath}`
	uni.request({
		url: requestUrl,
		method: "DELETE",
		header: requestHeader(),
		dataType: "json",
		timeout: 30000,
		success: (requestData) => {
			responseJson(requestData, callback, errorCallback)
		},
		fail: (error) => {
			console.error("响应错误", error)
			if (errorCallback) {
				errorCallback(error.errMsg)
			}
		},
		complete: (msg) => {}
	})
}

function responseJson(requestData, callback, errorCallback){
	if (requestData.data.code == 200){
		var result = decryptData(requestData.data.data)
		if (result != '') {
			try {
				requestData.data.data = JSON.parse(result)
			} catch (error) {
				requestData.data.data = result
			}
		}
		if (callback) {
			callback(requestData.data)
		}
	}
	else if (requestData.data.code == 401) {	
		store.commit('logout')
		gotoLoginpage();
	}
	else{
		if (errorCallback) {
			errorCallback(requestData.data.msg)
		}
	}
}


export function requestAsync(url, method, header, data = {}, dataType = "json") {
	return new Promise(function(resolve, reject) {
		uni.request({
			header: header,
			method: method,
			url: url,
			dataType: dataType,
			data: data,
			timeout: 30000,
			success(res) {
				resolve(res);
			},
			fail(err) {
				reject(err)
			}
		})
	})
}

function gotoLoginpage(){
    uni.showModal({
		title:"提示",
		content: "登录过期，请重新登录",
		showCancel:false,
		confirmText:"确定",
		complete: (res) => {
			if (res.cancel) {}
			if (res.confirm) {
				uni.reLaunch({
					url: '/pages/login/login',
				})
			}
		}
	})
}


export function requestHeader(){
	let cacheToken =  uni.getStorageSync('aigc_token')
	if (isNull(cacheToken)) {
		_app.userInfoData.accessToken = cacheToken;
	}
	var header={
		'Content-Type': 'application/json;charset:utf-8',
		'Authorization': 'Bearer ' + _app.userInfoData.accessToken,
        'clientId':'e5cd7e4891bf95d1d19206ce24a7b32e'
	}
	return header
}

export function decryptData(data) {
    return data
	if (typeof(data) == null)
		return ''
	if (data == "" || data == 'null' || data == null || data == undefined)
		return ''
	var dataStr = data
	var key = CryptoJS.enc.Utf8.parse('u8cf2osw0fc3miko')
	var _iv = CryptoJS.enc.Utf8.parse('0000000000000000')
	var decrypt = CryptoJS.AES.decrypt(dataStr, key, {
		iv: _iv,
		mode: CryptoJS.mode.CBC,
		padding: CryptoJS.pad.Pkcs7
	})
	var result = data;
	try {
		var result = decrypt.toString(CryptoJS.enc.Utf8);
	} catch {}
	return result

}