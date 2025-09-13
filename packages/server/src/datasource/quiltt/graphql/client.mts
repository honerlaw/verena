import { Client, cacheExchange, fetchExchange } from "urql";

const QUILTT_GRAPHQL_ENDPOINT = "https://api.quiltt.io/v1/graphql";

export type QuilttGraphQLClient = Client;

/**
 * Quiltt pushes that these requests are made from the client side, but
 * we want to make them from the server side, so we can cache certain information
 * and abstract away quiltt itself from the client code.
 *
 * @param sessionToken
 * @returns
 */
export const createQuilttGraphQLClient = (sessionToken: string) =>
  new Client({
    url: QUILTT_GRAPHQL_ENDPOINT,
    exchanges: [cacheExchange, fetchExchange],
    fetchOptions: () => ({
      headers: {
        authorization: `Bearer ${sessionToken}`,
      },
    }),
  });
