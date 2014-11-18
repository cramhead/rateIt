Ideas = new Meteor.Collection('ideas');
Votes = new Meteor.Collection('votes');


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

Votes.dailyLimit = 5;

Votes.dailyVoteCount = function(userId) {
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
  }).count();
};

if (Meteor.isServer) {


  var overLimit = function(userId) {
    return Votes.dailyVoteCount(userId) >= Votes.dailyLimit;
  };

  Votes.after.insert(function(userId, doc) {
    if (doc.vote === 'up') {
      Ideas.update({
        _id: doc.ideaId
      }, {
        $inc: {
          votes: 1
        }
      });
    }
    if (doc.vote === 'down') {
      Ideas.update({
        _id: doc.ideaId
      }, {
        $inc: {
          votes: -1
        }
      });
    }
  });

  Meteor.publish('votes', function(){
    return Votes.find({userId: this.userId});
  })


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