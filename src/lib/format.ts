const inr = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

export function formatPrice(cents: number): string {
  return inr.format(cents / 100);
}

export function formatPaymentMethod(method: string): string {
  switch (method.toUpperCase()) {
    case "ESEWA":
      return "eSewa";
    case "COD":
      return "Cash on delivery";
    default:
      return method;
  }
}