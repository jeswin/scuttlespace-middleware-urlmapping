import { ApolloClient } from "apollo-client";
import { NextFunction } from "express-serve-static-core";
import "mocha";
import "should";
import middleware from "../";
import getApolloClient from "./apollo-client";

const shouldLib = require("should");

function makeContext(args: { url: string; path: string; host: string }) {
  return {
    path: args.path,
    request: {
      header: {
        host: args.host
      }
    },
    url: args.url
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

  it("correctly maps a scuttlespace path", async () => {
    const mapper = middleware({
      apolloClient,
      domain: "localhost"
    });
    const ctx: any = makeContext({
      host: "localhost",
      path: "/jeswin/search",
      url: "/jeswin/search?q=where"
    });
    const next: NextFunction = () => {};
    await mapper(ctx, next);
    ctx.path.should.equal("/jeswin/search");
    ctx.url.should.equal("/jeswin/search?q=where");
    ctx.scuttlespace.username.should.equal("jeswin");
    ctx.scuttlespace.isLocal.should.be.true();
  });

  it("correctly maps a custom domain", async () => {
    const mapper = middleware({
      apolloClient,
      domain: "localhost"
    });
    const ctx: any = makeContext({
      host: "jeswin.org",
      path: "/search",
      url: "/search?q=where"
    });
    const next: NextFunction = () => {};
    await mapper(ctx, next);
    ctx.path.should.equal("/jeswin/search");
    ctx.url.should.equal("/jeswin/search?q=where");
    ctx.scuttlespace.username.should.equal("jeswin");
    ctx.scuttlespace.isLocal.should.be.false();
  });

  it("correctly maps a custom domain with www", async () => {
    const mapper = middleware({
      apolloClient,
      domain: "localhost"
    });
    const ctx: any = makeContext({
      host: "www.jeswin.org",
      path: "/search",
      url: "/search?q=where"
    });
    const next: NextFunction = () => {};
    await mapper(ctx, next);
    ctx.path.should.equal("/jeswin/search");
    ctx.url.should.equal("/jeswin/search?q=where");
    ctx.scuttlespace.username.should.equal("jeswin");
    ctx.scuttlespace.isLocal.should.be.false();
  });

  it("does not map if custom domain is unknown", async () => {
    const mapper = middleware({
      apolloClient,
      domain: "localhost"
    });
    const ctx: any = makeContext({
      host: "example.com",
      path: "/search",
      url: "/search?q=where"
    });
    const next: NextFunction = () => {};
    await mapper(ctx, next);
    ctx.path.should.equal("/search");
    ctx.url.should.equal("/search?q=where");
    shouldLib.not.exist(ctx.scuttlespace.username);
    ctx.scuttlespace.isLocal.should.be.false();
  });
});
