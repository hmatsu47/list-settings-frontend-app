import { ErrorResponse, UriSetting } from "../type";
import { baseUri, remoteBaseUri, getApiData } from "./apiHandler";
import {
  message,
  messageSeverity,
  setMessage,
  setMessageSeverity,
  setRemoteServices,
  setServices,
  setUriRemoteSettings,
  setUriSettings,
} from "../signal";

// サービス名をユニーク化
const getUniqueServices = (data: UriSetting[]) => {
  const tempSetting = data.map((o) => {
    return o.service_name;
  });
  return [...new Set(tempSetting)];
};
// Local API or Remote API
const local = 1;

export const fetchImages = async (api: number) => {
  const load = async (): Promise<void> => {
    const data: UriSetting[] | ErrorResponse = await getApiData(
      `${api === local ? baseUri : remoteBaseUri}/uriSettings`
    );
    if (
      typeof data === "object" &&
      data !== null &&
      typeof (data as ErrorResponse).message === "string"
    ) {
      // 戻り値がエラーメッセージの場合
      if (api === local) {
        setServices(undefined);
        setUriSettings(undefined);
      } else {
        setRemoteServices(undefined);
        setUriRemoteSettings(undefined);
      }
      // すでにエラーメッセージがセットされている場合は連結する（複数 API を続けて呼び出すため）
      const tempMessage =
        message() && messageSeverity() === "error" ? message() : "";

      setMessage(`${tempMessage}${(data as ErrorResponse).message}`);
      setMessageSeverity("error");
      return;
    }
    if (api === local) {
      setUriSettings(data as UriSetting[]);
      setServices(getUniqueServices(data as UriSetting[]));
    } else {
      setUriRemoteSettings(data as UriSetting[]);
      setRemoteServices(getUniqueServices(data as UriSetting[]));
    }
    // エラーメッセージは上書きしない
  };
  void load();
};
