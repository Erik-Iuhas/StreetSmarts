/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const getOBSTRUCTIONTABLE = /* GraphQL */ `
  query GetOBSTRUCTIONTABLE($id: ID!) {
    getOBSTRUCTIONTABLE(id: $id) {
      lat
      lng
      linkID
      type
      img
      severity
      deleteTime
      extraOne
      id
      createdAt
      updatedAt
    }
  }
`;
export const listOBSTRUCTIONTABLES = /* GraphQL */ `
  query ListOBSTRUCTIONTABLES(
    $filter: ModelOBSTRUCTIONTABLEFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listOBSTRUCTIONTABLES(
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        lat
        lng
        linkID
        type
        img
        severity
        deleteTime
        extraOne
        id
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
export const getSIDEWALKTABLE = /* GraphQL */ `
  query GetSIDEWALKTABLE($id: ID!) {
    getSIDEWALKTABLE(id: $id) {
      id
      sidewalkStatus
      createdAt
      updatedAt
    }
  }
`;
export const listSIDEWALKTABLES = /* GraphQL */ `
  query ListSIDEWALKTABLES(
    $filter: ModelSIDEWALKTABLEFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listSIDEWALKTABLES(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        sidewalkStatus
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
