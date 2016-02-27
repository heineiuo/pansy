# Pansy API


## Quick Start

    <!doctype html>
    <head>
        <meta charset="utf-8">
        <title>PANSY</title>
        <script src="pansy.js"></script>
    </head>
    <body>
        
        <script>
    
            // init app
            var app = pansy.Main()
    
            // start as a single-page application
            app.set('spa', true) // default false
    
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
            app.go(location.href)
    
        </script>
        
    </body>
    

### Programmatic API

* <code>[app.set(name, content)]()</code>
* <code>[app.use(middleware)]()</code>
* <code>[app.go(url, type)]()</code>

#### pansy

##### pansy.Main()

    // create an app
    var app = pansy.Main()
    

##### app.config(name, content)

    // custom config
    // set single page app mode
    app.set('spa', true);
    // custom router scope
    app.config('routeScope', '/scope');


##### app.route(regex|string).get(stack)

    user.index = function(req, res, next){
        console.log(req.user) // => {user: {}}
        console.log(req.query) // => {a: "", b: "“}
        next()
        // res.end()
    }

    user.profile = function(){}

    app.route('/abc').get(user.index, user.profile)

##### app.use(middleware)

    app.use(function(req, res, next){
        req.timestamp = Date.now()
        next()
    })


#### req对象

    req.rawUrl
    req.query
    req.params

#### res对象

    res.end
    
    
#### next对象

    next() // use next middleware
    next(err) // some error happened :(
    