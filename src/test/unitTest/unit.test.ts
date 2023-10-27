import { generateToken } from '../../utils/generateToken'
import { isTransactionViable } from '../../utils/isTransactionViable'
import chai from 'chai'

chai.should()

describe('testing utils functions', () => {
  // test isTransactionViable function
  it('should return false if amount is greater that account balance', () => {
    const result = isTransactionViable(20, 12)
    result.should.be.false
  })
  it('should return true if amount is less that account balance', () => {
    const result = isTransactionViable(20, 22)
    result.should.be.true
  })

  // test generateToken function
  it('should generate a token successfully', () => {
    const result = generateToken('20')
    result.should.be.a.string
  })
})
