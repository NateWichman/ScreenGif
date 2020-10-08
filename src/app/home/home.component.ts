import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ElectronService } from 'ngx-electron';

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
    record: Blob;
    showRecord = false;

    constructor(private cd: ChangeDetectorRef, private eS: ElectronService) {}

    ngOnInit() {
        document.body.className += ' dark-background';
        this.eS.ipcRenderer.on('clip', (event, args) => {
          console.log('CLIPPED', event, args)
        })
    }

    onRecorded(blob: Blob) {
        this.record = blob;
        this.cd.detectChanges();
    }

    openOverlay() {
        this.eS.ipcRenderer.send('openOverlay');
    }
}
