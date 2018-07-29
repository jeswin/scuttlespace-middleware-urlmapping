import ApolloClient from "apollo-client";
import { NextFunction } from "connect";
import gql from "graphql-tag";
import { Context } from "koa";

export default function(opts: {
  domain: string;
  apolloClient: ApolloClient<any>
}) {
  return async function urlMapper(ctx: Context, next: NextFunction) {
    const fullHostname = ctx.request.header.host.toLowerCase();
    const hostname = fullHostname.startsWith("www.")
      ? fullHostname.substring(4)
      : fullHostname;

    if (hostname === opts.domain.toLowerCase()) {
      const parts = ctx.path.split("/");
      const username = parts.length > 1 ? parts[1] : undefined;
      const result = await opts.apolloClient.query({
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
      const result = await opts.apolloClient.query({
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
