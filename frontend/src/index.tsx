import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import { ChakraProvider } from "@chakra-ui/react";
import { Toaster } from "react-hot-toast";

ReactDOM.render(
  <React.StrictMode>
    <ChakraProvider>
      <div>
        <Toaster />
      </div>
      <App />
    </ChakraProvider>
  </React.StrictMode>,
  document.getElementById("root")
);
