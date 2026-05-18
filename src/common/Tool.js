import app from "@/App.vue";
// utils/sortUtils.optimized.js
import { pinyin } from 'pinyin-pro';
import Compressor from 'compressorjs';
const _app = app;

export function isNull(obj) {
  return obj === null || obj === undefined || obj === "";
}

export function UploadFile(filePath, callback,options={showLoading:true}) {
  let cacheToken = uni.getStorageSync("aigc_token");
  if (isNull(cacheToken)) {
    _app.userInfoData.accessToken = cacheToken;
  }
  options.showLoading && uni.showLoading({
    title: "上传中",
    mask: true,
  });
  uni.uploadFile({
    url: "/server/resource/oss/upload",
    filePath: filePath,
    name: "file",
    header: {
      Accept: "*/*",
      Product: "aimanju",
      Authorization: "Bearer " + _app.userInfoData.accessToken,
      clientId: "e5cd7e4891bf95d1d19206ce24a7b32e",
    },
    timeout: 300000,
    success: function (res) {
      options.showLoading && uni.hideLoading();
      if (res.statusCode == 200) {
        let data = JSON.parse(res.data);
        if (data.code == 200) {
          callback(data.data.url);
        }else if(data.msg=='Maximum upload size exceeded'){
          uni.showToast({
            title: "文件大小已超限制",
            icon: "none",
          });
        }else {
          uni.showToast({
            title: "上传文件失败，请重试",
            icon: "none",
          });
        }
      }else {
        uni.showToast({
          title: "上传文件失败，请重试",
          icon: "none",
        });
      }
    },
    fail: function (res) {
      options.showLoading && uni.hideLoading();
      uni.showToast({
        title: "上传文件失败，请重试",
        icon: "none",
      });
    },
  });
}

export function getCurrentTimeFormatted() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  const hours = String(now.getHours()).padStart(2, "0");
  const minutes = String(now.getMinutes()).padStart(2, "0");
  const seconds = String(now.getSeconds()).padStart(2, "0");
  const milliseconds = String(now.getMilliseconds()).padStart(2, "0");
  return `${year}_${month}_${day}_${hours}_${minutes}_${seconds}_${milliseconds}`;
}

//两个数组合并去重
export function mergeAndDeduplicateObjectArrays(arr1, arr2, key = "imageUrl") {
  const keyMap = new Map();
  const mergedArray = [...arr1, ...arr2];
  const result = [];

  for (const item of mergedArray) {
    if (typeof item === "object" && item !== null && key in item) {
      const uniqueKey = item[key];
      if (!keyMap.has(uniqueKey)) {
        keyMap.set(uniqueKey, true);
        result.push(item);
      }
    } else {
    }
  }

  return result;
}

export function exportJsonFunc(jsonData, fileName) {
  try {
    const jsonStr = JSON.stringify(jsonData, null, 2);
    const blob = new Blob([jsonStr], { type: "application/json" });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = fileName;
    link.style.display = "none";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
    uni.showToast({
      title: "文件导出成功",
      icon: "success",
    });
  } catch (error) {
    console.error("保存JSON文件失败：", error);
    uni.showToast({
      title: "导出失败，请重试",
      icon: "none",
    });
  }
}

//导入分集剧本并按格式分割
export function splitDramaByEpisode(content) {
  const episodeRegex = /第\d+集[\s\S]*?(?=第\d+集|$)/g;
  const episodeArray = content.match(episodeRegex) || [];
  return episodeArray.map((episode) => episode.trim());
}

export function getImageSize(ratio, resolution) {
  var tempSize = "1600x2848";
  switch (ratio) {
    case "9:16":
      if (resolution == "2K") {
        tempSize = "1600x2848";
      } else if (resolution == "3K") {
        tempSize = "2304x4096";
      }
      break;
    case "16:9":
      if (resolution == "2K") {
        tempSize = "2848x1600";
      } else if (resolution == "3K") {
        tempSize = "4096x2304";
      }
      break;
    case "3:4":
      if (resolution == "2K") {
        tempSize = "1728x2304";
      } else if (resolution == "3K") {
        tempSize = "2592x3456";
      }
      break;
    case "4:3":
      if (resolution == "2K") {
        tempSize = "2304x1728";
      } else if (resolution == "3K") {
        tempSize = "3456x2592";
      }
      break;
    case "1:1":
      if (resolution == "2K") {
        tempSize = "2048x2048";
      } else if (resolution == "3K") {
        tempSize = "3072x3072";
      }
      break;
  }
  return tempSize;
}


export function checkMediaType(url) {
  if(!url){
    return 'unknown';
  }
  // 定义支持的图片和视频扩展名（小写）
  const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'bmp', 'tiff'];
  const videoExtensions = ['mp4', 'avi', 'mov', 'wmv', 'mkv', 'flv', 'webm', 'rmvb'];
  const audioExtensions = ['mp3', 'wav', 'aac', 'flac', 'ogg', 'm4a'];
  let path = url;
  try {
    // 1. 解析 URL，去除参数和锚点
    if(/http|https/.test(url)){
      const parsedUrl = new URL(url);
      path = parsedUrl.pathname.split('?')[0]; // 去除查询参数
      path && (path = path.split('#')[0]); // 去除锚点
    }

    // 2. 提取文件名和扩展名
    const filename = path.split('/').pop() || '';
    const extension = filename.split('.').pop().toLowerCase();

    // 3. 判断类型
    if (imageExtensions.includes(extension)) {
      return 'image';
    } else if (videoExtensions.includes(extension)) {
      return 'video';
    }else if (audioExtensions.includes(extension)) {
      return 'audio';
    }
  } catch (e) {
    console.error('无效的 URL:', e);
  }

  // 未匹配到类型
  return 'unknown';
}

export const transferVideoSync = async (url,callback) => {
    //需在vite.config配置代理
    if(process.env.NODE_ENV=='development'){
      url = url.replace('https://ark-content-generation-ap-southeast-1.tos-ap-southeast-1.volces.com','/download-doubao')
    }
    try {
      // 获取视频二进制数据
      const response = await fetch(url);
      const blob = await response.blob();

      // 生成临时URL（内存地址）
      const tempUrl = URL.createObjectURL(blob);
      // console.log('临时路径:', tempUrl);

      UploadFile(tempUrl,(url)=>{
        // 释放内存（关键！避免内存泄漏）
        URL.revokeObjectURL(tempUrl);
        callback(url)
      },{showLoading:false})
      // return tempUrl;
    } catch (error) {
      console.error('下载失败:', error);
    }
}

// 浏览器端：把 File/Blob 直接以 multipart/form-data 上传到后端，返回 Promise<string>（url）
export function uploadFileToServer(file, options = { showLoading: true }) {
  return new Promise(async (resolve, reject) => {
	  
	const uploadFail = () =>{
		uni.showToast({
		  title: "上传文件失败，请重试",
		  icon: "none",
		});
	}
	  
    try {
      const token = uni.getStorageSync('aigc_token') || '';
      const filename = file.name || `img_${Date.now()}.${(file.type && file.type.split('/')[1]) || 'jpg'}`;

      const form = new FormData();
      form.append('file', file, filename);

      options.showLoading && uni.showLoading({ title: '上传中', mask: true });

      const headers = {
        Accept: '*/*',
        Product: 'aimanju',
        Authorization: token ? 'Bearer ' + token : '',
        clientId: 'e5cd7e4891bf95d1d19206ce24a7b32e'
      };

      const res = await fetch('/server/resource/oss/upload', {
        method: 'POST',
        body: form,
        headers
      });

      options.showLoading && uni.hideLoading();

      if (!res.ok) {
		  uploadFail()
		  return reject(new Error('上传失败: HTTP ' + res.status));
	  }
      const text = await res.text();
      const data = JSON.parse(text || '{}');
      if (data && data.code == 200) {
        resolve(data.data?.url)
      } else if(data && data.msg == "Maximum upload size exceeded"){
		uni.showToast({
			title: "文件大小已超限制",
			icon: "none",
		});
	  }else{
		uploadFail()
        reject(new Error('上传失败: ' + (data?.msg || '未知错误')));
      }
    } catch (err) {
      options.showLoading && uni.hideLoading();
	  uploadFail()
      reject(err);
    }
  });
}

/**
 * 带缓存的拼音排序工具
 */
export const optimizedSortUtils = {
  // 拼音缓存
  pinyinCache: new Map(),
  
  /**
   * 获取拼音首字母（带缓存）
   */
  getPinyinFirstLetter(str) {
    if (!str) return '#';
    
    // 检查缓存
    if (this.pinyinCache.has(str)) {
      return this.pinyinCache.get(str);
    }
    
    const firstChar = str.charAt(0);
    
    // 如果是英文字母，直接返回大写
    if (/^[a-zA-Z]$/.test(firstChar)) {
      const result = firstChar.toUpperCase();
      this.pinyinCache.set(str, result);
      return result;
    }
    
    // 如果是数字，返回 '#'
    if (/^\d$/.test(firstChar)) {
      this.pinyinCache.set(str, '#');
      return '#';
    }
    
    try {
      const py = pinyin(firstChar, {
        pattern: 'first',
        toneType: 'none',
        type: 'string'
      });
      
      const result = py.toUpperCase();
      this.pinyinCache.set(str, result);
      return result;
    } catch (error) {
      const result = '#';
      this.pinyinCache.set(str, result);
      return result;
    }
  },

  /**
   * 批量排序（适合大数据量）
   * @param {Array} array - 要排序的数组
   * @param {String} key - 排序字段
   * @returns {Array} 排序后的数组
   */
  batchSort(array, key = null) {
    // 预处理：为每个元素计算排序权重
    const processed = array.map((item, index) => {
      const str = key ? item[key] : item;
      const s = String(str || '');
      const firstChar = s.charAt(0);
      const isNumber = /^\d/.test(firstChar);
      
      return {
        original: item,
        str: s,
        isNumber,
        pinyin: isNumber ? '#' : this.getPinyinFirstLetter(s),
        numberValue: isNumber ? this.extractLeadingNumber(s) : Infinity,
        originalIndex: index // 保持稳定排序
      };
    });
    
    // 排序
    processed.sort((a, b) => {
      // 字母 vs 字母
      if (!a.isNumber && !b.isNumber) {
        if (a.pinyin !== b.pinyin) {
          return a.pinyin.localeCompare(b.pinyin);
        }
        return a.str.toLowerCase().localeCompare(b.str.toLowerCase());
      }
      
      // 字母 vs 数字
      if (!a.isNumber && b.isNumber) return -1;
      if (a.isNumber && !b.isNumber) return 1;
      
      // 数字 vs 数字
      if (a.numberValue !== b.numberValue) {
        return a.numberValue - b.numberValue;
      }
      
      return a.originalIndex - b.originalIndex;
    });
    
    // 返回原始数据
    return processed.map(item => item.original);
  },

  extractLeadingNumber(str) {
    const match = String(str).match(/^(\d+)/);
    return match ? parseInt(match[1], 10) : 0;
  }
};

/**
 * 深度比较两个对象的属性是否完全相同
 * 一旦发现属性不一致立即返回 false
 * @param {any} obj1 - 第一个对象
 * @param {any} obj2 - 第二个对象
 * @returns {boolean} - 是否完全相同
 */
export function deepEqualFast(obj1, obj2) {
  // 1. 严格相等（包括引用相同）
  if (obj1 === obj2) return true;
  
  // 2. 处理 null 或 undefined
  if (obj1 == null || obj2 == null) return obj1 === obj2;
  
  // 3. 类型不同，立即返回 false
  if (typeof obj1 !== typeof obj2) return false;
  
  // 4. 处理日期对象
  if (obj1 instanceof Date && obj2 instanceof Date) {
    return obj1.getTime() === obj2.getTime();
  }
  
  // 5. 处理正则表达式
  if (obj1 instanceof RegExp && obj2 instanceof RegExp) {
    return obj1.toString() === obj2.toString();
  }
  
  // 6. 处理数组
  if (Array.isArray(obj1) && Array.isArray(obj2)) {
    // 长度不同，立即返回 false
    if (obj1.length !== obj2.length) return false;
    
    // 逐个比较数组元素，发现不同立即返回 false
    for (let i = 0; i < obj1.length; i++) {
      if (!deepEqualFast(obj1[i], obj2[i])) {
        return false; // 立即返回
      }
    }
    return true;
  }
  
  // 7. 如果不是对象（此时已经排除了数组和null）
  if (typeof obj1 !== 'object' || typeof obj2 !== 'object') {
    // 特殊处理 NaN（NaN !== NaN，但我们认为两个 NaN 相等）
    if (Number.isNaN(obj1) && Number.isNaN(obj2)) return true;
    return false;
  }
  
  // 8. 处理普通对象
  const keys1 = Object.keys(obj1);
  const keys2 = Object.keys(obj2);
  
  // 属性数量不同，立即返回 false
  if (keys1.length !== keys2.length) return false;
  
  // 检查每个属性
  for (const key of keys1) {
    // 如果 obj2 没有该属性，立即返回 false
    if (!Object.prototype.hasOwnProperty.call(obj2, key)) {
      return false;
    }
    
    // 递归比较属性值，发现不同立即返回 false
    if (!deepEqualFast(obj1[key], obj2[key])) {
      return false; // 立即返回
    }
  }
  
  return true;
}

// 将网络URL转为 File 对象 (H5端需注意跨域)
export const urlToFile = async (url, filename) => {
  const response = await fetch(url, { mode: 'cors' });
  const blob = await response.blob();
  return new File([blob], filename, { type: blob.type });
}

// 转换格式核心函数
export const convertImageFormat = (file, targetFormat) => {
  return new Promise((resolve, reject) => {
    new Compressor(file, {
      mimeType: targetFormat, // 目标格式
      quality: 1,          // 图片质量 (0-1)
      success(result) {
        resolve(result); // result 即为转换后的 Blob 文件对象
      },
      error(err) {
        reject(err);
      },
    });
  });
}

// 创建a链接下载文件
export const downloadFile = (blob, filename) => {
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(link.href);
};

/**
 * 解析分辨率：画幅比例 + 清晰度等级
 * @param {number} width
 * @param {number} height
 * @returns {object}
 */
export function parseResolution(width, height) {
    const ratio = width / height;

    // ✅ 支持的画幅比例（含横屏 & 竖屏）
    const commonRatios = [
        { name: '1:1', value: 1 },
        { name: '4:3', value: 4 / 3 },
        { name: '3:4', value: 3 / 4 },
        { name: '3:2', value: 3 / 2 },
        { name: '2:3', value: 2 / 3 },
        { name: '16:9', value: 16 / 9 },
        { name: '9:16', value: 9 / 16 },
        { name: '21:9', value: 21 / 9 }
    ];

    let standardRatio = 'Unknown';
    for (const r of commonRatios) {
        if (Math.abs(ratio - r.value) < 0.01) {
            standardRatio = r.name;
            break;
        }
    }

    const totalPixels = width * height;

    // ✅ 清晰度分级
    let level = 'Low Res';
    if (totalPixels >= 3840 * 2160) {
        level = '4K';
    } else if (totalPixels >= 2560 * 1440) {
        level = '2K';
    } else if (totalPixels >= 1920 * 1080) {
        level = '1080p';
    } else if (totalPixels >= 1280 * 720) {
        level = '720p';
    }

    return {
        resolution: `${width}×${height}`,
        ratio: ratio.toFixed(3),
        orientation: width >= height ? 'Landscape' : 'Portrait',
        standardRatio,
        level,
        totalPixels
    };
}

export async function copyText(text) {
  try {
    await navigator.clipboard.writeText(text);
    uni.showToast({
      title: '复制成功',
      icon: 'none'
    });
  } catch (err) {
    console.error('复制失败:', err);
  }
}