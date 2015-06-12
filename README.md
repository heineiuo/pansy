#PURPLE.js v0.6.0

## TODO

* Remove template engine.
* Better flow control.
* Custom router listing.

## Introduction

Purple help you create a SPA quickly and flexibility. It's not a framework nor a solution. It's lightly.
But if you need to do something more with purple, you can use middlewires, which is supported and suggested.
    

## Quick Start

    <script src="purple.js"></script>

    var app = purple('main');

    app.route('/').get(function(req, res, next){
        alert('hello world!')
    });

    app.set('isMain', 'true');

    app.go('/');

### Programmatic API

* <code>[purple()](#purple)</code>
* <code>[app.route(regex|string).get(stack)]()</code>
* <code>[app.set(name, content)]()</code>
* <code>[app.go(url)]()</code>
* <code>[app.back()]()</code>
* <code>[app.use(middleware)]()</code>
* <code>[app.listen()]()</code>
* <code>[res.end()]()</code>


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


##### app.route(regex|string).get(stack)

    user.index = function(req, res, next){
        console.log(req.user) // => {user: {}}
        console.log(req.query) // => {a: "", b: "“}
        next()
        // res.end()
    }

    user.profile = ...

    app.route('/abc').get(user.index, user.profile)

##### app.go(url)

    app.go('/news');

##### app.back()

    app.back()

##### app.use(middleware)

    app.use(function(req, res, next){
        req.timestamp = Date.now()
        next()
    })

##### res.end()

    res.end()


