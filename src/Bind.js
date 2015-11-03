
var options = {
  template: JST['cname/new'],
  data: {w:'sb'},
  filters: submitEvent = function(event, data){
    ajax('cname.new').data(data.formdata).exec(function(err, res){
      if (err) return data.err = err
      data.res = res
    })
  }
}

$('#page-container').kister(options)


kister('#page-container')({
  template: JST['cname/new'],
  data: {
    submitEvent: submitEvent
  }
})
