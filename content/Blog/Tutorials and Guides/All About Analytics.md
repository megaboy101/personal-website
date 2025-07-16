---
Owner: Jacob Bleser
Created time: 2020-12-30T10:53
Last edited: 2025-03-02T23:04
Development: Budding
Lifespan: Rotted
Type: Guide
---
- Do not worry about setting up analytics until you're ready to move out of stage 1 and open your product up outside your small test group. Until then, your growth formula will be too fluid to warrant the time necessary to set everything up
- Analytics should be built around your growth formula and your growth funnel
    - You should ideally set up tracking for each factor in your growth formula
- Once you have your analytics set up, make sure you post it everywhere so that your team can see it and be constantly aware of it
# Setup for Typical Funnel Metrics
Acquisition Metric
- This is typically signups per week, or something similar
- Break this up by invite type, so that you can distinguish organic users from referred users
    - This can be done in Amplitude by doing "Event Segmentation" under the signup event you create
Retention Metric
- This depends heavily on your business
    - AirBnB: Bookings per cohort per year
    - Facebook: Active Users per cohort per day
    - Ebay: Value of merchandise sold per cohort per day
- Organize users into cohorts based on the week they signed up. Track each user cohort over time to get an active usage per week over time
    - This can be done in Amplitude by doing "Retention Analysis" and plugging in your starter event and "standard usage" event

Revenue Metric
- This depends on your business, but is signified by the specific moment a user of your product hands over their money
    - You can measure improvement in this metric in Amplitude by doing a "Property Value Sum" over all Revenue Metric events
    
      
    

# Analytics Tech Stack
- Before sharing with your first private beta group...
    - Install google Analytics on your site and product. This will identify users coming to your site and let you know when users are new or returning
    - Install Amplitude on you site and product. This will tell you what actions users are taking with your product
    - Set up a direct line between the team and your audience
        - What this looks like depends on your product. For SaaS apps this may be a Live Chat feature on your website, or an welcome email from the founder after signup
![[Sketchbook/img/Untitled 5.png|Untitled 5.png]]