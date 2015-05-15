/**
 * 模板渲染
 */ 

purple.node = function (nodeName, stringName) {
  
  if (isDefined(stringName)) {
    var dom = __purple.node[nodeName] = string2dom(__purple.template[stringName])
  } else {
    var dom = __purple.node[nodeName] || document.createElement('div')
  }

  return domWrapper(dom)

  function string2dom (stringDom) {
    var wrapper= document.createElement('div')
    // stringDom = stringDom.replace(/[\r\n\s]/g, "") // ERROR
    wrapper.innerHTML = stringDom
    deleteChildTextNode(wrapper)
    return wrapper.firstChild
  }

  function domWrapper (dom) {

    dom.hide = function () {
      dom.style.display = "none"
    }
    dom.show = function () {
      dom.style.display = "inherit"
    }
    return dom
  }

  function deleteChildTextNode (dom) {

    r(dom)
    return dom

    function r(dom) {
      if (dom.childNodes.length > 0) {
        for (var i = dom.childNodes.length-1; i > -1; i--) {
          if (dom.childNodes[i].nodeName != '#text') {
            // 不递归了
          } else {
            dom.childNodes[i].remove()
          }
        }
      }
    } // end r
  } // end deleteChildTextNode

}


function render (node, tree, animation) {
  var oldTree = __purple.currentPurpleTemplateStructure || {}
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
        jack.appendChild(purple.node(nodeName, nodeName))
      }
    }

    return diff
  }
}