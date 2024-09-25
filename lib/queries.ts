import { graphqlClient } from '@/graphql-client';

import { GraphQLResponse, TransactionsResponse } from '@/interfaces';

export const fetchImageTransactions = async (cursor: string | null = null): Promise<TransactionsResponse> => {
  const query = `
    query GetImageTransactions($cursor: String) {
      transactions(
        first: 100
        after: $cursor
        tags: [
          { name: "Content-Type", values: ["image/jpeg", "image/png", "image/gif", "image/svg+xml", "image/webp"] }
        ]
      ) {
        pageInfo {
          hasNextPage
        }
        edges {
          cursor
          node {
            id
            owner {
              address
            }
            tags {
              name
              value
            }
          }
        }
      }
    }
  `;

  const variables = { cursor };

  const data: GraphQLResponse = await graphqlClient.request(query, variables);
  return data.transactions;
};
