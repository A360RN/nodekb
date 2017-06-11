const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const methodOverride = require('method-override');

mongoose.connect('mongodb://localhost/nodekb');
mongoose.Promise = global.Promise;
let db = mongoose.connection;

// Check connection
db.once('open', function () {
    console.log('Connected to MongoDB');
})

// Check for DB errors
db.on('error', function (err) {
    console.log(err);
});

// Init App
const app = express();

// Bring in Models
let Article = require('./models/article');

// Load view engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// body-parser middleware
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

// method-override middleware
app.use(methodOverride('_method'));

// Set Public folder
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', function(req, res){
    res.redirect('/articles');
});

// Find all articles route
app.get('/articles', function (req, res) {
    Article.find({}, function (err, articles) {
        if (err) {
            console.log(err);
        } else {
            res.render('index', {
                title: 'Articles',
                articles: articles
            });
        }
    })

});

// Article add form
app.get('/articles/add', function (req, res) {
    res.render('add_article', {
        title: 'Add Article'
    })
});

// Add Route
app.post('/articles', function (req, res) {
    let article = new Article();
    article.title = req.body.title;
    article.author = req.body.author;
    article.body = req.body.body;

    article.save(function(err){
        if(err){
            console.log(err);
            return;
        }else{
            res.redirect('/');
        }
    });
});

// Find Article by Id Route
app.get('/articles/:id', function(req, res){
    Article.findById(req.params.id, function(err, article){
        res.render('article', {
            article: article
        });
    });
});

// Load Edit Form
app.get('/articles/edit/:id', function(req,res){
    Article.findById(req.params.id, function(err, article){
        res.render('edit_article', {
            title: 'Edit Article',
            article: article
        });
    });
});

// Edit Article Route
app.put('/articles/:id', function(req, res){
    let article = {};
    article.title = req.body.title;
    article.author = req.body.author;
    article.body = req.body.body;

    let query = {_id: req.params.id}

    Article.update(query, article, function(err){
        if(err){
            console.log(err);
            return;
        }else{
            res.redirect('/');
        }
    });
});

// Delete Article Route
app.delete('/articles/:id', function(req, res){
    let query = {_id: req.params.id}

    Article.remove(query, function(err){
        console.log(err);
    });
});

// Start Server
app.listen(3000, function () {
    console.log('Server has started on port 3000...');
});