AccountsItch = {};

Oauth.registerService("itch", 2, null, function(query) 
{
    var response = getTokenResponse(query);
    var accessToken = response.access_token;

    var user = getUser(query.key);

    user.id = user._id;

    var serviceData = _.extend(user, {accessToken: accessToken});

    return {
        serviceData: serviceData,
        options: {
            profile: { name: user.username },
            services: { itch: user }
        }
    };
});

var getTokenResponse = function (query) 
{
    var config = ServiceConfiguration.configurations.findOne({service: "itch"});

    if (!config)
        throw new ServiceConfiguration.ConfigError();

    var response;
    try 
    {
        response = HTTP.post("https://itch.io/api/1/oauth/token", 
        {
            params: 
            {
                code: query.code,
                client_id: config.clientId,
                redirect_uri: OAuth._redirectUri("itch", config),
                client_secret: OAuth.openSecret(config.secret),
                grant_type: "authorization_code"
            }
        });

        if (response.error) // if the http response was an error
            throw response.error;
        if (typeof response.content === "string")
            response.content = JSON.parse(response.content);
        if (response.content.error)
            throw response.content;
    } 
    catch (err) 
    {
        throw _.extend(new Error("Failed to complete OAuth handshake with Itch. " + err.message),
            {response: err.response});
    }

    return response.content;
};

var getUser = function(access_token) 
{
    try 
    {
        return HTTP.get("https://itch.io/api/1/key/me",
        {
            headers: {"Authorization": "Bearer " + access_token}
        }).data;
    } 
    catch (err) 
    {
        throw _.extend(new Error("Failed to fetch identity from Itch. " + err.message), {response: err.response});
    }
};

AccountsItch.retrieveCredential = function(credentialToken, credentialSecret) 
{
    return Oauth.retrieveCredential(credentialToken, credentialSecret);
};