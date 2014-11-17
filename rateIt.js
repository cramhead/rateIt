if (Meteor.isClient) {
  Template.ideas.helpers({
    ideas: function() {
      return Ideas.find({}, {
        sort: {
          createdAt: -1
        }
      });
    }
  });

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