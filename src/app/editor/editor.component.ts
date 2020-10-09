import {
    AfterViewInit,
    ChangeDetectorRef,
    Component,
    ElementRef,
    Input,
    OnInit,
    ViewChild
} from '@angular/core';
import { ElectronService } from 'ngx-electron';

@Component({
    selector: 'app-editor',
    templateUrl: './editor.component.html',
    styleUrls: ['./editor.component.scss']
})
export class EditorComponent implements AfterViewInit {
    @ViewChild('vid') videoEl: ElementRef;
    @Input() record: any;
    videoUrl;

    constructor(private cd: ChangeDetectorRef, private eS: ElectronService) {}

    ngAfterViewInit() {
        console.log('record', this.record);
        this.videoUrl = window.URL.createObjectURL(this.record);
        this.videoEl.nativeElement.src = this.videoUrl;
        this.cd.detectChanges();
        this.videoEl.nativeElement.play();
    }

    async save() {
        const buffer = Buffer.from(await this.record.arrayBuffer());
        this.eS.ipcRenderer.send('saveFile', buffer);
    }
}
