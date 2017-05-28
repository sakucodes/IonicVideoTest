import { Component, ElementRef, ViewChild, Renderer } from '@angular/core';
import { Content, NavController, Platform, DomController } from 'ionic-angular';
import { ScreenOrientation } from "@ionic-native/screen-orientation";
import { StatusBar } from "@ionic-native/status-bar";

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  @ViewChild('video', { read: ElementRef }) video: ElementRef;
  @ViewChild('controls', { read: ElementRef }) videoControls: ElementRef;

  isFullScreen: boolean = false;
  areControlsVisible: boolean = true;
  isLoading: boolean = false;
  time: number = 0;
  timeString: string = "00:00";

  private controlsVisibleTimer: number = null;

  constructor(public navCtrl: NavController,
    private screenOrientation: ScreenOrientation,
    private renderer: Renderer,
    private domController: DomController,
    private platform: Platform,
    private statusBar: StatusBar) {
    this.screenOrientation.onChange().subscribe(() => {
      if (this.screenOrientation.type === this.screenOrientation.ORIENTATIONS.LANDSCAPE_PRIMARY || this.screenOrientation.type === this.screenOrientation.ORIENTATIONS.LANDSCAPE_SECONDARY) {
        this.statusBar.hide();
        this.isFullScreen = true;
        this.domController.write(() => {
          if (this.video) {
            this.renderer.setElementStyle(this.video.nativeElement, "height", this.platform.width() + "px");
          }
        });
      }
      else {
        this.isFullScreen = false;
        this.statusBar.show();
        this.domController.write(() => {
          this.renderer.setElementStyle(this.video.nativeElement, "height", "auto");
        });
      }
    });
  }

  private updateTime(): void {
    this.isLoading = false;
    const video = this.video.nativeElement as HTMLVideoElement;
    this.time = video.currentTime;
    const h = Math.floor(this.time / 60);
    const s = Math.floor(this.time % 60);
    this.timeString = `${('0' + h).slice(-2)}:${('0' + s).slice(-2)}`;
  }

  timeSelected(): void {
    this.updateTime();
  }

  togglePlayState(): void {
    const video = this.video.nativeElement as HTMLVideoElement;

    if (video.paused) {
      video.play();
      this.areControlsVisible = false;
    }
    else {
      video.pause();
      this.areControlsVisible = true;
    }
  }

  showControls(): void {
    this.areControlsVisible = true;
    clearTimeout(this.controlsVisibleTimer);
    if (!this.video.nativeElement.paused) {
      this.controlsVisibleTimer = setTimeout(() => this.areControlsVisible = false, 1000);
    }
  }

  loading(): void {
    this.isLoading = true;
  }
}
