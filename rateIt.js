if (Meteor.isClient) {

  Template.ideas.helpers({
    ideas: function() {
      return Ideas.find({}, {
        sort: {
          votes: -1,
          createdAt: -1
        }
      });
    }
  });

  Template.ideas.events({
    'click .up': function(evt, tmpl) {
      var iId = this._id;
      Ideas.update({_id: iId}, {$inc: {votes: 1}})
    },
    'click .down': function(evt, tmpl) {
      var iId = this._id;
      Ideas.update({_id: iId}, {$inc: {votes: -1}})
    }

  })

  Template.modal.events({
    'click .addIdea': function(evt, tmpl) {

      var name = tmpl.$('.name').val();
      var desc = tmpl.$('.description').val();

      var uId = Meteor.userId();
      if (uId && name && desc) {
        Ideas.insert({
          name: name,
          description: desc,
          userId: uId,
          createdAt: new Date(),
          votes: 0
        });
      }

    }
  })


  // At the bottom of the client code
  Accounts.ui.config({
    passwordSignupFields: "USERNAME_AND_EMAIL"
  });


}

if (Meteor.isServer) {
  Meteor.startup(function() {
    // code to run on server at startup
  });
}