import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
@Injectable({
  providedIn: 'root'
})
export class MusicService {
  private isPlayingSubject = new BehaviorSubject<boolean>(false);
  private currentSongIndex = 0;
  songs = [
    { id: 1, name: 'Thiên Lý ơi', url: 'music/ThienLyOi.mp3', image: 'image/thienlyoi.jpg', artist: 'J97' },
    { id: 2, name: 'Đom đóm', url: 'music/DomDom.mp3', image: 'image/domdom.jpg', artist: 'J97' },
    { id: 3, name: 'APT', url: 'music/APT.mp3', image: 'image/apt.jpg', artist: 'Rose' },
    { id: 4, name: 'Đừng làm trái tim anh đau', url: 'music/DungLamTraiTimAnhDau.mp3', image: 'image/dunglamtraitimanhdau.jpg', artist: 'Sơn Tùng MTP' },
    { id: 5, name: 'Waiting For You', url: 'music/WaitingForYou.mp3', image: 'image/waitingforyou.jpg', artist: 'MONO' },
  ];

  public currentSong$ = new BehaviorSubject<string>(this.songs[this.currentSongIndex].name);
  public isPlaying$ = this.isPlayingSubject.asObservable();
  public currentSongUrl$ = new BehaviorSubject<string>(this.songs[this.currentSongIndex].url);
  public currentSongImage$ = new BehaviorSubject<string>(this.songs[this.currentSongIndex].image);
  constructor() {}

  // Play/Pause nhạc
  playPause(audioPlayer: HTMLAudioElement) {
    if (this.isPlayingSubject.value) {
      audioPlayer.pause();
    } else {
      audioPlayer.play();
    }
    this.isPlayingSubject.next(!this.isPlayingSubject.value);
  }

  // Chuyển đến bài hát tiếp theo
  nextSong(audioPlayer: HTMLAudioElement) {
    this.currentSongIndex = (this.currentSongIndex + 1) % this.songs.length;
    this.updateCurrentSong(audioPlayer);
    this.currentSongImage$.next(this.songs[this.currentSongIndex].image);
  }

  // Quay lại bài hát trước
  prevSong(audioPlayer: HTMLAudioElement) {
    this.currentSongIndex = (this.currentSongIndex - 1 + this.songs.length) % this.songs.length;
    this.updateCurrentSong(audioPlayer);
    this.currentSongImage$.next(this.songs[this.currentSongIndex].image);
  }

  // Cập nhật Song hiện tại
  updateCurrentSong(audioPlayer: HTMLAudioElement) {
    this.currentSong$.next(this.songs[this.currentSongIndex].name);
    this.currentSongUrl$.next(this.songs[this.currentSongIndex].url);

    // Dừng nhạc hiện tại, thay đổi src và phát nhạc mới
    audioPlayer.pause(); // Dừng bài hát cũ
    audioPlayer.src = this.songs[this.currentSongIndex].url; // Cập nhật src
    audioPlayer.load();  // Tải lại bài mới
    audioPlayer.play();  // Phát bài mới
    this.isPlayingSubject.next(true);  // Cập nhật trạng thái phát
  }
  playSong(url: string, audioPlayer: HTMLAudioElement) {
    const songIndex = this.songs.findIndex(song => song.url === url);
    console.log(songIndex);
    if (songIndex !== -1) {
      this.currentSongIndex = songIndex;
      this.updateCurrentSong(audioPlayer);
      this.currentSongImage$.next(this.songs[this.currentSongIndex].image);
    }
  } 
}