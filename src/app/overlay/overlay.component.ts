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

    constructor(private eS: ElectronService) {}

    ngOnInit() {}

    cancel() {
        this.eS.ipcRenderer.send('cancelOverlay');
    }

    select() {
      const clipPercents = {
        x: this.offset.x / window.innerWidth,
        y: this.offset.y / window.innerHeight,
        width: this.offset.width,
        height: this.offset.height
      };
      this.eS.ipcRenderer.send('selectOverlay', clipPercents);
      this.eS.ipcRenderer.send('cancelOverlay');
    }

    onMouseDown(event: MouseEvent) {

      if (this.offset) return;
      this.isDragging = true;
      this.offset = {
        x: event.clientX,
        y: event.clientY,
        width: 0,
        height: 0
      };
    }

    onMouseMove(event: MouseEvent) {
      if (this.isDragging) {
        this.offset.width = event.clientX - this.offset.x;
        this.offset.height = event.clientY - this.offset.y;
      }
    }

    onMouseUp(event: MouseEvent) {
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
        height: this.offset.height + 'px'
      };
    }
}
