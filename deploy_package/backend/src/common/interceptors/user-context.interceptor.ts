import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { UserContextService } from '../user-context/user-context.service';

@Injectable()
export class UserContextInterceptor implements NestInterceptor {
  constructor(private readonly userContextService: UserContextService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const user = request.user; // Populated by JwtAuthGuard
    
    // Create storage map
    const store = new Map<string, any>();
    if (user && user.userId) {
      store.set('userId', user.userId);
    }

    // Run the request within the async storage context
    return new Observable((subscriber) => {
        this.userContextService.run(store, () => {
            next.handle().subscribe(subscriber);
        });
    });
  }
}
