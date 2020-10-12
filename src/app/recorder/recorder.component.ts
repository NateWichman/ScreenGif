import {
    OnInit,
    Component,
    ViewChild,
    ElementRef,
    Output,
    EventEmitter,
    ChangeDetectorRef
} from '@angular/core';
import { DesktopCapturerSource } from 'electron';
import { ElectronService } from 'ngx-electron';
import { grayScale } from '../helpers/image-filters';

declare var MediaRecorder: any;
declare var Blob: any;

@Component({
    selector: 'app-recorder',
    templateUrl: './recorder.component.html',
    styleUrls: ['./recorder.component.scss']
})
export class RecorderComponent implements OnInit {
    @Output() recordingEmitter = new EventEmitter<Blob>();
    @ViewChild('vid') videoEl: ElementRef;
    @ViewChild('canv') canvasEl: ElementRef;
    @ViewChild('previewVideo') previewVideoEl: ElementRef;

    resolution = {
        width: 1280,
        height: 720
    };
    sources: DesktopCapturerSource[] = [];
    selectedSource: DesktopCapturerSource;
    isRecording = false;
    isOverlaying = false;
    private mediaRecorder: any;
    private recordedChunks = [];
    private i; // interval
    offset: {
        x: number;
        y: number;
        height: number;
        width: number;
        totalHeight: number;
        totalWidth: number;
    };

    canvas: {
        height: number;
        width: number;
    };

    constructor(private eS: ElectronService, private cd: ChangeDetectorRef) {}

    ngOnInit() {
        this.fetchSources();
        const { height, width } = this.resolution;
        this.eS.ipcRenderer.on('clip', (event, clip) => {
            console.log('clip received');
            this.offset = clip;
            this.canvas = {
                height: clip.height * height,
                width: clip.width * width
            };
            this.cd.detectChanges();
        });

        this.eS.ipcRenderer.on('startRecording', (event) => {
            this.toggleRecording();
        });

        this.eS.ipcRenderer.on('stopRecording', (event) => {
            this.toggleRecording();
        });

        this.eS.ipcRenderer.on('overlayCancel', (event) => {
            this.isOverlaying = false;
            this.cd.detectChanges();
        });
    }

    openOverlay() {
        this.isOverlaying = true;
        this.eS.ipcRenderer.send('openOverlay');
    }

    toggleRecording() {
        if (this.isRecording) {
            this.mediaRecorder.stop();
        } else {
            this.startCanvasDisplay();
            this.recordedChunks = [];
            const mimeOpts = { mimeType: 'video/webm; codecs=vp9' };
            const stream = this.canvasEl.nativeElement.captureStream(30);
            this.mediaRecorder = new MediaRecorder(stream, mimeOpts);

            this.mediaRecorder.ondataavailable = (e) => {
                this.recordedChunks.push(e.data);
            };
            this.mediaRecorder.onstop = (e) => this.handleStop(e);
            this.mediaRecorder.start();
        }
        this.isRecording = !this.isRecording;
        this.cd.detectChanges();
    }

    private async handleStop(e: any) {
        this.endCanvasDisplay();
        const blob = new Blob(this.recordedChunks, {
            type: 'video/webm; codecs=vp9'
        });
        this.recordingEmitter.emit(blob);
        /* const buffer = Buffer.from(await blob.arrayBuffer());
        this.eS.ipcRenderer.send('saveFile', buffer); */
    }

    private startCanvasDisplay() {
        const v = this.videoEl.nativeElement;
        const ctx = this.canvasEl.nativeElement.getContext('2d');
        const width = v.clientWidth;
        const height = v.clientHeight;
        this.i = setInterval(() => {
            ctx.drawImage(
                v,
                -1 * (this.offset.x * this.resolution.width),
                -1 * (this.offset.y * this.resolution.height),
                width,
                height
            );
            // grayScale(ctx, this.canvasEl.nativeElement);
        }, 20);
    }

    private endCanvasDisplay() {
        clearInterval(this.i);
    }

    /** Shows all available sources for screen recording. */
    private async fetchSources() {
        const inputSources = await this.eS.desktopCapturer.getSources({
            types: ['window', 'screen']
        });
        this.sources = inputSources;
        if (this.sources.length > 0) {
            this.selectedSource = this.sources[0];
            this.selectSource();
        }
    }

    async selectSource() {
        this.videoEl.nativeElement.innerText = this.selectedSource.name;

        const { height, width } = this.resolution;
        const options = {
            audio: false,
            video: {
                mandatory: {
                    chromeMediaSource: 'desktop',
                    chromeMediaSourceId: this.selectedSource.id,
                    minWidth: width,
                    maxWidth: width,
                    minHeight: height,
                    maxHeight: height
                }
            }
        };
        const stream = await (navigator.mediaDevices as any).getUserMedia(
            options
        );

        this.videoEl.nativeElement.srcObject = stream;
        this.videoEl.nativeElement.play();

        this.previewVideoEl.nativeElement.srcObject = stream;
        this.previewVideoEl.nativeElement.play();
    }
}
