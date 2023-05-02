import { For, onMount, Show } from "solid-js";
import Box from "@suid/material/Box";
import Stack from "@suid/material/Stack";
import Typography from "@suid/material/Typography";
import { ServiceButton } from "./ServiceButton";
import { services, setService } from "../signal";

export const ServiceSelector = () => {
  onMount(() => {
    // ローカルストレージから前回の選択肢を読み取る
    const tmpService = localStorage.getItem("selectedService");
    if (tmpService) {
      setService(tmpService);
    }
  });

  return (
    <Box
      sx={{
        width: "100%",
        minWidth: "1024px",
        display: "flex",
      }}
      aria-live="polite"
    >
      <Show when={services()} fallback={<div>Loading...</div>}>
        <Stack spacing={2} direction="row">
          <Typography variant="h6" sx={{ minWidth: "256px" }}>
            リリース対象サービス
          </Typography>
          <For each={services()} fallback={<></>}>
            {(item) => <ServiceButton serviceName={item} />}
          </For>
        </Stack>
      </Show>
    </Box>
  );
};
