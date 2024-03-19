import { Select } from "@chakra-ui/react"

const SelectButton = (props) => {
  let selectOptions
  if (props.state) {
    let result = {}
    for (let i = 0; i < props.state.length; ++i) {
      result[props.state[i].exchange] = "exchange"
      result[props.state[i].symbol] = "symbol"
    }
    // console.log(result)
    selectOptions = Array.from(Object.entries(result))
  }
  return (
    <Select
      onChange={(e) => props.handleFilterSelection(e)}
      bg=" #17285e"
      borderColor="#17285e"
      focusBorderColor=" #17285e"
      color="white"
      _hover={{ cursor: "pointer" }}
    >
      {/* "selected disabled" necessary to prevent placeholder from being selectable*/}
      <option selected disabled value="">
        Select desk or symbol
      </option>
      {selectOptions.map((option) => {
        return (
          <option value={[option]} key={option[0]}>
            {option[0]}
          </option>
        )
      })}
    </Select>
  )
}

export default SelectButton
