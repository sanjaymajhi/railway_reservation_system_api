# BookYourJourney.com

This app is made for private railway companies to add their trains in database and made the website available to users for booking.

## Uses : 
1. Create stations, connect them via routes and schedule trains on these routes.
2. Login and register for users
3. Train search using src, dest, class and date.
4. Get train list and see seat availability
5. Payment for booking via Razorpay Api
6. PNR status checking
7. Ticket cancellation using Razorpay API

## Technology Used (Back End) : 

1. NodeJS + ExpressJS
2. MongoDB Atlas + Mongoose ODM
3. JSON Web Tokens
4. Razorpay payment links API

Client repo : https://github.com/sanjaymajhi/railway_reservation_system_client

## Env File : 
create .env file in the root directory and put this :
```
MONGODB_URI=<generate from mongodb atlas website>
```

## How to use : 
1. clone this repo
2. clone the API repo
3. Make .env files in both directories
4. do npm install in both directories
5. Now in bash, type npm run start-both (in backend folder bash)

# Project Deployed in Heroku PaaS

Website : https://bookyourjourney.herokuapp.com

