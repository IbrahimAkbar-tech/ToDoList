const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const _ = require('lodash');

const app = express();

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

app.set('view engine', 'ejs');

mongoose.connect("mongodb+srv://admin-ibrahim:test123@cluster0.c433h.mongodb.net/todolistDB", {useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true, useFindAndModify: false});

const itemsSchema = new mongoose.Schema({name: String});

const listSchema = new mongoose.Schema({name: String, items: [itemsSchema]});

const Item = mongoose.model("Item", itemsSchema);

const List = mongoose.model("List", listSchema);

const item1 = new Item({name: "Welcome to your todolist!"});

const item2 = new Item({name: "Hit the + button to add a new item"});

const item3 = new Item({name: "<-- Hit this to delete an item"});

const defaultItems = [item1, item2, item3];


app.get("/", function(req, res){

  Item.find(function(err, items){

    if (items.length === 0) {
      Item.insertMany(defaultItems, function(err){
        if (err){
          console.log(err);
        } else {
          console.log("Successfully added documents");
        }
      });
      res.redirect("/");
    } else {
      //EJS render <itemName>: <var>
      res.render("list", {listTitle: "Today", newListItems: items});
    }
    });
});


app.get("/:customListName", function(req, res){
  const customListName = _.capitalize(req.params.customListName);

  List.findOne({name: customListName}, function(err, foundList){
    if (!err){
      if (!foundList){
        //create new list
        const list = new List({
          name: customListName,
          items: defaultItems
        });
        list.save(() => res.redirect('/' + customListName));
      } else {
        //show existing list
        res.render("list", {listTitle: foundList.name, newListItems: foundList.items});
      }
    }
  });
});

//post
app.post("/", function(req, res){
  //Identify the input data from item
  const itemName = req.body.item;
  const listName = req.body.list;

  const item = new Item({name: itemName});

  if (listName === "Today"){
    item.save();
    res.redirect("/");
  } else {
    List.findOne({name: listName}, function (err, foundList){
      foundList.items.push(item);
      foundList.save();
      res.redirect("/" + listName);
    });
  }

});

app.post("/delete", function(req, res){
  const checkedItemId = req.body.checkbox;
  const listName = req.body.listName;

  if(listName === "Today"){
    Item.findByIdAndRemove(checkedItemId, function(err){
      if (err){
        console.log(err);
      } else {
        //console.log("Successfully deleted item");
      }
      res.redirect("/");
    });
  } else {
    List.findOneAndUpdate({name: listName}, {$pull: {items: {_id: checkedItemId}}}, function(err, foundList){
      if (!err){
        res.redirect("/" + listName);
      }
    });
  }

});

//heroku port
let port = process.env.PORT;
if (port == null || port == "") {
  port = 3000;
}

app.listen(port, function(){
  console.log("Server started successfully");
});
