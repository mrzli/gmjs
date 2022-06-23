export interface PostmanCollection {
  readonly info: PostmanCollectionInfo;
  readonly item: readonly PostmanCollectionAnyItem[];
}

export interface PostmanCollectionInfo {
  readonly name: string;
  readonly schema: string;
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
  readonly url: PostmanCollectionUrl;
  readonly header: readonly PostmanCollectionHeader[];
  readonly body?: PostmanCollectionBody;
}

export interface PostmanCollectionHeader {
  readonly key: string;
  readonly value: string;
}

export interface PostmanCollectionUrl {
  readonly raw: string;
  readonly host: readonly string[];
  readonly path: readonly string[];
  readonly variable?: readonly PostmanCollectionUrlVariable[];
}

export interface PostmanCollectionUrlVariable {
  readonly key: string;
  readonly value: string;
}

export interface PostmanCollectionBody {
  readonly mode: 'raw';
  readonly raw: '';
  readonly options: PostmanCollectionBodyOptions;
}

export interface PostmanCollectionBodyOptions {
  readonly raw: PostmanCollectionBodyOptionsRaw;
}

export interface PostmanCollectionBodyOptionsRaw {
  readonly language: 'json';
}

export type PostmanCollectionResponse = [];

export type PostmanCollectionAnyItem =
  | PostmanCollectionItemFolder
  | PostmanCollectionItemRequest;
