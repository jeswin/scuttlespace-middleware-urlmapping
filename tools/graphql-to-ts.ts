import fromQuery from "@gql2ts/from-query";
import * as gqlSchema from "scuttlespace-service-user-graphql-schema";
import queriesAndMutations from "../src/queries";

const camelCase = require("camelcase");

const fixedSchema = gqlSchema.typeDefs
  .replace("extend type Query", "type Query")
  .replace("extend type Mutation", "type Mutation");

let output = "";

output += `import { ApolloClient } from "apollo-client";`;
output += `import gql from "graphql-tag";`;
output += `import queries from "./queries";`;
output += "\n\n";

const queries: any = queriesAndMutations.queries;
if (queries) {
  for (const key of Object.keys(queriesAndMutations.queries)) {
    const interfaces: string[] = [];
    const generated = fromQuery(
      fixedSchema,
      queries[key],
      {},
      {
        interfaceBuilder: (interfaceName: string, body: string) => {
          interfaces.push(interfaceName);
          output += `export interface ${interfaceName}`;
          output += body;
        }
      }
    );

    output += "\n";

    const invokeFunctionName = `query${camelCase(key, { pascalCase: true })}`;
    const invokeFunctionText = `
    export async function ${invokeFunctionName}(
      input: ${interfaces[0]},
      apolloClient: ApolloClient<any>
    ): Promise<${interfaces[1]}> {
      try {
        const result = await apolloClient.query({
          query: gql(queries.queries.${key}),
          variables: input.args
        });
        return result.data as any;
      } catch (ex) {
        throw ex;
      }
    }
    `;
    output += invokeFunctionText;
    output += "\n";
  }
}

console.log(output);
