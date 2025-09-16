import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { store } from "./redux/store.js";
import { Provider } from "react-redux";
import { CssBaseline, GlobalStyles } from "@mui/material";
import App from "./App.js";

createRoot(document.getElementById("root")!).render(
  <BrowserRouter>
    <Provider store={store}>
      <CssBaseline />
      <GlobalStyles styles={{ body: { backgroundColor: "#1d1d1d" } }} />
      <App />
    </Provider>
  </BrowserRouter>
);
