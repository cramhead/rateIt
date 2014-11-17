Ideas = new Meteor.Collection('ideas');

Ideas.allow({
  insert: function(userId, doc) {
    return userId === Meteor.userId();
  },
  update: function(userId, doc, fields, modifier) {
    return userId === Meteor.userId();
  },
  remove: function(userId, doc) {
    return false;
  }
});


if (Meteor.isClient) {


}

if (Meteor.isServer) {

  Meteor.publish('ideasFilter', function(filter, options) {
    filter = filter || {};
    options = options || { limit: 100}

    check(filter, Object);
    check(options, Object);

    return Ideas.find(filter, options);
  });

}