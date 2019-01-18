function createHandleFn (fn) {
  return function handleFn (entity) {
    return new Promise (function handlePromiseFn (resolve, reject) {
      fn(entity)
        .then(data => {
          resolve({ entity, data })
        })
        .catch(error => {
          reject({ entity, error })
        })
    });
  };
}

function createResultFn (fn) {
  return function resultFn (result) {
    return new Promise(function resultPromiseFn (resolve, reject) {
      fn(result)
        .then(data => {
          resolve({ result, data })
        })
        .catch (error => {
          reject({ result, error })
        })
    })
  }
}

function EasyQueue (options) {
  let entities = options.entities;
  if (!entities) {
    this.waitQueue = [];
  } else if (!Array.isArray(entities)) {
    this.waitQueue = [entities];
  } else {
    this.waitQueue = entities;
  }
  this.MAX_WOKING_NUMBER = options.workingNum || 100;
  this.MIN_HANDLE_NUMBER = options.handleNum || 50;

  let handleFn = 
    options.handleFn
      ? options.handleFn.bind(this)
      : function defaultHandleFn (entity) {
        return entity
      };
  
  let resultFn =
    options.resultFn
      ? options.resultFn.bind(this)
      : function defaultResultFn (result) {
        return result
      };

  this.handleFn = createHandleFn(handleFn);
  this.resultFn = createResultFn(resultFn)

  this.doingQueue = [];
  this.doingErrorQueue = [];
  this.resultQueue = [];
  this.resultErrorQueue = [];

  this.doingTimer = null
  this.resultTimer = null
  this.handleGap = options.handleGap || 0
  this.resultGap = options.resultGap || 200
}

EasyQueue.prototype.removeFromDoingQ = function (entity) {
  let index = -1;
  for (let i = 0, l = this.doingQueue.length; i < l; i++) {
    if (entity === this.doingQueue[i]) {
      index = i;
      break;
    }
  }
  if (index > -1) {
    return this.doingQueue.splice(index, 1);
  }
  return null;
}

EasyQueue.prototype.handledOne = function (entity, data) {
  this.removeFromDoingQ(entity);
  this.resultQueue.push(data);
}

EasyQueue.prototype.handledError = function (entity) {
  entity = this.removeFromDoingQ(entity) || entity;
  this.doingErrorQueue.push(entity);
}

EasyQueue.prototype.resultedError = function (result) {
  this.resultErrorQueue.push(result)
}

EasyQueue.prototype.addWork = function (entity) {
  this.waitQueue.push(entity)
}

EasyQueue.prototype.start = function () {
  console.log('start')
  this.doingTimer = setInterval(() => {
    if (this.doingQueue.length < this.MAX_WOKING_NUMBER) {
      let current = this.waitQueue.shift();
      if (current) {
        this.doingQueue.push(current)
        this.handleFn(current)
        .then(({ entity, data }) => {
          this.handledOne(entity, data);
        })
        .catch(({ entity, error }) => {
          console.log('处理实体过程报错', error)
          this.handledError(entity)
        })
      }
    }
  }, this.handleGap)
  this.resultTimer = setInterval(() => {
    let resArr = []
    if (this.resultQueue.length >= this.MIN_HANDLE_NUMBER) {
      resArr = this.resultQueue.splice(0, this.MIN_HANDLE_NUMBER);
    } else if (!this.doingQueue.length && !this.waitQueue.length) {
      resArr = this.resultQueue.splice(0);
    }
    if (resArr.length) {
      this.resultFn(resArr)
        .then(({ result, data }) => {
          console.log(`处理结果完毕`, result, data)
        })
        .catch(({ result, error }) => {
          console.log(`结果处理时出错：`, error)
          this.resultedError(result)
        })
    }
    
  }, this.resultGap)
}

EasyQueue.prototype.pause = function () {
  clearInterval(this.doingTimer);
  clearInterval(this.resultTimer);
}

EasyQueue.prototype.close = function () {
  this.paush()
  this.doingQueue = []
  this.waitQueue = []
  this.resultQueue = []
  this.resultErrorQueue = []
  this.doingErrorQueue = []
}

module.exports = EasyQueue;
