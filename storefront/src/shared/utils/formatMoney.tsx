const formatMoney = (money:number) => {
  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  });

  return formatter.format(money)
}

export default formatMoney

export function formatPriceVND(price) {
  if (typeof price !== "number") {
    throw new Error("Phải là số!!");
  }

  const formattedPrice = price.toLocaleString("vi-VN", {
    style: "currency",
    currency: "VND",
  });
  return formattedPrice;
}
