import { Request } from 'express';
import { SessionDTO } from '../../auth';

export interface IRequest extends Request {
  user?: SessionDTO;
}
