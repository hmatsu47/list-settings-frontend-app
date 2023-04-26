import { Show } from "solid-js";
import Alert from "@suid/material/Alert";
import Box from "@suid/material/Box";
import { message, messageSeverity } from "../signal";

export const Message = () => {
  return (
    <Show when={message()} fallback={<></>}>
      <Box
        sx={{
          width: "100%",
          minWidth: "1024px",
          display: "flex",
        }}
        aria-live="polite"
      >
        <Alert severity={messageSeverity()}>{message()}</Alert>
      </Box>
    </Show>
  );
};
