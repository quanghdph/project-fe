export const getValueByName = (data: any,  name: string) => {
    const dataFilter = data.length && data.filter((item: any) => item.name === `${name}`).map((item: any) => item.value)
    
    const options = dataFilter.length > 0 ? {
        name: name,
        value: dataFilter
    } : null
    return options
}

export const removeEmpty = (obj : any) =>  {
    return Object.fromEntries(Object.entries(obj).filter(([_, v]) => v != null));
}

export const getCategorySelectName = (data: any) => {
    const result = data.map((e: any) => {
        const {categoryName, id} = e
        return {
            value: id,
            label: categoryName
        }
    })
    return result;
}
export const getBrandSelectName = (data: any) => {
    const result = data.map((e: any) => {
        const {brandName, id} = e
        return {
            value: id,
            label: brandName
        }
    })
    return result;
}
export const getMaterialSelectName = (data: any) => {
    const result = data.map((e: any) => {
        const {materialName, id} = e
        return {
            value: id,
            label: materialName
        }
    })
    return result;
}
export const getWaistbandSelectName = (data: any) => {
    const result = data.map((e: any) => {
        const {waistbandName, id} = e
        return {
            value: id,
            label: waistbandName
        }
    })
    return result;
}