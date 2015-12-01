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


## Document
 
[docs](tree/master/docs)


