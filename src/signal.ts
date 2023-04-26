import { createSignal } from "solid-js";
import { AlertColor } from "@suid/material/Alert";

import { TagSetting, UriSetting } from "./type";

export const [tagSettings, setTagSettings] = createSignal<
  TagSetting[] | null | undefined
>();
export const [tagSettingsRemote, setTagSettingsRemote] = createSignal<
  TagSetting[] | null | undefined
>();
export const [uriSettings, setUriSettings] = createSignal<
  UriSetting[] | null | undefined
>();
export const [uriSettingsRemote, setUriSettingsRemote] = createSignal<
  UriSetting[] | null | undefined
>();
export const [message, setMessage] = createSignal<string | undefined>();
export const [messageSeverity, setMessageSeverity] = createSignal<
  AlertColor | undefined
>();
