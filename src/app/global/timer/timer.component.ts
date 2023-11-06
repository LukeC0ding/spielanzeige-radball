import {Component, ElementRef, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild} from '@angular/core';
import {CountdownComponent, CountdownConfig, CountdownEvent} from "ngx-countdown";

@Component({
  selector: 'app-timer',
  templateUrl: './timer.component.html',
  styleUrls: ['./timer.component.scss']
})
export class TimerComponent implements OnDestroy, OnInit {

  @ViewChild('cd') cd: CountdownComponent | undefined;
  @Input() set _countdown(value: number) {
    console.log(value);
    this.countdown = value;
    this.countdownConfig = {
      leftTime: value,
      format: 'm:ss',
      demand: true,
    }
  }

  emitInterval: any;
  @Input() set running(value: boolean) {
    if (value) {
      this.emitInterval = setInterval(()=> { this.time.emit(this.cd!.left / 1000) }, 500);
      this.cd?.begin();
    } else {
      this.emitInterval = clearInterval(this.emitInterval);
      this.cd?.pause();
    }
  }

  @Input() set reset(value: boolean) {
    if (value) {
      this.cd?.restart();
    }
    this.resetChange.emit(false);
  }

  @Output() time = new EventEmitter<number>();
  @Output() resetChange = new EventEmitter<boolean>();
  @Output() finished = new EventEmitter<boolean>();

  countdown: number = 0;
  countdownConfig: CountdownConfig = {
    leftTime: 420,
    format: 'm:ss',
    demand: true,
  };

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
  }

  handleEvent($event: Event) {
    console.log($event);
  }

  eventCalled($event: CountdownEvent) {
    if($event.action == 'done') {
      this.finished.emit(true);
      clearInterval(this.emitInterval);
    }
  }
}
