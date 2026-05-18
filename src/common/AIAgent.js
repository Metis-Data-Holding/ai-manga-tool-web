
// let serverUrl = 'https://cloud.vtrix.ai/'
let serverUrl = '/martin/'
//let apikey='sa-JNvO-hys5_7waBnzNuW-vxohX792xtNDLlhjDGxqutY' //测试key 以关停

let apikey=''

let doubaoserverUrl = 'https://ark.cn-beijing.volces.com/'
let aboardDoubaoserverUrl = 'https://ark.ap-southeast.bytepluses.com'
if(process.env.NODE_ENV=='development'){
    aboardDoubaoserverUrl = '/aboard-doubao'
}
let doubaoapikey=''
import { postRequest,putRequest, APIPath } from "./APIRequest"
import { isNull,getImageSize,transferVideoSync } from "./Tool";
import store from '@/store';

//多参生视频
export function ViduQ2(config,callback,errorCallback){
    var apiPath = "model/v1/generation"
    var requestUrl = `${serverUrl}${apiPath}`
    uni.request({
        url: requestUrl,
        method: "POST",
        header: {
            'Authorization': `Bearer ${apikey}`,
            'Content-Type': 'application/json',
        },
        dataType: "json",
        timeout: 60000,
        data: {
            model:"viduq2_i2v_reference",
            input:[
                {
                    params:{
                        prompt: config.sp,
                        images: config.imageurls,
                        duration: config.time,
                        resolution: "720p",
                        aspect_ratio: config.ratio,
                        watermark: false
                    }
                }
            ]
        },
        success: (requestData) => {
            if(requestData.statusCode==200){
                // console.log('ViduQ2成功==',requestData.data)
                checkVideoTask(requestData.data.id,callback,errorCallback)
                //callback(requestData.data)
            }
            else{
                errorCallback(requestData.errMsg)
            }
        },
        fail: (error) => {
            errorCallback(error)
        },
        complete: (msg) => {}
    })
}
//多参生视频 pro
export function ViduQ2PRO(config,callback,errorCallback){
    var apiPath = "model/v1/generation"
    var requestUrl = `${serverUrl}${apiPath}`
    uni.request({
        url: requestUrl,
        method: "POST",
        header: {
            'Authorization': `Bearer ${apikey}`,
            'Content-Type': 'application/json',
        },
        dataType: "json",
        timeout: 60000,
        data: {
            model:"viduq2_pro_reference",
            input:[
                {
                    params:{
                        prompt: config.sp,
                        videos: config.videos,
                        images: config.imageurls,
                        duration: config.time,
                        resolution: "720p",
                        aspect_ratio: config.ratio,
                        watermark: false
                    }
                }
            ]
        },
        success: (requestData) => {
            if(requestData.statusCode==200){
                // console.log('ViduQ2成功==',requestData.data)
                checkVideoTask(requestData.data.id,callback,errorCallback)
                //callback(requestData.data)
            }
            else{
                errorCallback(requestData.errMsg)
            }
        },
        fail: (error) => {
            errorCallback(error)
        },
        complete: (msg) => {}
    })
}

//可灵V3 Omni 生视频
export function KirinV3Omni(config,callback,errorCallback){
    var apiPath = "model/v1/generation"
    var requestUrl = `${serverUrl}${apiPath}`
    uni.request({
        url: requestUrl,
        method: "POST",
        header: {
            'Authorization': `Bearer ${apikey}`,
            'Content-Type': 'application/json',
        },
        dataType: "json",
        timeout: 60000,
        data: {
            model:"kirin_v3_omni_video",
            input:[
                {
                    params:{
                        prompt: config.sp,
                        image_list: config.imageurls,
                        video_list: config.videos,
                        sound:'on',
                        duration: config.time,
                        mode: "std",
                        aspect_ratio: config.ratio,
                        watermark_info: {
                            enabled: false,
                        }
                    }
                }
            ]
        },
        success: (requestData) => {
            if(requestData.statusCode==200){
                // console.log('ViduQ2成功==',requestData.data)
                checkVideoTask(requestData.data.id,callback,errorCallback)
                //callback(requestData.data)
            }
            else{
                errorCallback(requestData.errMsg)
            }
        },
        fail: (error) => {
            errorCallback(error)
        },
        complete: (msg) => {}
    })
}

//多参生视频 任务状态检查
function checkVideoTask(id,callback,errorCallback){
		var apiPath = "model/v1/generation/task/"+id
		var requestUrl = `${serverUrl}${apiPath}`
		uni.request({
			url: requestUrl,
			method: "GET",
			header: {
				'Authorization': `Bearer ${apikey}`,
				'Content-Type': 'application/json',
			},
			dataType: "json",
			timeout: 60000,
			success: (requestData) => {
				if(requestData.statusCode==200){
                     console.log('checkVideoTask成功==',requestData.data)
					if(requestData.data.status=='completed'){
                        console.log('视频地址==',requestData.data.output[0].content[0].url)
						callback(requestData.data.output[0].content[0].url)
					}
					else if(requestData.data.status=='in_progress'){
						setTimeout(()=>{
							checkVideoTask(id,callback,errorCallback)
						},5000)
					}
					else{
						errorCallback(requestData.data.status)
					}
				}
				else{
					errorCallback(requestData.errMsg)
				}
			},
			fail: (error) => {
				errorCallback(error)
			},
			complete: (msg) => {}
		})
}

//豆包文字理解
export function doubaoChat(body,callback,errCallback){
    var apiPath = "api/v3/chat/completions"
    var requestUrl = `${doubaoserverUrl}${apiPath}`
    uni.request({
        url: requestUrl,
        method: "POST",
        header: {
            'Authorization': `Bearer ${doubaoapikey}`,
            'Content-Type': 'application/json',
        },
        dataType: "json",
        timeout: 300000,
        data: {
            model:"doubao-seed-1-8-251228",
            max_tokens:32768,
            messages:body,
        },
        success: (requestData) => {
            //  console.error("生成成功", requestData)
            if(requestData.statusCode==200){
                callback(requestData.data.choices[0].message.content)
            }
            else{
                errCallback(requestData.errMsg)
            }
        },
        fail: (error) => {
            errCallback(error)
        },
        complete: (msg) => {}
    })
}

//豆包文字理解（流式）
export async function doubaoChatStream (bodyData,callback,callbackChunk,errorCallback){
    var apiPath = "api/v3/chat/completions"
    var requestUrl = `${doubaoserverUrl}${apiPath}`
    const response =  await fetch(requestUrl,{
        method:'POST',
        headers: {
            'Authorization': `Bearer ${doubaoapikey}`,
            'Content-Type': 'application/json',
            'Accept': 'text/event-stream',
			'Cache-Control': 'no-cache',
        },
        body: JSON.stringify({
            model:"doubao-seed-1-8-251228",
            max_tokens:32768,
            messages:bodyData,
            stream : true,
            thinking:{
                type:'disabled'//enabled开启思考，disabled关闭思考，auto自动
            }
        }),
    })
    if (!response.ok) {
		if(errorCallback){
			errorCallback(response.status)
		}
		console.log('请求失败=='+response.status)
		throw new Error(`HTTP error! status: ${response.status}`);
	}
    const reader = response.body.getReader();
	const decoder = new TextDecoder();
    let output = ''
    while (true){
        const { done, value } = await reader.read()
        if (done) {
            console.log(done)
			break
		}
        var text = decoder.decode(value, { stream: true })
         let cleanedText =text.replace(/^\s+|\s+$/g, ''); 
        let lines = cleanedText.split(/\n{2,}/);
        for (let index = 0; index < lines.length; index++) {
             const element = lines[index]
              if(element.startsWith("data:")){
                let json=element.slice(6)
                 if(json === "[DONE]"){
                    console.log('DONE')
                 }
                 else{
                    let choiceDalta=JSON.parse(json)
                     for (let index = 0; index < choiceDalta.choices.length; index++){
                          const content = choiceDalta.choices[index].delta.content;
                          output+=content
                          if(content){
                            // console.log('chunk==',content)
                            if(callbackChunk){
                                callbackChunk(content)
                            }
                          }
                     }
                 }
              }
        }
    }
    callback(output)
}

//doubao1.6图片理解
export function doubaoSeed1_6(sp,url,callback,errorCallback){
    var apiPath = "api/v3/responses"
    var requestUrl = `${doubaoserverUrl}${apiPath}`
    uni.request({
        url: requestUrl,
        method: "POST",
        header: {
            'Authorization': `Bearer ${doubaoapikey}`,
            'Content-Type': 'application/json',
        },
        dataType: "json",
        timeout: 60000,
        data: {
            model:"doubao-seed-1-6-251015",
            input:[
                {
                    role: "system",
                    content:[
                        {type:'input_text',text:sp},
                        {type:'input_image',image_url:url}
                    ]
                }
            ]
        },
        success: (requestData) => {
            if(requestData.statusCode==200){
                for (let index = 0; index < requestData.data.output.length; index++) {
                    const element = requestData.data.output[index];
                    if(element.type=='message'){
                        if(element.content.length>0){
                            callback(element.content[0].text)
                        }
                    }
                }
            }
            else{
                errorCallback(requestData.errMsg)
            }
        },
        fail: (error) => {
            errorCallback(error)
        },
        complete: (msg) => {}
    })
}

//香蕉生图
export function Banana(config,callback,errorCallback){
    var apiPath = "model/v1/generation"
    var requestUrl = `${serverUrl}${apiPath}`
    uni.request({
        url: requestUrl,
        method: "POST",
        header: {
            'Authorization': `Bearer ${apikey}`,
            'Content-Type': 'application/json',
        },
        dataType: "json",
        timeout: 60000,
        data: {
            model:"vtrix_nano_banana",
            input:[
                {
                    params:{
                        prompt: config.sp,
                        image_urls: config.imageurls,
                        resolution: "2k",
                        aspect_ratio: config.ratio,
                        watermark: false
                    }
                }
            ]
        },
        success: (requestData) => {
            if(requestData.statusCode==200){
                //  console.log('Banana==',requestData.data)
                 checkVideoTask(requestData.data.id,callback,errorCallback)
            }
            else{
                errorCallback(requestData.errMsg)
            }
        },
        fail: (error) => {
            errorCallback(error)
        },
        complete: (msg) => {}
    })
}

//香蕉pro生图
export function BananaPro(config,callback,errorCallback){
    var apiPath = "model/v1/generation"
    var requestUrl = `${serverUrl}${apiPath}`
    uni.request({
        url: requestUrl,
        method: "POST",
        header: {
            'Authorization': `Bearer ${apikey}`,
            'Content-Type': 'application/json',
        },
        dataType: "json",
        timeout: 60000,
        data: {
            model:"vtrix_nano_banana_pro",
            input:[
                {
                    params:{
                        prompt: config.sp,
                        image_urls: config.imageurls,
                        resolution: "2k",
                        aspect_ratio: config.ratio,
                        watermark: false
                    }
                }
            ]
        },
        success: (requestData) => {
            if(requestData.statusCode==200){
                //  console.log('Banana==',requestData.data)
                 checkVideoTask(requestData.data.id,callback,errorCallback)
            }
            else{
                errorCallback(requestData.errMsg)
            }
        },
        fail: (error) => {
            errorCallback(error)
        },
        complete: (msg) => {}
    })
}

export function MidjourneyV7(config,callback,errorCallback){
    var apiPath = "model/v1/generation"
    var requestUrl = `${serverUrl}${apiPath}`
    uni.request({
        url: requestUrl,
        method: "POST",
        header: {
            'Authorization': `Bearer ${apikey}`,
            'Content-Type': 'application/json',
        },
        dataType: "json",
        timeout: 60000,
        data: {
            model:"midjourney_diffusion",
            input:[
                {
                    params:{
                        text: config.sp+' --v 7 --repeat 1' +' --ar '+config.ratio,   
                    }
                }
            ]
        },
        success: (requestData) => {
            if(requestData.statusCode==200){
                //  console.log('Banana==',requestData.data)
                 checkVideoTask(requestData.data.id,callback,errorCallback)
            }
            else{
                errorCallback(requestData.errMsg)
            }
        },
        fail: (error) => {
            errorCallback(error)
        },
        complete: (msg) => {}
    })
}

//豆包4.5生图
export function doubaoseedream4_5(combineSP,imageurls,ratio,callback,errorCallback){
    var apiPath = "api/v3/images/generations"
    var requestUrl = `${doubaoserverUrl}${apiPath}`
    var tempSize='2560x1440'
    if(ratio=='9:16'){
        tempSize='1440x2560'
    }
    uni.request({
        url: requestUrl,
        method: "POST",
        header: {
            'Authorization': `Bearer ${doubaoapikey}`,
            'Content-Type': 'application/json',
        },
        dataType: "json",
        timeout: 300000,
        data: {
            model:"doubao-seedream-4-5-251128",
            prompt:combineSP,
            image:imageurls,
            size:tempSize,
            watermark: false
        },
        success: (requestData) => {
            if(requestData.statusCode==200){
                callback(requestData.data.data[0].url)
            }
            else{
                errorCallback(requestData.errMsg)
            }
        },
        fail: (error) => {
            errorCallback(error)
        },
        complete: (msg) => {}
    })
}

//豆包1.5生视频
export function doubaoseedance1_5(combineSP,time, imageurlF,imageurlE,tempRatio,callback,errCallback){
    var tempduration=Number(time) 
    if(tempduration<4){
        tempduration=4
    }
    var apiPath = "api/v3/contents/generations/tasks"
    var requestUrl = `${doubaoserverUrl}${apiPath}`
    var Body=[]
    if(imageurlE ==''){
        Body=[
                {
                    type:"text",
                    text:combineSP
                },
                {
                    type:"image_url",
                    image_url:{
                        url:imageurlF
                    },
                }
            ]
    }
    else{
        Body=[
                {
                    type:"text",
                    text:combineSP
                },
                {
                    type:"image_url",
                    image_url:{
                        url:imageurlF
                    },
                    role: "first_frame"
                },
                {
                    type:"image_url",
                    image_url:{
                        url:imageurlE
                    },
                    role: "last_frame"
                }
            ]
    }

    uni.request({
        url: requestUrl,
        method: "POST",
        header: {
            'Authorization': `Bearer ${doubaoapikey}`,
            'Content-Type': 'application/json',
        },
        dataType: "json",
        timeout: 300000,
        data: {
            model:"doubao-seedance-1-5-pro-251215",
            content:Body,
            resolution:'720p',
            ratio: tempRatio,
            duration:tempduration,
            watermark: false
        },
        success: (requestData) => {
            //  console.error("生成成功", requestData)
            if(requestData.statusCode==200){
                doubaocheckVideoTask(requestData.data.id,callback,errCallback)
            }
            else{
                errCallback(requestData.errMsg)
            }
        },
        fail: (error) => {
            errCallback(requestData.errMsg)
        },
        complete: (msg) => {}
    })
}

export function doubaoseedance2_0(){
    var zhuqueUrl = '/zhuque/'
    var apiPath = "api/v1/doubao/create"
    var requestUrl = `${zhuqueUrl}${apiPath}`
    var Body=[]
    Body.push({
        type:'text',
        text:"全程使用视频1的第一视角构图，全程使用音频1作为背景音乐。第一人称视角果茶宣传广告，seedance牌「苹苹安安」苹果果茶限定款；首帧为图片1，你的手摘下一颗带晨露的阿克苏红苹果，轻脆的苹果碰撞声；2-4 秒：快速切镜，你的手将苹果块投入雪克杯，加入冰块与茶底，用力摇晃，冰块碰撞声与摇晃声卡点轻快鼓点，背景音：「鲜切现摇」；4-6 秒：第一人称成品特写，分层果茶倒入透明杯，你的手轻挤奶盖在顶部铺展，在杯身贴上粉红包标，镜头拉近看奶盖与果茶的分层纹理；6-8 秒：第一人称手持举杯，你将图片2中的果茶举到镜头前（模拟递到观众面前的视角），杯身标签清晰可见，背景音「来一口鲜爽」，尾帧定格为图片2。背景声音统一为女生音色。"
    })
    Body.push({
        type:'image_url',
        image_url:{
            url:'https://ark-project.tos-cn-beijing.volces.com/doc_image/r2v_tea_pic1.jpg'
        },
        role: "reference_image"
    })
    Body.push({
        type:'image_url',
        image_url:{
            url:'https://ark-project.tos-cn-beijing.volces.com/doc_image/r2v_tea_pic2.jpg'
        },
        role: "reference_image"
    })
    Body.push({
        type:'video_url',
        video_url:{
            url:'https://ark-project.tos-cn-beijing.volces.com/doc_video/r2v_tea_video1.mp4'
        },
        role: "reference_video"
    })
    Body.push({
        type:'audio_url',
        audio_url:{
            url:'https://ark-project.tos-cn-beijing.volces.com/doc_audio/r2v_tea_audio1.mp3'
        },
        role: "reference_audio"
    })
    uni.request({
        url: requestUrl,
        method: "POST",
        header: {
            'Authorization': `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiYjk3MzkxZjk4ZmVlNDFkNDhhNThkY2E0NGU5NzM3NDkiLCJleHAiOjIwODg0OTY0NjF9.RMyCezKyRpZ7GRGoCg8qlqCHNKNcZpOMS4J2TOZfLlQ`,
            'Content-Type': 'application/json',
        },
        dataType: "json",
        timeout: 300000,
        data: {
            model:"ep-20260307130721-bx7tv",
            content:Body,
            generate_audio:true,
            resolution:'720p',
            ratio: "16:9",
            duration:10,
            watermark: false
        },
        success: (requestData) => {
              console.error("2.0生成成功", requestData)
              if(requestData.statusCode==200){
                   setTimeout(()=>{
                        doubaocheckVideoTask2_0(requestData.data.id)
                    },5000)
              }
            // if(requestData.statusCode==200){
            //     doubaocheckVideoTask(requestData.data.id,callback,errCallback)
            // }
            // else{
            //     errCallback(requestData.errMsg)
            // }
        },
        fail: (error) => {
            // errCallback(requestData.errMsg)
        },
        complete: (msg) => {}
    })
}

export function doubaocheckVideoTask2_0(taskid){
    var zhuqueUrl = '/zhuque/'
    var apiPath = "api/v1/doubao/get_result"
    var requestUrl = `${zhuqueUrl}${apiPath}`
    uni.request({
        url: requestUrl,
        method: "POST",
        header: {
            'Authorization': `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiYjk3MzkxZjk4ZmVlNDFkNDhhNThkY2E0NGU5NzM3NDkiLCJleHAiOjIwODg0OTY0NjF9.RMyCezKyRpZ7GRGoCg8qlqCHNKNcZpOMS4J2TOZfLlQ`,
            'Content-Type': 'application/json',
        },
        dataType: "json",
        timeout: 60000,
        data:{
            id:taskid
        },
        success: (requestData) => {
            console.log('检查任务状态：',requestData)
            if(requestData.statusCode==200){
                if(requestData.data.status=='succeeded'){
                   
                }
                else if(requestData.data.status=='queued' || requestData.data.status=='running'){
                    setTimeout(()=>{
                        doubaocheckVideoTask2_0(taskid)
                    },5000)
                }
                else{

                }
            }
            // if(requestData.statusCode==200){

            //     if(requestData.data.status=='succeeded'){
            //         callback(requestData.data.content.video_url)
            //     }
            //     else if(requestData.data.status=='queued' || requestData.data.status=='running'){
            //         setTimeout(()=>{
            //             doubaocheckVideoTask2_0(id,callback,errorCallback)
            //         },5000)
            //     }
            //     else{
            //         errorCallback(requestData.data.status)
            //     }
            // }
            // else{
            //     errorCallback(requestData.errMsg)
            // }
        },
        fail: (error) => {
            // errorCallback(error)
        },
        complete: (msg) => {}
    })
}


// 检查豆包视频任务状态
function doubaocheckVideoTask(id,callback,errorCallback){
    var apiPath = "api/v3/contents/generations/tasks/"+id
    var requestUrl = `${doubaoserverUrl}${apiPath}`
    uni.request({
        url: requestUrl,
        method: "GET",
        header: {
            'Authorization': `Bearer ${doubaoapikey}`,
            'Content-Type': 'application/json',
        },
        dataType: "json",
        timeout: 60000,
        success: (requestData) => {
            if(requestData.statusCode==200){
                if(requestData.data.status=='succeeded'){
                    callback(requestData.data.content.video_url)
                }
                else if(requestData.data.status=='queued' || requestData.data.status=='running'){
                    setTimeout(()=>{
                        doubaocheckVideoTask(id,callback,errorCallback)
                    },5000)
                }
                else{
                    errorCallback(requestData.data.status)
                }
            }
            else{
                errorCallback(requestData.errMsg)
            }
        },
        fail: (error) => {
            errorCallback(error)
        },
        complete: (msg) => {}
    })
}

//豆包5.0lite文生图
export function doubaoseedream5_0_liteTextImage(){
        var apiPath = "api/v3/images/generations"
    var requestUrl = `${doubaoserverUrl}${apiPath}`
    var tempSize='1600x2848'
    switch(ratio){
        case '9:16':
            if(resolution=='2K'){
                tempSize='1600x2848'
            }
            else if(resolution=='3K'){
                tempSize='2304x4096'
            }
            break;
        case '16:9':
            if(resolution=='2K'){
                tempSize='2848x1600'
            }
            else if(resolution=='3K'){
                tempSize='4096x2304'
            }
            break;
        case '3:4':
            if(resolution=='2K'){
                tempSize='1728x2304'
            }
            else if(resolution=='3K'){
                tempSize='2592x3456'
            }
            break;
        case '4:3':
            if(resolution=='2K'){
                tempSize='2304x1728'
            }
            else if(resolution=='3K'){
                tempSize='3456x2592'
            }
            break;
        case '1:1':
            if(resolution=='2K'){
                tempSize='2048x2048'
            }
            else if(resolution=='3K'){
                tempSize='3072x3072'
            }
            break;
    }
    uni.request({
        url: requestUrl,
        method: "POST",
        header: {
            'Authorization': `Bearer ${doubaoapikey}`,
            'Content-Type': 'application/json',
        },
        dataType: "json",
        timeout: 300000,
        data: {
            model:"doubao-seedream-5-0-260128",
            prompt:combineSP,
            size:tempSize,
            watermark: false
        },
        success: (requestData) => {
            if(requestData.statusCode==200){
                callback(requestData.data.data[0].url)
            }
            else{
                errorCallback(requestData.errMsg)
            }
        },
        fail: (error) => {
            errorCallback(error)
        },
        complete: (msg) => {}
    })
}

//可灵O3 文生图
export function KirinV3OmniTextImage(config,callback,errorCallback){
    var apiPath = "model/v1/generation"
    var requestUrl = `${serverUrl}${apiPath}`
    uni.request({
        url: requestUrl,
        method: "POST",
        header: {
            'Authorization': `Bearer ${apikey}`,
            'Content-Type': 'application/json',
        },
        dataType: "json",
        timeout: 60000,
        data: {
            model:"kirin_v3_omni_image",
            input:[
                {
                    params:{
                        prompt: config.sp,
                        resolution:'1k',
                        aspect_ratio: '9:16',
                        watermark_info: {
                            enabled: false,
                        }
                    }
                }
            ]
        },
        success: (requestData) => {
            if(requestData.statusCode==200){
                // console.log('ViduQ2成功==',requestData.data)
                checkVideoTask(requestData.data.id,callback,errorCallback)
                //callback(requestData.data)
            }
            else{
                errorCallback(requestData.errMsg)
            }
        },
        fail: (error) => {
            errorCallback(error)
        },
        complete: (msg) => {}
    })
}
//香蕉2 文生图
export function Banana2TextImage(config,callback,errorCallback){
    var apiPath = "model/v1/generation"
    var requestUrl = `${serverUrl}${apiPath}`
    // var tempSize='1600x2848'
    // switch(ratio){
    // case '9:16':
    //     tempSize='768x1344'
    //     break;
    // case '16:9':
    //     tempSize='1344x768'
    //     break;
    // case '3:4':
    //      tempSize='864x1184'
    //     break;
    // case '4:3':
    //     tempSize='1184x864'
    //     break;
    // case '1:1':
    //     tempSize='1024x1024'
    //     break;
    // }
    uni.request({
        url: requestUrl,
        method: "POST",
        header: {
            'Authorization': `Bearer ${apikey}`,
            'Content-Type': 'application/json',
        },
        dataType: "json",
        timeout: 60000,
        data: {
            model:"nano_banana_2",
            input:[
                {
                    params:{
                        prompt: config.sp,
                        resolution: '2K',
                        aspect_ratio: config.ratio,
                        watermark: false
                    }
                }
            ]
        },
        success: (requestData) => {
            if(requestData.statusCode==200){
                //  console.log('Banana==',requestData.data)
                 checkVideoTask(requestData.data.id,callback,errorCallback)
            }
            else{
                errorCallback(requestData.errMsg)
            }
        },
        fail: (error) => {
            errorCallback(error)
        },
        complete: (msg) => {}
    })
}
//香蕉pro 文生图
export function BananaProTextImage(config,callback,errorCallback){
    var apiPath = "model/v1/generation"
    var requestUrl = `${serverUrl}${apiPath}`
    uni.request({
        url: requestUrl,
        method: "POST",
        header: {
            'Authorization': `Bearer ${apikey}`,
            'Content-Type': 'application/json',
        },
        dataType: "json",
        timeout: 60000,
        data: {
            model:"nano_banana_pro",
            input:[
                {
                    params:{
                        prompt: config.sp,
                        resolution: "2k",
                        aspect_ratio: config.ratio,
                        watermark: false
                    }
                }
            ]
        },
        success: (requestData) => {
            if(requestData.statusCode==200){
                //  console.log('Banana==',requestData.data)
                 checkVideoTask(requestData.data.id,callback,errorCallback)
            }
            else{
                errorCallback(requestData.errMsg)
            }
        },
        fail: (error) => {
            errorCallback(error)
        },
        complete: (msg) => {}
    })
}



//海外豆包1.5生视频
export function aboardDoubaoseedance1_5(config){
    return new Promise((resolve,reject)=>{
        const bodycontent=[
            {
                type:"text",
                text:config.sp
            },
            ...config.imageurls.map(i=>{
                return {
                    type:"image_url",
                    image_url:{
                        url:i
                    },
                }
            })
        ]

        const params={
            content:bodycontent,
            resolution: config.resolution?.toLocaleLowerCase(),
            ratio: config.ratio,
            duration: config.time,
            watermark: false,
        }

        var requestUrl = `${aboardDoubaoserverUrl}/api/v3/contents/generations/tasks`
        uni.request({
            url: requestUrl,
            method: "POST",
            header: {
                'Authorization': `Bearer ${doubaoapikey}`,
                'Content-Type': 'application/json',
            },
            dataType: "json",
            timeout: 30000,
            data: {
                "model": "ep-20260401171940-qgc2m",
                ...params,
            },
            success: (requestData) => {
                //  console.error("生成成功", requestData)
                if(requestData.statusCode==200 && requestData.data?.id){
                     const params={
                        projectId:config.projectId,
                        episodesId:config.episodesId,
                        cameraId:config.cameraId,
                        type:3,
                        status:0,
                        typeId:5,
                        taskId:requestData.data.id,
                    }

                    postRequest(APIPath.aiTask,params,(res)=>{
                        resolve({
                            id:res.data,
                            ...params,
                        })

                        const _interval = setInterval(()=>{
							aboardDoubaocheckVideoTask({id:res.data,...params})
						},5000)
						store.commit('process/REGISTER_TIMER',{tagName:res.data,interval:_interval,extract:params})

                    },(err)=>{})
                }
                else{
                    reject(requestData.errMsg)
                }
            },
            fail: (error) => {
                reject(error)
            },
            complete: (msg) => {}
        })
    })
    
}

// 检查海外豆包视频任务状态
export function aboardDoubaocheckVideoTask(params){
    return new Promise((resolve,reject)=>{
        var requestUrl = `${aboardDoubaoserverUrl}/api/v3/contents/generations/tasks/${params.taskId}`
        uni.request({
            url: requestUrl,
            method: "GET",
            header: {
                'Authorization': `Bearer ${doubaoapikey}`,
                'Content-Type': 'application/json',
            },
            dataType: "json",
            timeout: 60000,
            success: (requestData) => {
                if(requestData.statusCode==200){
                    if(requestData.data.status=='succeeded'){
                        putRequest(APIPath.aiTask,{
                            ...params,
                            status:5,
                            ossUrl:requestData.data.content.video_url,
                        },(res)=>{
                            resolve({
                                url:requestData.data.content.video_url,
                            })                           
                        },(err)=>{})
                        store.commit('process/CLEAR_TIMER',{tagName:params.id})

                        // 下载再上传到OSS
                        transferVideoSync(requestData.data.content.video_url,(url)=>{
                            putRequest(APIPath.aiTask,{
                                ...params,
                                status:5,
                                ossUrl:url,
                            },(res)=>{},(err)=>{})
                        })
                    }
                    else if(requestData.data.status=='queued' || requestData.data.status=='running'){
                        putRequest(APIPath.aiTask,{
                            ...params,
                            status:2
                        },(res)=>{
                            resolve({
                                status:2
                            })
                        },(err)=>{})
                    }
                    else{
                        reject(requestData.data.status)
                        putRequest(APIPath.aiTask,{
                            ...params,
                            status:3
                        },(res)=>{
                            resolve({
                                status:2
                            })
                        },(err)=>{})
                    }
                }
                else{
                    reject(requestData.errMsg)
                }
            },
            fail: (error) => {
                reject(error)
            },
        })
    })
    
}

//海外豆包4.5生图
export function aboardDoubaoSeedream4_5(config){
    return new Promise((resolve,reject)=>{
        
        const params={
            image:config.imageurls,
            prompt: config.sp,
            size: getImageSize(config.ratio, config.resolution),
            watermark: false,
        }

        const taskParams={
            projectId:config.projectId,
            episodesId:config.episodesId,
            cameraId:config.cameraId,
            type:3,
            status:1,
            typeId:4,
            taskId:'',
        }

        const requestUrl = `${aboardDoubaoserverUrl}/api/v3/images/generations`

        postRequest(APIPath.aiTask,taskParams,(res)=>{
            taskParams.id = res.data
            uni.request({
                url: requestUrl,
                method: "POST",
                header: {
                    'Authorization': `Bearer ${doubaoapikey}`,
                    'Content-Type': 'application/json',
                },
                dataType: "json",
                timeout: 300000,
                data: {
                    "model": "ep-20260401171816-wlz62",
                    ...params,
                },
                success: (requestData) => {
                    //  console.error("生成成功", requestData)
                    if(requestData.statusCode==200 && requestData.data.data[0].url){
                        //上传再下载
                        transferVideoSync(requestData.data.data[0].url,(url)=>{
                            putRequest(APIPath.aiTask,{
                                ...taskParams,
                                status:5,
                                ossUrl:url,
                            },(res)=>{
                                resolve({
                                    id:taskParams.id,
                                    url:url,
                                })
                            },(err)=>{})
                        })
                    }
                    else{
                        reject(requestData.errMsg)
                        putRequest(APIPath.aiTask,{
                            ...taskParams,
                            status:3,
                        },(res)=>{
                        },(err)=>{})
                    }
                },
                fail: (error) => {
                    reject(error)
                    putRequest(APIPath.aiTask,{
                        ...taskParams,
                        status:3,
                    },(res)=>{
                    },(err)=>{})
                },
                complete: (msg) => {}
            })

        },(err)=>{})
    })
    
}

//海外豆包文字理解（流式）
export async function aboardDoubaoChatStream(bodyData,callback,callbackChunk,errorCallback){

    var requestUrl = `${aboardDoubaoserverUrl}/api/v3/chat/completions`
    const response =  await fetch(requestUrl,{
        method:'POST',
        headers: {
            'Authorization': `Bearer ${doubaoapikey}`,
            'Content-Type': 'application/json',
            'Accept': 'text/event-stream',
			'Cache-Control': 'no-cache',
        },
        body: JSON.stringify({
            model:"ep-20260401171555-46n4s",
            max_tokens:32768,
            messages:bodyData.messages,
            stream : true,
            thinking:{
                type:'disabled'//enabled开启思考，disabled关闭思考，auto自动
            }
        }),
    })
    if (!response.ok) {
		if(errorCallback){
			errorCallback(response.status)
		}
		console.log('请求失败=='+response.status)
		throw new Error(`HTTP error! status: ${response.status}`);
	}
    const reader = response.body.getReader();
	const decoder = new TextDecoder();
    let output = ''
    while (true){
        const { done, value } = await reader.read()
        if (done) {
            console.log(done)
			break
		}
        var text = decoder.decode(value, { stream: true })
         let cleanedText =text.replace(/^\s+|\s+$/g, ''); 
        let lines = cleanedText.split(/\n{2,}/);
        for (let index = 0; index < lines.length; index++) {
             const element = lines[index]
              if(element.startsWith("data:")){
                let json=element.slice(6)
                 if(json === "[DONE]"){
                    console.log('DONE')
                 }
                 else{
                    let choiceDalta=JSON.parse(json)
                     for (let index = 0; index < choiceDalta.choices.length; index++){
                          const content = choiceDalta.choices[index].delta.content;
                          output+=content
                          if(content){
                            // console.log('chunk==',content)
                            if(callbackChunk){
                                callbackChunk(content)
                            }
                          }
                     }
                 }
              }
        }
    }
    callback(output)
}