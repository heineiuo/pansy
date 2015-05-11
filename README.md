#PURPLE.js


## Quick Start

    <script src="purple.js"></script>

    purple.route('/').get(function(req, res, next){
        purple.render({
            "index": {
                "common/header": {}
                "common/body": {
                    "page/hello": {}
                }
                "common/footer": {}
            }
        }, function(){
            next()
        })
    },function(req, res){
        var a = document.getElementById('hello')
        a.innerHTML = req.query.username

        res.end()
    })

    purple.start()

### Programmatic API

#### purple.route

    user.index = function(req, res, next){
        console.log(req.user) // => {user: {}}
        console.log(req.query) // => {a: "", b: "“}

        next()
        res.end() //
    }

    purple.route('/abc').all(user.index, user.profile)

#### purple.go

    purple.go('/news')

####purple.model


    purple.model('user')
    purple.model('user', userSchema)


####purple.on

    purple.on()

####purple.off

    purple.off()

####purple.offAll

    purple.offAll()


### Private Methods

    __purple.build()
    __purple.template()
    __purple.DOM()
    __purple.data._d
    __purple.data._t
    
