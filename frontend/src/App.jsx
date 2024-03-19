import { useState, useEffect } from "react"
import Header from "./components/header/Header"
import SelectButton from "./components/Select"
import Charts from "./components/Charts"
import moment from "moment"

import "./App.css"

function App() {
  const [state, setState] = useState(() => {
    fetch("http://localhost:8000/api")
      .then((res) => {
        const parsedRes = res.json()
        return parsedRes
      })
      .then((trades) => {
        for (let fill of trades) {
          // 14,400,000 substracted to make up for  HighCharts 4-hour discrepancy
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
        console.table(trades)
        setState(trades)
      })
      .catch((error) => console.log(error))
  })

  const [filterOption, setFilterOption] = useState([])

  useEffect(() => {
    setFilterOption(["BTC/USDT", "symbol"])
  }, [])

  const handleFilterSelection = (e) => {
    let option = e.target.value.split(",")
    setFilterOption(option)
  }

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
      <section className="charts">
        {state ? <Charts state={state} filterOption={filterOption} /> : null}
      </section>
    </div>
  )
}

export default App
