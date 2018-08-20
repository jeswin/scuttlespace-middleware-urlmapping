import ApolloClient from "apollo-client";
import { NextFunction } from "connect";
import gql from "graphql-tag";
import { queryUserByDomain } from "./schemaTypes";
import apolloClient from "./test/apollo-client";

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
    const result: { username?: string; isLocal: boolean } =
      hostname === opts.domain.toLowerCase()
        ? (() => {
            const parts = ctx.path.split("/");
            return parts.length > 1
              ? { username: parts[1], isLocal: true }
              : { isLocal: true };
          })()
        : await (async () => {
            const graphqlResult = await queryUserByDomain(
              { args: opts.domain },
              apolloClient
            );
            const maybeUsername =
              graphqlResult.data && graphqlResult.data.user
                ? graphqlResult.data.user.username
                : undefined;
            return {
              isLocal: false,
              username: maybeUsername
            };
          })();

    if (result.username && !result.isLocal) {
      ctx.path = `/${result.username}${ctx.path}`;
      ctx.url = `/${result.username}${ctx.url}`;
    }

    ctx.scuttlespace = result;

    next();
  };
}
