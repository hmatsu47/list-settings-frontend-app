// @vitest-environment jsdom

import { expect, test, vi } from "vitest";
import "vi-fetch/setup";
import { mockFetch, mockGet } from "vi-fetch";
import { baseUri } from "../../src/api/apiHandler";
import { fetchTagSettings } from "../../src/api/fetchTagSettings";
import { TagSetting } from "../../src/type";

describe("fetchTagSettings", () => {
  beforeEach(() => {
    // localStorage はモック化すべきかも（うまくいかなかったため一旦モックなしで実装）
    localStorage.removeItem("baseUri");
    mockFetch.clearAll();
  });
  afterEach(() => {
    vi.clearAllMocks();
    localStorage.removeItem("baseUri");
  });
  const apiCall = [
    {
      baseUrl: "/api",
      environment_name: "dev",
      tags: ["latest", "hogafuga"],
    },
    {
      baseUrl: "/http://example.com/api",
      environment_name: "prod",
      tags: ["release", "testtest"],
    },
  ];
  apiCall.forEach((testCase) => {
    test(`コンテナイメージ一覧（タグ）の取得 API 呼び出し`, async () => {
      localStorage.setItem("baseUri", testCase.baseUrl);
      const mock = mockGet(`${baseUri}/tagSettings`).willResolve([
        {
          environment_name: testCase.environment_name,
          tags: testCase.tags,
        },
      ] as TagSetting[]);
      await fetchTagSettings();
      // とりあえず呼び出しが行われたことだけを確認（戻り値は今のところ上手くテストできず）
      expect(mock).toHaveFetched();
    });
  });
});
