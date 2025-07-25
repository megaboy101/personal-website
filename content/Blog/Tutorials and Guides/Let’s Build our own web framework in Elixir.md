---
Owner: Jacob Bleser
Created time: 2021-01-26T21:02
Development: Seed
Lifespan: Dated
Type: Guide
---
[[Web Framework Devlog]]
- Use Plug as a base
- Include time-based API versioning
    
    - One cool trick I saw was to pattern match on the Plug `conn` field like so
    
    ```elixir
    def create(%Plug.Conn{req_headers: "11-21-22"} = conn, _params) do
    	# Handle new version
    end
    
    def create(conn, _params) do
    	# Handle old version
    end
    ```
    
- Include request idempotency
- Include idiomatic input validation
- Include idiomatic .env file loading
- Include rejecting all requests are aren’t of the right media type with `415` error
- Add support for async requests with `201` status
- Add support for blank responses with `204` status
- Include idiomatic job accepting
    - Immediately give a 202 response
    - Provide a URL where the job status can be checked
    - This is a stateless way to do it, but this could also be supported in a stateful way via events?
- Support RESTful JSON views
    - Resource graph based views!
- Support autogenerated API documentation
- Support the future of API’s
    - Model-View-Update like Elm. Expose a strongly typed data structure that can be richly queried/subscribed to. And then instead of mutations support Elm style commands as RPC commands or something
- Support real-time
    - Able to define resource graph events!
- Don’t know where else to put this but wanted to write it down:
    - Would it make sense to have the web layer be a protocol? Like if the idea is to expose a read-only data structure, it would be cool if a bulk of the API-side logic was standardized, and you would just have to implement some functions for your specific data structure. This may help with stuff like auto-generated documentation?