import ApolloClient from "apollo-client";
import { NextFunction } from "connect";
import gql from "graphql-tag";
import { Context } from "koa";

export default function(opts: {
  domain: string;
  apolloClient: ApolloClient<any>;
}) {
  return async function urlMapper(ctx: any, next: NextFunction) {
    const fullHostname = ctx.request.header.host.toLowerCase();

    const hostname = (fullHostname.startsWith("www.")
      ? fullHostname.substring(4)
      : fullHostname
    ).toLowerCase();

    /* 
      Check if we're on our own domain.
      If we are, then check if there's a user directory mentioned in the path
        eg: scuttle.space/jeswin, where jeswin is the username.
    */
    const username =
      hostname === opts.domain.toLowerCase()
        ? (() => {
            const parts = ctx.path.split("/");
            return parts.length > 1 ? parts[1] : undefined;
          })()
        : await (async () => {
            const result = await opts.apolloClient.query({
              query: gql`
                query UserByDomain {
                  user(domain: "${hostname}") {
                    username
                  }
                }
              `
            });
            return result.data.user ? result.data.user.username : undefined;
          })();

    ctx.username = username;

    next();
  };
}
