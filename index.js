
const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser')
const passport = require('passport');
const localStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');
const Sequelize = require('sequelize');
const dotenv = require('dotenv').config();
const mysql = require('mysql2');
const axios = require('axios');
const cors = require('cors');
var url = require('url');


const req = require('express/lib/request');
const sequelize = new Sequelize('arthur', 'root', 'tl1wlndw', {
    host: "localhost",
    dialect: 'mysql'
})

sequelize.authenticate().then(function() {
    console.log('MySql Connected Successfuly');
}).catch( function(erro) {
    console.log('Error at connecting to MySql:'+erro)
    }
)

const users_database = sequelize.define('users', {
    name: {
        type: Sequelize.STRING
    },
    email : {
        type: Sequelize.STRING
    }, 
    password : {
        type: Sequelize.STRING
    },
    stocks : {
        type: Sequelize.JSON
    }
});
//users_database.sync({force: true});

const port = 80;
const app = express({ mergeParams: true });
 
app.listen(port,()=> {
    console.log('Servidor Rodando!');
})

var path = require('path');
const { rootCertificates } = require('tls');
const oneDay = 1000 * 60 * 60 * 24;

//storing sessions
const sessions_database = sequelize.define('sessions', {
    sid : {
        type: Sequelize.STRING,
        primaryKey: true
    },
    expires : {
        type: Sequelize.DATE
    },
    data : {
        type: Sequelize.JSON
    }
});

var SequelizeStore = require('connect-session-sequelize')(session.Store);

var sessionStore = new SequelizeStore({
   db: sequelize,
   checkExpirationInterval: 15 * 60 * 1000,
   expiration: 7 * 24 * 60 * 60 * 1000
});

//sessionStore.sync()

//config session
app.use(session({
    secret: 'asjgfbapsufaasgsagsagagsgsg4634',
    resave: true,
    saveUninitialized: true,
    secure: process.env.NODE_ENV === "production",
    connectionLimit: 20,
    store: sessionStore,
    endConnectionOnClose: false,
    cookie: {
        httpOnly: true,
        maxAge: oneDay,
        sameSite: true,
        resave: false,
        secret: 'apifjapnifaswfas'
    }
}));
const cookie_secret = 'dashldhe128ewhgcvasdy7et2hvhwytt2';


app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');
app.use('/views', express.static(path.join(__dirname, 'views')));
app.set('views', path.join(__dirname, '/views'));
app.use(express.static(__dirname+'/views'));
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(cookieParser(cookie_secret));
app.use(cors())

//using passport
require('./configs/auth');
app.use(passport.initialize());
app.use(passport.session());

//passport authenticating
function checkAuth(req,res,next){
    if(req.isAuthenticated()){
        next();
    } else{
        res.redirect("/login");
    }
}

//routes
app.get('/signup', (req,res) => {
    res.render('signup');
})

app.get('/login', (req, res) => {
    res.render('login')
})

app.post('/login', 
    passport.authenticate('local', { failureRedirect: '/signup' }),
    (req, res) => {
        res.redirect('/');
});

app.get('/', checkAuth, (req, res) => {

    const sessionId = req.sessionID;

    sessions_database.findOne({
        where: {
            sid: sessionId
        }
    }).then(session => {
        let data = JSON.parse(session.data);
        let user_id = data.passport.user;

        users_database.findOne({
            where: {
                id: user_id
            }
        }).then(user => {
            res.render('home');
            res.status(200);
        })
    });

});

app.post('/signup', async (req,res)=>{

    var hashedpassword = await bcrypt.hash(req.body.password, 10);

    users_database.findOne({
        where: {
            email: req.body.email
        }
    }).then((user)=>{

        if(!user){

            if(req.body.name !== "" && req.body.email && req.body.password !== ""){
        
                users_database.create({
                    name: req.body.name,
                    email: req.body.email,
                    password: hashedpassword,
                    stocks: "{}"
                })
                res.redirect('/login');
            }   
        }else{
            res.send('Email already used! <br> <form action="/login" method="get"><button>Want to log In?</button></form>');
        }
    });
});

app.post('/delete', checkAuth, (req,res) => {
    const sessionId = req.sessionID;

    sessions_database.findOne({
        where: {
            sid: sessionId
        }
    }).then(session => {
        let data = JSON.parse(session.data);
        let user_id = data.passport.user;

        users_database.destroy({
            where: {
                id: user_id
            }
        }).then(user => {
            req.session.destroy();
            res.redirect('/signup');
        })
    });
})

app.post('/logout', (req,res) =>{
    req.session.destroy();
    res.redirect('/login')
})

/*app.post('/api',(req,res)=>{
    const stock = req.body.stock;
    res.redirect(`/api/${stock}`);
})*/

/**/
app.get('/api', async (req, res)=>{

    //let stock = req.params.stock;
    
    /**/try {
        const users = ['Marcos', 'Pedro', 'usuário do node'];
        return res(users);
        
    } catch (error) {
        console.log(error)
    }
})