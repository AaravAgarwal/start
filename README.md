# START (Startup Tracking & Accelerated Revenue Toolkit)
## START up with START: Become the Next Success Story
Annually, a significant majority of startups fail because of poor business, finance, and marketing decisions. START provides a centralized platform for startups to build solid business plans and finance strategies. Ranging from unit economics, business plan building to valuation simulation, startups are able to document the best suited strategies. 
## Inspiration
Aaren, co-founder of the startup LaneTrax, was experiencing issues with building business plans and finance strategies at LaneTrax with his team. Moreover, finding someone who had experience to onboard the team was a challenge. The team only consisting of non-business majors learning a completely new set of knowledge was a challenge and trying to make the best decisions with limited knowledge was hindering growth. This was not only the problem for LaneTrax; extra research indicated the majority of the startups fail due to business model and financing challenges. 

To address this issue, the hackathon team has decided to build a software that centralizes all business challenges ranging from unit economics, business plan building, and valuation simulation. This will be an all-in-one toolkit to track company growth and make healthy business and finance choices with assistance of the services in the website. 
## What does START do
The service contains four different features:
- **Business Model & Feedback**: It enables startups to base their business model from our guided questions. By startups following the questions step-by-step, they will be able to give thoughts into their product and growth. With the responses, the service provides feedback by the prompted LLM which will help them to elaborate further. 
- **Unit Economics Calculation**: Unit economics calculation is provided through customizable metrics suited to various types of startups as it is the basics to building a financial plan and a suitable marketing strategy. The calculations are automatically updated with changed values. 
- **Valuation Simulation**: With the method of Discounted Cash Flow (DCF), startups are able to project their value and create appropriate financial plans. While guide to creating financial plan is to be added in the future, the valuation simulation takes in multiple metrics
- **News Sentiment**: News sentiment provides the most recent news related to the industry that the startup is operating in. This will give insight to startups on how the market and the competing industries are looking. 
## How we built START
We have used three different tools to build the service: 
- **React JS**: ReactJS handles the interaction between the user and client page as well as communication with the backend server. Using Google Material UI gives our service a clean-cut, professional, and easy-to use interface.
- **Flask**: Flask manages all backend tasks – its tasks include facilitating reading and writing to the database, running sentiment analysis on recent news, and running simulations. 
- **Google Firebase**: Firebase stores user information via Firestore and facilitates user login through Google OAuth. 
- **Side Note**: START’s sentiment analysis toolkit is powered by FinBERT and trained on the OpenVC dataset
## How is it Different
We provide KNOWLEDGE and GUIDANCE to let startups GROW and LEARN. While our competitors might provide quicker services, they use AI technology to build goals for the startups instead of letting the startups have a thought about their visions. We believe this is merely generating standardized appropriate data and plans instead of having a unique plan tailored to the startup. We guide startups to build unique profiles and plans instead. 
## Challenges
- **Integration between Flask and React.JS**: The application had a lot of moving parts, and ensuring that all API calls, POST, and GET requests were going where they needed to be was challenging. Additionally, making sure file-formats matched between the backend and frontend was another challenge, as variable names and keys had to be identical. 
- **Sentiment Analysis**: We retrieve news from an API, and then use the transformer FinBERT to track sentiment. As we have the news update every hour, we wanted to ensure that this process takes little time and resources. Running a model on a server with laptop-specs is intensive, so making things efficient was a challenge. 
- **Efficient Filtering of VCs**: We used OpenVC’s dataset of over 6,000 VCs and investors to provide users with a comprehensive list of VCs around the world. Due to this large number, we had to efficiently filter AND render the results on our webpage. 
- **Account Security**: As a lot of sensitive data is used in our app, we had to ensure everything was as secure as possible. We used Google Firebase to keep data secure. Firebase is also very efficient and dynamic, providing a great database for our purposes. 
## Future Projections
Feature 1: Detailed Guide
- This will serve as a new starting point for ventures, providing an interactive guide. This guide will serve as an overview of all the metrics and essential knowledge teams need for a successful startup. 

Feature 2: Various Valuations
- Currently, we calculate and determine the DCF valuation for startups. In the future, multiple valuation metrics such as step=up simulations and cash-runway models will be provided to give companies a better idea of their valuations. 

Feature 3: 2-way VC Matching
- 2-way VC matching will allow VCs to find growing and promising startups to contact. This will allow startups and VCs to connect, allowing VCs to further find new investment opportunities as well as making it easier for startups to gain the capital they need.

Feature 4: Equity Tracker
- This feature will track the equity of stakeholders in the company, allowing for simulations of dilutions for investments. This is integral for startups as equity shifts a lot as they gain investments. 
