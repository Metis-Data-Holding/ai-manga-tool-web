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
          if (roles.includes("demo_personal")) {
            resolve(
              data.rows.filter((i) => {
                if (i.modelType == "1" && i.id != 16) {
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
