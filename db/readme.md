# The Syndicate Herald

## Database Schema

### Users

The Users collection will store all users and their information and preferences, likes and dislikes. 
Users will be able to login, update their profile, and like/dislike news post and share.

```
{
    "_id":UUID("14ce2dfb-de99-47b9-9347-30b8db7db50e"),
    "firstName":"Harry",
    "lastName":"Potter",
    "username":"theboywholived",
    "email":"harry.potter@hogwarts.wiz",
    "hashedPassword":"$2a$08$XdvNkfdNIL8Fq7l8xsuIUeSbNOFgK0M0iV5HOskfVn7.PWncShU.O",
    "sources":[
        "abc-news",
        "axios",
        bbc-news"
    ],
    "categories":[
        "science",
        "entertainment"
    ],
    "liked":[
        UUID("4d4e8646-f092-4733-9eb2-a04ed5e5a30c"),
        UUID("50e49c7d-1c52-4f0f-a84a-464a6c1369ea")
    ],
    "disLiked":[
        UUID("7c78a407-2ff3-470a-83b6-e311aa6b9a11")
    ],
    "sent":[
        {
            "newsId": UUID("0e7bf31a-17d1-4a5f-a3b4-aae15973372e")
            "to": UUID("5d91e9ce-1aa4-459e-ae62-b5c3e0393acf"),
            "sentAt": "2019-11-16T19:16:07Z"
        },
        {
            "newsId": UUID("f2abbb11-d25b-438b-8bab-1fd0a247252f")
            "to": UUID("f2abbb11-d25b-438b-8bab-1fd0a247252f"),
            "sentAt": "2019-10-15T10:21:55Z"
        }
    ]
    "received":[
        {
            "newsId": UUID("7cc89ecb-a579-40f7-906f-58463767e8fe")
            "from": UUID("662d4641-b678-4468-927d-b4d872f9407c"),
            "receivedAt": "2019-11-10T19:51:00Z"
        }
    ],
 }
```

<br/>
<br/>
<br/>
<br/>
<br/>
<br/>
<br/>
  
| Name              | Type                      | Description                                                       |
| ----------------- |---------------------------| ------------------------------------------------------------------|
| _id               | UUID string               | A UUID to represent the User                                      |
| firstName         | string                    | First name of the User                                            |
| lastName          | string                    | Last name of the User                                             |
| username          | string                    | Username of the User, that will be used on the website            |
| email             | string                    | Email id of the User                                              |
| hashedPassword    | string                    | A bcrypted string that is a hashed version of the User's password |
| sources           | array of strings          | Array of user's News source preferences                           |
| categories        | array of strings          | Array of user's News category preferences                         |
| liked             | array of UUID strings     | Array of News references liked by the User                        |
| disLiked          | array of UUID strings     | Array of News references disliked by the User                     |
| sent              | array of News Sent        | Array of News Sent objects ie. news shared with other Users       |
| received          | array of News Received    | Array of News Received objects ie. news shared by other Users     |

<div style="page-break-after: always;"></div>

### News Sent
###### Sub document, not stored in separate collection

```
{
    "newsId": UUID("0e7bf31a-17d1-4a5f-a3b4-aae15973372e")
    "to": UUID("5d91e9ce-1aa4-459e-ae62-b5c3e0393acf"),
    "sentAt": "2019-11-16T19:16:07Z"
}
```

| Name      | Type              | Description                                                   |
| ----------|-------------------| --------------------------------------------------------------|
| newsId    | UUID string       | A UUID referencing the News                                   |
| to        | UUID string       | A UUID referencing the User to whom the News was shared with  |
| sentAt    | datetime string   | A datetime string when the News was shared                    |

### News Received
###### Sub document, not stored in separate collection

```
{
    "newsId": UUID("7cc89ecb-a579-40f7-906f-58463767e8fe")
    "from": UUID("662d4641-b678-4468-927d-b4d872f9407c"),
    "receivedAt": "2019-11-10T19:51:00Z"
}
```

| Name          | Type              | Description                                       |
| --------------|-------------------| --------------------------------------------------|
| newsId        | UUID string       | A UUID referencing the News                       |
| from          | UUID string       | A UUID referencing the User who shared the News   |
| receivedAt    | datetime string   | A datetime string when the News was shared        |

<br/>
<br/>
<br/>
<br/>

### News

The News collection will store all the news that has been liked/disliked or shared by any User.

```
{
    "_id":UUID("76eb7d84-af99-451d-8b0a-ea6d4a5626f7"),
    source": {
        "id": "fox-news",
        "name": "Fox News"
    },
    "author": "Chris Irvine",
    "title": "Alabama's Tua Tagovailoa carted off field 'screaming in pain' - Fox News",
    "description": "Alabama quarterback and potential Number 1 overall draft pick Tua Tagovailoa was carted
    off the field Saturday with an apparent hip injury after being dragged down by two Mississippi State
    defenders.",
    "url": "https://www.foxnews.com/sports/alabama-tua-tagovailoa-carted-off-field",
    "urlToImage": "https://static.foxnews.com/foxnews.com/content/uploads/2019/11/Tua-2-Getty.jpg",
    "publishedAt": "2019-11-16T19:16:07Z",
    "content": "Alabama quarterback and potential No. 1 overall draft pick Tua Tagovailoa was carted off
    the field Saturday with an apparent hip injury after being dragged down by two Mississippi State
    defenders.\r\nWith three minutes left in the second quarter, Tagovailoa scr… [+2139 chars]"
    "likedBy": [
        UUID("14ce2dfb-de99-47b9-9347-30b8db7db50e")
    ],
    "dislikedBy": [
    ]
 }
```

| Name          | Type                  | Description                                       |
| ------------- |-----------------------| --------------------------------------------------|
| _id           | UUID string           | A UUID to represent the News                      |
| source        | A Source object       | Source of the News                                |
| author        | string                | Author of the News                                |
| title         | string                | Title of the News                                 |
| description   | string                | A small description of the News                   |
| url           | url string            | URL to the News article                           |
| urlToImage    | url string            | URL to the image associated with the News         |
| publishedAt   | datetime string       | Datetime when the News was published              |
| content       | string                | Content of the News                               |
| likedBy       | array of UUID strings | Array of User references who liked the News       |
| dislikedBy    | array of UUID strings | Array of User references who disliked the News    |

### Source
###### Sub document, not stored in separate collection

```
{
    "id": "fox-news",
    "name": "Fox News"
}
```

| Name  | Type      | Description                   |
| ------|-----------| ------------------------------|
| id    | string    | id string of the News source  |
| name  | string    | Name of the News source       |

<br/>

### Sessions
The Sessions document will store the User login sessions and. The `Sessions._id` will be used as the session id for the 
User
```
{
    "_id": UUID("59edb1a7-41f7-4466-a26a-399ccc2271e7")
    "userId": UUID("8d12cb07-c008-4785-9c66-ddaae4d390bb"),
    "startTime": "2019-11-10T19:51:00Z",
    "endTime": "2019-11-10T20:43:38Z",
    "isActive": false
}
```

| Name          | Type              | Description                                                   |
| --------------|-------------------| --------------------------------------------------------------|
| _id           | UUID string       | A UUID to represent a Session                                 |
| userId        | UUID string       | A UUID referencing the User                                   |
| startTime     | datetime string   | Start time of the session                                     |
| endTime       | datetime string   | End time of the session                                       |
| isActive      | boolean           | Boolean value to represent if the session is active or not    |