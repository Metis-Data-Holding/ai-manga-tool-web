import { APIPath, deleteRequest, getRequest, postRequest, putRequest } from "./APIRequest";

//proType 1：一人 2：多人
export function CreateProject(params,callback){
    postRequest(APIPath.createProject,params,(data)=>{
        //  console.log('创建项目成功',data)
        if(data.code==200){
            callback(data.data)
        }
        else{
            uni.showToast({
                title: '创建项目失败，请重试:'+data.msg,
                icon: 'none'
            });
        }
    },(error)=>{
        uni.showToast({
            title: '创建项目失败，请重试:'+error,
            icon: 'none'
        });
    })
}

export function DeleteeProject(id,callback){
    deleteRequest(APIPath.deleteProject+`/${id}`,(data)=>{
        if(data.code==200){
            callback(data.data)
        }
        else{
            uni.showToast({
                title: data.msg,
                icon: 'none'
            });
        }
    },(errMsg)=>{
        uni.showToast({
            title: errMsg,
            icon: 'none'
        });
    })
}

export function GetProjectDetail(projectId,callback){
    getRequest(APIPath.getProjectDetail+`/${projectId}`,(data)=>{
          console.log('获取项目详情',data)
        if(data.code==200){
            callback(data.data)
        }
        else{
            uni.showToast({
                title: '获取失败:'+data.msg,
                icon: 'none'
            });
        }
    },(error)=>{
        uni.showToast({
            title: '获取失败:'+error,
            icon: 'none'
        });
    })
}

export function UpdateProjectSetting(params, callback, errorCallback) {
    putRequest(APIPath.updateProjectSetting, params, (data) => {
        if (data.code == 200) {
            callback && callback(data.data)
        } else if (errorCallback) {
            errorCallback(data.msg)
        } else {
            uni.showToast({
                title: '保存失败:' + data.msg,
                icon: 'none'
            });
        }
    }, (error) => {
        if (errorCallback) {
            errorCallback(error)
            return
        }
        uni.showToast({
            title: '保存失败:' + error,
            icon: 'none'
        });
    })
}

//status=0进行中 1已完成
export function GetProjectList(pageNum,pageSize,status,callback){
    var apiPath=APIPath.getProjectList+`?pageNum=${pageNum}&pageSize=${pageSize}&status=${status}`
    getRequest(apiPath,(data)=>{
        if(data.code==200){
            // console.log('获取项目列表成功',data.rows)
            callback(data.rows)
        }
        else{
            console.error('获取项目列表失败',data.msg)
        }
    },(error)=>{
        console.error('获取项目列表失败',error)
    })
}


export function CreateProjectEpisodes(config,callback,errorCallback){
    postRequest(APIPath.addProjectEpisodes,config,(data)=>{
        console.log('保存分集成功',data)
        if(data.code==200){
            callback(data.data)
        }
        else{
            uni.showToast({
                title: '保存失败:'+data.msg,
                icon: 'none',
                duration: 5000
            });
        }
    },(error)=>{
        uni.showToast({
            title: '保存失败'+error,
            icon: 'none',
            duration: 5000
        });
        errorCallback(error)
    })
}

export function ModifyProjectEpisodes(config,callback,errorCallback){
    putRequest(APIPath.addProjectEpisodes,config,(data)=>{
        console.log('修改分集成功',data)
        if(data.code==200){
            callback(data.data)
        }
        else{
            uni.showToast({
                title: '保存失败:'+data.msg,
                icon: 'none',
                duration: 5000
            });
        }
    },(error)=>{
        uni.showToast({
            title: '保存失败'+error,
            icon: 'none',
            duration: 5000
        });
        errorCallback(error)
    })
}

export function updateStorySp(config,callback,errorCallback){
    postRequest(APIPath.updateStorySp,config,(data)=>{
        console.log('修改分集成功',data)
        if(data.code==200){
            callback(data.data)
        }
        else{
            uni.showToast({
                title: '保存失败:'+data.msg,
                icon: 'none',
                duration: 5000
            });
        }
    },(error)=>{
        uni.showToast({
            title: '保存失败'+error,
            icon: 'none',
            duration: 5000
        });
        errorCallback(error)
    })
}

// 获取项目分集剧本列表
export function GetProjectEpisodesList(pageNum,pageSize,projectId,callback,errorCallback){
	var apiUrl = APIPath.getEpisodesList + `?pageNum=${pageNum}&pageSize=${pageSize}&projectId=${projectId}`
	getRequest(apiUrl, reqData => {
		console.log("获取分集剧本列表:", reqData)
		if(reqData.code == 200){
			if(callback){
				callback(reqData)
			}
		}else{
			uni.showToast({
				title: '获取分集剧本列表失败:' + reqData.msg,
				icon: 'none',
				duration: 5000
			});
			if(errorCallback)errorCallback()
		}
	}, error => {
		uni.showToast({
			title: '获取分集剧本列表失败:' + error,
			icon: 'none',
			duration: 5000
		});
		if(errorCallback)errorCallback()
	})
}

export function GetCamereDetail(episodesId,callback,errCallback){
    getRequest(APIPath.addProjectEpisodes+`/${episodesId}`,(data)=>{
        console.log('获取相机详情',data)
        if(data.code==200){
            callback(data.data)
        }
        else{
            errCallback(data.msg)
        }
    },(error)=>{
       errCallback(error)
	})
}

export function MarkCompleteCamera(config,callback,errorCallback){
        postRequest(APIPath.completeCamera,config,(data)=>{
        console.log('分镜完成',data)
        if(data.code==200){
            callback(data.data)
        }
        else{
            uni.showToast({
                title: '标记失败，请稍后再试:'+data.msg,
                icon: 'none',
                duration: 5000
            });
            errorCallback(data.msg)
        }
    },(error)=>{
        uni.showToast({
            title: '标记失败，请稍后再试：'+error,
            icon: 'none',
            duration: 5000
        });
        errorCallback(error)
    })
}

// 删除剧本管理
export function deleteProjectEpisodes(ids,callback,errorCallback){
	var apiUrl = APIPath.addProjectEpisodes + `/${ids}`
	console.log(apiUrl)
	deleteRequest(apiUrl,reqData=>{
		console.log("刪除剧本管理:",reqData)
		if(reqData.code==200){
			if(callback)callback(reqData)
		}else{
			uni.showToast({
				title: '刪除剧本管理失败:' + reqData.msg,
				icon: 'none',
				duration: 5000
			});
			if(errorCallback)errorCallback()
		}
	},error=>{
		uni.showToast({
			title: '刪除剧本管理失败:' + error,
			icon: 'none',
			duration: 5000
		});
		if(errorCallback)errorCallback()
	})
}

export function newCameraConfig(camName, dateTime, index){
    var cameraConfig = {
			id: dateTime + index,
			name: camName,
            completeStatus:0,
			imageUrl: "",
			isSelectfanqiu: false,
			fanqiuSp: '',
			fanqiuResult: '',
			isSelectfanqiuResult: false,
			isSelectRongtu: false,
			rongtuhuafengStyle: '',
			rongtuStyle: '',
			rongtuSP: '',
			rongtuSPScene: '',
			rongtuFuxiangSP: '',
			rongtuImages: [],
			isSelectRongtuResult: false,
			rongtuCount: 1,
			rongtuHistory: [],
			rongtyResultImage: '',
			isSelectVideo: false,
			videoSP: '',
			videoContentSP: '',
			videoSPbottom: '',
			videofuxiangSP: '',
			isSelectVideoResult: false,
			videotime: 0,
			videofps: 24,
			resolutionratio: '9:16',
			createVideoCount: 1,
			videoHistory: [],
			videoResultUrl: '',
			endCamera: null,

			fenjinContent: '',
			fenjinDialog: '',
			rongtucankaosp: '',
			cankaoVideo: [],
			cankaoVieoImages: [],
			isMulitVideo: false,
			videoAgentName: '',
			loadingVisible: false,
			loadingfenji: false,
			imageAgentName: '',
		}
		return cameraConfig
}

export function cancelSingleTaskQueue(projectId,episodesId,cameraId,taskId,succeed){
    postRequest(APIPath.cancelTaskQueue,{projectId:projectId,episodesId:episodesId,cameraId:cameraId,id:taskId},(data)=>{
        if(data.code==200){
            uni.showToast({
                title: '取消任务成功',
                icon: 'none',
                duration: 2000
            });
            if(succeed)
                succeed()
        }
        else{
            uni.showToast({
                title: '取消任务失败:'+data.msg,
                icon: 'none',
                duration: 2000
            });
        }
    },(error)=>{
        uni.showToast({
            title: '取消任务失败'+error,
            icon: 'none',
            duration: 2000
        });
    })
}

export function cancelTaskQueue(projectId,succeed){
    postRequest(APIPath.cancelTaskQueue,{projectId:projectId},(data)=>{
        if(data.code==200){
            uni.showToast({
                title: '取消任务队列成功',
                icon: 'none',
                duration: 2000
            });
            if(succeed)
                succeed()
        }
        else{
            uni.showToast({
                title: '取消任务队列失败:'+data.msg,
                icon: 'none',
                duration: 2000
            });
        }
    },(error)=>{
        uni.showToast({
            title: '取消任务队列失败'+error,
            icon: 'none',
            duration: 2000
        });
    })
}

export function CheckTaskQueue(params,succeed){
    var path=`${APIPath.checkTask}?`;
    for(var key in params){
        path+=`${key}=${params[key]}&`
    }
    path=path.slice(0,-1)
    
    getRequest(path,(data)=>{
        // console.log('检查任务队列',data)
        if(data.code==200){
            if(succeed)
                succeed(data.data)
        }
        else{
        }
    },(error)=>{
    })
}

export function DeleteTask(taskId,successCallback){
    deleteRequest(APIPath.aiTask+`/${taskId}`,(data)=>{
        if(data.code==200){
            uni.showToast({
                title: '删除任务成功',
                icon: 'none',
                duration: 2000
            });
            successCallback && successCallback(data)
        }
        else{
            uni.showToast({
                title: '删除任务失败:'+data.msg,
                icon: 'none',
                duration: 2000
            });
        }
    },(error)=>{
        uni.showToast({
            title: '删除任务失败'+error,
            icon: 'none',
            duration: 2000
        });
    })
}
export function DeleteCameraVideoHistory(episodesId,cameraId,videourls,callback){
    var body={
        episodesId:episodesId,
        cameraId:cameraId,
        urls:videourls
    }
    postRequest(APIPath.deleteVideoHistoryPath,body,(data)=>{
        if(data.code==200){
            uni.showToast({
                title: '删除视频成功',
                icon: 'none',
                duration: 2000
            });
            if(callback){
                callback()
            }
        }
        else{
            uni.showToast({
                title: '删除视频失败:'+data.msg,
                icon: 'none',
                duration: 2000
            });
        }
    },(error)=>{
        uni.showToast({
            title: '删除视频失败'+error,
            icon: 'none',
            duration: 2000
        });
    })
}

export function DeleteCameraRongtuHistory(episodesId,cameraId,imageurls,callback){
    var body={
        episodesId:episodesId,
        cameraId:cameraId,
        urls:imageurls
    }
    postRequest(APIPath.deleteRongtuHistoryPath,body,(data)=>{
        if(data.code==200){
            uni.showToast({
                title: '删除视频成功',
                icon: 'none',
                duration: 2000
            });
            if(callback){
                callback()
            }
        }
        else{
            uni.showToast({
                title: '删除视频失败:'+data.msg,
                icon: 'none',
                duration: 2000
            });
        }
    },(error)=>{
        uni.showToast({
            title: '删除视频失败'+error,
            icon: 'none',
            duration: 2000
        });
    })
}


export function getTaskBaseInfo(taskId){
  getRequest(APIPath.aiTaskInfo+'/'+taskId,(resData)=>{
    if(resData.code==200){
      try{
        const queue = resData.data?.queue;
        const content = queue.content || queue.result || ''
        const responseContent = JSON.parse(content)
        if(responseContent?.error?.message){
          uni.showModal({
            title:`任务${taskId}`,
            content: responseContent.error.message,
            showCancel: false,
          })
        }else if(resData.data?.queue?.result && /\<title\>(.*)\<\/title\>/.test(resData.data.queue.result)){
          const titleContent = resData.data.queue.result.match(/\<title\>(.*)\<\/title\>/)[1];
          let desc = '';
          const errorCodeMap = {
            '502 Bad Gateway':'服务器异常或超时',
          }
          for(let key in errorCodeMap){
            if(titleContent.includes(key)){
              desc=errorCodeMap[key]
              break;
            }
          }
          uni.showModal({
            title:`任务${taskId}`,
            content: `${titleContent}${desc?`(${desc})`:''}`,
            showCancel: false,
          })
        }
        else{
          uni.showToast({
            title: '无法匹配到错误信息',
            icon: 'none',
            duration: 3000
          })
        }
      }
      catch(error){
        console.warn(error)
      }
    }
  },(error)=>{
    error && uni.showToast({
      title: error,
      icon: 'none',
      duration: 3000
    })
  })
}