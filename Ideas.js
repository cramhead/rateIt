Ideas = new Meteor.Collection('ideas');

Ideas.allow({
  insert: function (userId, doc) {
    return userId === Meteor.userId();
  },
  update: function (userId, doc, fields, modifier) {
     return userId === Meteor.userId();
  },
  remove: function (userId, doc) {
    return false;
  }
});