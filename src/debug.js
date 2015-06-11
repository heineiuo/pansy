function debug(err, debug) {
  if (__purple.debug == null) {
    if (err) {
      console.error(err, debug);
    } else {
      console.log(debug);
    }
  } else {
    __purple.debug(err, debug);
  }
}