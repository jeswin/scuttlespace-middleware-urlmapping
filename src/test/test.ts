import { NextFunction } from "express-serve-static-core";
import "mocha";
import "should";
import middleware from "../";
import getApolloClient from "./apollo-client";
import { ApolloClient } from "apollo-client";

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

let apolloClient: ApolloClient<any>;

describe("scuttlespace-middleware-urlmapping", async () => {
  before(async () => {
    apolloClient = await getApolloClient({
      hostname: "localhost",
      port: 4000
    });
  });
  
  it("....", async () => {
    const mapper = middleware({
      apolloClient,
      domain: "localhost"
    });
    const ctx: any = makeContext();
    const next: NextFunction = () => {};
    mapper(ctx, next);
    console.log(ctx);

    shouldLib.exist(ctx.account);
  });
});
