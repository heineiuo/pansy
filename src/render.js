/**
 * 模板渲染
 */

purple.node = function (nodeName, stringDom) {

  if (isDefined(stringDom)) {
    var dom = __purple.node[nodeName] = string2dom(stringDom)
    dom.style.display = 'none';
  } else {
    var dom = __purple.node[nodeName] || null
  }

  return dom

  function string2dom (stringDom) {
    var wrapper= document.createElement('div')
    // stringDom = stringDom.replace(/[\r\n\s]/g, "") // ERROR
    wrapper.innerHTML = stringDom
    deleteChildTextNode(wrapper)
    return wrapper.firstChild
  }

  function deleteChildTextNode (dom) {
    r(dom)
    return dom

    function r(dom) {
      if (dom.childNodes.length > 0) {
        for (var i = dom.childNodes.length-1; i > -1; i--) {
          if (dom.childNodes[i].nodeName != '#text') {
            // 心累了，不递归了
          } else {
            dom.childNodes[i].remove()
          }
        }
      }
    } // end r
  } // end deleteChildTextNode

};



function render(res, tree, animation) {
  // 判断是否要清空旧的视图
  if(res.prevView == null) {
    res.prevView = purple.node('prevView', '<div id="prevView"></div>');
    for(var i=purple.scope().childNodes.length - 1; i> -1; i--){
      res.prevView.appendChild(purple.scope().childNodes[i]);
    }
    purple.scope().appendChild(res.prevView);
    __purple.node = {}
  }
  var treeArr = obj2arr(tree);
  // 遍历更新视图
  for(var i = 0; i<treeArr.length; i++){
    // 判断是否已经存在
    var thisNodeName = treeArr[i][treeArr[i].length - 1];
    if (purple.node(thisNodeName) == null) {
      var thisNode = purple.node(thisNodeName, __purple.template[thisNodeName]);
      // 查找父节点
      if (treeArr[i].length == 1) {
        var parentNode = purple.scope()
      } else {
        var parentNodeName = treeArr[i][treeArr[i].length - 2];
        var parentNode = purple.node(parentNodeName);
      }
      // 查找插口
      var jack = parentNode.querySelector('[data-id="'+thisNodeName+'"]');
      if (jack == null) {jack = parentNode}
      // 插入
      jack.appendChild(thisNode);
      if(isUndefined(animation)){
        thisNode.style.display = null;
      }
    }
  } // 遍历结束
  if(isDefined(animation)){
    animation(prevView, purple.scope())
  }
}


function render3 (node, tree, animation) {

  var oldTree = __purple.tree;
  var oldTreeArr = obj2arr(oldTree);
  if(oldTreeArr.length>0) {
    var prevScope = purple.node(oldTreeArr[0][0]);
    if(typeof animation == 'undefined') {
      prevScope.remove();
    }
    prevScope.id = 'purple-scope-prev';
  } else {
    var prevScope = null
  }


  __purple.node = {};
  var treeArr = obj2arr(tree);
  var newScope = purple.node(treeArr[0][0], purple.template(treeArr[0][0]));

  for(var i=1; i<treeArr.length; i++){
    if(treeArr[i].length==1){
      var parentNode = newScope;
    } else {
      var parentNodeName = treeArr[i][treeArr[i].length - 2]
      var parentNode = purple.node(parentNodeName);
    }
    var thisNodeName = treeArr[i][treeArr[i].length -1]
    var thisNode = purple.node(thisNodeName, purple.template(thisNodeName));
    var jack = parentNode.querySelector('[data-id="'+thisNodeName+'"]');
    if (jack == null) {jack = parentNode}
    jack.appendChild(thisNode);
  }

  __purple.tree = tree;
  if(typeof animation == 'undefined') {
    document.body.appendChild(newScope);
  } else {
    animation(prevScope, newScope)
  }


}






function render2 (node, tree, animation) {
  var oldTree = __purple.tree || {}
  var diff = compareTree(oldTree, tree)
  __purple.tree = tree
  /*  => 
   diff.show
   diff.hide
   */

  // 如果有动画控制器，将显隐控制权转移
  // 否则直接显隐
  if (typeof animation !== 'undefined') {
    animation(diff)
  } else {
    for (var i = 0; i < diff.show.length; i++) {
      purple.node(diff.show[i]).show()
    }
    for (var i = 0; i < diff.hide.length; i++) {
      purple.node(diff.hide[i]).hide()
    }
  }

  /**
   * 比较两个DOM结构，返回一个对象，包含3个数组对象
   */
  function compareTree (oldTree, tree) {
    var oldTreeArr = obj2arr(oldTree)
    var treeArr = obj2arr(tree)
    var diff = {
      show: [],
      hide: []
    }

    // 遍历出hide
    for (var i = 0; i < oldTreeArr.length; i++) {
      if (!in_array(oldTreeArr[i], treeArr)) {
        diff.hide.push(oldTreeArr[i][oldTreeArr[i].length-1])
      }
    }

    // 遍历出show，并构建新dom
    for (var i = 0; i < treeArr.length; i++) {
      var nodeName = treeArr[i][treeArr[i].length-1]
      diff.show.push(nodeName)
      // 未加载过的node
      if (isUndefined(__purple.node[nodeName])) {
        if (treeArr[i].length == 1) {
          var parentNode = document.body
        } else {
          var parentNodeName = treeArr[i][treeArr[i].length-2]
          var parentNode = __purple.node[parentNodeName] || {aaa:'aaaa'}
        }

        var jack = parentNode.querySelector('[data-id="'+nodeName+'"]')
        if (jack == null) {jack = parentNode}
        jack.appendChild(purple.node(nodeName, __purple.template[nodeName]))
      }
    }

    return diff
  }
}