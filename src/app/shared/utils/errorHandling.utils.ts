import { IHttpError } from '../models/error.model';

export function getErrorObject(name: string, message: string): IHttpError {
  return { name, message };
}
