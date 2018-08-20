export default {
  queries: {
    userByDomain: `query UserByDomain($args: String) {
      user(domain: $args) {
        username
      }
    }`
  }
};
