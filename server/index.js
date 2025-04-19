const express = require("express");
const cors = require("cors");
const fs=require("fs");
const users = require("./saple.json");
const e = require("express");
const app = express();
app.use(express.json());
const port = 8000;


//display the data in json format
app.use(cors(
    {
        origin:"http://localhost:5173",
        methods:["GET","POST","PUT","DELETE","PATCH"],
    }
));
app.get("/users",(req,res)=>{
return res.json(users);
})

//delete the data
app.delete("/users/:id",(req,res)=>{
    let id=Number(req.params.id);
    let userIndex=users.filter((user)=>user.id!==id);
    fs.writeFile("./saple.json",JSON.stringify(userIndex),(err,data)=>{
        
        return res.json(userIndex);
    })
})

//add new user
app.post("/users",(req,res)=>{
    let{name,age,city}=req.body;
    if(!name || !age || !city){
     res.status(400).send({"message":"All fields are required"})
    }
    let id=Date.now();
    users.push({id,name,age,city});
    fs.writeFile("./saple.json",JSON.stringify(users),
   (err,data)=>{    
       return res.json({"message":"User added successfully"});
    });

})

/*app.post("/users",(req,res)=>{
    let{name,age,city}=req.body;
    if(!name || !age || !city){
     return res.status(400).send({"message":"All fields are required"})
    }
    let id=Date.now();
    users.push({id,name,age,city});
    fs.writeFile("./saple.json",JSON.stringify(users),
   (err)=>{
    if(err){    
        console.log("error",err);
        return res.status(500).send({message:"internal error"})
    }
    return res.json({message:"user added successfully"})
    });

})
*/







//update user
app.patch("/users/:id",(req,res)=>{
    let id=Number(req.params.id);
    let{name,age,city}=req.body;
    if(!name || !age || !city){
     res.status(400).send({"message":"All fields are required"})
    }
    let index=users.findIndex((user)=>user.id==id);
    users.splice(index,1,{...req.body});
    fs.writeFile("./saple.json",JSON.stringify(users),
    (err,data)=>{    
        return res.json({"message":"User updated successfully"});
    });

})


app.listen(port,(err)=>{
    console.log(`Server is running on port ${port}`);
})