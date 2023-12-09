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