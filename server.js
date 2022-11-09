const express = require('express');
const app = express();
const mongoose = require('mongoose');

//para porde referenciar los contenidos estaticos como imagenes, js, styles
app.use(express.static(__dirname + '/public'));

//carpete de todos los htmls que son interpretados como ejs
app.set('views', __dirname + '/views');

//motor interprete de las vistas
app.set('view engine', 'ejs');

//para recuperar campos de formularios
let bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extends: true }));

//para conectarnos o crear la BD
mongoose.connect('mongodb://localhost/forodb', { useNewUrlParser: true });

const PostSchema = new mongoose.Schema(
    {
        title: { type: String, required: [true, "Posts must have a title"] },
        content: { type: String, required: [true, "Posts must have content"] },
    }, { timestamps: true })

const BlogSchema = new mongoose.Schema({
    title: { type: String, required: [true, "Blogs must have a title"], minlength: [3, "Titles must have at least 3 characters"] },
    posts: [PostSchema]
}, { timestamps: true })

const UserSchema = new mongoose.Schema({
    name: { type: String, required: [true, "A first name is required"] },
    blogs: [BlogSchema]
}, { timestamps: true })



// crea un objeto que contenga métodos para que Mongoose interactúe con MongoDB
const Post = mongoose.model('post', PostSchema);
const Blog = mongoose.model('blog', BlogSchema);
const Usuario = mongoose.model('usuario', UserSchema);


//carga la paginia inical del sitio
app.get('/', function (req, res) {

    Usuario.find()
        .then(data => {
            //res.json(data);
            res.render("default", { usuarios: data, errores: []})
            })
        .catch(err =>  {console.log('hola'); res.json(err)});

    
});


app.post('/newpost', function (req, res) {
    let myblogs=[];

    console.log('newpost param:' + req.query.id + ' bid=' + req.query.bid);

    Post.create(req.body, function(err, pdata){
        if(err){
             // gestiona el error de crear un blog
             res.render('default', {errores: errorHandler(err)})
        }else {
            //console.log('post creado:' + pdata);

            Usuario.find({_id: req.query.id})
            .then(data => {
                    data.forEach(element => {
                        myblogs = element.blogs;
                        // myblogs.posts.push({title:'post title add', content: req.body.content})
                        myblogs.push({title:'blog title', posts: pdata})

                        // myblogs.forEach(element => {
                        //   console.log('post:' + element.posts);
                        //   //element.push({posts: pdata})
                        // });
                    });
                    
                    //ahora que le agregue el nuevo post se debe actualizar en la BD
                    Usuario.updateOne({ _id: req.query.id ,data}, function (err, udata) {
                        if (err) {
                            res.render('default', { errores: errorHandler(err) })
                        }
                        else {
                            res.redirect('/');
                        }
                    });

                    
                     
                    
                })
            .catch(err =>  {console.log('hola'); res.json(err)});
        }        
    });  


});


app.post('/sendmsg', function (req, res) {

    console.log('sendmsg param:' + req.query.id);

    Post.create(req.body, function(err, data){
        if(err){
             // gestiona el error de crear un blog
             res.render('default', {errores: errorHandler(err)})
        }else {
            console.log('post creado:' + data);
            createBlog(req, res, data);
        }        
    });  

});


function createBlog (req, res, pdata){
    
    console.log('createBlog:' + req.query.id);

    Blog.findOneAndUpdate({_id: req.query.id}, {title:req.body.title, $push: {posts: pdata}}, function(err, data){     

        if (err) {
            // gestiona el error de crear un blog
            res.render('default', { errores: errorHandler(err) })
        }
        else {
            if (data===null){
                const blog = new Blog();
                blog.title= req.body.title;
                blog.posts = pdata;
                
                blog.save()
                .then(bdata => {
                      console.log('Blog Creado:' + bdata);  
                      createUser(req, res, bdata)
                })
                .catch(err =>  res.render('default', {usuarios:[], errores: errorHandler(err) }));
            }else {
                createUser(req, res, data)
            }                       
        }
    });
}

function createUser(req, res, bdata){

    console.log('createUser:' + req.query.id);

    Usuario.findOneAndUpdate({ _id: req.query.id }, {name: req.body.name,  $push: { blogs: bdata } }, function (err, data) {
        if (err) {
            res.render('default', { errores: errorHandler(err) })
        }
        else {
            
            if (data===null){
                const usuario = new Usuario();
                usuario.name= req.body.name;
                usuario.blogs = bdata;
                usuario.save()
                .then(data => {
                    console.log('Usuario Creado:' + data);
                    res.redirect('/');
                })
                .catch(err =>  res.render('default', {usuarios:[], errores: errorHandler(err) }));
            }else {
                console.log('termino bien: ' + data);
                res.redirect('/');
            }
        }
    });

}

function errorHandler(err) {
    let arrMsg = []
    for (let key in err.errors) {
        arrMsg.push(err.errors[key].message)
    }
    return arrMsg;
}


//exponemos el servidor en el la ip:puerto requerido
app.listen(5100, function () {
    console.log('servidor ejecutandose en http://localhost:5100');
});