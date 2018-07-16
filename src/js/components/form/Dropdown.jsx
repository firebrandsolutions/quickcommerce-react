import assign from 'object-assign'

import React from 'react'
import PropTypes from 'prop-types'

import { DropdownButton, FormControl, MenuItem, SplitButton, InputGroup } from 'react-bootstrap'

import FormHelper from '../../helpers/Form.js'
import ObjectHelper from '../../helpers/Object.js'

const getMappedValue = FormHelper.getMappedValue

const SelectList = (props) => {
  // Render the SelectList

  const {
    //field,
    fields,
    mapping,
    data,
    mapItems,
    displayText,
  } = props

  let items = props.items || []

  let hasMapping = false
  if (typeof mapping !== 'undefined' && mapping.hasOwnProperty('property')) {
    hasMapping = true
  }

  let name = ''
  if (hasMapping) {
    name = (typeof props.name === 'string') ? props.name : mapping.property
  } else {
    name = (typeof props.name === 'string') ? props.name: name
  }

  let inputProps = undefined
  if (hasMapping) {
    inputProps = assign({}, props, props.fields(mapping.property, getMappedValue(mapping, data), null, {
      onChange: props.onChange
    }))

    delete inputProps.items
    delete inputProps.optionValue
    delete inputProps.codeValue
  }

  // Just for debugging
  if (!ObjectHelper.isEmpty(data)) {
    //debugger
  }

  if (props.hasOwnProperty('optionValue')) {
    return (
      <FormControl
        readOnly={props.readOnly}
        name={name}
        componentClass='select'
        {...inputProps}>
        <option key={0} value=''></option>
        {items.map((item, idx) => {
          // Use the mapItems callback to perform
          // any last second tweaks to the data
          item = mapItems(item)
          return(
            <option
              key={idx + 1}
              code={item.code}
              value={item.value}
              selected={item.selected}>
              {item.value}
            </option>
          )
        })}
      </FormControl>
    )
  }

  if (props.hasOwnProperty('displayTextValue')) {
    return (
      <FormControl
        readOnly={props.readOnly}
        name={name}
        componentClass='select'
        {...inputProps}>
        <option key={0} value=''></option>
        {items.map((item, idx) => {
          // Use the mapItems callback to perform
          // any last second tweaks to the data
          item = mapItems(item)

          let displayValue = item.value

          if (typeof props.displayText === 'function') {
            displayValue = displayText(item.value)
          }

          return(
            <option
              key={idx + 1}
              value={item.value}
              selected={item.selected}>
              {displayValue}
            </option>
          )
        })}
      </FormControl>
    )
  }

  if (props.hasOwnProperty('codeValue')) {
    return (
      <FormControl
        readOnly={props.readOnly}
        name={name}
        componentClass='select'
        {...inputProps}>
        <option key={0} value=''></option>
        {items.map((item, idx) => {
          // Use the mapItems callback to perform
          // any last second tweaks to the data
          item = mapItems(item)
          return (
            <option
              key={idx + 1}
              value={item.code}
              selected={item.selected}>
              {item.value}
            </option>
          )
        })}
      </FormControl>
    )
  }

  return (
    <FormControl
      readOnly={props.readOnly}
      name={name}
      componentClass='select'
      {...inputProps}>
      <option key={0} value=''></option>
      {items.map((item, idx) => {
        // Use the mapItems callback to perform
        // any last second tweaks to the data
        item = mapItems(item)
        return(
          <option
            key={idx + 1}
            value={item.id}
            selected={item.selected}>
            {item.value}
          </option>
        )
      })}
    </FormControl>
  )
}

SelectList.propTypes = {
  mapItems: PropTypes.func
}

SelectList.defaultProps = {
  mapItems: (items) => { return items }
}

const SelectButton = (props) => {
  let items = props.items || []
  // Helen Keller won't be using this software, because she obviously shouldn't be driving or even thinking about vehicles but since
  // React/Bootstrap is stupidly opinionated about assistive technologies like screen readers we have to hack in an ID to prevent warnings
  let itemId = 'splitbutton-' + Math.random() * 10

  if (props.mode === 'split') {
    return (
      <SplitButton
        readOnly={props.readOnly}
        id={itemId}
        title='Split Button'
        {...props}>
        {items.map((item, idx) => (
          <MenuItem key={idx} eventKey={item.id}>{item.value}</MenuItem>
        ))}
      </SplitButton>
    )
  } else {
    return (
      <DropdownButton title='Normal Button' {...props}>
        {items.map((item, idx) => (
          <MenuItem id={itemId + '_' + idx} key={idx} eventKey={item.id}>{item.value}</MenuItem>
        ))}
      </DropdownButton>
    )
  }
}

const PercentageRateDropdown = (props) => {
  return (
    <InputGroup>
      <SelectList {...props} />
      <InputGroup.Addon>%</InputGroup.Addon>
    </InputGroup>
  )
}

const MonthsDropdown = (props) => {
  return (
    <InputGroup>
      <SelectList {...props} />
      <InputGroup.Addon>Months</InputGroup.Addon>
    </InputGroup>
  )
}

// Dropdown lists
const ContactTypeDropdown = (props) => {
  console.log('dumping ContactTypeDropdown props')
  console.log(props)
  return (<SelectList {...props} />)
}

const IdTypeDropdown = (props) => {
  return (<SelectList {...props} />)
}

const CustomerRelationDropdown = (props) => {
  return (<SelectList {...props} />)
}

const SalutationDropdown = (props) => {
  return (<SelectList {...props} />)
}

const SuffixDropdown = (props) => {
  let newProps = assign({}, props, {
    items: [
      {
        id: 1,
        code: 'JR',
        value: 'Jr.'
      },
      {
        id: 2,
        code: 'SR',
        value: 'Sr.'
      },
      {
        id: 3,
        code: '1',
        value: 'I'
      },
      {
        id: 4,
        code: '2',
        value: 'II'
      },
      {
        id: 5,
        code: '3',
        value: 'III'
      },
      {
        id: 6,
        code: '4',
        value: 'IV'
      },
      {
        id: 7,
        code: '5',
        value: 'V'
      },
      {
        id: 8,
        code: '6',
        value: 'VI'
      },
      {
        id: 9,
        code: '7',
        value: 'VII'
      },
      {
        id: 10,
        code: '8',
        value: 'VIII'
      },
      {
        id: 11,
        code: '9',
        value: 'IX'
      },
      {
        id: 12,
        code: '10',
        value: 'X'
      }
    ]
  })

  return (<SelectList {...newProps} />)
}

const GenderDropdown = (props) => {
  return (<SelectList {...props} />)
}

const MaritalDropdown = (props) => {
  let newProps = assign({}, props, {
    items: [
      {
        id: 1,
        code: 'SINGLE',
        value: 'Single'
      },
      {
        id: 2,
        code: 'MARRIED',
        value: 'Married'
      },
      {
        id: 3,
        code: 'COMMONLAW',
        value: 'Common Law'
      },
      {
        id: 4,
        code: 'SEPARATED',
        value: 'Separated'
      },
      {
        id: 5,
        code: 'DIVORCED',
        value: 'Divorced'
      }
    ]
  })

  return (<SelectList {...newProps} />)
}

const ResidenceTypeDropdown = (props) => {
  return (<SelectList {...props} />)
}

const EmploymentTypeDropdown = (props) => {
  return (<SelectList {...props} />)
}

const EmploymentStatusDropdown = (props) => {
  return (<SelectList {...props} />)
}

const IncomeTypeDropdown = (props) => {
  return (<SelectList {...props} />)
}

const FrequencyDropdown = (props) => {
  return (<SelectList {...props} />)
}

const AssetTypeDropdown = (props) => {
  return (<SelectList {...props} />)
}

const LiabilityTypeDropdown = (props) => {
  return (<SelectList {...props} />)
}

const StreetTypeDropdown = (props) => {
  return (<SelectList {...props} />)
}

const StreetDirDropdown = (props) => {
  return (<SelectList {...props} />)
}

// Dropdown buttons

const ContactTypeButton = (props) => {
  return (<SelectButton {...props} />)
}

const IdTypeButton = (props) => {
  return (<SelectButton {...props} />)
}

const CustomerRelationButton = (props) => {
  return (<SelectButton {...props} />)
}

const SalutationButton = (props) => {
  return (<SelectButton {...props} />)
}

const SuffixButton = (props) => {
  return (<SelectButton {...props} />)
}

const GenderButton = (props) => {
  return (<SelectButton {...props} />)
}

const MaritalButton = (props) => {
  return (<SelectButton {...props} />)
}

const ResidenceTypeButton = (props) => {
  return (<SelectButton {...props} />)
}

const EmploymentTypeButton = (props) => {
  return (<SelectButton {...props} />)
}

const IncomeTypeButton = (props) => {
  return (<SelectButton {...props} />)
}

const FrequencyButton = (props) => {
  return (<SelectButton {...props} />)
}

const AssetTypeButton = (props) => {
  return (<SelectButton {...props} />)
}

const LiabilityTypeButton = (props) => {
  return (<SelectButton {...props} />)
}

const StreetTypeButton = (props) => {
  return (<SelectButton {...props} />)
}

const StreetDirButton = (props) => {
  return (<SelectButton {...props} />)
}

export {
  SelectList,
  SelectButton,
  ContactTypeDropdown,
  IdTypeDropdown,
  CustomerRelationDropdown,
  SalutationDropdown,
  SuffixDropdown,
  GenderDropdown,
  MaritalDropdown,
  ResidenceTypeDropdown,
  EmploymentTypeDropdown,
  EmploymentStatusDropdown,
  IncomeTypeDropdown,
  FrequencyDropdown,
  MonthsDropdown,
  PercentageRateDropdown,
  AssetTypeDropdown,
  LiabilityTypeDropdown,
  StreetTypeDropdown,
  StreetDirDropdown,
  ContactTypeButton,
  IdTypeButton,
  CustomerRelationButton,
  SalutationButton,
  SuffixButton,
  GenderButton,
  MaritalButton,
  ResidenceTypeButton,
  EmploymentTypeButton,
  IncomeTypeButton,
  FrequencyButton,
  AssetTypeButton,
  LiabilityTypeButton,
  StreetTypeButton,
  StreetDirButton
} 
