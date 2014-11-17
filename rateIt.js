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

  Template.modal.events({
    'click .addIdea': function(evt, tmpl) {
      console.log("button clicked");

      var name = tmpl.$('.name').val();
      var desc = tmpl.$('.description').val();

      var uId = Meteor.userId();
      if (uId && name && desc) {
        Ideas.insert({
          name: name,
          description: desc,
          userId: uId
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