export const currency = (price: number) => {
  const currencyPrice = new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(price);
  return currencyPrice;
};

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
