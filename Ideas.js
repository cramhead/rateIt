Ideas = new Meteor.Collection('ideas');
Votes = new Meteor.Collection('votes');

var availableVotes = 5;

Ideas.allow({
  insert: function(userId, doc) {
    return userId === Meteor.userId();
  },
  update: function(userId, doc, fields, modifier) {
    if (overLimit(userId)) {
      return false;
    }
    return userId === Meteor.userId();
  },
  remove: function(userId, doc) {
    return false;
  }
});

Votes.allow({
  insert: function(userId, doc) {
    if (overLimit(userId)) {
      return false;
    }
    return true;
  },
  update: function(userId, doc, fields, modifier) {
    if (overLimit(userId)) {
      return false;
    }
    return true;
  },
  remove: function(userId, doc) {
    return false;
  }
});


if (Meteor.isClient) {


}

if (Meteor.isServer) {

  var overLimit = function(userId) {

    var currentDateTime = new Date();
    var year = currentDateTime.getFullYear();
    var month = currentDateTime.getMonth();
    var dayOfMonth = currentDateTime.getDate();

    var startOfDay = new Date(year, month, dayOfMonth);
    var endOfDay = moment(startOfDay).add(1, 'days').toDate();

    return Votes.find({
      $and: [{
        userId: userId
      }, {
        createdAt: {
          $gte: startOfDay,
          $lte: endOfDay
        }
      }]
    }).count() > availableVotes;
  };


  Meteor.publish('ideasFilter', function(filter, options) {
    filter = filter || {};
    options = options || {
      limit: 100
    }

    check(filter, Object);
    check(options, Object);

    return Ideas.find(filter, options);
  });

}