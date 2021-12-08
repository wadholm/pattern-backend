# pattern API
[![Build Status](https://app.travis-ci.com/wadholm/pattern-backend.svg?branch=main)](https://app.travis-ci.com/wadholm/pattern-backend)

This API is built as a part of the course pattern at BTH.

### users

A user has the following attributes:
```
_id
firstname
lastname
email
password
phone
payment_method
card_information
balance
account_status
```

### admins

An admin has the following attributes:
```
_id
username
password
```

### cities

A city has the following attributes:
```
_id
name
coordinates
charge_stations
parking_stations
```

### parking_stations and charge_stations

A station has the following attributes:
```
_id
name
coordinates
```

### bikes

A bike has the following attributes:
```
_id
city_id
charge_id
parking_id
bike_status
battery_status
coordinates
maintenance
```

### trips

A trip has the following attributes:
```
_id
user_id
bike_id
start_time
start_coordinates
average_speed
distance
price
stop_time
stop_coordinates
```

### prices

A price has the following attributes:
```
_id
starting_fee
price_per_minute
penalty_fee
discount
```

### api_users

An api_user has the following attributes:
```
_id
email
api_key
```

#### Request api key
```
POST /api/register
```

Required parameters:
```
email
```
Result:
```
{
    "message": "Succesfully created an api key",
    "createdApi": {
        "_id": "61b0d06bc538ad2053787cd6",
        "email": "hi@example.com",
        "api_key": "longandrandomapikey"
    }
}
```


#### To get all users
```
GET /users
```
Result:
```
{
    "count": 2,
    "users": [
        {
            "_id": "619f6ee3d0b6c914a2b58514",
            "firstname": "John",
            "lastname": "Doe",
            "email": "john@exampple.com",
            "password": "password",
            "phone": "+4412345678",
            "payment_method": "unknown",
            "card_information": "unknown",
            "balance": 0,
            "account_status": "active"
        },
        {
            "_id": "619f767f6736ee4a118b900a",
            "firstname": "Jane",
            "lastname": "Doe",
            "email": "jane@example.com",
            "password": "pass",
            "phone": "+4412345679",
            "payment_method": "unknown",
            "card_information": "unknown",
            "balance": 99.99,
            "account_status": "deleted"
        }
    ]
}
```


## Available Scripts

In the project directory, you can run:

```
npm start
```

Runs the app in the development mode.  
Open [http://localhost:1337](http://localhost:1337) to view it in the browser.

You will also see any lint errors in the console.

```
npm run watch
```

Runs the app in the development mode.  
The page will reload if you make edits.  
You will also see any lint errors in the console.

```
npm run production
```

Runs the app in the production mode.  

```
npm run test
```

Runs the test suite.  
