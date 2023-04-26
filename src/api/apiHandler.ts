import { fetchWithTimeout } from "./fetchWithTimeout";

// ベース URI
export const baseUri = "/api";
export const baseUriTag = "/api";
export const remoteBaseUri = localStorage.getItem("remoteBaseUri");
export const remoteBaseUriTag = localStorage.getItem("remoteBaseUriTag");

// API からデータ取得（GET）
export const getApiData = async (url: string) => {
  return await (await fetchWithTimeout("GET", url)).json();
};
