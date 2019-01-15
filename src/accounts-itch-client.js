Itch = {};

Itch.requestCredential = function(options, credentialRequestCompleteCallback) {
  if (!credentialRequestCompleteCallback && typeof options === 'function') {
    credentialRequestCompleteCallback = options;
    options = {};
  } else if (!options) {
    options = {};
  }

  var config = ServiceConfiguration.configurations.findOne({service: 'itch'});

  if (!config) {
    credentialRequestCompleteCallback &&
      credentialRequestCompleteCallback(new ServiceConfiguration.ConfigError());
    return;
  }

  var credentialToken = Random.secret();
  var loginStyle = OAuth._loginStyle('itch', config, options);
  var requiredScope = ['profile:me'];
  var scope = (options && options.requestPermissions) || [];
  scope = _.union(scope, requiredScope);
  var flatScope = _.map(scope, encodeURIComponent).join('+');

  var loginUrl =
    'https://itch.io/user/oauth' +
    '?client_id=' +
    config.clientId +
    '&response_type=token' +
    '&scope=' +
    flatScope +
    '&redirect_uri=' +
    OAuth._redirectUri('itch', config) +
    '&state=' +
    OAuth._stateParam(loginStyle, credentialToken);

  OAuth.launchLogin({
    loginService: 'itch',
    loginStyle: loginStyle,
    loginUrl: loginUrl,
    credentialRequestCompleteCallback: credentialRequestCompleteCallback,
    credentialToken: credentialToken,
  });
};
