import * as React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { persistor, store } from "./app/store";
import { Provider } from "react-redux";
import "./index.css";
import "antd/dist/antd.css";
import "antd-button-color/dist/css/style.css";
import { PersistGate } from "redux-persist/integration/react";
import { ChakraProvider } from "@chakra-ui/react";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement,
);
root.render(
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <ChakraProvider>
        <App />
      </ChakraProvider>
    </PersistGate>
  </Provider>
  ,
);
