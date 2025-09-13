process.loadEnvFile(); 

import type { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
  overwrite: true,
  schema: {
    "https://api.quiltt.io/v1/graphql": {
      headers: {
        Authorization: `Bearer ${process.env.QUILTT_API_SECRET_KEY || ''}`,
      }
    }
  },
  documents: "graphql/queries/**/*.graphql",
  generates: {
    "src/generated/graphql.ts": {
      plugins: ["typescript", "typescript-operations", "typescript-urql"],
      config: {
        gqlImport: 'urql#gql'
      }
    }
  }
};

export default config;
