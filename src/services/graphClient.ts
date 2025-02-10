import { request } from 'graphql-request';

const GRAPHQL_ENDPOINT = 'https://api.studio.thegraph.com/query/103774/pbb/version/latest';

export const graphClient = {
  async query(query: string, variables: Record<string, any> = {}): Promise<any> {
    try {
      return await request(GRAPHQL_ENDPOINT, query, variables);
    } catch (error) {
      console.error('Error en la petición a The Graph:', error);
      throw error;
    }
  }
};
