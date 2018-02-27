// 'url' is assigned to in a statement before this.
var page = require('webpage').create();

var isReady = function () {
  return page.evaluate(function () {
    if (typeof Meteor === 'undefined'
        || Meteor.status === undefined
        || !Meteor.status().connected) {
      return false;
    }
    if (typeof Package === 'undefined'
        || Package['ongoworks:spiderable'] === undefined
        || Package['ongoworks:spiderable'].Spiderable === undefined
        || !Package['ongoworks:spiderable'].Spiderable._initialSubscriptionsStarted) {
      return false;
    }
    Tracker.flush();
    return DDP._allSubscriptionsReady();
  });
};

var dumpPageContent = function () {
  var out = page.content;
  out = out.replace(/<script([^>](?!type))*[^\s>]?(\stype\=("|')(application|text)\/javascript("|'))?([^>](?!type))*>(.|\n|\r)*?<\/script\s*>/ig, '');
  out = out.replace('<meta name="fragment" content="!">', '');
  console.log(out);
};

page.open(url, function(status) {
  if (status === 'fail')
    phantom.exit();
});

setInterval(function() {
  if (isReady()) {
    dumpPageContent();
    phantom.exit();
  }
}, 100);

