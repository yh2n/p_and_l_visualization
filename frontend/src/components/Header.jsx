import moment from "moment"
import PatternLogo from "../assets/PatternLogo.svg"

import styles from "./Header.module.css"

const Header = (props) => {
  return (
    <section>
      <div className={styles.logo}>
        <img
          style={{
            backgroundColor: "#17285e",
            width: "50",
            height: "fit-content",
          }}
          src={PatternLogo}
        />
      </div>
      <header className="header">
        <div>
          {moment(props.state[0].timestamp).format("dddd MMMM, D YYYY")} P&L{" "}
        </div>
        <div>
          <p>Total Trades For The Time Period: {props.state.length}</p>
        </div>
      </header>
      <div className={styles.mock_logo}>
        <img
          style={{
            backgroundColor: "#17285e",
            width: "50",
            height: "fit-content",
          }}
          src={PatternLogo}
        />
      </div>
    </section>
  )
}

export default Header
