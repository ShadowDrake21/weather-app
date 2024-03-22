import { HttpHeaders, HttpInterceptorFn } from '@angular/common/http';

export const CacheInterceptor: HttpInterceptorFn = (req, next) => {
  const httpRequest = req.clone({
    headers: new HttpHeaders({
      'Cache-Control':
        'no-cache, no-store, must-revalidate, post-check=0, pre-check=0',
      Pragma: 'no-cache',
      Expires: '0',
    }),
  });

  return next(httpRequest);
};
