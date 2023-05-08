import { createSignal } from "solid-js";
import { AlertColor } from "@suid/material/Alert";

import { TagSetting, UriSetting } from "./type";

export const [service, setService] = createSignal<string | null | undefined>();
export const [services, setServices] =
  createSignal<string[] | null | undefined>();
export const [remoteServices, setRemoteServices] =
  createSignal<string[] | null | undefined>();
export const [tagSettings, setTagSettings] =
  createSignal<TagSetting[] | null | undefined>();
export const [uriSettings, setUriSettings] =
  createSignal<UriSetting[] | null | undefined>();
export const [uriRemoteSettings, setUriRemoteSettings] =
  createSignal<UriSetting[] | null | undefined>();
export const [message, setMessage] = createSignal<string | undefined>(
  "リリース対象サービスを選択すると一覧が表示されます"
);
export const [messageSeverity, setMessageSeverity] =
  createSignal<AlertColor | undefined>("info");
