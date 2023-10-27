import chai from 'chai'
import chaiHttp from 'chai-http'
import server from '../../index'
import jwt, { Secret } from 'jsonwebtoken'

chai.should()
chai.use(chaiHttp)

const body = {
  amount: 50
}
const id = '8Wqe9cgRz3T0onmmFHLT'
const wrongId = 't655dfhdfggzdgs'
const receiverId = '3CGCqzNaOMSSty2GcgVy'
const token = jwt.sign({ id }, process.env.JWT_TOKEN_SECRET as Secret, { expiresIn: '15m' })

describe('payment test', async () => {
  // test credit API endpoint
  it('should successfully receive funds', (done) => {
    chai
      .request(server)
      .post(`/api/credit/${id}`)
      .send(body)
      .end((err, response) => {
        response.should.have.status(200)
        response.body.should.have.property('status').eq('success')
        done()
      })
  })

  it('should throw an error if the id is not found in our database', async () => {
    chai
      .request(server)
      .post(`/api/credit/${wrongId}`)
      .send(body)
      .end((err, response) => {
        response.should.have.status(400)
        response.body.should.have.property('status').eq('error')
      })
  })

  it('should throw an error if the req url is wrong', async () => {
    chai
      .request(server)
      .get(`/api/credit/${wrongId}`)
      .send(body)
      .end((err, response) => {
        response.should.have.status(404)
        response.body.should.have.property('status').eq('error')
      })
  })

  // test debit Api endpoint
  it('field must not be empty', (done) => {
    chai
      .request(server)
      .post(`/api/debit`)
      .set('authorization', `Bearer ${token}`)
      .send({})
      .end((err, response) => {
        response.should.have.status(400)
        response.body.should.have.property('status').eq('error')
        done()
      })
  })

  it('should throw an error if amount is greater than account balance', (done) => {
    chai
      .request(server)
      .post('/api/debit')
      .set('authorization', `Bearer ${token}`)
      .send({
        amount: 500000
      })
      .end((err, response) => {
        response.should.have.status(400)
        response.body.should.have.property('status').eq('error')
        done()
      })
  })

  it('should debit successfully', async () => {
    chai
      .request(server)
      .post(`/api/debit`)
      .set('authorization', `Bearer ${token}`)
      .send(body)
      .end((err, response) => {
        response.should.have.status(200)
        response.body.should.have.property('status').eq('success')
      })
  })

  // test show balance api
  it('It should show users balance', (done) => {
    chai
      .request(server)
      .get('/api/balance')
      .set('authorization', `Bearer ${token}`)
      .end((err, response) => {
        response.should.have.status(200)
        response.body.should.have.property('status').eq('success')
        done()
      })
  })

  it('It should show throw error if user doesnt have a token', (done) => {
    chai
      .request(server)
      .get('/api/balance')
      .end((err, response) => {
        response.should.have.status(401)
        response.body.should.have.property('status').eq('error')
        done()
      })
  })

  // test send funds to other users
  it('It should throw error if user wants to send money to himself', (done) => {
    chai
      .request(server)
      .post(`/api/send/${id}`)
      .set('authorization', `Bearer ${token}`)
      .send(body)
      .end((err, response) => {
        response.should.have.status(400)
        response.body.should.have.property('status').eq('error')
        done()
      })
  })

  it('It should show throw error if no receiver exists', (done) => {
    chai
      .request(server)
      .post(`/api/send/${wrongId}`)
      .set('authorization', `Bearer ${token}`)
      .send(body)
      .end((err, response) => {
        response.should.have.status(400)
        response.body.should.have.property('status').eq('error')
        done()
      })
  })

  it('It should send funds all things being equal', (done) => {
    chai
      .request(server)
      .post(`/api/send/${receiverId}`)
      .set('authorization', `Bearer ${token}`)
      .send({
        amount: 5
      })
      .end((err, response) => {
        response.should.have.status(200)
        response.body.should.have.property('status').eq('success')
        done()
      })
  })

  it('should throw an error if amount is greater than account balance', (done) => {
    chai
      .request(server)
      .post(`/api/send/${receiverId}`)
      .set('authorization', `Bearer ${token}`)
      .send({
        amount: 500000
      })
      .end((err, response) => {
        response.should.have.status(400)
        response.body.should.have.property('status').eq('error')
        done()
      })
  })
})
