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
        console.table(trades[trades.length - 1])
        console.log(
          format(
            fromUnixTime(1666019586954552 / 1000000),
            "MM/dd/yyyy, HH:mm:ss"
          )
        )
      })
  })

  let options
  if (state) {
    options = {
      title: {
        text: `${moment(1666019586954552 / 1000).format("MM/DD/YYYY")} Trades`,
      },
      series: [
        {
          clip: false,
          name: "BOUGHT",
          showInLegend: true,
          data: state
            .filter((fill) => fill.side === "BUY" && fill.exchange === "OKEX")
            .map((fill) => {
              return { x: fill.timestamp, y: fill.total }
            }),
          color: "orange",
        },
        {
          name: "SOLD",
          showInLegend: true,
          clip: false,
          data: state
            .filter((fill) => fill.side === "SELL" && fill.exchange === "OKEX")
            .map((fill) => {
              return { x: fill.timestamp, y: fill.total }
            }),
          color: "green",
        },
      ],
      xAxis: {
        categories: state.map((fill) => fill.timestamp),
        type: "datetime",
        // visible: false,
        time: {
          timezone: "America/New_York",
        },
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
        buttons: [{ type: "day", count: 1, text: "1 d" }],
      },
      chart: {
        // type: "spline",
        height: "800px",
        backgroundColor: "black",
      },
      plotOptions: {
        series: {
          cropThreshold: 800,
          tooltip: {
            followPointer: true,
            shared: true,
          },
        },
      },
      tooltip: {
        split: true,
        shared: true,
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
