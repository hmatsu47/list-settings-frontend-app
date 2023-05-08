import { fetchWithTimeout } from "./fetchWithTimeout";

// ベース URI
export const baseUri = localStorage.getItem("baseUri");
export const remoteBaseUri = localStorage.getItem("remoteBaseUri");

// API からデータ取得（GET）
export const getApiData = async (url: string) => {
  return await (await fetchWithTimeout("GET", url)).json();
};
