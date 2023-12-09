import { Collapse, Box } from '@chakra-ui/react'
import React, { Fragment, useState } from 'react'
import { Checkbox, Slider } from 'antd'
import { ChevronDown } from 'react-feather'
import { createAxiosClient } from 'src/axios/axiosInstance'
import { Cateogry, IAxiosResponse, ProductOption } from 'src/shared/types'
import type { CheckboxValueType } from 'antd/es/checkbox/Group';
import { uniqBy } from 'lodash'

interface CategoryList {
    categories: Cateogry[]
    totalPage: number
    total: number
    skip: number
    take: number
}

interface FilterProductProps {
    setFilterCategories: (filterCategories: number[]) => void
    setPrice: (price: number) => void
    price: number
    setSize: (size: number[]) => void
    setColor: (color: number[]) => void
}
const FilterProduct = ({ setFilterCategories, setPrice, price, setColor, setSize }: FilterProductProps) => {
    // ** State
    const [categories, setCategories] = React.useState<CategoryList>()
    const [take, setTake] = useState<number>(12)
    const [skip, setSkip] = useState<number>(0)
    const [cateCb, setCateCb] = useState<boolean>(true)
    const [optCb, setOptCb] = useState<boolean>(true)
    const [options, setOptions] = useState<ProductOption[]>()

    // ** Variables
    const axiosClient = createAxiosClient();

    // ** Effect
    React.useEffect(() => {
        axiosClient.get(`category`, {
            params: {
                skip,
                take,
                status: "active"
            }
        }).then((res) => {
            const result = { ...res } as unknown as IAxiosResponse<Cateogry[]>
            setCategories(result.response.data as unknown as CategoryList)
        })
        axiosClient.get(`product/options`).then((res) => {
            const result = { ...res } as unknown as IAxiosResponse<ProductOption[]>
            setOptions(result.response.data as unknown as ProductOption[])
        })
    }, [skip, take])

    const optionsCategoriesToRender = () => {
        if (categories) {
            return categories.categories.map((category) => {
                return {
                    label: category.category_name,
                    value: category.id
                }
            })
        }
        return []
    }

    const onChange = (checkedValues: CheckboxValueType[]) => {
        setFilterCategories([...checkedValues] as number[])
    };

    const onChangePrice = (price: number) => {
        setPrice(price)
    }

    const optsSizeToRender = (optName: string) => {
        if (options) {
            const opts = options.filter((option) => option.name === optName)
            return uniqBy(opts, "value").map((opt) => {
                return {
                    label: opt.value,
                    value: opt.value
                }
            })
        }
    }

    const onChangeSize = (checkedValues: CheckboxValueType[]) => {
        setSize([...checkedValues] as number[])
    }

    const onChangeColor = (checkedValues: CheckboxValueType[]) => {
        setColor([...checkedValues] as number[])
    }

    return (
        <Fragment>
            <div className='uppercase font-bold'>Filters</div>
            <div>
                <div className='flex flex-row justify-between mt-3'>
                    <p className='font-semibold'>Categories</p>
                    <ChevronDown size={24} onClick={() => setCateCb(!cateCb)} className={`cursor-pointer`} />
                </div>
                <Collapse in={cateCb} animateOpacity >
                    <Checkbox.Group options={optionsCategoriesToRender()} onChange={onChange} style={{ display: "flex", flexDirection: "column" }} />
                </Collapse>
            </div>
            <div>
                <div className='flex flex-row justify-between mt-3'>
                    <p className='font-semibold'>Options</p>
                    <ChevronDown size={24} onClick={() => setOptCb(!optCb)} className={`cursor-pointer`} />
                </div>
                <Collapse in={optCb} animateOpacity>
                    <div className='mb-2'>
                        <div className='mb-1 font-semibold'>Size</div>
                        <Checkbox.Group options={optsSizeToRender("Size")} onChange={onChangeSize} style={{ display: "flex", flexDirection: "column" }} />
                    </div>
                    <div className='mb-2'>
                        <div className='mb-1 font-semibold'>Color</div>
                        <Checkbox.Group options={optsSizeToRender("Color")} onChange={onChangeColor} style={{ display: "flex", flexDirection: "column" }} />
                    </div>
                </Collapse>
            </div>
            <div>
                <div className='flex flex-row justify-between mt-3'>
                    <p className='font-semibold'>Price</p>
                </div>
                <Slider value={price} onChange={onChangePrice} min={0} max={1000} />
            </div>
        </Fragment>
    )
}

export default FilterProduct