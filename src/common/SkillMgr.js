import app from "@/App.vue";
import { APIPath, deleteRequest, getRequest, postRequest, putRequest, requestUploadHeader } from "./APIRequest";
import { buildSkillListQuery } from "./SkillFormatter.mjs";

const _app = app;

function parseUploadResponse(response) {
  if (typeof response === "string") {
    return JSON.parse(response);
  }
  return response;
}

export function GetSkillList(params, callback, errorCallback) {
  const apiPath = `${APIPath.skillList}?${buildSkillListQuery(params)}`;
  getRequest(apiPath, (data) => {
    if (data.code === 200) {
      callback({
        rows: data.rows || [],
        total: data.total || 0,
      });
    } else if (errorCallback) {
      errorCallback(data.msg);
    }
  }, errorCallback);
}

export function InstallSkillPackage(filePath, fileName, callback, errorCallback) {
  uni.uploadFile({
    url: `/server/${APIPath.skillInstall}`,
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
          callback(data.data);
          return;
        }
        if (errorCallback) {
          errorCallback(data.msg || "安装 Skill 失败");
        }
      } catch (error) {
        if (errorCallback) {
          errorCallback(error.message || "安装 Skill 失败");
        }
      }
    },
    fail: (error) => {
      if (errorCallback) {
        errorCallback(error.errMsg || "安装 Skill 失败");
      }
    },
  });
}

export function UpdateSkillStatus(skill, status, callback, errorCallback) {
  putRequest(
    APIPath.skillDetail,
    {
      id: skill.id,
      name: skill.name,
      description: skill.description,
      status,
    },
    (data) => {
      if (data.code === 200) {
        callback(data.data);
      } else if (errorCallback) {
        errorCallback(data.msg);
      }
    },
    errorCallback
  );
}

export function GetSkillDetail(id, callback, errorCallback) {
  getRequest(`${APIPath.skillDetail}/${id}`, (data) => {
    if (data.code === 200) {
      callback(data.data || {});
    } else if (errorCallback) {
      errorCallback(data.msg);
    }
  }, errorCallback);
}

export function UpdateSkillBasic(skill, callback, errorCallback) {
  putRequest(
    APIPath.skillDetail,
    {
      id: skill.id,
      name: skill.name,
      description: skill.description,
      status: skill.status,
    },
    (data) => {
      if (data.code === 200) {
        callback(data.data);
      } else if (errorCallback) {
        errorCallback(data.msg);
      }
    },
    errorCallback
  );
}

export function SaveSkillDraftFile(id, path, content, callback, errorCallback) {
  putRequest(
    `${APIPath.skillDetail}/${id}/draft/file`,
    {
      path,
      content,
    },
    (data) => {
      if (data.code === 200) {
        callback(data.data);
      } else if (errorCallback) {
        errorCallback(data.msg);
      }
    },
    errorCallback
  );
}

export function PublishSkillDraft(id, callback, errorCallback) {
  postRequest(`${APIPath.skillDetail}/${id}/publish`, {}, (data) => {
    if (data.code === 200) {
      callback(data.data);
    } else if (errorCallback) {
      errorCallback(data.msg);
    }
  }, errorCallback);
}

export function DeleteSkills(ids, callback, errorCallback) {
  deleteRequest(`${APIPath.skillDetail}/${ids.join(",")}`, (data) => {
    if (data.code === 200) {
      callback(data.data);
    } else if (errorCallback) {
      errorCallback(data.msg);
    }
  }, errorCallback);
}

export function refreshSkillTokenFromCache() {
  const cacheToken = uni.getStorageSync("aigc_token");
  if (cacheToken) {
    _app.userInfoData.accessToken = cacheToken;
  }
}
