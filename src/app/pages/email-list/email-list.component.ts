import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable, pluck, Subscription, take } from 'rxjs';
import { Email, selectedEmail } from 'src/app/models/email';
import { State } from '../../store/store';
import { LoadEmails, RemoveEmail, RemoveEmails, SetFilter, UpdateEmails } from 'src/app/store/actions/email.actions';
import { FilterBy } from 'src/app/models/filterBy';


@Component({
  selector: 'email-list',
  templateUrl: './email-list.component.html',
  styleUrls: ['./email-list.component.scss']
})
export class EmailListComponent {
  emails$!: Observable<Email[]>;
  filterBy$!: Observable<FilterBy>;
  totalPages$!: Observable<number>;


  selectedEmails: Array<Email> = []
  tab: string = ''
  subscription!: Subscription


  constructor(private store: Store<State>,
    private route: ActivatedRoute) {

    this.emails$ = this.store.select('emailState').pipe(pluck('emails'));
    this.filterBy$ = this.store.select('emailState').pipe(pluck('filterBy'));
    this.totalPages$ = this.store.select('emailState').pipe(pluck('totalPages'));
  }

  ngOnInit() {
    this.subscription = this.route.params.subscribe(params => {
      if (this.tab === params['tab']) return console.log('same')
      this.tab = params['tab']
      this.store.dispatch(new LoadEmails({ txt: '', page: 0, tab: this.tab, pageSize: 5 }))

    })
  }

  toggleCheckbox(payload: selectedEmail): void {
    if (payload.checked) {
      this.selectedEmails.push(payload.email)
    }
    else {
      const idx = this.selectedEmails.findIndex(e => e._id === payload.email._id)
      this.selectedEmails.splice(idx, 1)
    }
  }

  onRemoveEmails() {
    console.log('emailList: dispatching remove');
    const emails: Email[] = JSON.parse(JSON.stringify(this.selectedEmails))
    //  when we wanna remove from collection
    if (this.tab === 'trash' || this.tab === 'spam') {
      this.store.dispatch(new RemoveEmails(emails))
    }
    // when we wanna change all to trash tab
    // ['inbox','starred']
    else {
      emails.forEach(email => {
        let newTabs: string[] = email.tabs.filter((tab, idx) => {
          // if (!(tab === 'inbox' || tab === 'sent'))  return tab
          return !(tab === 'inbox' || tab === 'sent')
        })
        newTabs.push('trash')

        email.tabs = newTabs
        console.log(email.tabs)
      })

      this.store.dispatch(new UpdateEmails(emails))
      this.filterBy$.pipe(take(1)).subscribe(filterBy => {
        // debugger
        this.store.dispatch(new LoadEmails({ ...filterBy }))
      })
    }

    this.selectedEmails = []
  }

  setPage(diff: number) {
    this.filterBy$.pipe(take(1)).subscribe(filterBy => {
      const { page } = filterBy
      this.store.dispatch(new LoadEmails({ ...filterBy, page: page! + diff }))
    })
  }

  onSetReadStat() {
    const emails: Email[] = JSON.parse(JSON.stringify(this.selectedEmails))
    // if all were read
    if (emails.every(email => email.isRead)) {
      emails.forEach(e => e.isRead = false)
    } else {
      emails.forEach(e => e.isRead = true)
    }
    this.store.dispatch(new UpdateEmails(emails))
    this.selectedEmails = []

  }


}



