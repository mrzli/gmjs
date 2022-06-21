export interface PostmanCollection {
  readonly info: PostmanCollectionInfo;
  readonly item: readonly PostmanCollectionAnyItem[];
}

export interface PostmanCollectionInfo {
  readonly _postman_id: string;
  readonly name: string;
  readonly schema: string;
  readonly _exporter_id: string;
}

export interface PostmanCollectionItemBase {
  readonly name: string;
}

export interface PostmanCollectionItemFolder extends PostmanCollectionItemBase {
  readonly item: readonly PostmanCollectionAnyItem[];
}

export interface PostmanCollectionItemRequest
  extends PostmanCollectionItemBase {
  readonly request: PostmanCollectionRequest;
  readonly response: PostmanCollectionResponse;
}

export interface PostmanCollectionRequest {
  readonly method: 'GET' | 'POST' | 'DELETE';
  readonly header: readonly PostmanCollectionHeader[];
  readonly url: PostmanCollectionUrl;
}

export interface PostmanCollectionHeader {
  readonly key: string;
  readonly name: string;
}

export interface PostmanCollectionUrl {
  readonly raw: string;
  readonly host: readonly string[];
  readonly path: readonly string[];
}

export type PostmanCollectionResponse = [];

export type PostmanCollectionAnyItem =
  | PostmanCollectionItemFolder
  | PostmanCollectionItemRequest;
