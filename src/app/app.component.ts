import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ElectronService } from 'ngx-electron';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
    record: Blob;
    showRecord = false;

    constructor(private cd: ChangeDetectorRef, private eS: ElectronService) { }

    ngOnInit() {
    }

    onRecorded(blob: Blob) {
        this.record = blob;
        this.cd.detectChanges();
    }

    test() {
        console.log('attempting to open overlay');
        this.eS.ipcRenderer.send('openOverlay');
    }
}
