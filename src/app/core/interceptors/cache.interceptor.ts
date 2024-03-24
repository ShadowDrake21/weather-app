import { HttpHeaders, HttpInterceptorFn } from '@angular/common/http';

export const CacheInterceptor: HttpInterceptorFn = (req, next) => {
  const httpRequest = req.clone({
    headers: new HttpHeaders({
      'Cache-Control': 'no-cache',
      Pragma: 'no-cache',
      Expires: '0',
    }),
  });

  return next(httpRequest);
};
