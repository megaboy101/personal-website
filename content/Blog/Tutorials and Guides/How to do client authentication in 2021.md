---
Owner: Jacob Bleser
Created time: 2023-12-17T17:10
Development: Seed
Lifespan: Dated
Type: Guide
---
When only a single server and database is involved in the application, OAuth2.0/OIDC is overkill. It's easier to just use regular session to control access to your backend API. The primary use case of OIDC is if you need to support enterprise SAML, or if you want other sites to support "Sign up with X" for your service.
- OIDC is all about access delegation. App 1 wants data that app 2 has. From app 1 you can login to app 2 and tell it what control you want to allow app 1 over your data.
- EX: CircleCI wants your github data, so it can automatically pull your repositories and run CI/CD. You "Login With Github" in CircleCI, and consent to letting CircleCI read your repo data
  
However, for applications where the API is a distinct, separately managed entity from your client application (this is common in serverless applications), then you may be stuck with OIDC
- In this case, app 1 is your web client (i.e. the client), app 2 is the API you want to access (i.e. the resource server).
- Your web client authenticates with an identity provider (i.e. Amazon Cognito) (i.e. the authorization server), which grants a code or token back to the client. The client uses the token to access the resource server
- Because it is OIDC, your client application has to "Login with API" and show the hosted login UI of the auth server in order to grant the client access. Is there a way to avoid this?
  
Ok so apparently Cognito supports it's OWN auth flows with it's OWN associated JWTs, AND OAuth flows to get it's OWN JWT's. So essentially AWS has it's own OIDC-like system. Additionally, Cognito ALSO provides OIDC styles JWT's
- So essentially, you can login using one of Cognito's own auth flows to get tokens, OR you can use an OAuth2 mechanism to get tokens. But the tokens you get out will be the same. So both regular, and delegated sign in is supported
- It's also important to note that YOU define which methods a client can use to get tokens. So technically it can use both methods, although you'd probably do one or the other
- So cognito has its own auth system, that happens to use JWTs instead of session related stuff.
  
So basically Cognito is OIDC++. No matter what, you will always have a user pool. That is your standard directory for user data. Client applications can access that directory in a variety of ways. If you are making a first-party app, you can create an auth client that authenticates with the user pool directly. To authenticate, the app must use one of Cognito's native auth flows (which are completely distinct from OAuth flows). The supported auth flows are defined when the first-party auth client is created. Additionally, if you are making a 3rd-party app that wants to authenticate with users from the pool, you can create an auth client that authenticates using OIDC. In this setup, the third-party auth client is configured and consumed the same way as a regular OIDC client, with grant types, defined resource servers, redirect URIs, etc. Lastly, if you are creating a 1st-party service that interacts with the protected resource directly (i.e. no user pool involved, app just needs access), you can create an OIDC client that uses the client_credentials grant type.
- Note, you can also use IAM+Sigv4 to handle m2m services. This auth flow is useful when the client is acting as a surrogate in-place of some application. The AWS CLI is a good example, which uses IAM+Sigv4 internally, and can only interact with AWS resources that it's attached IAM policy allows.
- Note, one of the main goals of Cognito is to provide a standard tokens wherever possible, regardless of the authentication/authorization mechanism.
- Cognito is a vendor for OIDC **_tokens_**, but that doesn't mean it follows OIDC flows to get them.
  
This really good breakdown of User Pools vs Identity Pools and when you should use either:
- [https://stackoverflow.com/questions/46334431/aws-service-difference-between-cognito-user-pool-and-federated-identity](https://stackoverflow.com/questions/46334431/aws-service-difference-between-cognito-user-pool-and-federated-identity)
- Essentially, Identity pools are a tool for trading auth tokens for AWS credentials with attached IAM roles. The credentials it returns can be used to interact with AWS services directly, for example though the CLI or the SDK. This makes it easy to assign groups of authenticated users to the same IAM-bound policy, rather than creating a new, unique IAM user and policy for every person who needs to interface with the AWS account. So in a sense, you only need to worry about identity pools if you need to allow some group of people to control parts of your AWS account. It has nothing to do with the actual applications you make