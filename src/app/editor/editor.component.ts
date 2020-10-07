import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.scss']
})
export class EditorComponent implements AfterViewInit {
  @ViewChild('vid') videoEl: ElementRef;
  @Input() record: Blob;
  videoUrl;

  constructor(private cd: ChangeDetectorRef) { }

  ngAfterViewInit() {
    console.log('record', this.record)
    this.videoUrl = window.URL.createObjectURL(this.record);
    this.videoEl.nativeElement.src = this.videoUrl;
    this.cd.detectChanges();
    this.videoEl.nativeElement.play();
  }


}
