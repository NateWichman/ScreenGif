import { Component, OnInit } from '@angular/core';
import { ElectronService } from 'ngx-electron';

@Component({
    selector: 'app-overlay-record',
    templateUrl: './overlay-record.component.html',
    styleUrls: ['./overlay-record.component.scss']
})
export class OverlayRecordComponent implements OnInit {
    isRecording = false;

    constructor(private eS: ElectronService) {}

    ngOnInit() {}

    toggleRecord() {
        if (!this.isRecording) {
            this.eS.ipcRenderer.send('startRecording');
        } else {
            this.eS.ipcRenderer.send('endRecording');
        }
        this.isRecording = !this.isRecording;
    }
}
