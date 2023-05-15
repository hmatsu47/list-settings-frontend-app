import { describe, expect, test } from "vitest";
import { render } from "@solidjs/testing-library";
import { formatSnapshot } from "../common/formatSnapshot";
import { UriSettingList } from "../../src/components/UriSettingList";
import {
  setService,
  setServices,
  setUriSettings,
  setUriRemoteSettings,
} from "../../src/signal";
import { LastReleased, NextRelease, UriSetting } from "../../src/type";

describe("<UriSettingList />", () => {
  const uriSettingList = [
    {
      title: "サービス選択なし・両側のリポジトリにレコードなし",
      colors: '{"test":"#2c387e","stg":"#00695f","prod":"#e91e63"}',
      header: "ヘッダータイトル1",
      uriPrefix: "http://",
      uriSuffix: "-test.example.com",
      settings: null,
      remoteSettings: null,
      selectedService: undefined,
      expectedButtonLabel: null,
      expected: [{ label: "リリース対象サービスが未選択です", count: 1 }],
      expectedTitle: null,
    },
    {
      title: "サービス選択あり・両側のリポジトリにレコードなし",
      colors: '{"test":"#2c387e","stg":"#00695f","prod":"#e91e63"}',
      header: "ヘッダータイトル2",
      uriPrefix: "http://",
      uriSuffix: "-test.example.com",
      settings: null,
      remoteSettings: null,
      selectedService: "test1",
      expectedButtonLabel: null,
      expected: [{ label: "リポジトリにイメージがありません", count: 1 }],
      expectedTitle: null,
    },
    {
      title: "サービス選択あり・リモート側のリポジトリにレコードなし",
      colors: '{"test":"#2c387e","stg":"#00695f","prod":"#e91e63"}',
      header: "ヘッダータイトル3",
      uriPrefix: "http://",
      uriSuffix: "-test.example.com",
      settings: [
        {
          environment_name: "test",
          last_released: {
            image_uri: "testtesttest",
            released_at: new Date("2023-05-14T22:05:00+0900"),
          } as LastReleased,
          next_release: null,
          service_name: "test1",
        } as UriSetting,
      ],
      remoteSettings: null,
      selectedService: "test1",
      expectedButtonLabel: null,
      expected: [{ label: "リポジトリにイメージがありません", count: 1 }],
      expectedTitle: null,
    },
    {
      title: "サービス選択あり・両側のリポジトリにレコードあり",
      colors: '{"test":"#2c387e","stg":"#00695f","prod":"#e91e63"}',
      header: "ヘッダータイトル4",
      uriPrefix: "http://",
      uriSuffix: "-test.example.com",
      settings: [
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
      selectedService: "test1",
      expectedButtonLabel: [
        "test環境設定",
        "ステージング環境設定",
        "本番環境設定",
      ],
      expected: [
        { label: "前回：testtesttest", count: 1 },
        { label: "前回：2023-05-14 22:05", count: 1 },
        { label: "次回：foobarbaz", count: 1 },
        { label: "次回：2023-05-15 04:05", count: 1 },
        { label: "次回：hogefuga", count: 1 },
        { label: "次回：2023-05-17 23:05", count: 1 },
      ],
      expectedTitle: ["前回：foobar | 2023-05-11 04:05"],
    },
  ];
  beforeEach(() => {
    localStorage.removeItem("selectedService");
    localStorage.removeItem("uriButtonColor");
    localStorage.removeItem("uriSettingsHeaderTitle");
    localStorage.removeItem("uriSettingUriPrefix");
    localStorage.removeItem("uriSettingUriSuffix");
  });
  afterEach(() => {
    localStorage.removeItem("selectedService");
    localStorage.removeItem("uriButtonColor");
    localStorage.removeItem("uriSettingsHeaderTitle");
    localStorage.removeItem("uriSettingUriPrefix");
    localStorage.removeItem("uriSettingUriSuffix");
  });
  uriSettingList.forEach((testCase) => {
    test(testCase.title, () => {
      if (testCase.colors) {
        localStorage.setItem("uriButtonColor", testCase.colors);
      }
      localStorage.setItem("uriSettingsHeaderTitle", testCase.header);
      localStorage.setItem("uriSettingUriPrefix", testCase.uriPrefix);
      localStorage.setItem("uriSettingUriSuffix", testCase.uriSuffix);
      setServices(["test1", "test2"]);
      if (testCase.selectedService) {
        localStorage.setItem("selectedService", testCase.selectedService);
      }
      setService(testCase.selectedService);
      setUriSettings(testCase.settings);
      setUriRemoteSettings(testCase.remoteSettings);
      const { container, getByText, getAllByText, getByTitle, unmount } =
        render(() => <UriSettingList />);
      // css の名前が動的に変わるので固定値に置換
      const html = formatSnapshot(container.innerHTML);
      expect(html).toMatchSnapshot();
      // ヘッダータイトル
      const headerTitle = getByText(testCase.header) as HTMLElement;
      expect(headerTitle).toHaveTextContent(testCase.header);
      // 各ボタン（クリックしない）
      if (testCase.expectedButtonLabel) {
        testCase.expectedButtonLabel.forEach((buttonLabel) => {
          const text = getByText(buttonLabel) as HTMLElement;
          expect(text).toHaveTextContent(buttonLabel);
        });
      }
      // 各 URI・日付
      testCase.expected.forEach((expected) => {
        if (expected.count === 1) {
          // URI と日付
          const text = getByText(expected.label) as HTMLElement;
          expect(text).toHaveTextContent(expected.label);
        } else {
          // （未設定）
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
      unmount();
    });
  });
});
