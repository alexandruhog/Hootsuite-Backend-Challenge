# Hootsuite Backend Interview Homework

## Techonology used:

* NodeJS with Express.js for the REST API
* Mongoose for Mongodb integration
* Mocha and Chai.js for testing
* Docker

## Development process

* Project structure:
    
    I used express generator to generate the main template and then I added my
own folders. In addition, I used the config module to store two different 
mongodb connection URIs that vary based on whether I am running the server in 
dev mode or test mode.

* Transaction schema for database:
    
    --- models/transactions.js
    
        users -- array consisting of the sender and receiver (has index)
        sender
        receiver
        date -- being computed out of the timestamp
        sum (has index)
        created_at and updated_at -- for logging
    
    I chose to index the users array and the sum field for better queries because
all the queries are made for a user and then for the sum to be greater than the
treshold.

* REST API:
    
    I used 2 controllers for the routes, one for the transactions route and one
for balance route. For better syntax, I am using the generator aproach with
co-express, because mongo queries return promises. For reducing the mongo 
overhead returned after the query, I used lean.
    
    --- controllers/transactionController.js
    
    Inserting transactions is pretty straightforward, consisting
only of getting the request body, computing the data out of the timestamp and
pushing the newly created object in the database. 
    Getting the transactions is made by doing a query with 2 criterias, one for
the user and one for the sum. After getting all the transactions for the 
specified user and treshold, I am filtering them again to match the day.
    
    --- controllers/balanceControler.js 
    
    For balance, I computed the 2 timestamps given as input and made a query with
two criterias, one for the user and the other for the date. Then, I calculated
the sum, by adding if the user was a receiver or by substracting if the user
was a sender.
    
    The controllers are used in the route.js file, where I define my api routes.
    
    I used helmet for adding http headers to better secure the app and morgan
for logging.

* Test 
    
    --- test/transactionsTest.js
    
    For testing, I used Postman for manual testing and mocha with chai and 
chai-http for script-testing. When the test script starts I am switching the 
value of the environment variable NODE_ENV to be "test", so I will connect to
the database meant for testing. I tested all the potential cases that may appear
from requesting null objects to requesting with partial queries. Also, I made
sure that requesting some objects based on criteria always fulfills.

## Dockerizing the app

*  I wrote a Dockerfile to build the server and then I linked the server with
the database by using docker-compose, where I made a container for the database
out of the mongo:3.0 image. 

* Running the dockerized app: docker-compose up
* Testing the dockerized app: docker exec -it <container-id> /bin/bash and npm 
test. 
    