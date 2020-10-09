import { Component, OnInit } from '@angular/core';
import { ElectronService } from 'ngx-electron';

@Component({
    selector: 'app-overlay',
    templateUrl: './overlay.component.html',
    styleUrls: ['./overlay.component.scss']
})
export class OverlayComponent implements OnInit {
    offset: {
        x: number;
        y: number;
        width: number;
        height: number;
    };
    isDragging = false;
    isClickThrough = false;

    constructor(private eS: ElectronService) {}

    ngOnInit() {}

    cancel() {
        this.eS.ipcRenderer.send('cancelOverlay');
    }

    select() {
        if (this.isClickThrough) {
            return;
        }
        this.isClickThrough = true;
        this.eS.ipcRenderer.send('selectOverlay', {
            x: this.offset.x / window.innerWidth,
            y: this.offset.y / window.innerHeight,
            height: this.offset.height / window.innerHeight,
            width: this.offset.width / window.innerWidth
        });
        this.eS.ipcRenderer.send('recordOverlay');
    }

    onMouseDown(event: MouseEvent) {
        if (this.isClickThrough) {
            return;
        }
        this.isDragging = true;
        this.offset = {
            x: event.clientX,
            y: event.clientY,
            width: 0,
            height: 0
        };
    }

    onMouseMove(event: MouseEvent) {
        if (this.isClickThrough) {
            return;
        }
        if (this.isDragging) {
            this.offset.width = event.clientX - this.offset.x;
            this.offset.height = event.clientY - this.offset.y;
        }
    }

    onMouseUp(event: MouseEvent) {
        if (this.isClickThrough) {
            return;
        }
        this.isDragging = false;
    }

    selectionBoxStyle() {
        if (!this.offset) {
            return {};
        }
        return {
            top: this.offset.y + 'px',
            left: this.offset.x + 'px',
            width: this.offset.width + 'px',
            height: this.offset.height + 'px',
        };
    }
}
