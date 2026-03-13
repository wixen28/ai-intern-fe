export function formatMoneyParts(dollars: number) {
  if (dollars < 1) {
    const cents = dollars * 100
    const full = cents.toFixed(4)
    const [main, decimals = "00"] = full.split(".")

    return {
      unit: "¢",
      main,
      decimals: decimals.slice(0, 2)
    }
  }

  const full = dollars.toFixed(4)
  const [main, decimals = "00"] = full.split(".")

  return {
    unit: "$",
    main,
    decimals: decimals.slice(0, 2)
  }
}