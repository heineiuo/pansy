function headertab (tab) {
  $('.main .header .tab').removeClass('open')
  $('.main .header .tab-'+tab).addClass('open')
}

function upperFirstLetter (letter) {
  return letter.substr(0,1).toUpperCase()+letter.substr(1)
}
