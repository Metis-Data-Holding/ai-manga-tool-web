import { APIPath, getRequest, postRequest, putRequest } from "./APIRequest";
import store from "@/store";

// 获取字典
export function GetDict(dictType) {
  return new Promise((resolve, reject) => {
    getRequest(
      `${APIPath.getDict}?pageNum=1&pageSize=300&dictType=${dictType}`,
      (data) => {
        if (data.code == 200) {
          resolve(data.rows || []);
        }
      },
      (error) => {
        resolve;
      },
    );
  });
}

// 获取模型列表
export function GetAIModelList() {
  return new Promise((resolve, reject) => {
    getRequest(
      `${APIPath.getAIModelList}?pageNum=1&pageSize=100`,
      (data) => {
        if (data.code == 200) {
          const roles = store.getters.roles;
          const platformType = store.getters.platformType;
          if (roles.includes("demo_personal")) {
            let ids = ['16',16]
            if(platformType===2){
              ids = ['50','51',50,51];
            }
            resolve(
              data.rows.filter((i) => {
                if (i.modelType == "1" && !ids.includes(i.id)) {
                  return false;
                }
                return true;
              }) || [],
            );
          }
          resolve(data.rows || []);
        }
      },
      (error) => {
        resolve;
      },
    );
  });
}
