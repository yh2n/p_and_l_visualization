import { useState } from "react"
import Header from "./components/Header"
import SelectButton from "./components/Select"
import Charts from "./components/Charts"

import "./App.css"
import { useEffect } from "react"

function App() {
  const [state, setState] = useState(() => {
    fetch("http://localhost:8000/api", {
      method: "GET",
      headers: { "content-type": "application/json" },
    })
      .then((res) => {
        const parsedRes = res.json()
        return parsedRes
      })
      .then((trades) => {
        for (let fill of trades) {
          // 14,400,000 substracted to make up for 4-hour discrepancy with HighCharts
          fill.timestamp = fill.timestamp / 1000 - 14400000
        }
        for (let el of trades) {
          if (
            // negative fees = "cash back"
            (el.fees < 0 && el.side === "SELL") ||
            // fees deducted from the sales total
            (el.fees > 0 && el.side === "SELL")
          ) {
            el["total"] =
              el.fill_price * el.fill_quantity * ((100 - el.fees) / 100)
          } else {
            el["total"] =
              el.fill_price * el.fill_quantity * ((100 + el.fees) / 100)
          }
        }
        setState(trades)
      })
  })

  const [filterOption, setFilterOption] = useState([])

  const handleFilterSelection = (e) => {
    let option = e.target.value.split(",")
    setFilterOption(option)
  }

  useEffect(() => {
    setFilterOption(["BTC/USDT", "symbol"])
  }, [])

  return (
    <div className="App">
      <section>{state ? <Header state={state} /> : null}</section>
      <div className="filter">
        {state ? (
          <SelectButton
            state={state}
            handleFilterSelection={handleFilterSelection}
          />
        ) : null}
      </div>
      <section className="chart">
        {state ? <Charts state={state} filterOption={filterOption} /> : null}
      </section>
    </div>
  )
}

export default App
