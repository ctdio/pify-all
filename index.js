var promisify = require('pify')

var functionBlackListMap =
  Object.getOwnPropertyNames(Object.prototype)
    .reduce(function (map, functionName) {
      map[functionName] = true
      return map
    }, {});

function _promisifyAllFunctions (object) {
  var propertyNames = Object.getOwnPropertyNames(object)
  for (var i = 0; i < propertyNames.length; i++) {
    var propertyName = propertyNames[i]

    if (functionBlackListMap[propertyName]) {
      continue;
    }

    var descriptor = Object.getOwnPropertyDescriptor(object, propertyName)

    if (!descriptor.get) {
      var func = object[propertyName]
      if (typeof func === 'function') {
        object[`${propertyName}Async`] = promisify(func)
      }
    }
  }
}

module.exports = function (object) {
  _promisifyAllFunctions(object)

  var proto = Object.getPrototypeOf(object)
  if (proto) {
    _promisifyAllFunctions(proto)
  }

  return object
}
