export const currency = (price: number) => {
    const currencyPrice = new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price)
    return currencyPrice
}