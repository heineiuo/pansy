#PANSY

## Introduction

Purple help you create a SPA quickly and flexibility. It's not a framework nor a solution. It's lightly.
But if you need to do something more with purple, you can use middlewires, which is supported and suggested.
    

## Quick Start

    <script src="pansy.js"></script>

    <script>

        var router = purple.Router()
        router.route('/').get(function(req, res){
            console.log('hello world')
            res.end()
        })

    </script>

    <script>

        var app = purple()

        app.use(router)
        app.use(purple.History({
            redirect: true // add res.redirect method in browser env.
        }))

        app.listen(function(){
            console.log('app started.')
        })

        // console will log `app started`.
        // when document.onready="success",
        // if location.pathname = '/', console will log `hello world`,
        // else, console will warn `not found`

   </script>



### Programmatic API

* <code>[purple()](#purple)</code>
* <code>[purple.Router().route(regex|string).get(stack)]()</code>
* <code>[app.set(name, content)]()</code>
* <code>[app.get(name)]()</code>
* <code>[app.use(middleware)]()</code>
* <code>[app.listen([port,] [callback])]</code>

#### purple


##### purple([name])

    var app = purple('test');
    console.log(app.name); // => 'test'


##### app.set(name, content)

    app.set('onanchorclick', true);
    app.set('onpopstate', true);


##### app.get(name)

    app.get('onanchorclick');
    app.get('onpopstate');


##### purple.Router().route(regex|string).get(stack)

    user.index = function(req, res, next){
        console.log(req.user) // => {user: {}}
        console.log(req.query) // => {a: "", b: "“}
        next()
        // res.end()
    }

    user.profile = ...

    app.route('/abc').get(user.index, user.profile)

##### app.redirect(url)

    app.redirect('/news');

##### app.use(middleware)

    app.use(function(req, res, next){
        req.timestamp = Date.now()
        next()
    })

##### res.end()

    res.end()



