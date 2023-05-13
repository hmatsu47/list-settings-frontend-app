import { describe, expect, test } from "vitest";
import { render } from "@solidjs/testing-library";
import { formatSnapshot } from "../common/formatSnapshot";
import { UriSettingListParts } from "../../src/components/UriSettingListParts";
import { setService } from "../../src/signal";
import { LastReleased, NextRelease, UriSetting } from "../../src/type";

describe("<UriSettingListParts />", () => {
  const uriSettingList = [
    {
      title: "色設定なし・サービス1つ・環境1つ（本番）・リリースセットなし",
      colors: undefined,
      uriPrefix: "http://",
      uriSuffix: "-test.example.com",
      settings: [
        {
          environment_name: "prod",
          last_released: null,
          next_release: null,
          service_name: "test1",
        } as UriSetting,
      ],
      selectedService: "test1",
      expectedButtonLabel: ["本番環境設定"],
      expected: [{ label: "（未設定）", count: 2 }],
      expectedTitle: null,
    },
    {
      title:
        "サービス1つ・環境1つ（ステージング）・リポジトリにレコード1つ（過去リリースあり）",
      colors: '{"stg":"#00695f","prod":"#e91e63"}',
      uriPrefix: "http://",
      uriSuffix: "-stg.example.com",
      settings: [
        {
          environment_name: "stg",
          last_released: {
            image_uri: "hogefuga",
            released_at: new Date("2023-05-11T04:05:00+0900"),
          } as LastReleased,
          next_release: null,
          service_name: "test1",
        } as UriSetting,
      ],
      selectedService: "test1",
      expectedButtonLabel: ["ステージング環境設定"],
      expected: [
        { label: "前回：hogefuga", count: 1 },
        { label: "前回：2023-05-11 04:05", count: 1 },
      ],
      expectedTitle: null,
    },
    {
      title:
        "サービス1つ・環境1つ（本番）・リポジトリにレコード1つ（リリースセットあり）",
      colors: '{"stg":"#00695f","prod":"#e91e63"}',
      uriPrefix: "http://",
      uriSuffix: "-prod.example.com",
      settings: [
        {
          environment_name: "prod",
          last_released: null,
          next_release: {
            image_uri: "hogefuga",
            release_at: new Date("2023-05-15T04:05:00+0900"),
          } as NextRelease,
          service_name: "test1",
        } as UriSetting,
      ],
      selectedService: "test1",
      expectedButtonLabel: ["本番環境設定"],
      expected: [
        { label: "次回：hogefuga", count: 1 },
        { label: "次回：2023-05-15 04:05", count: 1 },
      ],
      expectedTitle: null,
    },
    {
      title:
        "サービス1つ・環境1つ（ステージング）・リポジトリにレコード1つ（過去リリースおよびリリースセットあり）",
      colors: '{"stg":"#00695f","prod":"#e91e63"}',
      uriPrefix: "http://",
      uriSuffix: "-stg.example.com",
      settings: [
        {
          environment_name: "stg",
          last_released: {
            image_uri: "foobar",
            released_at: new Date("2023-05-11T04:05:00+0900"),
          } as LastReleased,
          next_release: {
            image_uri: "hogefuga",
            release_at: new Date("2023-05-15T04:05:00+0900"),
          } as NextRelease,
          service_name: "test1",
        } as UriSetting,
      ],
      selectedService: "test1",
      expectedButtonLabel: ["ステージング環境設定"],
      expected: [
        { label: "次回：hogefuga", count: 1 },
        { label: "次回：2023-05-15 04:05", count: 1 },
      ],
      expectedTitle: ["前回：foobar | 2023-05-11 04:05"],
    },
    {
      title:
        "サービス2つ・環境1つ（本番）・リポジトリにレコード2つ（過去リリース：非表示およびリリースセット：表示あり）",
      colors: '{"stg":"#00695f","prod":"#e91e63"}',
      uriPrefix: "http://",
      uriSuffix: "-prod.example.com",
      settings: [
        {
          environment_name: "prod",
          last_released: {
            image_uri: "foobar",
            released_at: new Date("2023-05-11T04:05:00+0900"),
          } as LastReleased,
          next_release: null,
          service_name: "test1",
        } as UriSetting,
        {
          environment_name: "prod",
          last_released: null,
          next_release: {
            image_uri: "hogefuga",
            release_at: new Date("2023-05-15T04:05:00+0900"),
          } as NextRelease,
          service_name: "test2",
        } as UriSetting,
      ],
      selectedService: "test2",
      expectedButtonLabel: ["本番環境設定"],
      expected: [
        { label: "次回：hogefuga", count: 1 },
        { label: "次回：2023-05-15 04:05", count: 1 },
      ],
      expectedTitle: null,
    },
    {
      title:
        "サービス2つ・環境2つ（ステージング・本番）・リポジトリにレコード2つ（過去リリース：表示およびリリースセット：非表示あり）",
      colors: '{"stg":"#00695f","prod":"#e91e63"}',
      uriPrefix: "http://",
      uriSuffix: "-stg.example.com",
      settings: [
        {
          environment_name: "stg",
          last_released: {
            image_uri: "foobar",
            released_at: new Date("2023-05-11T04:05:00+0900"),
          } as LastReleased,
          next_release: null,
          service_name: "test1",
        } as UriSetting,
        {
          environment_name: "prod",
          last_released: null,
          next_release: null,
          service_name: "test1",
        } as UriSetting,
        {
          environment_name: "stg",
          last_released: null,
          next_release: null,
          service_name: "test2",
        } as UriSetting,
        {
          environment_name: "prod",
          last_released: null,
          next_release: {
            image_uri: "hogefuga",
            release_at: new Date("2023-05-15T04:05:00+0900"),
          } as NextRelease,
          service_name: "test2",
        } as UriSetting,
      ],
      selectedService: "test1",
      expectedButtonLabel: ["ステージング環境設定", "本番環境設定"],
      expected: [
        { label: "前回：foobar", count: 1 },
        { label: "前回：2023-05-11 04:05", count: 1 },
        { label: "（未設定）", count: 2 },
      ],
      expectedTitle: null,
    },
  ];
  beforeEach(() => {
    localStorage.removeItem("uriButtonColor");
    localStorage.removeItem("uriSettingUriPrefix");
    localStorage.removeItem("uriSettingUriSuffix");
  });
  afterEach(() => {
    localStorage.removeItem("selectedService");
  });
  uriSettingList.forEach((testCase) => {
    test(testCase.title, () => {
      if (testCase.colors) {
        localStorage.setItem("uriButtonColor", testCase.colors);
      }
      localStorage.setItem("uriSettingUriPrefix", testCase.uriPrefix);
      localStorage.setItem("uriSettingUriSuffix", testCase.uriSuffix);
      setService(testCase.selectedService);
      const { container, getByText, getAllByText, getByTitle, unmount } =
        render(() => <UriSettingListParts settings={testCase.settings} />);
      // css の名前が動的に変わるので固定値に置換
      const html = formatSnapshot(container.innerHTML);
      expect(html).toMatchSnapshot();
      // 各ボタン（クリックしない）
      testCase.expectedButtonLabel.forEach((buttonLabel) => {
        const text = getByText(buttonLabel) as HTMLElement;
        expect(text).toHaveTextContent(buttonLabel);
      });
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
