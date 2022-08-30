# The Syndicate Herald

The Syndicate Herald is a news aggregator website, that will show your daily customized news feeds. This website will 
gather news from [newsapi.org](https://newsapi.org/) API endpoints and will showcase the daily news for a user. A user can login into this 
website and choose his source preferences (news channels) and he will see the latest feed pulled up for him according 
to his preferences. Each news article will have a title, description and a link to read further about the news article.
Furthermore he can search for news articles containing keywords.

### Features:

* User Login System

* User can select his preferred news sources

* Aggregated display of all the latest news feed in a styled single page

* User can search for articles containing specific keywords

* User can see his session history

* Secure from malicious attacks

* Session-Cookie based authentication

* Bootstrap


### Technologies Used

* [Node JS](https://nodejs.org/en/)

* [Express JS](https://expressjs.com/)

* [Mongo DB](https://www.mongodb.com/)


### News Source

* [News API](https://newsapi.org/)


### Libraries and Packages used

* [Bootstrap](https://getbootstrap.com/)

* [jQuery](https://jquery.com/)
    
* [popper.js](https://popper.js.org/)    
    
* [Select2](https://select2.org/)

* [handlebars](https://handlebarsjs.com/)

* [Express Handlebars](https://www.npmjs.com/package/express-handlebars)

* [express-session](https://www.npmjs.com/package/express-session)

* [bcrypt.js](https://www.npmjs.com/package/bcryptjs)

* [body-parser](https://www.npmjs.com/package/body-parser)

* [moment](https://www.npmjs.com/package/moment)

* [uuid-mongodb](https://www.npmjs.com/package/uuid-mongodb)

* [newman](https://www.npmjs.com/package/newman)
    

### Steps to run the Project

###### Note: Make Sure `mongodb` and `npm` are installed before proceeding ahead and you have an active internet connection.

#### 1. Get the Project files:

Download these files or take a clone of the repository.


#### 2. Restore the database:

Restore the database which is included in the project files by the following command:

```$xslt
mongorestore -d thesyndicateherald db/thesyndicateherald
```

#### 3. Install the packages and the project

Install the project, packages and dependent libraries by the following command:

```$xslt
npm install
```


#### 4. Run the Server

Run the Node JS server and the website will be up and running with the following command:

```$xslt
npm start
```

###### Note: The sever run on port 3000. Please make sure the port is idle before starting the server.


#### 4. Checkout the Project

The server is now running and ready to use. Go to [localhost:3000/](http://localhost:3000/) and checkout.

#### 5. Create a user or login with existing one.

You can create a new user or login with one of the following credentials:

```$xslt
username: harry
password: hedwig
```

```$xslt
username: ron
password: scabbers
```

```$xslt
username: hermoine
password: crookshanks
```

### Things to do once the Website is running

#### 1. Select News sources.

You can select the news sources from the available list of sources:

#### 2. News Feed.

You can scroll through your News Feeds.It will contain the latest news and top headline from the sources you have selected.
 
 #### 3. Know More.
 
 You can read the News articles from the sources you selected in Step 1 and know more about it by clicking the `See More` button on each article. 

#### 4. Search for News.
 
 You can search for news from the top right corner containing keywords.

#### 5. See your sessions.

You can see your activity and their time in the Sessions tab.

### Demo

[![The Syndicate Herald](public/img/logo.png)](https://youtu.be/-i1pzRnUenw "The Syndicate Herald")