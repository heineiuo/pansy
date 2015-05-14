/**
 * 模板渲染
 */ 

purple.node = function (nodeName, stringName) {
  
  if (typeof stringDom !== 'undefined') {
    var dom = __purple.node[nodename] = string2dom(__purple.template[stringName])
  } else {
    var dom = __purple.node[nodename]
  }

  return domWrapper(dom)

  function string2dom (stringDom) {
    var wrapper= document.createElement('div')
    wrapper.innerHTML= stringDom
    return wrapper.firstChild
  }

  function domWrapper (dom) {
    dom.hide = function () {
      this.style.display = "none"
    }
    dom.show = function () {
      this.style.display = "inherit"
    }
    return dom
  }

}


function render (node, tree, animation) {
  var oldTree = __purple.currentPurpleTemplateStructure
  var diff = compareTree(oldTree, tree)
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
      if (typeof __purple.node[nodeName] === 'undefined') {
        var parentNodeName = treeArr[i][treeArr[i].length-2]
        var parentNode = __purple[parentNodeName]
        var jack = parentNode.querySelector('[data-id='+nodeName+']')
        if (jack == null) {jack = parentNode}
        jack.appendChild(purple(nodeName))
      }
    }
  }
}