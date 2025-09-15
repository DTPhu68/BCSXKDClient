export interface ApiException {
  statusCode: number;
  message: string;
  details: string;
}