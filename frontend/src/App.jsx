import { useState } from "react"
import moment from "moment"
import Highcharts from "highcharts/highstock"
import HighchartsReact from "highcharts-react-official"
import { Select } from "@chakra-ui/react"

import "./App.css"

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
          // to review
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

  const [filterOption, setFilterOption] = useState(["exchange", "OKEX"])

  const handleFilterSelection = (e) => {
    console.log(e.target.value)
    let option = e.target.value.split(",")
    console.log(option)
    setFilterOption(option)
    console.log(filterOption[0])
  }
  let selectOptions
  if (state) {
    let result = {}
    for (let i = 0; i < state.length; ++i) {
      result[state[i].exchange] = "exchange"
      result[state[i].symbol] = "symbol"
    }
    selectOptions = Array.from(Object.entries(result))
    // console.log(result)
    // console.log(selectOptions)
  }

  let options
  if (state) {
    options = {
      title: {
        // text: `${moment(1666019586954552 / 1000).format("MM/DD/YYYY")} Trades`,
        text: `${filterOption[1]}: ${filterOption[0]}`,
        style: { color: "white" },
      },
      series: [
        {
          clip: false,
          name: "BOUGHT",
          showInLegend: true,
          data: state
            .filter(
              (fill) =>
                fill.side === "BUY" && fill[filterOption[1]] === filterOption[0]
            )
            .map((fill) => {
              return { x: fill.timestamp, y: fill.total }
            }),
          color: "purple",
        },
        {
          name: "SOLD",
          showInLegend: true,
          clip: false,
          data: state
            .filter(
              (fill) =>
                fill.side === "SELL" &&
                fill[filterOption[1]] === filterOption[0]
            )
            .map((fill) => {
              return { x: fill.timestamp, y: fill.total }
            }),
          color: "green",
        },
      ],
      xAxis: {
        time: {
          timezone: "America/New_York",
        },
        style: { color: "white" },
      },
      yAxis: {
        title: {
          text: "Total",
        },
        crosshair: true,
      },
      rangeSelector: {
        // enabled: false,
        verticalAlign: "top",
        buttons: [
          { type: "minute", count: 5, text: "5m" },
          { type: "minute", count: 10, text: "10m" },
          { type: "minute", count: 15, text: "15m" },
          { type: "minute", count: 30, text: "30m" },
          { type: "hour", count: 1, text: "1h" },
          { type: "all", text: "All" },
        ],
      },
      chart: {
        height: "800px",
        backgroundColor: "black",
      },
      plotOptions: {
        series: {
          cropThreshold: 1500,
          states: {
            inactive: {
              opacity: 0.8,
            },
          },
          tooltip: {
            // followPointer: true,
            // shared: true,
          },
        },
      },
      tooltip: {
        borderColor: "silver",
        backgroundColor: "black",
        style: { color: "white" },
      },
      credits: {
        enabled: false,
      },
    }
  }

  return (
    <div className="App">
      <section>
        <header className="header">
          {state ? (
            <h1>
              {moment(state[0].timestamp).format("dddd MMMM, D YYYY")} P&L{" "}
            </h1>
          ) : null}
        </header>
        <div className="number_of_trades">
          {state ? (
            <div>
              {" "}
              <p>
                Time period:
                {moment(state[0].timestamp + 14400000).format("HH:MM:ss")} -
                {moment(1666021680365.231 + 14400000).format("HH:MM:ss")}{" "}
              </p>
              <p>Total Trades For The Time Period: {state.length}</p>
            </div>
          ) : null}
        </div>
      </section>
      <div className="filter">
        {state ? (
          <Select
            onChange={(e) => handleFilterSelection(e)}
            bg="tomato"
            borderColor="tomato"
            color="white"
          >
            {selectOptions.map((option) => {
              return (
                <option value={[option]} key={option[0]}>
                  {option[0]}
                </option>
              )
            })}
          </Select>
        ) : null}
      </div>
      <section className="chart">
        {state ? (
          <HighchartsReact
            highcharts={Highcharts}
            options={options}
            constructorType={"stockChart"}
            width="100%"
          />
        ) : null}
      </section>
    </div>
  )
}

export default App
