import { ApolloClient } from "apollo-client";
import gql from "graphql-tag";
import queries from "./queries";

export interface UserByDomainInput {
  args?: string | null;
}
export interface UserByDomain {
  user: SelectionOnUser | null;
}
export interface SelectionOnUser {
  username: string;
}

export async function queryUserByDomain(
  input: UserByDomainInput,
  apolloClient: ApolloClient<any>
): Promise<UserByDomain> {
  try {
    const result = await apolloClient.query({
      query: gql(queries.queries.userByDomain),
      variables: input.args
    });
    return result.data as any;
  } catch (ex) {
    throw ex;
  }
}
