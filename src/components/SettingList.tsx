import { onMount } from "solid-js";
import {
  fetchLocal,
  fetchRemote,
  fetchUriSettings,
} from "../api/fetchUriSettings";
import { fetchTagSettings } from "../api/fetchTagSettings";
import { tagSettings, uriSettings, uriRemoteSettings } from "../signal";
import { ServiceSelector } from "./ServiceSelector";
import { TagSettingList } from "./TagSettingList";

export const ImageList = () => {
  onMount(() => {
    if (uriSettings() == undefined) {
      fetchUriSettings(fetchLocal);
    }
    if (uriRemoteSettings() == undefined) {
      fetchUriSettings(fetchRemote);
    }
    if (tagSettings() == undefined) {
      fetchTagSettings();
    }
  });

  return (
    <>
      <ServiceSelector />
      <TagSettingList />
    </>
  );
};
