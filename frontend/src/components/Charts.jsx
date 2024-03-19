import Highcharts from "highcharts/highstock"
import HighchartsReact from "highcharts-react-official"

const Charts = (props) => {
  let options
  if (props.state) {
    options = {
      title: {
        text: `${
          props.filterOption[1].slice(0, 1).toUpperCase() +
          props.filterOption[1].slice(1)
        }: ${props.filterOption[0]}`,
        style: { color: "white" },
      },
      series: [
        {
          clip: false,
          name: "BOUGHT",
          showInLegend: true,
          data: props.state
            .filter(
              (fill) =>
                fill.side === "BUY" &&
                fill[props.filterOption[1]] === props.filterOption[0]
            )
            .map((fill) => {
              return { x: fill.timestamp, y: fill.total }
            }),
          color: "#73077e",
        },
        {
          name: "SOLD",
          showInLegend: true,
          clip: false,
          data: props.state
            .filter(
              (fill) =>
                fill.side === "SELL" &&
                fill[props.filterOption[1]] === props.filterOption[0]
            )
            .map((fill) => {
              return { x: fill.timestamp, y: fill.total }
            }),
          color: "#0d83a7",
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
        backgroundColor: " #020e13",
      },
      plotOptions: {
        series: {
          cropThreshold: 1500,
          states: {
            inactive: {
              opacity: 0.8,
            },
          },
        },
      },
      tooltip: {
        borderColor: "silver",
        backgroundColor: " #020e13",
        style: { color: "white" },
      },
      credits: {
        enabled: false,
      },
    }
  }

  return (
    <div className="charts">
      <HighchartsReact
        highcharts={Highcharts}
        options={options}
        constructorType={"stockChart"}
        width="100%"
      />
    </div>
  )
}

export default Charts
