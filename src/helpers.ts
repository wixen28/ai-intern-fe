export function formatMoneyParts(dollars: number) {
  const full = dollars.toFixed(4)
  const [whole, decimals = "0000"] = full.split(".")

  return {
    main: `$${whole}.${decimals.slice(0, 2)}`,
    subtle: decimals.slice(2, 4)
  }
}