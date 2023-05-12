// @vitest-environment jsdom

import { expect, test, vi } from "vitest";
import "vi-fetch/setup";
import { mockFetch, mockGet } from "vi-fetch";
import { baseUri, remoteBaseUri } from "../../src/api/apiHandler";
import {
  fetchLocal,
  fetchRemote,
  fetchUriSettings,
} from "../../src/api/fetchUriSettings";
import { LastReleased, NextRelease, UriSetting } from "../../src/type";

describe("fetchUriSettings", () => {
  beforeEach(() => {
    // localStorage はモック化すべきかも（うまくいかなかったため一旦モックなしで実装）
    localStorage.removeItem("baseUri");
    localStorage.removeItem("remoteBaseUri");
    mockFetch.clearAll();
  });
  afterEach(() => {
    vi.clearAllMocks();
    localStorage.removeItem("baseUri");
    localStorage.removeItem("remoteBaseUri");
  });
  const apiCall = [
    {
      api: fetchLocal,
      baseUrl: "/api",
      remoteBaseUrl: "",
      environment_name: "stg",
      last_released: {
        image_uri: "hogefuga",
        released_at: new Date(),
      } as LastReleased,
      next_release: null,
      service_name: "test1",
    },
    {
      api: fetchRemote,
      baseUrl: "",
      remoteBaseUrl: "http://remote.example.com/api",
      environment_name: "prod",
      last_released: null,
      next_release: {
        image_uri: "testtest",
        release_at: new Date(),
      } as NextRelease,
      service_name: "test2",
    },
  ];
  apiCall.forEach((testCase) => {
    test(`コンテナイメージ一覧（タグ）の取得 API 呼び出し`, async () => {
      localStorage.setItem("baseUri", testCase.baseUrl);
      localStorage.setItem("remoteBaseUri", testCase.remoteBaseUrl);
      const mock = mockGet(
        `${testCase.api === fetchLocal ? baseUri : remoteBaseUri}/uriSettings`
      ).willResolve([
        {
          environment_name: testCase.environment_name,
          last_released: testCase.last_released,
          next_release: testCase.next_release,
          service_name: testCase.service_name,
        },
      ] as UriSetting[]);
      await fetchUriSettings(testCase.api);
      // とりあえず呼び出しが行われたことだけを確認（戻り値は今のところ上手くテストできず）
      expect(mock).toHaveFetched();
    });
  });
});
