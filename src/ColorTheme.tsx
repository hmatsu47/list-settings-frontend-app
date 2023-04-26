import { grey, blueGrey } from "@suid/material/colors";
import { createTheme } from "@suid/material/styles";

export const ColorTheme = createTheme({
  palette: {
    primary: {
      main: localStorage.getItem("primaryColor")
        ? (localStorage.getItem("primaryColor") as string)
        : grey[900],
    },
    secondary: {
      main: localStorage.getItem("secondaryColor")
        ? (localStorage.getItem("secondaryColor") as string)
        : blueGrey[900],
    },
  },
});
