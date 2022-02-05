const express=require("express")
const bodyParser=require('body-parser')
const mongoose=require('mongoose');
const ejs=require('ejs');
const app=express();
app.use(bodyParser.urlencoded({extended:true}))
app.set('view engine', 'ejs');
const listSchema = new mongoose.Schema({
    title: String,
    content: String,
    time:String
})
const completeListSchema = mongoose.Schema({
    title: String
})

const Complete = mongoose.model("Complete",completeListSchema);

const List = mongoose.model("List",listSchema);
var today = new Date();
 let options ={
     weekday: "long",
     day: "numeric",
     month: "long"
 }
 var date = today.toLocaleDateString("en-US",options);
 mongoose.connect("mongodb://localhost:27017/toDoListWebApp");

app.use(express.static("public"));
app.get('/',function(req,res){
    res.render("lists",{date:date});
})

app.get("/completedtasks",function(req,res){
   Complete.find({},function(err,results){
       if(err){
           console.log(err);
       }
       else{
        res.render("completedtasks",{results:results})

       }
       
   })
    })


app.get("/pendingtasks",function(req,res){
    List.find({},function(err,results){
        if(err){
            console.log(err)
        }
        else{
            res.render("pendingtasks",{results:results})
        }
      
    })

})

app.post("/",function(req,res){
    var todayTime = new Date();
const title = req.body.title;
const content = req.body.content;
const time = todayTime.getHours() + ":" + todayTime.getMinutes() + ":" + todayTime.getSeconds();
const list = new List({
    title: title,
    content: content,
    time: time
})
list.save();
res.redirect("/");
})

app.post("/complete",function(req,res){
    var completeTitle = req.body.checkbox;
 var comp = new Complete({
     title:completeTitle
 })
comp.save();
List.deleteOne({title: completeTitle},function(err){
    if(err){
        console.log(err)
    }
    else{
        console.log("Deleted Successfully")
    }
})
res.redirect("/pendingtasks")
})

app.listen(3000,function(){
    console.log("Server is running on port 3000")
})