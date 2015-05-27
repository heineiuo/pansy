#PURPLE.js


## Introduction

Purple help you create a SPA quickly and flexibility. It's not a framework nor a solution. It's lightly.
But if you need to do something more with purple, you can use middlewires, which is supported and suggested.
    

## Quick Start

    <script src="purple.js"></script>

    var app = purple('main');

    app.route('/').get(function(req, res, next){
        alert('hello world!')
    });


    purple.set('mainApp', 'main');
    purple.start()

### Programmatic API

* <code>[purple()](#purple)</code>
* <code>[purple.set(name, content)](#purple-set)</code>
* <code>[purple.start()](#purple-start)</code>
* <code>[app.route(regex|string).get(stack)]()</code>
* <code>[app.set(name, content)]()</code>
* <code>[app.go(url)]()</code>
* <code>[app.back()]()</code>
* <code>[app.use(middleware)]()</code>
* <code>[res.render(tree[, callback])]()</code>
* <code>[res.end()]()</code>


#### purple


##### purple([name])

    var app = purple('test');
    console.log(app.name); // => 'test'

##### purple.set(name, content)

    purple.set('mainApp', 'test');
    purple.set('templateSource', 'script');
    purple.set('scope', 'body');


##### purple.start()

    purple.start();

##### app.route(regex|string).get(stack)

    user.index = function(req, res, next){
        console.log(req.user) // => {user: {}}
        console.log(req.query) // => {a: "", b: "“}
        next()
        // res.end()
    }

    user.profile = ...

    app.route('/abc').get(user.index, user.profile)

##### app.set(name, content)

    app.set('listenAnchor', true);
    app.set('listenPopstate', true);

##### app.go(url)

    app.go('/news');

##### app.back()

    app.back()

##### app.use(middleware)

    app.use(function(req, res, next){
        req.timestamp = Date.now()
        next()
    })

##### res.render(tree[, callback])

    res.render({
        "home/home": {
            "home/news": {}
        }
    });

##### res.end()

    res.end()


