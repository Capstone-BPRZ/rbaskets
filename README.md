# RBaskets: Webhooks for Capturing and Debugging API Requests


### This application allows for any RESTful api request to be captured into a user's basket. Each basket will contain a short URL for which you can use to send a request. Each basket can contain multiple requests and a user can have  many baskets. Each request contains valuable information about requests that can be inspected.

## 1. Use-Case

### Rbaskets allows users to receive webhooks on different types of api requests. This can be extremely beneficial for debugging or testing in a sandbox environment. Clients can immediately check given requests that otherwise, would go unnoticed. With Rbaskets you can quickly and conveniently view information about your api requests. 

## 2. Setup and Deployment 

## Local/Dev environment setup




1. Set up the PostgreSQL database

  	a. Create a database with a name of your choice.

 	 b. Navigate to the database and run the code in `/server/db_setup.sql`. This will set up the database schema and insert some seed data.

2. Set up the Mongo database
  a. Make sure `mongod` is installed and currently running
3. Create the file `/server/.env` and include the following data:
    DB_USER='$my_postgresql_user'
    DB_PASSWORD='$my_postgresql_password'
    DB_HOST='$my_postgresql_address'
    DB_PORT='$my_postgresql_port'
    DB_NAME='$my_postgresql_database_name'
    MONGODB_URI='$my_mongodb_uri'
4. From the root directory, run `npm install`
5. From `/server`, execute `npm run dev`
6. From `/client`, execute `npm run dev`
7. Access the frontend on `localhost:5173` in your browser. It should automatically coordinate with the backend running on `localhost:3000`. You can also send requests to backend routes directly using an API tool or REST client.


## 

## Public/ Deployed environment...

Not yet developed.  Plans for deployment coming soon. 


## 


## 3. Usage 



#### On a user's homepage you will have a New Basket button. On the right will be a section for a user's baskets. When you click on the button to create a new basket it will show the user the URL that will be associated with all requests sent to that basket. You can create many different baskets, each will be associated with their own unique URL.  Click the button and a basket will be created.  On creation you will have the abililty to go directly to the basket or return back to the home page. Next to each basket will be a button to delete any particular basket if you no longer wish to use that particular basket. 


#### Each basket has its own page where all the associated requests exists. to actually send a request a user will have to utilize the associated URL. You can send requests using tools like [Postman](https://www.postman.com/)  or the [REST Client VS Code extension](https://marketplace.visualstudio.com/items?itemName=humao.rest-client).  Both of which allow for easy ability to send requests. 

#### When you click on any basket you will be shown a new page. This page wlil show the url associated with your basket, which you can capture, the ability to delete a given basket, and all subsequent requests that have been sent to the basket below. For each request you will see the type of method alongside the exact time it was sent and the date it was sent. Next to that will be the unique part of the url associated with the basket and beneath that will be a bar for the Headers and a bar for the Body. Both of which you can toggle to display their info.  You can return home by pressing the icon in the top left. 




## 4. Developers 

### This Application was developed collaboratively as a fun opportunity to create our own personal Webhook application. 


[![bwalkerq](https://github.com/bwalkerq.png?size=100)](https://github.com/bwalkerq)  
[![philipsknapp](https://github.com/philipsknapp.png?size=100)](https://github.com/philipsknapp)  
[![ryandoesdata](https://github.com/ryandoesdata.png?size=100)](https://github.com/ryandoesdata)  
[![Kcstills17](https://github.com/Kcstills17.png?size=100)](https://github.com/Kcstills17)  
