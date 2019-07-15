import React from 'react';
import ReactDOM from 'react-dom';
import './stylesheets/styles.css'
import App from './App';
import ApolloClient from 'apollo-boost';
import { ApolloProvider } from 'react-apollo';

// create the client and send it the endpoint for the GraphQL uri
const client = new ApolloClient({
    // uri: "https://browsing-health.herokuapp.com/"
    uri: process.env.PRODUCTION_URI || "http://localhost:4000" 
})

// Render the App component
// Wrap it inside an ApolloProvider component which handles GraphQL queries
ReactDOM.render(
    <ApolloProvider client={client}>
        <App />
    </ApolloProvider>, 
    document.getElementById('root')
);
