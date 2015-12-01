# Pansy API文档


## Quick Start


    <!doctype html>
    <head>
        <meta charset="utf-8">
        <title>PANSY</title>
        <!-- 引用js文件 -->
        <script src="pansy.js"></script>
    </head>
    <body>
        
        <script>
    
            // init app
            var app = pansy()
    
            // start as a single-page application
            app.config('spa', true) // default false
    
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
        
    </body>
    

### Programmatic API

* <code>[app.config(name, content)]()</code>
* <code>[app.use(middleware)]()</code>
* <code>[app.go(url, type)]()</code>

#### pansy

##### pansy([name])

    // 生成app
    var app = pansy();
    

##### app.config(name, content)

    // 自定义配置
    // 开启单页面模式
    app.config('spa', true);
    // 自定义路由作用范围
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

    req.rawUrl // 请求的原始链接
    req.query // URL中的query参数
    req.params // URL中的pathname转化来的数组

#### res对象

    res.end // 结束请求
    
    
#### next对象

    next() // 不带参数,跳转到下一个控制器
    next(err) // err参数堆栈,交给错误处理器处理,同时跳转到下一个控制器
    