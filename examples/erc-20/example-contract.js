const start = (input) => {
  const { applicationInput } = input
  const { contractFn } = applicationInput
  return executeMethod(contractFn, applicationInput)
}

function executeMethod(methodName, params) {
  const { spender, address, toAddress, amount } = params
  switch (methodName) {
    case 'name':
      return {
        name: FAKE_ERC20_STATE['name'],
        success: true,
      }
    case 'symbol':
      return {
        symbol: FAKE_ERC20_STATE['symbol'],
        success: true,
      }
    case 'decimals':
      return {
        decimals: FAKE_ERC20_STATE['decimals'],
        success: true,
      }
    case 'totalSupply':
      return {
        totalSupply: FAKE_ERC20_STATE['totalSupply'],
        success: true,
      }
    case 'balanceOf':
      return {
        balance: FAKE_ERC20_STATE['balances'][address] ?? 0,
        success: true,
      }
    case 'allowance':
      return {
        allowance: FAKE_ERC20_STATE['allowances'][address][spender] ?? 0,
        success: true,
      }
    case 'approve':
      return approve(address, spender, amount)
    case 'transfer':
      return transfer(address, toAddress, amount)
    default:
      throw new Error(`Unknown method: ${methodName}`)
  }
}

const approve = (address, spender, amount) => {
  if (FAKE_ERC20_STATE['balances'][address] < amount)
    return { success: false, FAKE_ERC20_STATE }
  FAKE_ERC20_STATE['allowances'][address][spender] = amount
  return { success: true, FAKE_ERC20_STATE }
}

const transfer = (address, toAddress, amount) => {
  if (FAKE_ERC20_STATE['balances'][address] < amount)
    return { success: false, FAKE_ERC20_STATE }
  FAKE_ERC20_STATE['balances'][address] -= amount
  FAKE_ERC20_STATE['balances'][toAddress] += amount
  return { success: true, FAKE_ERC20_STATE }
}

const FAKE_ERC20_STATE = {
  name: 'VRSTSERC',
  symbol: 'VRSTSERC',
  decimals: 18,
  totalSupply: 100000000,
  balances: {
    '0x1': 4200000,
    '0x2': 0,
    '0x3': 0,
    '0x4': 0,
    '0x5': 0,
    '0x6': 0,
    '0x7': 0,
    '0x8': 0,
    '0x9': 0,
    '0xa': 0,
  },
  allowances: {
    '0x1': {
      '0x2': 2000,
      '0x3': 0,
      '0x4': 0,
      '0x5': 0,
      '0x6': 0,
      '0x7': 0,
      '0x8': 0,
      '0x9': 0,
      '0xa': 0,
    },
  },
}

export default start