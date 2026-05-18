import { APIPath, deleteRequest, getRequest, postRequest,putRequest } from "./APIRequest"

export function GetResourceStatusList(num,size,resType,status,callback){
    var apiPath=APIPath.resourceList+'?pageNum='+num+'&pageSize='+size+'&typeId='+resType+'&status='+status
    getRequest(apiPath,(data)=>{
        if(data.code == 200){
          if(callback){
                callback(data.rows)
            }
        }
        else{
             console.error(data.msg)
        }
    },(error)=>{
        console.error(error)
    })
}
export function GetResourceList(num,size,resType,callback){
    var apiPath=APIPath.resourceList+'?pageNum='+num+'&pageSize='+size+'&typeId='+resType
    getRequest(apiPath,(data)=>{
        if(data.code == 200){
          if(callback){
                callback(data.rows)
            }
        }
        else{
             console.error(data.msg)
        }
    },(error)=>{
        console.error(error)
    })
}

export function GetResourceListByProject(params,callback){
    var apiPath=APIPath.resourceList+'?';
    const reqParams = {
        pageNum:1,
        pageSize:2000,
        typeId:25,
        ...params,
    }
    for(let key in reqParams){
        apiPath+=key+'='+reqParams[key]+'&'
    }
    apiPath=apiPath.slice(0,-1);

    getRequest(apiPath,(data)=>{
        if(data.code == 200){
          if(callback){
                callback(data.rows)
            }
        }
        else{
             console.error(data.msg)
        }
    },(error)=>{
        console.error(error)
    })
}

export function AddNewResource(newResConfig,callback){
    postRequest(APIPath.addResource,newResConfig,(data)=>{
        if(data.code == 200){
            if(callback){
                callback(data)
            }
        }
        else{
            uni.showToast({
                title: data.msg,
                icon: 'none'
            })
             console.error(data.msg)
        }
    },(error)=>{
            uni.showToast({
                title: error,
                icon: 'none'
            })
        console.error(error)
    })
}

export function EditorResource(newResConfig,callback){
    putRequest(APIPath.addResource,newResConfig,(data)=>{
        if(data.code == 200){
            // console.log(data)
            if(callback){
                callback(data)
            }
        }
        else{
            uni.showToast({
                title: data.msg,
                icon: 'none'
            })
             console.error(data.msg)
        }
    },(error)=>{
            uni.showToast({
                title: error,
                icon: 'none'
            })
        console.error(error)
    })
}

export function DeleteResource(resId,callback){
    var apiPath=APIPath.deleteResource+'/'+resId
    console.log(apiPath,resId)
    deleteRequest(apiPath,(data)=>{
        if(data.code == 200){
            if(callback){
                callback(data)
            }
        }
        else{
            uni.showToast({
                title: '删除失败：'+data.msg,
                icon: 'none'
            })
        }
    },(error)=>{
        uni.showToast({
            title: '删除失败：'+error,
            icon: 'none'
        })
    })
}


export function GetResourceTypeList(parentId,callback){
    var apiPath=APIPath.resourceTypeList+"?parentId="+parentId
    getRequest(apiPath,(data)=>{
        if(data.code == 200){
          if(callback){
                callback(data.data)
            }
        }
        else{
             console.error(data.msg)
        }
    },(error)=>{
        console.error(error)
    })
}


export function AddBatchResource(configs,callback){
    uni.showLoading({
		title: '资产增加中',
		mask: true,
	})
    postRequest(APIPath.addBacthResPath,configs,(data)=>{
        uni.hideLoading()
        if(data.code == 200){
            if(callback){
                callback(data)
            }
        }
        else{
            uni.showToast({
                title: data.msg,
                icon: 'none'
            })
             console.error(data.msg)
        }
    },(error)=>{
         uni.hideLoading()
            uni.showToast({
                title: error,
                icon: 'none'
            })
        console.error(error)
    })
}