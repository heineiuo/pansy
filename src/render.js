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

};


function string2dom (stringDom) {
  var wrapper= document.createElement('div')
  wrapper.innerHTML = stringDom
  deleteChildTextNode(wrapper)
  return wrapper.firstChild

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
}


function render(res, tree, animation) {
  // 清空旧的视图，如果已经清空，pass
  if (res.prevView == null){
    res.prevView = string2dom('<div style="position: absolute"></div>');
    for(var i=purple.scope().childNodes.length - 1; i> -1; i--){
      res.prevView.appendChild(purple.scope().childNodes[i]);
    }
    __purple.node = {}
  }
  var treeArr = obj2arr(tree);
  // 新建视图
  for(var i = 0; i<treeArr.length; i++){
    var thisNodeName = treeArr[i][treeArr[i].length - 1];
    // 判断是否已经存在，已经存在，pass
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