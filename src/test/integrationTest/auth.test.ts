import chai from 'chai'
import chaiHttp from 'chai-http'
import server from '../../index'
import { db } from '../../config/firebase'

chai.should()
chai.use(chaiHttp)

const body = {
  username: 'test',
  email: 'test@gmail.com',
  password: 'test123'
}

describe('auth test', () => {
  // test register users
  it('should successfully register a user', (done) => {
    chai
      .request(server)
      .post('/api/auth/signup')
      .send(body)
      .end((err, response) => {
        response.should.have.status(201)
        response.body.should.have.property('status').eq('success')
        done()
      })
  })

  it('email must be unique', async () => {
    chai
      .request(server)
      .post('/api/auth/signup')
      .send(body)
      .end((err, response) => {
        response.should.have.status(409)
        response.body.should.have.property('status').eq('error')
      })
  })

  it('all fields must not be empty', (done) => {
    chai
      .request(server)
      .post('/api/auth/signup')
      .send({})
      .end((err, response) => {
        response.should.have.status(400)
        response.body.should.have.property('status').eq('error')
        done()
      })
  })

  // test login
  it('It should login a user with a valid email and password', (done) => {
    chai
      .request(server)
      .post('/api/auth/login')
      .send(body)
      .end((err, response) => {
        response.should.have.status(200)
        response.body.should.have.property('status').eq('success')
        done()
      })
  })

  it('It should throw an error if password doesnt match', (done) => {
    chai
      .request(server)
      .post('/api/auth/login')
      .send({
        email: 'test@gmail.com',
        password: 'test1234'
      })
      .end((err, response) => {
        response.should.have.status(400)
        response.body.should.have.property('status').eq('error')
        done()
      })
  })

  it('It should not login a user with an invalid email and password', (done) => {
    chai
      .request(server)
      .post('/api/auth/login')
      .send({
        email: 'userss',
        password: 'user'
      })
      .end((err, response) => {
        response.should.have.status(400)
        response.body.should.have.property('message').eq('invalid credentials')
        done()
      })
  })

  // home route test
  it('It should respond with hello world', (done) => {
    chai
      .request(server)
      .get('/')
      .end((err, response) => {
        response.should.have.status(200)
        response.body.should.have.property('status').eq('success')
        done()
      })
  })

  // delete user from database before the test
  before(async () => {
    const userSnapshot = await db.collection('users').where('email', '==', body.email).get()
    // grab the user details from the database
    let user = {
      id: ''
    }
    userSnapshot.forEach((doc: any) => {
      user = { id: doc.id }
    })

    await db.collection('users').doc(user.id).delete()
  })
})
