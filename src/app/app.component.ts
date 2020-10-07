import { ChangeDetectorRef, Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
    record: Blob;
    showRecord = false;

    constructor(private cd: ChangeDetectorRef) { }

    ngOnInit() {
    }

    onRecorded(blob: Blob) {
        this.record = blob;
        this.cd.detectChanges();
    }
}
