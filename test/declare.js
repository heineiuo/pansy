var viewModel = pansy.viewModel({
  selector: '',
  data: {}, // 预存数据
  template: JST['template'], // 模板或模板引擎
  getData: function(callback){ // 接口通信,更新viewModel.data

  }
})

//props
var render = function(){
  $(this.selector).html(this.template(this.data))
}

viewModel.render()