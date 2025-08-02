---
Owner: Jacob Bleser
Created time: 2021-09-09T17:24
Development: Seed
Lifespan: Evergreen
Type: Opinion
---
Another issue that came up in Marriage Pact. We are in the process of building out our first real infrastructure, including a repository to hold user data long-term. Since there was very little existing code, we had full reign over what we wanted our tech stack to be (with the exception that we host most of it on AWS). The first major decision was choice of database. Myself, and 2 other devs wanted to use PostgreSQL. The dev who was largely responsible for our cloud/backend operations wanted to use DynamoDB. This actually turned into quite the heated debate, with solid arguments made on both sides. Unfortunetly, while we were debating, time was ticking, and the eventual solution we arrived at was to go with what the backend dev wanted, despite not really feeling ok with it. I found the exchange really interesting, because it's a conflict I've now encountered on every greenfield project I've worked on, across multiple teams. So the question becomes, how do you solve problems like this in an efficient matter, where both sides have strong arguments, and both sides believe they are correct?