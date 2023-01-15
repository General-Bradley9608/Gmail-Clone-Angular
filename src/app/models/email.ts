
export interface Email{
  _id:string,
  tabs:Array<string>,
  name:string,
  subject:string,
  body:string,
  isRead:boolean,
  sentAt:number,
  from:string,
  to:string,
  labels:string[]
}


export interface selectedEmail{
  checked:boolean,
  email:Email
}


