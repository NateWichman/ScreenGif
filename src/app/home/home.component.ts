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
    }

    onRecorded(blob: Blob) {
        this.record = blob;
        this.cd.detectChanges();
    }
}
