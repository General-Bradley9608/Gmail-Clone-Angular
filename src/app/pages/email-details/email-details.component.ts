import { Location } from '@angular/common';
import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Actions, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { Observable, pluck, take } from 'rxjs';
import { Email } from 'src/app/models/email';
import { Label } from 'src/app/models/label';
import { LOADED_EMAILS, LoadEmail, UPDATED_EMAILS, UpdateEmails } from 'src/app/store/actions/email.actions';
import { State } from 'src/app/store/store';

@Component({
  selector: 'email-details',
  templateUrl: './email-details.component.html',
  styleUrls: ['./email-details.component.scss']
})
export class EmailDetailsComponent {
  constructor(
    private route: ActivatedRoute,
    private actions$: Actions,
    private location: Location,
    private store: Store<State>) {
    this.labels$ = this.store.select('emailState').pipe(pluck('labels'));
  }
  email!: Email
  isLabelMenu = false
  labels$: Observable<Label[]>


  ngOnInit() {
    const { snapshot } = this.route
    this.email = snapshot.data['email']
    this.store.dispatch(new UpdateEmails([{ ...this.email, isRead: true }]))
  }

  updateLabels(labels: string[] | null) {
    if (labels) {
      this.store.dispatch(new UpdateEmails([{ ...this.email, labels }]))
      this.actions$.pipe(ofType(UPDATED_EMAILS), take(1)).subscribe(() => {
        this.email = { ...this.email, labels }
      })

    }
    this.isLabelMenu = false
  }

  goBack() {
    this.location.back()
  }
  onSpam() {
    const tabs = [...this.email.tabs!]
    let idx = tabs.indexOf('inbox')
    if (idx === -1) idx = tabs.indexOf('sent')
    if (idx === -1) idx = tabs.indexOf('trash')
    tabs.splice(idx, 1, 'spam')
    const updatedEmail = { ...this.email, tabs }
    this.updateAndClose(updatedEmail)
  }
  onTrash() {
    const tabs = [...this.email.tabs!]
    tabs.push('trash')
    const updatedEmail = { ...this.email, tabs }
    this.updateAndClose(updatedEmail)
  }
  onUnread() {
    const updatedEmail = { ...this.email, isRead: !this.email.isRead }
    this.updateAndClose(updatedEmail)
  }
  updateAndClose(email: Email) {
    this.store.dispatch(new UpdateEmails([email]))
    this.actions$.pipe(ofType(UPDATED_EMAILS), take(1)).subscribe(() => {
      this.goBack()
    })
  }
}
