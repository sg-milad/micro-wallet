# NestJS App

### Installation

```bash
#1. clone the project
$ git clone https://github.com/sg-milad/micro-wallet
#2. go to directory
$ cd /micro-wallet
$ cp .env.example .env
$ docker-compose up
#3. wait a couple of minutes ...
```
### [Swagger Documentation for User Service](https://localhost:3000/doc)
### [Swagger Documentation for Wallet Service](https://localhost:3001/doc)

# User

## Create User

POST /api/user

## get User by ID

Get /api/user/{id}

## Patch User

#### update user info

Patch /api/user/{id}
-----

# Wallet

## PATCH

#### patch amount wallet

PAtch /api/user/{id}/amount

## GET

#### get user amount

GET /api/user/{id}/amount
