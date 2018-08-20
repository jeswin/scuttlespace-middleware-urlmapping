rm -rf dist
ts-node tools/graphql-to-ts.ts > src/schemaTypes.ts
prettier --write src/schemaTypes.ts
tsc