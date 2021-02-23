# API Documentation Guide

## Endpoints
- /users
- /cart
- /orders
- /products
- /checkout
- /auth

## Authentication
Clients are required to register to be able to proceed to authentication. On their successful login, the API response will return a `token` that clients can put it in the header. Sample login response below

```
{
    "email": "test@mail.com",
    "id": "4wuxb7otzgi7gefy83oa",
    "expires": 1614001968764
}
```

## User
**POST** body
```
{
    "email": "test@mail.com",
    "name": "John",
    "address": "Toronto",
    "password": "123456"
}
```

**PUT** body

Updatable fields is only name and address
```
{
    "name": "John",
    "address": "Toronto"
}
```

**DELETE** body

*No body*

## Auth
**POST** body (Login)
```
{
    "email": "test@mail.com",
    "password": "123456"
}
```

**DELETE** body (Logout)

*No body*

## Cart
**PUT** body
```
{
    "product": {
        "name": "Chicken",
        "price": 10,
        "location": "Refrigerated Chicken"
    }
}
```

**GET** body

*No body*

## Order
**POST** body

*No body. The API will automatically read the stored cart items*

## Product
**GET** body

*No body*

## Checkout
**POST** body

```
{
    "orderId": "x7fwnol4qofuwbde5nwc"
}
```