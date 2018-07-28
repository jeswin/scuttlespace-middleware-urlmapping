import { NextFunction } from "express-serve-static-core";
import "mocha";
import "should";
import middleware from "../";

const shouldLib = require("should");

function makeContext() {
  return {
    path: "/jeswin",
    request: {
      header: {
        host: "localhost"
      }
    }
  };
}

describe("scuttlespace-middleware-urlmapping", async () => {
  it("....", async () => {
    const mapper = middleware({
      domain: "localhost",
      graphql: {
        hostname: "localhost",
        port: 4000
      }
    });
    const ctx: any = makeContext();
    const next: NextFunction = () => {};
    mapper(ctx, next);
    console.log(ctx);

    shouldLib.exist(ctx.account);
  });
});
