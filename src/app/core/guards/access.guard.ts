import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const accessGuard: CanActivateFn = (route, state) => {
  const jsonValue = localStorage.getItem('wasSearch');

  let parsedValue = jsonValue !== null ? Boolean(JSON.parse(jsonValue)) : false;

  if (!parsedValue) {
    return inject(Router).navigateByUrl('/main');
  }

  return parsedValue;
};
