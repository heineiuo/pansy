/**
 * 模板渲染
 */ 

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
    var needCreate = []
    var diff = {
      show: [],
      hide: []
    }

    // 找出 hide
    for (var i = 0; i < oldTreeArr.length; i++) {
      if (!in_array(oldTreeArr[i], treeArr)) {
        diff.hide.push(oldTreeArr[i][oldTreeArr[i].length-1])
      }
    }

    // 找出needCreate
    // 遍历treearr到show
    for (var i = 0; i < treeArr.length; i++) {
      var _len = treeArr[i].length
      var nodeName = treeArr[i][_len-1]
      diff.show.push(nodeName)
      if (typeof __purple.node[nodeName] === 'undefined')) {
        // needCreate.push(treeArr[i])
        // 构建 needCreate

        if (_len == 1) {
          $target = $(body)
        } else {
          $target = $(treeArr[i][_len-2])
        }
      
        $(purple.node(treeArr[i][0])).appendTo($target)


      };
    }






  }

}

