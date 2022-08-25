const Pool = require('pg').Pool;
const _ = require('lodash');
var username = "";
var password = "";
var security_qn = "";


const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'postgres',
    password: 'abcd1234',
    port: 5432
});

const homeStartingContent = "Lacus vel facilisis volutpat est velit egestas dui id ornare. Semper auctor neque vitae tempus quam. Sit amet cursus sit amet dictum sit amet justo. Viverra tellus in hac habitasse. Imperdiet proin fermentum leo vel orci porta. Donec ultrices tincidunt arcu non sodales neque sodales ut. Mattis molestie a iaculis at erat pellentesque adipiscing. Magnis dis parturient montes nascetur ridiculus mus mauris vitae ultricies. Adipiscing elit ut aliquam purus sit amet luctus venenatis lectus. Ultrices vitae auctor eu augue ut lectus arcu bibendum at. Odio euismod lacinia at quis risus sed vulputate odio ut. Cursus mattis molestie a iaculis at erat pellentesque adipiscing.";

const authCheck = (req, res) => {

    username = req.body.username;
    password = req.body.password;

    pool.query('SELECT COUNT(*) FROM USERS WHERE USERNAME = $1 AND PASSWORD = $2', [username, password], (err, result) => {
        if(err)
        {
            console.log(err.message);
        }
        else
        {
            if(result.rows[0].count === '0')
            {
                res.send("Incorrect Username and/or Password!");
            }
            else
            {
                getPosts(req,res);
            }
        }
    })
}

const signup = (req, res) => {

    console.log(req.body);

    username = req.body.username;
    password = req.body.password;
    confirmpass = req.body.confirmpassword;
    let question = req.body.securityQuestion;
    let answer = req.body.answer;

    pool.query('INSERT INTO USERS(USERNAME, PASSWORD, SECURITY_QUESTION, SECURITY_ANSWER) VALUES ($1, $2, $3, $4);', [username, password, question, answer], (err, result) => {
        if(err)
        {
            console.log(err.message);
        }
        else
        {
            if(password !== confirmpass)
            {
                res.send('Passwords Don\'t Match');
            }
            else
            {
                res.redirect("/");
            }
        }
    })
}

const fpass = (req, res) => {

    username = req.body.username;
  
    pool.query('SELECT SECURITY_QUESTION FROM USERS WHERE USERNAME = $1', [username], (err, result) => {
        if(err)
        {
            console.log(err.message);
        }
        else
        {
            security_qn = result.rows[0].security_question;
            res.redirect("/forgotpass");
        }
    })
  
}

const forgotpassread = (req, res) => {

    res.render('forgotpass', {name: username, securityQuestion: security_qn});
}

const forgotpasswrite = (req,res) => {

    answer = req.body.answer;

    pool.query('SELECT COUNT(*) FROM USERS WHERE USERNAME = $1 AND SECURITY_QUESTION = $2 AND SECURITY_ANSWER = $3', [username, security_qn, answer], (err, result) => {
        if(err)
        {
            console.log(err.message);
        }
        else
        {
            if(result.rows[0].count === '0')
            {
                res.send("Incorrect Security Answer!");
            }
            else
            {
                res.redirect("/fpassresult");
            }
        }
    })
}

const fpassresult = (req, res) => {

    let pass = req.body.pass;
    let cpass = req.body.cpass;

    if(pass !== cpass)
    {
        res.send("Passwords Don\'t Match!");
    }
    else
    {
        pool.query('UPDATE USERS SET PASSWORD = $1 WHERE USERNAME = $2', [pass, username], (err, result) => {
            if(err)
            {
                console.log(err.message);
            }
            else
            {
                res.redirect("/");
            }
        })
    }
}

const getYourPosts = (req, res) => {

    pool.query('SELECT * FROM PROJECT WHERE AUTHOR = $1', [username], (err, result) => {
        if(err)
        {
            console.log(err.message);
        }
        else
        {
            res.render('home', {userName: username, pageTitle: 'Your Posts', pageContent: homeStartingContent, posts: result.rows});
        }
    })
}

const getPosts = (req, res) => {

    pool.query('SELECT * FROM PROJECT', (err, result) => {
        if(err)
        {
            console.log(err.message);
        }
        else
        {
            res.render('home', {userName: username, pageTitle: 'Home', pageContent: homeStartingContent, posts: result.rows});
        }
    });
}

const getPostByTitle = (req, res) => {
    const title = req.params.title;
    
    pool.query('SELECT * FROM PROJECT WHERE TITLE = $1', [title], (err, result) => {
        if(err)
        {
            console.log(err.message);
        }
        else
        {
            res.render('post', {userName: username, post: result.rows[0]});
        }
    })
}

const getPostByTag = (req, res) => {
    const tag = req.params.tag;

    pool.query('SELECT TITLE, TAG, TEXTCONTENT, IMAGE FROM PROJECT WHERE TAG = $1', [tag], (err, result) => {
        if(err)
        {
            console.log(err.message);
        }
        else
        {
            res.render('home', {userName: username, pageTitle: tag, pageContent: homeStartingContent, posts: result.rows});
        }
    })
}

const createPost = (req, res) => {

    const { title, tag, textContent, image } = req.body;

    pool.query('INSERT INTO PROJECT ( TITLE, TAG, TEXTCONTENT, IMAGE, AUTHOR) VALUES ($1, $2, $3, $4, $5);', [title, tag, textContent, image, username], (err, result) => {
        if(err)
        {
            console.log(err.message);
        }
        else
        {
            res.send('Post Added!');
        }
    })
}

const editPost = (req, res) => {

    const title = req.params.title;
    const textcontent = req.body.textContent
    
    pool.query('UPDATE PROJECT SET TEXTCONTENT = $1 WHERE TITLE = $2', [textcontent, title], (err, result) => {
        if(err)
        {
            console.log(err.message);
        }
        else
        {
            res.redirect("/posts/"+title);
        }
    })
}

const deletePost = (req, res) => {
    const title = req.params.title
    
    pool.query('DELETE FROM PROJECT WHERE TITLE = $1', [title], (err, result) => {
        if(err)
        {
            console.log(err.message);
        }
        else
        {
            res.send('Post Deleted');
        }
    })
}

module.exports = {
    getPosts,
    getPostByTitle,
    createPost,
    deletePost,
    getPostByTag,
    editPost,
    authCheck,
    signup,
    getYourPosts,
    fpass,
    forgotpassread,
    forgotpasswrite,
    fpassresult
}

