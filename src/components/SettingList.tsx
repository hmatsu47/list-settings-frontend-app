import { onMount } from "solid-js";
import Box from "@suid/material/Box";
import Stack from "@suid/material/Stack";
import {
  fetchLocal,
  fetchRemote,
  fetchUriSettings,
} from "../api/fetchUriSettings";
import { fetchTagSettings } from "../api/fetchTagSettings";
import { tagSettings, uriSettings, uriRemoteSettings } from "../signal";
import { TagSettingList } from "./TagSettingList";
import { UriSettingList } from "./UriSettingList";

export const SettingList = () => {
  onMount(() => {
    if (uriSettings() === undefined) {
      fetchUriSettings(fetchLocal);
    }
    if (uriRemoteSettings() === undefined) {
      fetchUriSettings(fetchRemote);
    }
    if (tagSettings() === undefined) {
      fetchTagSettings();
    }
  });

  return (
    <Stack spacing={2} direction="column">
      <UriSettingList />
      <Box
        sx={{
          padding: "10px 10px 0 10px",
          width: "100%",
          minWidth: "1024px",
          display: "flex",
          // justifyContent: "center",
        }}
        aria-live="polite"
      />
      <TagSettingList />
    </Stack>
  );
};
