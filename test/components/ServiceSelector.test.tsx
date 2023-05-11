import { describe, expect, test } from "vitest";
import { render } from "@solidjs/testing-library";
import { formatSnapshot } from "../common/formatSnapshot";
import { ServiceSelector } from "../../src/components/ServiceSelector";
import { setServices } from "../../src/signal";

describe("<ServiceSelector />", () => {
  const serviceSelectorList = [
    {
      title: "サービス x1",
      services: ["service1"],
    },
    {
      title: "サービス x2",
      services: ["service1", "service2"],
    },
    {
      title: "サービス x3",
      services: ["service1", "service2", "service3"],
    },
  ];
  beforeEach(() => {
    localStorage.removeItem("selectedService");
  });
  afterEach(() => {
    localStorage.removeItem("selectedService");
  });
  serviceSelectorList.forEach((testCase) => {
    test(testCase.title, async () => {
      setServices(testCase.services);
      const { container, findByText, unmount } = render(() => (
        <ServiceSelector />
      ));
      // css の名前が動的に変わるので固定値に置換
      const html = formatSnapshot(container.innerHTML);
      expect(html).toMatchSnapshot();
      // 各ボタン
      testCase.services.forEach(async (service) => {
        const button = (await findByText(service)) as HTMLElement;
        expect(button).toHaveTextContent(service);
      });
      unmount();
    });
  });
});
