#PANSY

## Introduction

Purple help you create a SPA quickly and flexibility. It's not a framework nor a solution. It's lightly.
But if you need to do something more with pansy, you can use middlewires, which is supported and suggested.
    

## Quick Start

    <script src="pansy.js"></script>

    <script>

        // init app
        var app = pansy()

        // start as a single-page application
        app.config('spa', true)

        // use a middleware
        app.use(function(req, res, next){
            console.log(req.rawUrl)
            next()
        })

        // use a route
        app.route('/').get(function(req, res){
            document.body.innerHTML = 'hello world'
            res.end()
        })

        // after document ready
        app.go() // or app.go(location.href)

    </script>

    <script>
   </script>



### Programmatic API

* <code>[pansy()](#pansy)</code>
* <code>[pansy.Router()</code>
* <code>[app.config(name, content)]()</code>
* <code>[app.use(middleware)]()</code>
* <code>[app.go(url, type)]</code>

#### pansy

##### pansy([name])

    var app = pansy();

##### app.config(name, content)

    app.config('spa', true);
    app.config('routeScope', '/scope');


##### pansy.Router().route(regex|string).get(stack)

    user.index = function(req, res, next){
        console.log(req.user) // => {user: {}}
        console.log(req.query) // => {a: "", b: "“}
        next()
        // res.end()
    }

    user.profile = ...

    app.route('/abc').get(user.index, user.profile)

##### app.use(middleware)

    app.use(function(req, res, next){
        req.timestamp = Date.now()
        next()
    })



##### res.redirect(url)

    res.redirect('/news');


##### res.end()

    res.end()



