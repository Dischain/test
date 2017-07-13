/* AjaxHandler interface. */
var AjaxHandler = new Interface('AjaxHandler', ['request', 'createXhrObject']);
/* SimpleHandler class. */
var SimpleHandler = function() {}; // implements AjaxHandler
SimpleHandler.prototype = {
  request: function(method, url, callback, postVars) {
    var xhr = this.createXhrObject();
    xhr.onreadystatechange = function() {

    if(xhr.readyState !== 4) return;
    
    (xhr.status === 200) ?
      callback.success(xhr.responseText, xhr.responseXML) :
      callback.failure(xhr.status);
    };

    xhr.open(method, url, true);

    if(method !== 'POST') postVars = null;
    
    xhr.send(postVars);
  },

  createXhrObject: function() { // Factory method.
    var methods = [
      function() { return new XMLHttpRequest(); },
      function() { return new ActiveXObject('Msxml2.XMLHTTP'); },
      function() { return new ActiveXObject('Microsoft.XMLHTTP'); }
    ];

    for(var i = 0, len = methods.length; i < len; i++) {
      try {
        methods[i]();
      }
      catch(e) {
        continue;
      }

      // If we reach this point, method[i] worked.
      this.createXhrObject = methods[i]; // Memoize the method.
      return methods[i];
    }

    // If we reach this point, none of the methods worked.
    throw new Error('SimpleHandler: Could not create an XHR object.');
  }
};

/* QueuedHandler class. */
var QueuedHandler = function() { // implements AjaxHandler
  this.queue = [];
  this.requestInProgress = false;
  this.retryDelay = 5; // In seconds.
};

extend(QueuedHandler, SimpleHandler);

QueuedHandler.prototype.request = function(method, url, callback, postVars,override) {
  if(this.requestInProgress && !override) {
    this.queue.push({
      method: method,
      url: url,
      callback: callback,
      postVars: postVars
    });
  } else {
    this.requestInProgress = true;
    var xhr = this.createXhrObject();
    var that = this;
    xhr.onreadystatechange = function() {
    
    if(xhr.readyState !== 4) return;
    
    if(xhr.status === 200) {
      callback.success(xhr.responseText, xhr.responseXML);

      that.advanceQueue();
    } else {
      callback.failure(xhr.status);

      setTimeout(function() { that.request(method, url, callback, postVars); },
      that.retryDelay * 1000);
    }
  };

    xhr.open(method, url, true);
  
    if(method !== 'POST') postVars = null;
  
    xhr.send(postVars);
  }
};

QueuedHandler.prototype.advanceQueue = function() {
  if(this.queue.length === 0) {
    this.requestInProgress = false;
    return;
  }

  var req = this.queue.shift();
  this.request(req.method, req.url, req.callback, req.postVars, true);
};

/* OfflineHandler class. */
var OfflineHandler = function() { // implements AjaxHandler
  this.storedRequests = [];
};

extend(OfflineHandler, SimpleHandler);

OfflineHandler.prototype.request = function(method, url, callback, postVars) {
  if(XhrManager.isOffline()) { // Store the requests until we are online.
    this.storedRequests.push({
      method: method,
      url: url,
      callback: callback,
      postVars: postVars
    });
  } else { // Call SimpleHandler's request method if we are online.
    this.flushStoredRequests();
    OfflineHandler.superclass.request(method, url, callback, postVars);
  }
};

OfflineHandler.prototype.flushStoredRequests = function() {
  for(var i = 0, len = storedRequests.length; i < len; i++) {
    var req = storedRequests[i];
    OfflineHandler.superclass.request(req.method, req.url, req.callback, req.postVars);
  }
};

/* XhrManager singleton. */
var XhrManager = {
  createXhrHandler: function() {
    var xhr;
    
    if(this.isOffline()) {
      xhr = new OfflineHandler();
    } else if(this.isHighLatency()) {
      xhr = new QueuedHandler();
    } else {
      xhr = new SimpleHandler()
    }

    Interface.ensureImplements(xhr, AjaxHandler);
    
    return xhr
  },

  isOffline: function() { // Do a quick request with SimpleHandler and see if
    ... // it succeeds.
  },

  isHighLatency: function() { // Do a series of requests with SimpleHandler and
    ... // time the responses. Best done once, as a
    // branching function.
  }
};

var myHandler = XhrManager.createXhrHandler();
var callback = {
  success: function(responseText) { alert('Success: ' + responseText); },
  failure: function(statusCode) { alert('Failure: ' + statusCode); }
};
myHandler.request('GET', 'script.php', callback);
