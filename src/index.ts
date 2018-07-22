import { NextFunction } from "connect";
import { Context } from "koa";

export default function(opts: {
  domain: string;
  graphql: {
    hostname: string;
    port: number;
  };
}) {
  return async function urlMapper(ctx: Context, next: NextFunction) {
    const fullHostname = ctx.request.header.host.toLowerCase();
    const hostname = fullHostname.startsWith("www.")
      ? fullHostname.substring(4)
      : fullHostname;

    if (hostname === opts.domain.toLowerCase()) {
      const parts = ctx.path.split("/");
      const username = parts.length > 1 ? parts[1] : undefined;
      const account = `
        query AccountQuery($id) {
          account(id: $id) {
          }
        }
      `;
      (ctx as any).account = account;
    } else {
      const account = `
      query AccountQuery($id) {
        account(id: $id) {
        }
      }
    `;
      (ctx as any).account = account;
    }
    next();
  };
}
