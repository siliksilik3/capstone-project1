import express from "express";
import bodyParser from "body-parser";

const app = express();
const port = 3000;


app.set('view engine', 'ejs');

app.use(express.static("public"));
app.use(express.json());

app.use(bodyParser.urlencoded({ extended: true }));

let posts=[];
let i=0;
let clients=[];
let j=0; //client id



app.get("/", (req, res) => {
  res.render("main.ejs", {posts});
});

app.get("/create", (req, res) => {  
  res.render("partials/create.ejs");
});

app.get("/registration", (req, res)=>{
  res.render("partials/registration.ejs");
});
app.get("/login", (req, res)=>{
  res.render("partials/login.ejs");
});

app.get("/view/:id", (req, res) => {  
  const post = posts.find(p => p.id == req.params.id);
  if (post) {
    res.render("partials/view.ejs", { post });
  } else {
    res.redirect('/');
  }
  
});
app.post('/view/:id', (req, res) => {
  const { title, body } = req.body;
  const post = posts.find(p => p.id == req.params.id);
  if(!req.body.title){

  }else{
    if (post) {
      post.title = title;
      post.body = body;
      res.redirect('/');
    }
  }
  
  
});

app.post("/", (req, res) => {
    const {title, body}=req.body;
    const id= i;
    if(!req.body.title){
      res.redirect("/create");
    }else{
      posts.push({id, title, body});
      res.redirect("/");
      i++;
    }
});
app.post("/registration", (req, res)=>{
  const {login, password}=req.body;
  const clientId=j;
  if(!req.body.login || !req.body.password){
    res.redirect("/registration");
  }else{
clients.push({clientId, login, password});
res.redirect("/");
j++;
console.log(clients);

  }
});

app.post('/delete/:id', (req, res) => {
   posts = posts.filter(p => p.id != req.params.id);
  res.redirect('/');
});

// app.delete('/delete/:id', (req, res) => {
//   const postId = req.params.id;
//   posts = posts.filter(post => post.id !== postId);
//   res.redirect('/');
// });

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
