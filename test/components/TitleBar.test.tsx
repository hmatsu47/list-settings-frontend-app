// @vitest-environment jsdom

import { describe, expect, test, vi } from "vitest";
import "vi-fetch/setup";
import { mockFetch, mockGet } from "vi-fetch";
import { fireEvent, render } from "@solidjs/testing-library";
import { formatSnapshot } from "../common/formatSnapshot";
import { TitleBar } from "../../src/components/TitleBar";
import { baseUri, remoteBaseUri } from "../../src/api/apiHandler";
import { fetchTagSettings } from "../../src/api/fetchTagSettings";
import {
  fetchLocal,
  fetchRemote,
  fetchUriSettings,
} from "../../src/api/fetchUriSettings";
import {
  LastReleased,
  NextRelease,
  UriSetting,
  TagSetting,
} from "../../src/type";

describe("<TitleBar />", () => {
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
  const titleBarList = [
    {
      title: "タイトルバー表示",
      expected: "コンテナリリースイメージ一覧",
      baseUrl: "/api",
      remoteBaseUrl: "http://remote.example.com/api",
      uri_environment_name: "stg",
      last_released: {
        image_uri: "hogefuga",
        released_at: new Date(),
      } as LastReleased,
      next_release: {
        image_uri: "testtest",
        release_at: new Date(),
      } as NextRelease,
      service_name: "test1",
      remote_uri_environment_name: "prod",
      remote_last_released: {
        image_uri: "foobar",
        released_at: new Date(),
      } as LastReleased,
      remote_next_release: {
        image_uri: "testtesttest",
        release_at: new Date(),
      } as NextRelease,
      remote_service_name: "test2",
      tag_environment_name: "prod",
      tags: ["release", "testtest"],
    },
  ];
  titleBarList.forEach((testCase) => {
    test(testCase.title, async () => {
      localStorage.setItem("baseUri", testCase.baseUrl);
      localStorage.setItem("remoteBaseUri", testCase.remoteBaseUrl);
      const mockTag = mockGet(`${baseUri}/tagSettings`).willResolve([
        {
          environment_name: testCase.tag_environment_name,
          tags: testCase.tags,
        },
      ] as TagSetting[]);
      const mockUri = mockGet(`${baseUri}/uriSettings`).willResolve([
        {
          environment_name: testCase.uri_environment_name,
          last_released: testCase.last_released,
          next_release: testCase.next_release,
          service_name: testCase.service_name,
        },
      ] as UriSetting[]);
      const mockUriRemote = mockGet(`${remoteBaseUri}/uriSettings`).willResolve(
        [
          {
            environment_name: testCase.remote_uri_environment_name,
            last_released: testCase.remote_last_released,
            next_release: testCase.remote_next_release,
            service_name: testCase.remote_service_name,
          },
        ] as UriSetting[]
      );
      const { container, findByText, unmount } = render(() => <TitleBar />);
      const expected = (await findByText(testCase.expected)) as HTMLElement;
      expect(expected).toHaveTextContent(testCase.expected);
      const button = (await findByText("Reload")) as HTMLInputElement;
      expect(button).toHaveTextContent("Reload");
      // css の名前が動的に変わるので固定値に置換
      const htmlBefore = formatSnapshot(container.innerHTML);
      expect(htmlBefore).toMatchSnapshot();
      // Reload　ボタンクリック
      fireEvent.click(button);
      // とりあえず API の呼び出しが行われたことだけを確認（戻り値は今のところ上手くテストできず）
      expect(mockTag).toHaveFetched();
      expect(mockUri).toHaveFetched();
      expect(mockUriRemote).toHaveFetched();
      // css の名前が動的に変わるので固定値に置換
      const htmlAfter = formatSnapshot(container.innerHTML); // Before から変化しない
      expect(htmlAfter).toMatchSnapshot();
      unmount();
    });
  });
});
