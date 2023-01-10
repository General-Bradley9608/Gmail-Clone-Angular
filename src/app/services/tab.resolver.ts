import { Injectable } from '@angular/core';
import {
  Router, Resolve,
  RouterStateSnapshot,
  ActivatedRouteSnapshot
} from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable, of } from 'rxjs';
import { FilterBy } from '../models/filterBy';
import { LoadEmails } from '../store/actions/email.actions';
import { State } from '../store/store';

@Injectable({
  providedIn: 'root'
})
export class TabResolver implements Resolve<boolean> {
  constructor(private store: Store<State>) { }
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    const filterBy: FilterBy = {}
    const tab = route.params['tab']
    filterBy.tab = tab
    this.store.dispatch(new LoadEmails(filterBy));
    return of(tab);
  }
}
