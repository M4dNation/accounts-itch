Accounts.oauth.registerService("itch");

if (Meteor.isClient) {
  Meteor.loginWithItch = function(options, callback) {
    if (!callback && typeof options === "function") {
      callback = options;
      options = null;
    }

    var credentialRequestCompleteCallback = Accounts.oauth.credentialRequestCompleteHandler(
      callback
    );
    Itch.requestCredential(options, credentialRequestCompleteCallback);
  };
} else {
  Accounts.addAutopublishFields({
    forLoggedInUser: ["services.itch"],
    forOtherUsers: ["services.itch.profile"],
  });
}
