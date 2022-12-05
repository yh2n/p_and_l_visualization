import React from "react"
import ReactDOM from "react-dom/client"
import App from "./App"
import { ChakraProvider } from "@chakra-ui/react"

import "./index.css"

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ChakraProvider>
      <App />
    </ChakraProvider>
  </React.StrictMode>
)

// for (let el of trades) {
//   if (
//     // negative fees = "cash back"
//     (el.fees < 0 && el.side === "SELL") ||
//     // fees deducted from the sales total
//     (el.fees > 0 && el.side === "SELL")
//   ) {
//     el["total"] =
//       el.fill_price * el.fill_quantity * ((100 - el.fees) / 100)
//   } else {
//     el["total"] =
//       el.fill_price * el.fill_quantity * ((100 + el.fees) / 100)
//   }
// }
