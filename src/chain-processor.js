async function processAsync(handlers, value) {
  for(var i=0; i<handlers.length; i++) {
    var result = await handlers[i](value);
    if(result) {
      return result;
    }
  }
}

function process(handlers, value) {
  for(var i=0; i<handlers.length; i++) {
    var result = handlers[i](value);
    if(result) {
      return result;
    }
  }
}

exports.process = process;
exports.processAsync = processAsync;
