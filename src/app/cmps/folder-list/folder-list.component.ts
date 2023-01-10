import { Component } from '@angular/core';

@Component({
  selector: 'folder-list',
  templateUrl: './folder-list.component.html',
  styleUrls: ['./folder-list.component.scss']
})
export class FolderListComponent {
  folders=[
    {name:'inbox'},
    {name:'starred'},
    {name:'important'},
    {name:'sent'},
    {name:'drafts'},
    {name:'spam'},
    {name:'trash'},
  ]

  setTab=(folder:string)=>{console.log('setting tab:', folder)}

}
