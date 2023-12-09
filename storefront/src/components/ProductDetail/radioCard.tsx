import { Box, HStack, useRadio, useRadioGroup } from '@chakra-ui/react'
import React from 'react'

// @ts-ignore: Unreachable code error
export const RadioCard = (props) => {
  const { type, valueSelect } = props
  const { getInputProps, getRadioProps } = useRadio(props)

  const input = getInputProps()
  const checkbox = getRadioProps()

  return (
    <>
      {
        type === 'color' ? (
          <Box as='label'>
            <input {...input} />
            <Box
              {...checkbox}
              cursor='pointer'
              borderWidth='1px'
              borderColor='#dddddd'
              borderRadius='full'
              boxSizing='border-box'
              backgroundColor={props.value}
              boxShadow='inset 0px 0px 0px 2px #fff'
              _checked={{
                bg: props.value,
                borderColor: '#717fe0',
                boxShadow: 'inset 0px 0px 0px 1px #717fe0'
              }}
              _focus={{
                boxShadow: 'none'
              }}
              px={4}
              py={4}
            >
              {props.children}
            </Box>
          </Box>
        ) : (
          <Box as='label'>
            <input {...input} />
            <Box
              {...checkbox}
              cursor='pointer'
              borderWidth='1px'
              _checked={{
                bg: '#717fe0',
                color: 'white',
                borderColor: '#717fe0',
              }}
              _focus={{
                boxShadow: 'none',
              }}
              px={4}
              py={1}
            >
              {props.children}
            </Box>
          </Box>
        )
      }
    </>
  )
}

const RadioButtonCard = (props: any) => {
  const { options, type, valueSelect, onChangeRadio } = props
  console.log('valueSelect', valueSelect)
  const { getRootProps, getRadioProps } = useRadioGroup({
    name: 'framework',
    onChange: onChangeRadio,
  })

  const group = getRootProps()

  return (
    <HStack {...group}>
      {options.map((value: string) => {
        const radio = getRadioProps({ value })
        return (
          <RadioCard key={value} {...radio} type={type} valueSelect={valueSelect}>
            {type === 'size' ? value : null}
          </RadioCard>
        )
      })}
    </HStack>
  )
}

export default RadioButtonCard