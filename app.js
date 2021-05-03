const express = require("express");
const bodyParser = require("body-parser");
const date = require(__dirname + "/date.js");

const app = express();

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

app.set('view engine', 'ejs');

  //List set to 3 items by default
  const items = [];
  const workItems = [];

app.get("/", function(req, res){

  //calling date.js module function
  const day = date.getDate();

  //EJS render <itemName>: <var>
    res.render("list", {
      listTitle: day,
      newListItems: items
    });
});

//post

app.post("/", function(req, res){
  //Identify the input data from item
const item = req.body.item;

console.log(req.body);

if(req.body.list === "Work"){
  workItems.push(item);
  res.redirect("/work");
} else {
  //add item data to the end of items array
  items.push(item);
  //back to root
  res.redirect("/");
}

});

app.get("/work", function (req, res){
  res.render("list", {listTitle: "Work List", newListItems: workItems})
});

app.listen(3000, function(){
  console.log("Server started on port 3000");
});
