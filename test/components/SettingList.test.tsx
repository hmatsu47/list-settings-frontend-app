// @vitest-environment jsdom

import { describe, expect, test, vi } from "vitest";
import "vi-fetch/setup";
import { mockFetch, mockGet } from "vi-fetch";
import { render } from "@solidjs/testing-library";
import { formatSnapshot } from "../common/formatSnapshot";
import { SettingList } from "../../src/components/SettingList";
import { baseUri, remoteBaseUri } from "../../src/api/apiHandler";
import {
  setService,
  setServices,
  setTagSettings,
  setUriSettings,
  setUriRemoteSettings,
} from "../../src/signal";
import {
  LastReleased,
  NextRelease,
  TagSetting,
  UriSetting,
} from "../../src/type";

describe("<SettingList />", () => {
  const settingList = [
    {
      title: "未fetch",
      fetched: false,
      uriSettings: [
        {
          environment_name: "test",
          last_released: {
            image_uri: "testtesttest",
            released_at: new Date("2023-05-14T22:05:00+0900"),
          } as LastReleased,
          next_release: null,
          service_name: "test1",
        } as UriSetting,
        {
          environment_name: "stg",
          last_released: {
            image_uri: "foobar",
            released_at: new Date("2023-05-11T04:05:00+0900"),
          } as LastReleased,
          next_release: {
            image_uri: "foobarbaz",
            release_at: new Date("2023-05-15T04:05:00+0900"),
          } as NextRelease,
          service_name: "test1",
        } as UriSetting,
      ],
      remoteSettings: [
        {
          environment_name: "prod",
          last_released: null,
          next_release: {
            image_uri: "hogefuga",
            release_at: new Date("2023-05-17T23:05:00+0900"),
          } as NextRelease,
          service_name: "test1",
        } as UriSetting,
      ],
      tagSettings: [
        { environment_name: "dev", tags: ["hogefuga", "latest"] } as TagSetting,
        { environment_name: "prod", tags: ["release", "foobar"] } as TagSetting,
      ],
      selectedService: undefined,
      expectedButtonLabel: null,
      expected: [
        { label: "リリース対象サービスが未選択です", count: 1 },
        { label: "リポジトリにイメージがありません", count: 1 },
      ],
      expectedTitle: null,
    },
    {
      title:
        "サービス選択なし・URI形式両側のリポジトリにレコードなし・タグ形式リポジトリにレコードなし",
      fetched: true,
      uriSettings: null,
      remoteSettings: null,
      tagSettings: null,
      selectedService: undefined,
      expectedButtonLabel: null,
      expected: [
        { label: "リリース対象サービスが未選択です", count: 1 },
        { label: "リポジトリにイメージがありません", count: 1 },
      ],
      expectedTitle: null,
    },
    {
      title:
        "サービス選択なし・URI形式両側のリポジトリにレコードなし・タグ形式リポジトリに1レコードあり",
      fetched: true,
      uriSettings: null,
      remoteSettings: null,
      tagSettings: [
        {
          environment_name: "dev",
          tags: ["tag-hogefuga", "latest"],
        } as TagSetting,
      ],
      selectedService: undefined,
      expectedButtonLabel: [{ label: "開発環境設定", count: 1 }],
      expected: [{ label: "リリース対象サービスが未選択です", count: 1 }],
      expectedTitle: null,
    },
    {
      title:
        "サービス選択あり・URI形式両側のリポジトリにレコードなし・タグ形式リポジトリにレコードなし",
      fetched: true,
      uriSettings: null,
      remoteSettings: null,
      tagSettings: null,
      selectedService: "test1",
      expectedButtonLabel: null,
      expected: [{ label: "リポジトリにイメージがありません", count: 2 }],
      expectedTitle: null,
    },
    {
      title:
        "サービス選択あり・URI形式両側のリポジトリにレコードあり・タグ形式リポジトリに1レコードあり",
      fetched: true,
      uriSettings: [
        {
          environment_name: "test",
          last_released: {
            image_uri: "testtesttest",
            released_at: new Date("2023-05-14T22:05:00+0900"),
          } as LastReleased,
          next_release: null,
          service_name: "test1",
        } as UriSetting,
        {
          environment_name: "stg",
          last_released: {
            image_uri: "foobar",
            released_at: new Date("2023-05-11T04:05:00+0900"),
          } as LastReleased,
          next_release: {
            image_uri: "foobarbaz",
            release_at: new Date("2023-05-15T04:05:00+0900"),
          } as NextRelease,
          service_name: "test1",
        } as UriSetting,
      ],
      remoteSettings: [
        {
          environment_name: "prod",
          last_released: null,
          next_release: {
            image_uri: "hogefuga",
            release_at: new Date("2023-05-17T23:05:00+0900"),
          } as NextRelease,
          service_name: "test1",
        } as UriSetting,
      ],
      tagSettings: [
        { environment_name: "dev", tags: ["hogefuga", "latest"] } as TagSetting,
        { environment_name: "prod", tags: ["release", "foobar"] } as TagSetting,
      ],
      selectedService: "test1",
      expectedButtonLabel: [
        { label: "test環境設定", count: 1 },
        { label: "ステージング環境設定", count: 1 },
        { label: "本番環境設定", count: 2 },
        { label: "開発環境設定", count: 1 },
      ],
      expected: [
        { label: "前回：testtesttest", count: 1 },
        { label: "前回：2023-05-14 22:05", count: 1 },
        { label: "次回：foobarbaz", count: 1 },
        { label: "次回：2023-05-15 04:05", count: 1 },
        { label: "次回：hogefuga", count: 1 },
        { label: "次回：2023-05-17 23:05", count: 1 },
        { label: "hogefuga, latest", count: 1 },
        { label: "release, foobar", count: 1 },
      ],
      expectedTitle: ["前回：foobar | 2023-05-11 04:05"],
    },
  ];
  beforeEach(() => {
    // localStorage はモック化すべきかも（うまくいかなかったため一旦モックなしで実装）
    localStorage.setItem("baseUri", "/api");
    localStorage.setItem("remoteBaseUri", "http://remote.example.com/api");
    localStorage.removeItem("selectedService");
    localStorage.setItem(
      "uriButtonColor",
      '{"test":"#2c387e","stg":"#00695f","prod":"#e91e63"}'
    );
    localStorage.setItem("uriSettingsHeaderTitle", "URI形式ヘッダータイトル");
    localStorage.setItem("uriSettingUriPrefix", "http://");
    localStorage.setItem("uriSettingUriSuffix", "-test.example.com");
    localStorage.setItem("tagSettingsHeaderTitle", "タグ形式ヘッダータイトル");
    localStorage.setItem("tagSettingUriPrefix", "http://");
    localStorage.setItem("tagSettingUriSuffix", "-test.example.com");
    mockFetch.clearAll();
  });
  afterEach(() => {
    vi.clearAllMocks();
    localStorage.removeItem("baseUri");
    localStorage.removeItem("remoteBaseUri");
    localStorage.removeItem("selectedService");
    localStorage.removeItem("uriButtonColor");
    localStorage.removeItem("uriSettingsHeaderTitle");
    localStorage.removeItem("uriSettingUriPrefix");
    localStorage.removeItem("uriSettingUriSuffix");
    localStorage.removeItem("tagButtonColor");
    localStorage.removeItem("tagSettingsHeaderTitle");
    localStorage.removeItem("tagSettingUriPrefix");
    localStorage.removeItem("tagSettingUriSuffix");
  });
  settingList.forEach((testCase) => {
    test(testCase.title, () => {
      const mockTag = mockGet(`${baseUri}/tagSettings`).willResolve(
        testCase.tagSettings
      );
      const mockUri = mockGet(`${baseUri}/uriSettings`).willResolve(
        testCase.uriSettings
      );
      const mockUriRemote = mockGet(`${remoteBaseUri}/uriSettings`).willResolve(
        testCase.remoteSettings
      );
      setServices(["test1", "test2"]);
      if (testCase.selectedService) {
        localStorage.setItem("selectedService", testCase.selectedService);
      }
      setService(testCase.selectedService);
      if (testCase.fetched) {
        setUriSettings(testCase.uriSettings);
        setUriRemoteSettings(testCase.remoteSettings);
        setTagSettings(testCase.tagSettings);
      } else {
        setUriSettings(undefined);
        setUriRemoteSettings(undefined);
        setTagSettings(undefined);
      }
      const { container, getByText, getAllByText, getByTitle, unmount } =
        render(() => <SettingList />);
      // css の名前が動的に変わるので固定値に置換
      const html = formatSnapshot(container.innerHTML);
      expect(html).toMatchSnapshot();
      // fetch 後かどうかで分岐
      if (testCase.fetched) {
        // 各ボタン（クリックしない）
        if (testCase.expectedButtonLabel) {
          testCase.expectedButtonLabel.forEach((buttonLabel) => {
            if (buttonLabel.count === 1) {
              const text = getByText(buttonLabel.label) as HTMLElement;
              expect(text).toHaveTextContent(buttonLabel.label);
            } else {
              const text: string[] | any[] = getAllByText(
                buttonLabel.label
              ) as HTMLElement[];
              expect(text.length).toBe(buttonLabel.count);
            }
          });
        }
        // 各 URI・日付・タグ
        testCase.expected.forEach((expected) => {
          if (expected.count === 1) {
            const text = getByText(expected.label) as HTMLElement;
            expect(text).toHaveTextContent(expected.label);
          } else {
            const text: string[] | any[] = getAllByText(
              expected.label
            ) as HTMLElement[];
            expect(text.length).toBe(expected.count);
          }
        });
        // title
        if (testCase.expectedTitle) {
          testCase.expectedTitle.forEach((title) => {
            const text = getByTitle(title) as HTMLElement;
            expect(text).toBeInTheDocument();
          });
        }
      } else {
        // とりあえず API の呼び出しが行われたことだけを確認（戻り値は今のところ上手くテストできず）
        expect(mockTag).toHaveFetched();
        expect(mockUri).toHaveFetched();
        expect(mockUriRemote).toHaveFetched();
      }
      unmount();
    });
  });
});
