const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const db = require('./database')
const port = 3000;

const aboutContent = "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";
const contactContent = "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";
var usernamex = "";
var security_qn = "";

app.use(bodyParser.json())
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
)
app.use(express.static('public'));
app.set('view engine', 'ejs');

app.get("/", (req, res) => {
  res.render('auth');
});

app.post("/", db.authCheck);

app.get('/signup', (req, res) => {
  res.render('signup');
});

app.get("/fpass", (req, res) => {
    res.render('fpass');
});

app.post("/fpass", db.fpass);

app.get("/forgotpass", db.forgotpassread);

app.post("/forgotpass", db.forgotpasswrite);

app.get("/fpassresult", (req, res) => {
    res.render('fpassresult');
})

app.post('/fpassresult', db.fpassresult);

app.post('/signup', db.signup);

app.get("/home", db.getPosts);

app.get("/about", (req, res) => {
    res.render('about', {pageContent: aboutContent});
});

app.get("/contact", (req, res) => {
    res.render('contact', {pageContent: contactContent});
});

app.get("/yourpost", db.getYourPosts);

app.get("/posts/:title", db.getPostByTitle);

app.get("/compose", (req, res) => {
    res.render('compose');
});

app.post("/compose", db.createPost);

app.get('/delete/:title', db.deletePost);

app.get("/tags/:tag", db.getPostByTag);

app.get("/edit/:title", (req, res) => {
  const title = req.params.title;
  res.render('edit', {pageTitle: title});
});

app.post("/edit/:title", db.editPost);

app.listen(port, () => {
  console.log(`App running on port ${port}.`)
})