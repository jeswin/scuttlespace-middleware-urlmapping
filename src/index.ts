import { InMemoryCache } from "apollo-cache-inmemory";
import ApolloClient from "apollo-client";
import { ApolloLink } from "apollo-link";
import { onError } from "apollo-link-error";
import { HttpLink } from "apollo-link-http";
import { NextFunction } from "connect";
import fetch from "cross-fetch";
import gql from "graphql-tag";
import { Context } from "koa";

export default function(opts: {
  domain: string;
  graphql: {
    hostname: string;
    port: number;
  };
}) {
  const client = new ApolloClient({
    cache: new InMemoryCache(),
    link: ApolloLink.from([
      onError(({ graphQLErrors, networkError }) => {
        if (graphQLErrors) {
          graphQLErrors.map(({ message, locations, path }) =>
            console.log(
              `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`
            )
          );
        }
        if (networkError) {
          console.log(`[Network error]: ${networkError}`);
        }
      }),
      new HttpLink({
        fetch,
        uri: `http://${opts.graphql.hostname}:${opts.graphql.port}/graphql`
      })
    ])
  });

  return async function urlMapper(ctx: Context, next: NextFunction) {
    const fullHostname = ctx.request.header.host.toLowerCase();
    const hostname = fullHostname.startsWith("www.")
      ? fullHostname.substring(4)
      : fullHostname;

    if (hostname === opts.domain.toLowerCase()) {
      const parts = ctx.path.split("/");
      const username = parts.length > 1 ? parts[1] : undefined;
      const result = await client.query({
        query: gql`
          {
            hello
          }
        `
      });
      console.log(result);
      (ctx as any).account = result;
    } else {
      const parts = ctx.path.split("/");
      const username = parts.length > 1 ? parts[1] : undefined;
      const result = await client.query({
        query: gql`
          {
            hello
          }
        `
      });
      (ctx as any).account = result;
    }
    next();
  };
}
