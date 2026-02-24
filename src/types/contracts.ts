export type HttpMethod = 'get' | 'post' | 'put' | 'patch' | 'delete' | 'options' | 'head';

export interface Endpoint {
  path: string;
  method: HttpMethod;
  operationId?: string;
  requestBodyRequired: boolean;
  responseStatusCodes: string[];
  requiredQueryParams: string[];
}

export interface ApiContract {
  title: string;
  version: string;
  endpoints: Endpoint[];
}

export interface Change {
  type: 'endpoint_removed' | 'status_removed' | 'query_param_required_added' | 'request_body_required_added' | 'endpoint_added';
  severity: 'breaking' | 'non_breaking';
  message: string;
  endpoint?: string;
  method?: string;
}

export interface AnalysisResult {
  oldVersion: string;
  newVersion: string;
  changes: Change[];
}

export interface PolicyConfig {
  failOn: Array<Change['type']>;
  allowEndpointAdditions: boolean;
}
