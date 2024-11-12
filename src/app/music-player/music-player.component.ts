import { AsyncPipe, CommonModule } from '@angular/common';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { MusicService } from './music.service';
import { Song } from './song.model';

@Component({
  selector: 'app-music-player',
  templateUrl: './music-player.component.html',
  standalone: true,
  imports: [AsyncPipe],
  styleUrls: ['./music-player.component.css']
})
export class MusicPlayerComponent {
  @ViewChild('audioPlayer') audioPlayerRef!: ElementRef<HTMLAudioElement>;
  
  currentSong$: Observable<string>;
  isPlaying$: Observable<boolean>;
  currentSongUrl$: Observable<string>;
  currentSongImage$: Observable<string>;
  songs: Song[] = [];
  

  constructor(private musicService: MusicService) {
    this.currentSong$ = this.musicService.currentSong$;
    this.isPlaying$ = this.musicService.isPlaying$;
    this.currentSongUrl$ = this.musicService.currentSongUrl$;
    this.currentSongImage$ = this.musicService.currentSongImage$;
    this.songs = this.musicService.songs;
  }

  // Play/Pause nhạc
  playPause() {
    if (this.audioPlayerRef) {
      this.musicService.playPause(this.audioPlayerRef.nativeElement);
    }
  }
  playSong(url: string) {
    if (this.audioPlayerRef) {
      this.musicService.playSong(url, this.audioPlayerRef.nativeElement);
    }
  }

  // Chuyển đến bài hát tiếp theo
  nextTrack() {
    if (this.audioPlayerRef) {
      this.musicService.nextSong(this.audioPlayerRef.nativeElement);
    }
  }

  // Quay lại bài hát trước
  prevTrack() {
    if (this.audioPlayerRef) {
      this.musicService.prevSong(this.audioPlayerRef.nativeElement);
    }
  }
  changeVolume(event: Event) {
    const volume = (event.target as HTMLInputElement).value;
    if (this.audioPlayerRef) {
      // Cập nhật giá trị volume của bài hát
      this.audioPlayerRef.nativeElement.volume = parseFloat(volume);
    }
  }
  seekTo(event: Event) {
    const time = (event.target as HTMLInputElement).value;
    if (this.audioPlayerRef) {
      // Cập nhật thời gian hiện tại của bài hát
      this.audioPlayerRef.nativeElement.currentTime = parseFloat(time);
    }
  }

  ngAfterViewInit() {
    // Khi view đã sẵn sàng, cập nhật thanh seek bar
    this.setupAudioPlayer();
  }
  
  setupAudioPlayer() {
    if (this.audioPlayerRef) {
      const audioElement = this.audioPlayerRef.nativeElement;
      // Khi tải xong file, cập nhật thanh seek bar
      audioElement.addEventListener('loadedmetadata', () => {
        this.updateSeekBar();
        this.updateTimeDisplay();
      });
      // Khi thời gian thay đổi, cập nhật thanh seek bar
      audioElement.addEventListener('timeupdate', () => {
        this.updateTimeDisplay();
        this.updateSeekBar();
      });
      // Chuyển sang bài hát tiếp theo khi bài hát hiện tại kết thúc
      audioElement.addEventListener('ended', () => {
        this.nextTrack(); 
      });
    }
  }
  
  updateSeekBar() {
    const audioElement = this.audioPlayerRef.nativeElement;
    const seekBar = document.getElementById('seek') as HTMLInputElement;
    if (seekBar) {
      // Cập nhật giá trị max của thanh seek bar
      seekBar.max = audioElement.duration.toString();
      // Cập nhật giá trị hiện tại của thanh seek bar
      seekBar.value = audioElement.currentTime.toString();
    }
  }

  // Cập nhật thời gian hiện tại và tổng thời gian của bài hát
  updateTimeDisplay() {
    const audioElement = this.audioPlayerRef.nativeElement;
    const currentTimeElement = document.getElementById('current-time');
    const totalTimeElement = document.getElementById('total-time');
  
    if (currentTimeElement && totalTimeElement) {
      currentTimeElement.textContent = this.formatTime(audioElement.currentTime);
      totalTimeElement.textContent = this.formatTime(audioElement.duration);
    }
  }
  // Chuyển đổi thời gian từ giây sang phút và giây
  formatTime(seconds: number): string {
    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
  }
}
