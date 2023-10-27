# A Payment System Service

### Project Description.
This is basically a payment system that allows users to send receive and funds 

[link to the api documentation with postman](https://documenter.getpostman.com/view/10653175/2s9YRGw8Ee)
## Routes

The API has these endpoints.

#### No Auth Routes

- `POST /api/auth/signup` Creates an account for users
- `POST /api/auth/login` Allows users login with valid info
- `POST /api/credit` Allows users to be credited.

#### Auth Route

- `POST /api/debit` Allows users to be debited
- `POST /send/:id` Allows users to send funds to other users
- `GET /balance` Allows users to view their current balance.

### This is how the Schema looks like

```
userSchema
{
    username : {
    type: string,
    requireed: true
},
    email: {
    type: string,
    requireed: true,
    unique: true
},
    password: {
    type: string,
    requireed: true
},
    accountBalance: {
    type: number,
    default: 0
},
}

```

## Run the app

you can clone this repo.
   ` $ git clone https://github.com/backendTask.git`

or download the zip file

run ` npm install ` or ` yarn install ` to install dependencies and ` npm start ` or ` yarn install ` to start the app

if you are using ` yarn install ` you may want to delete the ` package.lock.json ` file as this project was run with npm

## Things to note

- This project uses typescript-eslint and prettier as the code style guide and code formatter, feel free to use any other of your choice like airbnb etc
- There is a `.env.sample` file to hint on some of the environment variables used in this app
- This project used firestore for data persistence. there is a `serviceAccountSample.json` in the `src/config` which gives an example of the serviceAcccount files provided by firebase. visit [firebase](https://console.firebase.google.com), create a dummy app and name the collection "users" to get started
- Run the test cases using ` npm run test ` which uses `mocha` for the test and `nyc` for test coverage. read the comment left on the `test/integrationTest/auth.ts` file before running the test. Also you can increase the rate limit in the `src/config/rateLimiter.ts`to allow you run the test cases a couple of times if you wish to.

view the schema diagram below

 ![alt text](https://github.com/Ebunwadi/backendTask/blob/main/src/model/schema.png)

  







