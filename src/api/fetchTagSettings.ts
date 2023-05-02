import { ErrorResponse, TagSetting } from "../type";
import { baseUri, getApiData } from "./apiHandler";
import {
  message,
  messageSeverity,
  setMessage,
  setMessageSeverity,
  setTagSettings,
} from "../signal";

export const fetchTagSettings = async () => {
  const load = async (): Promise<void> => {
    const data: TagSetting[] | ErrorResponse = await getApiData(
      `${baseUri}/tagSettings`
    );
    if (
      typeof data === "object" &&
      data !== null &&
      typeof (data as ErrorResponse).message === "string"
    ) {
      // 戻り値がエラーメッセージの場合
      setTagSettings(undefined);
      // すでにエラーメッセージがセットされている場合は連結する（複数 API を続けて呼び出すため）
      const tempMessage =
        message() && messageSeverity() === "error" ? message() : "";

      setMessage(`${tempMessage}${(data as ErrorResponse).message}`);
      setMessageSeverity("error");
      return;
    }
    setTagSettings(data as TagSetting[]);
    // エラーメッセージは上書きしない
  };
  void load();
};
