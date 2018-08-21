rm -rf dist
ts-node tools/graphqlToTS.ts > src/schemaTypes.ts
prettier --write src/schemaTypes.ts
tsc