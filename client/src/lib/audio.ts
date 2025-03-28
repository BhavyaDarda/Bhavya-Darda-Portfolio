// Using MP3 format for better browser compatibility
const audioFiles = {
  gold: "https://cdn.pixabay.com/download/audio/2022/03/10/audio_2ccd4d0c6c.mp3",
  emerald: "https://cdn.pixabay.com/download/audio/2022/01/18/audio_d0c3577467.mp3", 
  platinum: "https://cdn.pixabay.com/download/audio/2021/11/25/audio_c4b45baa22.mp3"
};

export function createAudioBlobUrl(themeId: string): string {
  return audioFiles[themeId as keyof typeof audioFiles] || audioFiles.gold;
}