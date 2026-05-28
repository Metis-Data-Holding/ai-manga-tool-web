import { APIPath, deleteRequest, getRequest, postRequest, requestUploadHeader } from "./APIRequest";

function parseUploadResponse(response) {
  if (typeof response === "string") {
    return JSON.parse(response);
  }
  return response;
}

export function GetAssetExtractionSession(projectId, callback, errorCallback) {
  getRequest(`${APIPath.assetExtractionSession}?projectId=${encodeURIComponent(projectId)}`, (data) => {
    if (data.code === 200) {
      callback(data.data || null);
    } else if (errorCallback) {
      errorCallback(data.msg);
    }
  }, errorCallback);
}

export function CreateAssetExtractionSession(payload, callback, errorCallback) {
  postRequest(APIPath.assetExtractionSession, payload, (data) => {
    if (data.code === 200) {
      callback(data.data || null);
    } else if (errorCallback) {
      errorCallback(data.msg);
    }
  }, errorCallback);
}

export function ClearAssetExtractionSession(projectId, sessionId, callback, errorCallback) {
  const query = [
    `projectId=${encodeURIComponent(projectId)}`,
    `sessionId=${encodeURIComponent(sessionId)}`,
  ];
  deleteRequest(`${APIPath.assetExtractionSession}?${query.join("&")}`, (data) => {
    if (data.code === 200) {
      callback(data.data || null);
    } else if (errorCallback) {
      errorCallback(data.msg);
    }
  }, errorCallback);
}

export function UploadAssetExtractionScript(projectId, sessionId, filePath, fileName, callback, errorCallback) {
  const query = [`projectId=${encodeURIComponent(projectId)}`];
  if (sessionId) {
    query.push(`sessionId=${encodeURIComponent(sessionId)}`);
  }
  uni.uploadFile({
    url: `/server/${APIPath.assetExtractionScript}?${query.join("&")}`,
    filePath,
    name: "file",
    fileName,
    header: {
      ...requestUploadHeader(),
      Accept: "*/*",
    },
    timeout: 300000,
    success: (res) => {
      try {
        const data = parseUploadResponse(res.data);
        if (res.statusCode === 200 && data.code === 200) {
          callback(data.data || null);
          return;
        }
        if (errorCallback) {
          errorCallback(data.msg || "剧本文档上传失败");
        }
      } catch (error) {
        if (errorCallback) {
          errorCallback(error.message || "剧本文档上传失败");
        }
      }
    },
    fail: (error) => {
      if (errorCallback) {
        errorCallback(error.errMsg || "剧本文档上传失败");
      }
    },
  });
}

export function SendAssetExtractionMessage(payload, callback, errorCallback) {
  postRequest(APIPath.assetExtractionChat, payload, (data) => {
    if (data.code === 200) {
      callback(data.data || null);
    } else if (errorCallback) {
      errorCallback(data.msg);
    }
  }, errorCallback, { timeout: 300000 });
}

export function ClearAssetExtractionScript(projectId, sessionId, callback, errorCallback) {
  const query = [
    `projectId=${encodeURIComponent(projectId)}`,
    `sessionId=${encodeURIComponent(sessionId)}`,
  ];
  deleteRequest(`${APIPath.assetExtractionScript}?${query.join("&")}`, (data) => {
    if (data.code === 200) {
      callback(data.data || null);
    } else if (errorCallback) {
      errorCallback(data.msg);
    }
  }, errorCallback);
}

export function ClearAssetExtractionDrafts(projectId, sessionId, callback, errorCallback) {
  const query = [
    `projectId=${encodeURIComponent(projectId)}`,
    `sessionId=${encodeURIComponent(sessionId)}`,
  ];
  deleteRequest(`${APIPath.assetExtractionDrafts}?${query.join("&")}`, (data) => {
    if (data.code === 200) {
      callback(data.data || null);
    } else if (errorCallback) {
      errorCallback(data.msg);
    }
  }, errorCallback);
}

export function ConfirmAssetExtraction(projectId, assets, callback, errorCallback) {
  postRequest(APIPath.assetExtractionConfirm, { projectId, assets }, (data) => {
    if (data.code === 200) {
      callback(data.data || null);
    } else if (errorCallback) {
      errorCallback(data.msg);
    }
  }, errorCallback, { timeout: 300000 });
}
