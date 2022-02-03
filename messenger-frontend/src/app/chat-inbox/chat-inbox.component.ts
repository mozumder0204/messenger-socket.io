import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { io } from 'socket.io-client';
const SOCKET_ENDPOINT = '10.11.201.130:3000';
@Component({
  selector: 'app-chat-inbox',
  templateUrl: './chat-inbox.component.html',
  styleUrls: ['./chat-inbox.component.scss'],
})
export class ChatInboxComponent implements OnInit {
  socket: any;
  message = '';
  name = '';
  isNameFound = false;
  myControl = new FormControl();
  @ViewChild('textControl') textControl;
  toggled: boolean = false;

  constructor(private cd: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.setupSocketConnection();
  }

  setupSocketConnection() {
    this.socket = io(SOCKET_ENDPOINT);
    this.socket.on('message-broadcast', (data: string) => {
      if (data) {
        const element = document.createElement('li');
        element.innerHTML = data;
        element.style.background = 'white';
        element.style.padding = '15px 30px';
        element.style.margin = '10px';
        document.getElementById('message-list').appendChild(element);
        let element2 = document.getElementById('msgContainer');
        element2.scrollTop = element2.scrollHeight - element2.clientHeight;
      }
    });
  }

  SendMessage() {
    if (this.message != '') {
      this.socket.emit('message', `${this.name}:  ${this.message}`);
      const element = document.createElement('li');
      element.innerHTML = `${this.name}:  ${this.message}`;
      element.style.background = 'white';
      element.style.padding = '15px 30px';
      element.style.margin = '10px';
      element.style.textAlign = 'right';
      document.getElementById('message-list').appendChild(element);
      let element2 = document.getElementById('msgContainer');
      element2.scrollTop = element2.scrollHeight - element2.clientHeight;
      this.message = '';
    }
  }

  assignName() {
    if (this.myControl.value != '') {
      this.name = this.myControl.value;
      this.isNameFound = true;
      this.cd.detectChanges();
      this.textControl.nativeElement.focus();
    }
  }

  handleSelection(event) {
    this.message += event.char;
  }
}
