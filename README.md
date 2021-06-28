# Chat interface for Nexus

View the main Nexus site at https://github.com/M2ansib/Nexus

## Requirements

- [Node.js](https://nodejs.org/en/)
- [PubNub Account](https://dashboard.pubnub.com/)

## Running the project

1. Clone the GitHub repository.

1. Install the project.

    ```bash
    cd nexus_chat
    npm install
    ```
1. Create a .env file and add in the required credentials

    ```
    REACT_APP_PUBLISH_KEY=
    REACT_APP_SUBSCRIBE_KEY=
    GIPHY_API_KEY=
    REACT_APP_GIPHY_API_KEY=$GIPHY_API_KEY
    FUNCTIONS_GIPHY_API_KEY=$GIPHY_API_KEY
    FUNCTIONS_SIGHTENGINE_API_SECRET=
    FUNCTIONS_SIGHTENGINE_API_USER=
    ```

1. Start the project. You only need to run setup once.

    ```bash
    npm run setup
    npm start
    ```

    A web browser should automatically open [http://localhost:3000](http://localhost:3000)