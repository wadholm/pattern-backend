# pattern API
[![Build Status](https://app.travis-ci.com/wadholm/pattern-backend.svg?branch=main)](https://app.travis-ci.com/wadholm/pattern-backend)
[![Scrutinizer Code Quality](https://scrutinizer-ci.com/g/wadholm/pattern-backend/badges/quality-score.png?b=main)](https://scrutinizer-ci.com/g/wadholm/pattern-backend/?branch=main)
[![Build Status](https://scrutinizer-ci.com/g/wadholm/pattern-backend/badges/build.png?b=main)](https://scrutinizer-ci.com/g/wadholm/pattern-backend/build-status/main)
[![Coverage Status](https://coveralls.io/repos/github/wadholm/pattern-backend/badge.svg?branch=main)](https://coveralls.io/github/wadholm/pattern-backend?branch=main)


This API is built as a part of the course pattern at BTH.

### REST-API with manual is available at:
https://pattern-api.herokuapp.com/

### users

A user has the following attributes:
```
_id
firstname
lastname
email
password
phone
city
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
latest_trip
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
http://localhost:1337/key
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
