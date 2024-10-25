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
let logIn= false;


function checkAuth(req, res, next) {
  if (logIn) {
    next(); 
  } else {
    res.redirect("/login"); 
  }
}

app.get("/", (req, res) => {
  res.render("main.ejs", {posts, clients, logIn});
});

app.get("/create", checkAuth, (req, res) => {  
  res.render("partials/create.ejs", { logIn });
});

app.get("/registration", (req, res)=>{
  res.render("partials/registration.ejs", { logIn });
});

app.get("/login", (req, res)=>{
  res.render("partials/login.ejs", { logIn });
});

app.get("/view/:id", (req, res) => {  
  const post = posts.find(p => p.id == req.params.id);
  if (post) {
    res.render("partials/view.ejs", { post, logIn});
  } else {
    res.redirect('/');
  }
});
app.get("/user/:id", (req, res) => {
  const userId = req.params.id; 
  const client = clients.find(p => p.id == userId); 

  if (client) {
    res.render("main.ejs", { clients, posts, logIn}); 
  } else {
    res.status(404).send("User not found"); 
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

app.post("/", checkAuth, (req, res) => {
  const { title, body } = req.body;
  const id = i;
  if (!req.body.title) {
    res.redirect("/create");
  } else {
    posts.push({ id, title, body });
    res.redirect("/");
    i++;
  }
});
app.post("/registration", (req, res)=>{
  const {login, password}=req.body;
  const id=j;
  if(!req.body.login || !req.body.password){
    res.redirect("/registration");
  }else{
clients.push({id, login, password});
res.redirect("/");
j++;
console.log(clients);
  }
});

app.post("/login", (req, res) => {
  const { login, password } = req.body;
  const client = clients.find(p => p.login === login);

  if (client && client.password === password) {
    logIn = true; 
    res.redirect(`/user/${client.id}`);
  } else {
    res.redirect("/login");
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
