#res.render

##流程

1. 获取<code>res.prevView</code>，如果是<code>null</code>，
则把<code>purple.scope() // dom </code> 以下的所有文件打包，
把<code>wrapper</code>赋给<code>res.prevView</code>，清空<code>__purple.node</code>，
继续执行

2. 获取到<code>tree //Object</code>，转换成<code>treeArr //Array</code>

3. 遍历<code>treeArr</code>，判断最后一位<code>{NAME}</code>是否存在，
如果不存在，在最后第二位（没有两位，在<code>purple.scope()</code>）<code>{PARENTNODE}</code>下查找<code>data-id="{NAME}"</code>有没有。
如果有，在<code>dataid</code>下插入，否则，在<code>{PARENTNODE}</code>下插入。
继续遍历

##实例

    res.render({
        "main/wrapper": {
            "main/loginState": {}
        }
    })

    if (user.isLogged){
        res.render({
            "main/loginState": {
                "main/logged: {}
            }
        })
    } else {
        res.render({
            "main/loginState": {
                "main/unlogged: {}
            }
        })
    }

    // 运行结果(已登录)

    <body>
        <div id="wrapper">
            <div data-id="main/loginState">
                <div id="loginState">
                    <div data-id="main/logged">
                        <div id="logged">已登录</div>
                    </div>
                </div>
            </div>
        </div>
    </body>

##特性

1. 不再维护全局的<code>tree</code>
2. 分级渲染页面，并分级实现动画
