import {
    AfterViewInit,
    ChangeDetectorRef,
    Component,
    ElementRef,
    EventEmitter,
    Input,
    OnInit,
    Output,
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
    @Output() cancel = new EventEmitter<boolean>();
    videoUrl;
    fileIsSaved = false;

    exportOptions = {
        video: true,
        gif: true
    };

    constructor(private cd: ChangeDetectorRef, private eS: ElectronService) {}

    ngAfterViewInit() {
        console.log('record', this.record);
        this.videoUrl = window.URL.createObjectURL(this.record);
        this.videoEl.nativeElement.src = this.videoUrl;
        this.cd.detectChanges();
        this.videoEl.nativeElement.play();
    }

    detect() {
        setTimeout(() => {
            this.cd.detectChanges();
        });
    }

    onCancel() {
        console.log('trying to cnacel');
        this.cancel.emit(true);
    }

    showFileSavedIndicator() {
        this.fileIsSaved = true;
        this.cd.detectChanges();
        setTimeout(() => {
            this.fileIsSaved = false;
            this.cd.detectChanges();
        }, 1000);
    }

    async save() {
        const buffer = Buffer.from(await this.record.arrayBuffer());
        this.eS.ipcRenderer.send('saveFile', buffer, this.exportOptions);
        this.eS.ipcRenderer.once('saved', (event) => {
            this.showFileSavedIndicator();
        });
    }
}
