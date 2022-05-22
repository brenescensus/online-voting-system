import React from "react"
import ReactDOM from "react-dom"
import "./index.scss"
import App from "./App"
import reportWebVitals from "./reportWebVitals"
import backendUrl from "./Helpers/URL"

import { AnimatePresence } from "framer-motion"

import { ApolloClient, InMemoryCache, ApolloProvider } from "@apollo/client"

const client = new ApolloClient({
  uri: backendUrl,
  cache: new InMemoryCache(),
})

ReactDOM.render(
  <React.StrictMode>
    <ApolloProvider client={client}>
      <AnimatePresence>
        <App />
      </AnimatePresence>
    </ApolloProvider>
  </React.StrictMode>,
  document.getElementById("root")
)

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()
