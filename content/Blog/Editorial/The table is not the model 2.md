---
Owner: Jacob Bleser
Created time: 2022-06-23T02:09
Development: Seed
Lifespan: Evergreen
Type: Opinion
---
- A cool example of this I stumbled upon was in Checkmate. In Checkmate, the data structure I try to expose to the client is a graph. And, on the backend I try and represent the entirety of all clients as a graph as well. But I noticed that the client graph may not be a 1-to-1 slice of the server graph.
- The example I found was when trying to model questions sent from one person to another. I knew how I wanted this to be structured when sent to the client, like this:
    
    ```javascript
    [
      {
        id: UUID,
        content: String,
        low_label: String,
        high_label: String,
        histogram: [Float],
        senders: [
          {
            id: "checkmate" | UUID,
            sent_at: UnixTimestamp,
            first_name: "checkmate" | String
          }
        ]
      }
    ]
    ```
    
- From the clients perspective, they have a connection to questions, and each question has a connection to multiple senders. Something like this:
    
    ```Plain
    (:profile)<-[:QUEUED_TO]-(:question)<-[:SENT_BY]-(:profile)
    ```
    
- The tricky thing arose when I tried to figure out how to express this in the overall server graph. See, in the server graph, there is a many to many relationship between profiles and questions already. A profile can have many questions in their queue, and a question can be in many peoples queues. So, a profiles queue is the subset of questions queued to them. Now arises the problem, a queued question can ALSO be sent by multiple people. But how do you express this as a graph? If you tried to run the Cypher query above in the server graph, you would get the subset of questions in your queue, but you would also get everyone who has ever sent that question, whether they were sent to you or not! How do we get the subset of senders that sent the question to you?
- There are 2 ways to solve this. This first is to introduce an intermediary node that links all the data together. Something like this:
    
    ```Plain
                             (question)
    														 ^
                                 |
    												[:QUEUED_WITH]
                                 |
    (profile)-[:QUEUED]-(sent_question)-[:SENT]-(profile)
    ```
    
- The problem I had this with design was that it deviated from the structure I wanted to send to the client. If I just sent a slice of this graph as-is, it would look something like this:
    
    ```javascript
    [
    	{
    		sent_at: UnixTimestamp,
    
    		question: {
    	    id: UUID,
    	    content: String,
    	    low_label: String,
    	    high_label: String,
    	    histogram: [Float],
    	  }
    		sender: {
          id: "checkmate" | UUID,
          first_name: "checkmate" | String
        }
    	}
    ]
    ```
    
- This isn’t necessarily bad, all the data we need is there. And on the plus side our data model is consistent and decoupled. If we wanted to later, say, add a way to view the top 10 most answered questions of the day, where the idea of “sent” questions doesn’t make sense, and we could just return a list of question structs as-is.
- But the obvious issue with this is that it unnecessarily duplicates a lot of data. It includes the question for every question sent by every person, even if the same question is sent multiple times
- The other catch with this is that our model is now semantically different. Instead of a `GET /questions` resource, we really now have a `GET /queued_questions` resource, with each queued question having a link to a question and list of senders . In theory we could even go further and say it’s a `GET /received_questions/queue` or `GET /received_questions?order_by=senders.sent_at,asc`. That would make our data model even more flexible, at the cost of a somewhat more complex implementation
- The second way to solve this is to