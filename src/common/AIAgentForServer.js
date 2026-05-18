import { APIPath, postRequest } from "./APIRequest";

import { isNull,getImageSize } from "./Tool";

export function ImageIdentify(sp,url,callback,errorCallback){
    var body={
        input:[
            {
                role: "system",
                content:[
                    {type:'input_text',text:sp},
                    {type:'input_image',image_url:url}
                ]
            }
        ],
    }
    postRequest(APIPath.doubaoSeed1_6,body,(resData)=>{
        console.log(resData)
        if(resData.code==200){
            if(callback)
                callback()
        }
        else{
            uni.showToast({
                title: '图片识别失败：'+resData.msg,
                icon: 'none'
            });
            if(errorCallback){
                errorCallback(error)
            }
        }
    },(error)=>{
        uni.showToast({
            title: '图片识别失败：'+error,
            icon: 'none'
        });
        if(errorCallback){
            errorCallback(error)
        }
    })
}

export function seedance2Video(config,callback,errorCallback,extract={}){
    if(config.audios.length>0 && (config.imageurls.length+config.videos.length==0)){
        uni.showToast({
            title: 'seedance2模型下带音频输入时必须包含图片或视频',
            icon: 'none',
            duration: 4000
        })
        return
    }
    let content;
    if(extract.projectType==2){
        content = [
            {
                type:'text',
                text:config.sp,
            },
            {
                type:'image_url',
                role:"first_frame",
                image_url:{
                    url:config.imageurls[0],
                }
            },
            ...config.audios.map(i=>{
                return {
                    type:'audio_url',
                    role:"reference_audio",
                    audio_url:{
                        url:i
                    }
                }
            })
        ]
    }else{
        content = [
            {
                type:'text',
                text:config.sp,
            },
            ...config.imageurls.map(i=>{
                return {
                    type:'image_url',
                    role:"reference_image",
                    image_url:{
                        url:i
                    }
                }
            }),
            ...config.videos.map(i=>{
                return {
                    type:'video_url',
                    role:"reference_video",
                    video_url:{
                        url:i
                    }
                }
            }),
            ...config.audios.map(i=>{
                return {
                    type:'audio_url',
                    role:"reference_audio",
                    audio_url:{
                        url:i
                    }
                }
            })
        ]
    }
    var body={    
        content,
        resolution:config.resolution?.toLocaleLowerCase(),
        ratio:config.ratio,
        duration:config.time,
        watermark: false,
        projectId: config.projectId,
        episodesId: config.episodesId,
        cameraId: config.cameraId,
        modelId: config.modelId,
        // draft:config.resolution?.toLocaleLowerCase()=='480p'?true:false,
    }
    
    postRequest(APIPath.seedance2Video,body,(resData)=>{
        if(resData.code==200){
            if(callback)
                callback(resData.data)
        }
        else{
            if(errorCallback){
                errorCallback(resData.msg)
            }
        }
    },(error)=>{
        if(errorCallback){
                errorCallback(error)
            }
    })
}

export function aliToVideo(config,callback,errorCallback,extract={type:'reference'}){
    if(config.videos.length>=1 || config.audios.length>=1){
        uni.showToast({
            title: '阿里云百炼模型仅支持图片输入',
            icon: 'none',
            duration: 4000
        })
        return
    }

    var body={
        input: {
            media: [],
            prompt: config.sp,
        },
        parameters: {
            resolution: config.resolution,
            duration: config.time,
            ratio: config.ratio,
            watermark:false
        },
        projectId: config.projectId,
        episodesId: config.episodesId,
        cameraId: config.cameraId,
        modelId: config.modelId,
    }

    if(extract.type=='image'){
        body.input.media[0] = {
            type: "first_frame",
            url: config.imageurls[0],
        }
        delete body.parameters.ratio
    }else{
        body.input.media = config.imageurls.map(i=>{
            return {
                type: "reference_image",
                url: i,
            }
        })
    }

    postRequest(APIPath.aliToVideo,body,(resData)=>{
        if(resData.code==200){
            if(callback)
                callback(resData.data)
        }
        else{
            if(errorCallback){
                errorCallback(resData.msg)
            }
        }
    },(error)=>{
         if(errorCallback){
                errorCallback(error)
            }
    })
}

export function ViduQ3Video(config,callback,errorCallback) {
    var body={
        input:[
            {
                params:{
                    prompt: config.sp,
                    images: config.imageurls,
                    duration: config.time,
                    resolution: config.resolution?.toLocaleLowerCase(),
                    aspect_ratio: config.ratio,
                    watermark: false
                }
            }
        ],
        projectId: config.projectId,
        episodesId: config.episodesId,
        cameraId: config.cameraId,
        modelId: config.modelId,
    }
    // 和可灵共用一个接口
    postRequest(APIPath.kirinV3,body,(resData)=>{
        if(resData.code==200){
            if(callback)
                callback(resData.data)
        }
        else{
            if(errorCallback){
                errorCallback(resData.msg)
            }
        }
    },(error)=>{
         if(errorCallback){
                errorCallback(error)
            }
    })
}


export function ViduQ2Video(config,callback,errorCallback){
    var body={
        input:[
            {
                params:{
                    prompt: config.sp,
                    images: config.imageurls,
                    duration: config.time,
                    resolution: config.resolution.toLocaleLowerCase(),
                    aspect_ratio: config.ratio,
                    watermark: false
                }
            }
        ],
        projectId: config.projectId,
        episodesId: config.episodesId,
        cameraId: config.cameraId,
        modelId: config.modelId,
    }
    postRequest(APIPath.viduQ2Video,body,(resData)=>{
        if(resData.code==200){
            if(callback)
                callback(resData.data)
        }
        else{
            if(errorCallback){
                errorCallback(resData.msg)
            }
        }
    },(error)=>{
         if(errorCallback){
                errorCallback(error)
            }
    })
}

export function ViduQ2ProVideo(config,callback,errorCallback){
    var body={
        input:[
            {
                params:{
                    prompt: config.sp,
                    images: config.imageurls,
                    duration: config.time,
                    resolution: config.resolution?.toLocaleLowerCase(),
                    aspect_ratio: config.ratio,
                    watermark: false,
                    videos: config.videos,
                }
            }
        ],
        projectId: config.projectId,
        episodesId: config.episodesId,
        cameraId: config.cameraId,
        modelId: config.modelId,
    }
    postRequest(APIPath.viduQ2ProVideo,body,(resData)=>{
        if(resData.code==200){
            if(callback)
                callback(resData.data)
        }
        else{
            if(errorCallback){
                errorCallback(resData.msg)
            }
        }
    },(error)=>{
         if(errorCallback){
                errorCallback(error)
            }
    })
}

export function DoubaoSeedance1_5Video(config,callback,errorCallback) {
    let bodycontent=[
        {
            type:"text",
            text:config.sp
        },
        ...config.imageurls.map((item)=>({
            type:"image_url",
            image_url:{
                url:item
            },
        }))
    ]
    
    var body={
        content:bodycontent,
        resolution: config.resolution?.toLocaleLowerCase(),
        ratio: config.ratio,
        duration: config.time,
        watermark: false,
        projectId: config.projectId,
        episodesId: config.episodesId,
        cameraId: config.cameraId,
        modelId: config.modelId,
    }

    postRequest(APIPath.doubaoseedance1_5Video,body,(resData)=>{
        if(resData.code==200){
            if(callback)
                callback(resData.data)
        }
        else{
            if(errorCallback){
                errorCallback(resData.msg)
            }
        }
    },(error)=>{
         if(errorCallback){
                errorCallback(error)
            }
    })
}

export function BananaImage(config,callback,errorCallback) {
    var body={
        input:[
            {
                params:{
                    prompt: config.sp,
                    image_urls: config.imageurls,
                    resolution: config.resolution,
                    aspect_ratio: config.ratio,
                    watermark: false,
                }
            }
        ],
        projectId: config.projectId,
        episodesId: config.episodesId,
        cameraId: config.cameraId,
        modelId: config.modelId,
    }
    postRequest(APIPath.bananaImage,body,(resData)=>{
        if(resData.code==200){
            if(callback)
                callback(resData.data)
        }
        else{
            if(errorCallback){
                errorCallback(resData.msg)
            }
        }
    },(error)=>{
         if(errorCallback){
                errorCallback(error)
            }
    })
}

export function BananaProImage(config,callback,errorCallback,extract={}) {
    var body={
        input:[
            {
                params:{
                    prompt: config.sp,
                    image_urls: config.imageurls,
                    resolution: config.resolution,
                    aspect_ratio: config.ratio,
                    watermark: false,
                }
            }
        ],
        projectId: config.projectId,
        episodesId: config.episodesId,
        cameraId: config.cameraId,
        modelId: config.modelId,
    }

    // 改成可灵的配置
    if(extract.kirin){
       delete body.input[0].params.image_urls;
       delete body.input[0].params.watermark;
       body.input[0].params.watermark_info = {
            enabled: false,
       }
       body.input[0].params.resolution = body.input[0].params.resolution.toLocaleLowerCase()
       body.input[0].params.image_list = config.imageurls.map((item)=>{
            return {
                image: item,
            }
        })
        
    }

    postRequest(APIPath.bananaProImage,body,(resData)=>{
        if(resData.code==200){
            if(callback)
                callback(resData.data)
        }
        else{
            if(errorCallback){
                errorCallback(resData.msg)
            }
        }
    },(error)=>{
         if(errorCallback){
                errorCallback(error)
            }
    })
}

export function Doubaoseedream4_5Image(config,callback,errorCallback) {
    var body={
        image:config.imageurls,
        prompt: config.sp,
        size: getImageSize(config.ratio, config.resolution),
        watermark: false,
        projectId: config.projectId,
        episodesId: config.episodesId,
        cameraId: config.cameraId,
        modelId: config.modelId,
    }

    postRequest(APIPath.doubaoseedream4_5Image,body,(resData)=>{
        if(resData.code==200){
            if(callback)
                callback(resData.data || {})
        }
        else{
            if(errorCallback){
                errorCallback(resData.msg)
            }
        }
    },(error)=>{
         if(errorCallback){
                errorCallback(error)
            }
    })
}

export function KirinV3OmniVideo(config,callback,errorCallback,extractConfig={}) {
    const getMode = function(str){
        const num = str.match(/[\d]+/)?.[0];
        if(num&&num<=720){
            return "std"
        }
        else{
            return "pro"
        }
    }
    var body={
        input:[
            {
                params:{
                    prompt: config.sp,
                    image_list: config.imageurls.map((item)=>{
                        return {
                            image_url: item,
                        }
                    }),
                    video_list: config.videos.map((item)=>{
                        return {
                            video_url: item,
                            refer_type:'feature',
                            keep_original_sound: "yes"
                        }
                    }),
                    duration: config.time,
                    mode: getMode(config.resolution),
                    sound:config.videos?.length>0?'off':'on',
                    aspect_ratio: config.ratio,
                    watermark_info: {
                        enabled: false,
                    }
                }
            }
        ],
        projectId: config.projectId,
        episodesId: config.episodesId,
        cameraId: config.cameraId,
        modelId: config.modelId,
    }
    if(extractConfig.type==2){
        body.input[0].params.image_list = [{
            image_url:config.imageurls[0],
            type:'first_frame',
        }]
        delete body.input[0].params.video_list
    }
    postRequest(APIPath.kirinV3,body,(resData)=>{
        if(resData.code==200){
            if(callback)
                callback(resData.data)
        }
        else{
            if(errorCallback){
                errorCallback(resData.msg)
            }
        }
    },(error)=>{
         if(errorCallback){
                errorCallback(error)
            }
    })
}


export function Doubaoseedream5_0liteTextImage(configs,callback,errorCallback){
    const params = [];
    for(const config of configs){
        const obj = {
            projectId: config.projectId,
            modelId: config.modelId,
            prompt: config.prompt,
            size: getImageSize(config.ratio, config.resolution),
            watermark: false,
            name: config.name,
            typeId: config.typeId,
            num: config.num,
            itemId: config.itemId,
        }

        if(config.imageUrls?.length==1){
            obj.image = config.imageUrls[0]
        }else if(config.imageUrls?.length>1){
            obj.image = config.imageUrls
        }

        params.push(obj)
    }

    postRequest(APIPath.doubaoseedream5_0lite,params,(resData)=>{
        if(resData.code==200){
            if(callback)
                callback(resData.data)
        }
        else{
            if(errorCallback){
                errorCallback(resData.msg)
            }
        }
    },(error)=>{
         if(errorCallback){
                errorCallback(error)
            }
    })
}

export function BananaTextImage(configs,callback,errorCallback){
    const params = [];
    for(const config of configs){
        const obj = {
            projectId: config.projectId,
            modelId: config.modelId,
            input: [{
                params: {
                    prompt: config.prompt,
                    resolution: config.resolution,
                    aspect_ratio: config.ratio,
                    watermark: false
                }
            }],
            name: config.name,
            typeId: config.typeId,
            num: config.num,
            itemId: config.itemId,
        }

        if(config.imageUrls?.length>=1){
            obj.input[0].params.image_urls = config.imageUrls
        }

        if(config.modelId==13 && config.imageUrls?.length>3){
            uni.showToast({
                title: '香蕉2模型最多支持3张图片',
                icon: 'none',
                duration: 3000
            })
            return
        }

        params.push(obj)
    }

    postRequest(APIPath.bananaTextImagePath,params,(resData)=>{
        if(resData.code==200){
            if(callback)
                callback(resData.data)
        }
        else{
            if(errorCallback){
                errorCallback(resData.msg)
            }
        }
    },(error)=>{
         if(errorCallback){
                errorCallback(error)
            }
    })
}

export function KirinV3TextImage(configs,callback,errorCallback){
    const params = [];
    for(const config of configs){
        const obj = {
            projectId: config.projectId,
            modelId: config.modelId,
            input: [{
                params: {
                    prompt: config.prompt,
                    resolution: config.resolution.toLocaleLowerCase(),
                    aspect_ratio: config.ratio,
                    watermark_info: {
                        enabled: false,
                    }
                }
            }],
            name: config.name,
            typeId: config.typeId,
            num: config.num,
            itemId: config.itemId,
        }
        
        if(config.imageUrls?.length>=1){
            obj.input[0].params.image_list = config.imageUrls.map((item)=>{
                return {
                    image: item,
                }
            })
        }
        params.push(obj)
    }

    postRequest(APIPath.kirinV3TextImagePath,params,(resData)=>{
        if(resData.code==200){
            if(callback)
                callback(resData.data)
        }
        else{
            if(errorCallback){
                errorCallback(resData.msg)
            }
        }
    },(error)=>{
         if(errorCallback){
                errorCallback(error)
            }
    })
}

export function doubaoCreateWord(config,successCallback,errorCallback){
    postRequest(APIPath.doubaoCreateWord,config,(resData)=>{
        if(resData.code==200){
            if(successCallback)
                successCallback(resData.msg)
        }
        else{
            if(errorCallback){
                errorCallback(resData.msg)
            }
        }
    },(error)=>{
         if(errorCallback){
                errorCallback(error)
            }
    },{timeout:300000})
}

export function geminiCreateWord(config,successCallback,errorCallback){
    postRequest(APIPath.geminiCreateWord,config,(resData)=>{
        if(resData.code==200){
            if(successCallback)
                successCallback(resData.msg)
        }
        else{
            if(errorCallback){
                errorCallback(resData.msg)
            }
        }
    },(error)=>{
         if(errorCallback){
                errorCallback(error)
            }
    },{timeout:300000})
}

export function aliCreateWord(config,successCallback,errorCallback){
    postRequest(APIPath.aliWords,config,(resData)=>{
        if(resData.code==200){
            if(successCallback)
                successCallback(resData.msg)
        }
        else{
            if(errorCallback){
                errorCallback(resData.msg)
            }
        }
    },(error)=>{
         if(errorCallback){
                errorCallback(error)
            }
    },{timeout:300000})
}