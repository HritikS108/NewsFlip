const express = require("express");
const exphbs = require('express-handlebars');

const app = express();  // initialize the express function in variable called app
app.use(express.json());
app.use("/node_modules", express.static(__dirname + "/node_modules"));
app.use("/public", express.static(__dirname + "/public"));
const configRoutes = require("./routes");

configRoutes(app);

const port = 3003;

// View Engine Setup
app.engine('handlebars', exphbs());  //register the given template engine
app.set('view engine', 'handlebars');
app.set('view options', { layout: false });


app.listen(port, () => {  // open the server on port 3000
    console.log("The server is up and running !!!");
    console.log(`The routes are running on http://localhost:${port}`);
});