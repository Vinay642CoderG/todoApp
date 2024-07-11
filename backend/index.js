const express = require('express')
const app = express()
const path = require("path")
const port = 3000
const sequelize = require('./database')
const {Op} = require('sequelize')
const TodoMd = require('./models/todo')
const cors = require('cors')

sequelize.sync().then(()=>console.log('db is ready.')).catch((e)=>console.log(e));

// enabling CORS for some specific origins only. 
let corsOptions = { 
  origin : ['http://localhost:5173'], 
} 
 
app.use(cors(corsOptions)) 

//json middleware
app.use(express.json());
app.use(express.urlencoded({extended: true}))


app.use(function (err, req, res, next) {
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    console.error('Invalid JSON in request body:', err.message);
    res.status(400).json({ error: 'Invalid JSON format' });
  } else {
    next(err); // Pass on other errors for further handling
  }
});


// Global error handling middleware
app.use(function (err, req, res, next) {
  console.error('Server Error:', err.stack); // Log the error for debugging
  res.status(500).json({ error: 'Internal Server Error' });
  next(err);
});


const api_base_url = "/api/v1"

app.get(`${api_base_url}/todos/`, async(req, res)=>{
  //query based search
  if(Object.keys(req.query).length != 0 && req.query.q){
    const todos = await TodoMd.findAll({where: {[Op.or]:
      { task: { [Op.like]: `%${req.query.q}%`}}
    }})
    if(todos.length == 0){
      res.status(404).json({'msg': "Not found."});
    }else{
      res.json(todos)
    }
  }else{
    // get all todos 
    const todos = await TodoMd.findAll();
    if (todos===null){
      res.status(404).json({msg: "Not found."})
    }else{
      res.json(todos)
    }
  }
})

app.post(`${api_base_url}/todos/`, (req, res)=>{
  // create todos 
  let {task} = req.body;
  let errors = {};

  if(!task){
    errors = {task: "Field Required."};
  }

  if(Object.entries(errors).length > 0){
    res.status(400).json(errors);
  }else{
    TodoMd.create(req.body).then(()=>{
      res.json({msg:"Todo is created."});
    }).catch((e)=>{
      res.status(403).json({msg:"Todo is not created."});
    })
  }
})

app.get(`${api_base_url}/todos/:id/`, async (req, res)=>{
  if (/^\d+$/.test(req.params.id)){
    const todo = await TodoMd.findOne({where: {id: req.params.id}});
    if(todo===null){
      res.status(404).json({'msg': "Not found."})
    }else{
      res.json(todo)
    }
  }else{
    res.status(400).json({'msg': 'id must be number'})
  }
})

app.put(`${api_base_url}/todos/:id`, async(req, res)=>{
  const {task} = req.body;
  if (/^\d+$/.test(req.params.id)){
    const todo = await TodoMd.findOne({where: {id: req.params.id}});
    if(todo===null){
      res.status(404).json({'msg': "Not found."})
    }else{
      if(task){
        todo.setDataValue("task", task);
        todo.save();
      }
      res.json(todo);
    }
  }else{
    res.status(400).json({'msg': 'id must be number'});
  }
})


app.listen(port, () => {
  console.log(`App listening on port http://localhost:${port}/`)
})