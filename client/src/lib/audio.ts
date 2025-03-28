
import { Howl } from 'howler';

// Generate a simple tone based on theme
function generateTone(frequency: number, duration: number): AudioBuffer {
  const sampleRate = 44100;
  const samples = duration * sampleRate;
  const buffer = new AudioContext().createBuffer(1, samples, sampleRate);
  const data = buffer.getChannelData(0);
  
  for (let i = 0; i < samples; i++) {
    data[i] = Math.sin(2 * Math.PI * frequency * i / sampleRate) * 0.5;
  }
  
  return buffer;
}

export function createAudioBlobUrl(themeId: string): string {
  let frequency = 440; // default A4 note
  
  switch (themeId) {
    case 'gold':
      frequency = 523.25; // C5
      break;
    case 'emerald':
      frequency = 392.00; // G4
      break;
    case 'platinum':
      frequency = 440.00; // A4
      break;
  }
  
  const buffer = generateTone(frequency, 2); // 2 second tone
  const wav = bufferToWav(buffer);
  const blob = new Blob([wav], { type: 'audio/wav' });
  return URL.createObjectURL(blob);
}

// Convert AudioBuffer to WAV format
function bufferToWav(buffer: AudioBuffer): ArrayBuffer {
  const length = buffer.length * buffer.numberOfChannels * 2;
  const view = new DataView(new ArrayBuffer(44 + length));
  
  // Write WAV header
  writeString(view, 0, 'RIFF');
  view.setUint32(4, 36 + length, true);
  writeString(view, 8, 'WAVE');
  writeString(view, 12, 'fmt ');
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true);
  view.setUint16(22, buffer.numberOfChannels, true);
  view.setUint32(24, buffer.sampleRate, true);
  view.setUint32(28, buffer.sampleRate * 2, true);
  view.setUint16(32, 2, true);
  view.setUint16(34, 16, true);
  writeString(view, 36, 'data');
  view.setUint32(40, length, true);
  
  // Write audio data
  const data = buffer.getChannelData(0);
  let offset = 44;
  for (let i = 0; i < data.length; i++) {
    view.setInt16(offset, data[i] * 32767, true);
    offset += 2;
  }
  
  return view.buffer;
}

function writeString(view: DataView, offset: number, string: string) {
  for (let i = 0; i < string.length; i++) {
    view.setUint8(offset + i, string.charCodeAt(i));
  }
}
