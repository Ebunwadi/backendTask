export const isTransactionViable = (amount: number, accountBalance: number): boolean =>
  amount > accountBalance ? false : true
