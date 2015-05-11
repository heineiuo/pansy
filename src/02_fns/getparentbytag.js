


/**
 * 在父级元素中查找标签
 */
function getParentByTag(dom, nodename) {
  if (dom.nodeName == 'BODY') {
    return false;
  }

  if (dom.nodeName == nodename) {
    return p
  };

  var p = getParent(dom);
  return getParentByTag(p)

  /**
   * 获取父级元素
   */
  function getParent(dom) {
    return dom.parentNode || dom.parentElement
  }
}
