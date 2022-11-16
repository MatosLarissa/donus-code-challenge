# Desafio de Código Donus

- [Back-end](backend.md)

#### 📋 Documentação: https://documenter.getpostman.com/view/18385856/2s8YmLuNUK


## First steps

#### To run in a docker container:
 - $ cd donus-code-challenge
 - $ docker-compose up --build -d

* URL base: http://localhost:3011/user


#### To clone this repository
* Run `npm install` to add the dependencies
* Create an .env file at the project root and fill in the following keys with the appropriate example values:
   ```
    #APP
    HOST=0.0.0.0
    PORT=3011
    NODE_ENV=production

    #DATABASE
    DB_HOST=127.0.0.1
    DB_USER=root
    DB_PASSWORD=password
    DB_SCHEMA=sys

    #TOKEN
    ACCESS_TOKEN_EXPIRES_IN=65000
    JWT_KEY=12strong142

   ```

* Run `npm run migrations` to add the tables to the database (if successful, the server will be ready to receive requests) 

## 🛠️ Technologies used:

→ MySql;

→ Express;

→ Knex;

→ Node.js:

→ Typescript;

→ Dotenv;

→ Cors;

→ BCRYPT;

→ UUID;

→ JWToken;

<br/>



## Requirements:

<ol>
  <li> Create customer account. </li>
  <li> Login to customer account. </li>

  <li> Create customer card. </li>
  <li> Search customer card. </li>

  <li> Customer deposits into his own account with debit or credit mode. </li>
  <li> The customer deposits into another customer's account with debit or credit mode.</li>
  <li> Get customer transaction history. </li>
  <li> Get the customer's transaction history by transfer type, debit or credit.</li>
</ol>
<br><br>

### Example of registration objects

#### Post > Sing up
* URL: http://localhost:3011/user/signup

```
{
    "fullName": "Robin Hood",
    "cpf": "98765432131231",
    "email": "robinho@email.com",
    "password": "Hood1377"
}
```

<br>

#### Post > Sing in
* URL: http://localhost:3011/user/login
```
{
    "email": "robinho@email.com",
    "password": "Hood1377"
}
```

<br>

#### Post > Create card customer
* URL: http://localhost:3011/user/createCard
```
{
   "cardCustomerName": "Robin Hood",
   "cardNumber": "765432131231",
   "amount": 100,
   "cvv": "321"
}
```

<br>

#### Get > Get card by customer
* URL: http://localhost:3011/user/card/all
```
{
    "Authorization": "jwt-token"
}
```

<br>

#### Post > Deposit payable
* URL: http://localhost:3011/user/depositPayable
```
{
   "paymentMethod": "CREDIT_CARD",
   "value": 2000,
   "description": "Pagamento do mês de Novembro",
   "cardNumber": "765432131231",
   "cvv": "321"
}
```

<br>

#### Post > Transfer payable
* URL: http://localhost:3011/user/transferPayable
```
{
   "paymentMethod": "DEBIT_CARD",
   "value": 2000,
   "description": "Pagando o melhor amigo",
   "cardNumber": "765432131231",
   "cvv": "321",
   "idTransferCustomer" : "c9f87f38-a47b-48c6-9ca9-dd248d3b32d2"
}
```

<br>

#### Get > All payable by customer
* URL: http://localhost:3011/user/allpayable
```
{
    "Authorization": "jwt-token"
}
```

<br>

#### Get > All payable by status
* URL: http://localhost:3011/user/payable/status
```
{
    "status": "WAITING_FUNDS"
}
```

<br>

## Technologies:

<ol> 
  <li> The password must be validated via hash (salt + pass = hash for validation and jwt).  </li>
  <li> The login must return a token to be used in the other routes.  </li>
  <li> Access to application routes (with the exception of user registration), must be done by passing the token obtained at login via Auth - Bearer Token in the request.  </li>
  <li> The api must be REST.  </li>
  <li> TDD. Add the command to run the tests in package.json.</li>
  <li> Database (MySQL).  </li>
  <li> Optional - SOLID can be applied in the application.  </li>
  <li> App and database running on Docker.  </li>
</ol>

## Tech:

<p style="text-align: justify;"> The API must be made with Javascript, Typescript to run in NodeJS. </p>
