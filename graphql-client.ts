import { GraphQLClient } from 'graphql-request';

const API_URL = 'https://didzcover.world/graphql'; // Replace with your GraphQL endpoint

export const graphqlClient = new GraphQLClient(API_URL);
