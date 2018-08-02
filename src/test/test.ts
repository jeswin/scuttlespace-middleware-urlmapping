import { ApolloClient } from "apollo-client";
import { NextFunction } from "express-serve-static-core";
import "mocha";
import "should";
import middleware from "../";
import getApolloClient from "./apollo-client";

const shouldLib = require("should");

function makeContext(host: string) {
  return {
    path: "/jeswin",
    request: {
      header: {
        host
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
    const ctx: any = makeContext("jeswin.org");
    const next: NextFunction = () => {};
    mapper(ctx, next);
    console.log(ctx);
  });
});
