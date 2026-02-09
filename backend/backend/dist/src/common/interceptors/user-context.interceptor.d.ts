import { CallHandler, ExecutionContext, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';
import { UserContextService } from '../user-context/user-context.service';
export declare class UserContextInterceptor implements NestInterceptor {
    private readonly userContextService;
    constructor(userContextService: UserContextService);
    intercept(context: ExecutionContext, next: CallHandler): Observable<any>;
}
