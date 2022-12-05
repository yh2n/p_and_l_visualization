import { useState } from "react"
import moment from "moment"
import Highcharts from "highcharts/highstock"
import HighchartsReact from "highcharts-react-official"

import "./App.css"

function App() {
  const [state, setState] = useState(function getInitialState() {
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
          fill.timestamp = fill.timestamp / 1000
        }
        for (let el of trades) {
          el["total"] =
            el.fill_price * el.fill_quantity * ((100 + el.fees) / 100)
        }
        setState(trades)
        // console.table(trades.filter((el) => el.symbol === "BTC/USDT"))
      })
  })

  let options
  if (state) {
    options = {
      series: [
        {
          name: "BOUGHT",
          data: state
            .filter((fill) => fill.side === "BUY" && fill.symbol === "BTC/USDT")
            .map((fill) => fill.total),
          pointInterval: state.pointInterval,
        },
        {
          name: "SOLD",
          data: state
            .filter(
              (fill) => fill.side === "SELL" && fill.symbol === "BTC/USDT"
            )
            .map((fill) => fill.total),
          pointInterval: state.pointInterval,
        },
      ],
      xAxis: {
        categories: state.map((fill) => fill.timestamp),
        type: "datetime",
        visible: false,
      },
      rangeSelector: {
        buttons: [{ type: "second", count: 10, text: "10s" }],
      },
      yAxis: {
        title: {
          text: "Total",
        },
      },
      chart: {
        height: "700px",
      },
    }
  }

  return (
    <div className="App">
      <div className="">Pattern Research</div>
      <h1>{moment(1666019586954552 / 1000).format("dddd MMMM, D YYYY")} P&L</h1>
      {state ? <p>Total Trades: {state.length}</p> : null}
      <div className="chart">
        {state ? (
          <HighchartsReact
            highcharts={Highcharts}
            options={options}
            width="100%"
          />
        ) : null}
      </div>
    </div>
  )
}

export default App
