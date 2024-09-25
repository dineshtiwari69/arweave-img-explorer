// New interfaces
interface Tag {
    name: string;
    value: string;
  }
  
  interface Owner {
    address: string;
  }
  
  export interface Transaction {
    id: string;
    owner: Owner;
    tags: Tag[];
  }
  
  interface PageInfo {
    hasNextPage: boolean;
  }
  
  interface TransactionEdge {
    cursor: string;
    node: Transaction;
  }
  
  export interface TransactionsResponse {
    pageInfo: PageInfo;
    edges: TransactionEdge[];
  }
  
export interface GraphQLResponse {
    transactions: TransactionsResponse;
  }