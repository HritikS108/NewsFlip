const MUUID = require('uuid-mongodb');


const bcrypt = require('bcryptjs');
const salt = bcrypt.genSaltSync(8);

const collections = require("./collection");

const users = collections.users;

async function addUser(newUser) {
    const error = new Error();
    error.http_code = 200;
    const errors = {};

    if (newUser === undefined || newUser === null) {
        errors['user'] = "user object not defined";
        error.http_code = 400
    } else if (typeof newUser !== "object") {
        errors['user'] = "invalid type of user";
        error.http_code = 400
    }

    if (!newUser.hasOwnProperty("firstName")) {
        errors['firstName'] = "missing property";
        error.http_code = 400
    }

    if (!newUser.hasOwnProperty("lastName")) {
        errors['lastName'] = "missing property";
        error.http_code = 400
    }

    if (!newUser.hasOwnProperty("username")) {
        errors['username'] = "missing property";
        error.http_code = 400
    }

    if (!newUser.hasOwnProperty("email")) {
        errors['email'] = "missing property";
        error.http_code = 400
    }

    // if (!validator.isEmail("email")) {
    //     errors['email'] = "invalid type";
    //     error.http_code = 400
    // }

    if (!newUser.hasOwnProperty("password")) {
        errors['password'] = "missing property";
        error.http_code = 400
    }

    if (error.http_code !== 200) {
        error.message = JSON.stringify({'errors': errors});
        throw error
    }


    newUser._id = MUUID.v4();
    newUser.hashedPassword = bcrypt.hashSync(newUser.password, salt);
    delete newUser.password;
    newUser.sources = [];
    newUser.categories = [];
    newUser.liked = [];
    newUser.disliked = [];
    newUser.sent = [];
    newUser.received = [];

    const usersCollection = await users();

    const user = await usersCollection.findOne({username: newUser.username});

    if (user) {
        errors['username'] = "username unavailable";
        error.http_code = 400;
        error.message = JSON.stringify({'errors': errors});
        throw error
    }


    const insertInfo = await usersCollection.insertOne(newUser);

    if (insertInfo.insertedCount === 0) {
        error.message = JSON.stringify({
            'error': "could not create user",
            'object': newUser,
            'errors': errors
        });
        error.http_code = 400;
        throw error
    }

    const newId = insertInfo.insertedId.toString();

    return await getUserById(newId);
}

async function updateUser(userId, updatedUser, addSource = false) {
    const error = new Error();
    error.http_code = 200;
    const errors = {};

    if (updatedUser === undefined || updatedUser === null) {
        errors['user'] = "user object not defined";
        error.http_code = 400
    } else if (addSource) {
        if (typeof updatedUser === "string") {
            updatedUser = [updatedUser]
        } else if (updatedUser.length === 0) {
            updatedUser = ['bbc-news'];
            // errors['sources'] = "invalid type of sources";
            // error.http_code = 400
        }
    } else if (typeof updatedUser !== "object") {
        errors['user'] = "invalid type of user";
        error.http_code = 400
    }

    if (error.http_code !== 200) {
        error.message = JSON.stringify({'errors': errors});
        throw error
    }

    try {
        const user = await getUserById(userId);

        const usersCollection = await users();

        if (addSource) {
            return await usersCollection.updateOne({_id: user._id}, {$push: {"sources": {$each: updatedUser}}})
                .then(async function (updateInfo) {
                    if (updateInfo.modifiedCount === 0) {
                        error.message = JSON.stringify({
                            'error': "could not update user",
                            'object': updatedUser,
                            'errors': errors
                        });
                        error.http_code = 400;
                        throw error
                    }
                    return await getUserById(userId);
                });
        } else {
            return await usersCollection.updateOne({_id: user._id}, {$set: updatedUser})
                .then(async function (updateInfo) {
                    if (updateInfo.modifiedCount === 0) {
                        error.message = JSON.stringify({
                            'error': "could not update user",
                            'object': updatedUser,
                            'errors': errors
                        });
                        error.http_code = 400;
                        throw error
                    }
                    return await getUserById(userId);
                });
        }
    } catch (e) {
        throw e
    }
}

async function getUserById(userId, ...projection) {
    const error = new Error();
    error.http_code = 200;
    const errors = {};

    if (userId === undefined || userId === null) {
        errors['id'] = "id is not defined";
        error.http_code = 400
    }

    if (typeof userId === "string") {
        try {
            userId = MUUID.from(userId);
        } catch (e) {
            errors['id'] = e.message;
            error.http_code = 400;
            error.message = JSON.stringify({
                errors: errors
            });
            throw error
        }
    } else {
        try {
            MUUID.from(userId);
        } catch (e) {
            errors['id'] = "id is not defined";
            error.http_code = 400;
            error.message = JSON.stringify({
                errors: errors
            });
            throw error
        }
    }

    const usersCollection = await users();

    let user;
    if (projection.length) {
        user = await usersCollection.findOne({_id: userId}, {projection: projection});
    } else {
        user = await usersCollection.findOne({_id: userId}, {
            projection: {
                "hashedPassword": false,
                "liked": false,
                "disliked": false,
                "sent": false,
                "received": false
            }
        });
    }

    if (user === null) {
        errors['id'] = `user with id ${userId} doesn't exists`;
        error.http_code = 404;
        error.message = JSON.stringify({
            errors: errors
        });
        throw error
    }

    return user;
}

async function getUserByUsername(username, ...projection) {
    const error = new Error();
    error.http_code = 200;
    const errors = {};

    if (username === undefined || userId === null) {
        errors['username'] = "username is not defined";
        error.http_code = 400
    }

    if (typeof username === "string") {
        errors['username'] = "invalid type of username";
        error.http_code = 400;
    }

    const usersCollection = await users();

    let user;
    if (projection.length) {
        user = await usersCollection.findOne({username: username}, {projection: projection});
    } else {
        user = await usersCollection.findOne({username: username}, {
            projection: {
                "_id": false,
                "hashedPassword": false,
                "liked": false,
                "disliked": false,
                "sent": false,
                "received": false
            }
        });
    }

    if (user === null) {
        errors['id'] = `user with username ${username} doesn't exists`;
        error.http_code = 404;
        error.message = JSON.stringify({
            errors: errors
        });
        throw error
    }

    return user;
}

async function userExists(userId) {
    if (userId === undefined || userId === null) {
        return false
    }
    if (typeof userId === "string") {
        try {
            userId = MUUID.from(userId);
        } catch (e) {
            return false
        }
    } else if (!isUUID(userId)) {
        return false
    }

    const usersCollection = await users();
    return await usersCollection.findOne({_id: userId}) !== null;
}

async function usernameAvailable(username) {
    const error = new Error();
    error.http_code = 200;
    const errors = {};

    if (username === undefined || username === null) {
        errors['username'] = "username object not defined";
        error.http_code = 400
    } else if (typeof username !== "object") {
        errors['username'] = "invalid type of user";
        error.http_code = 400
    }

    const usersCollection = await users();

    const user = await usersCollection.findOne({username: username});

    return user === null;
}

async function getLiked(userId) {
    try {
        return await getUserById(userId, {"liked": true})
    } catch (e) {
        throw e
    }
}

async function getShared(userId) {
    try {
        return await getUserById(userId, {"sent": true, "received": true});
    } catch (e) {
        throw e
    }
}

async function isAuthenticated(username, password) {
    console.log(1)
    const error = new Error();
    console.log(2)
    error.http_code = 200;
    console.log(3)
    const errors = {};
    console.log(4)

    if (username === undefined || username === null) {
        console.log(5)
        errors['username'] = "username not defined";
        console.log(6)
        error.http_code = 400
        console.log(7)
    } else if (typeof username !== "string") {
        console.log(8)
        errors['username'] = "invalid type of username";
        console.log(9)
        error.http_code = 400
        console.log(10)
    }
    console.log(10.5)

    if (password === undefined || password === null) {
        console.log(11)
        errors['password'] = "password not defined";
        console.log(12)
        error.http_code = 400
        console.log(13)
    } else if (typeof password !== "string") {
        console.log(14)
        errors['password'] = "invalid type of password";
        console.log(15)
        error.http_code = 400
        console.log(16)
    }

    console.log(16.5)

    const usersCollection = await users();
    console.log(17)

    const user = await usersCollection.findOne({username: username});
    console.log(18)

    if (user === null) {
        errors['username'] = `user with username ${username} not found`;
        console.log(19)
        error.http_code = 404;
        console.log(20)
        error.message = JSON.stringify({
            errors: errors
        });
        console.log(21)
        throw error
    }
    console.log(22)

    if (!bcrypt.compareSync(password, user.hashedPassword)) {
        console.log(23)
        errors['password'] = "Invalid password";
        console.log(24)
        error.http_code = 403;
        console.log(25)
        error.message = JSON.stringify({
            errors: errors
        });
        console.log(26)
        throw error
    }
    console.log(27)
    return user;
}

async function getUsers() 
{
    const usersCollection = await users();

    let usersList = await usersCollection.find({}, {
        projection:
            {
                "_id": false,
                "username": true,
                "firstName": true,
                "lastName": true
            }
    }).toArray();
    return usersList.map(function (user) {
        user.id = user.username;
        user.text = `${user.username} (${user.firstName} ${user.lastName})`;
        return user
    });
}

module.exports = {
    addUser,
    updateUser,
    getUserById,
    getUserByUsername,
    usernameAvailable,
    userExists,
    getLiked,
    getShared,
    isAuthenticated,
    getUsers
};