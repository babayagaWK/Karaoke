/**
 * Audio Export Utility
 * Handles downloading processed audio as WAV files
 */

export class AudioExporter {
  static async exportAsWAV(audioContext: AudioContext, stream: AudioNode, duration: number, fileName: string = 'export.wav') {
    // Create offline context for rendering
    const offlineContext = new OfflineAudioContext(
      2,
      audioContext.sampleRate * duration,
      audioContext.sampleRate
    );

    // Copy audio graph to offline context
    const offlineDestination = offlineContext.destination;
    
    // Render audio
    try {
      const renderedBuffer = await offlineContext.startRendering();
      
      // Convert to WAV
      const wav = this.encodeWAV(renderedBuffer);
      
      // Download
      this.downloadBlob(wav, fileName);
      
      return true;
    } catch (error) {
      console.error('Error exporting audio:', error);
      throw error;
    }
  }

  private static encodeWAV(audioBuffer: AudioBuffer): Blob {
    const numberOfChannels = audioBuffer.numberOfChannels;
    const sampleRate = audioBuffer.sampleRate;
    const format = 1; // PCM
    const bitDepth = 16;

    const bytesPerSample = bitDepth / 8;
    const blockAlign = numberOfChannels * bytesPerSample;

    const channelData: Float32Array[] = [];
    for (let i = 0; i < numberOfChannels; i++) {
      channelData.push(audioBuffer.getChannelData(i));
    }

    // Interleave channels
    const samples = new Float32Array(audioBuffer.length * numberOfChannels);
    for (let i = 0; i < audioBuffer.length; i++) {
      for (let c = 0; c < numberOfChannels; c++) {
        samples[i * numberOfChannels + c] = channelData[c][i];
      }
    }

    // Convert float32 to int16
    const int16Data = new Int16Array(samples.length);
    for (let i = 0; i < samples.length; i++) {
      let s = Math.max(-1, Math.min(1, samples[i])); // Clamp
      int16Data[i] = s < 0 ? s * 0x8000 : s * 0x7fff;
    }

    // Create WAV header
    const wavHeader = this.createWAVHeader(
      numberOfChannels,
      sampleRate,
      bitDepth,
      int16Data.byteLength
    );

    // Combine header and data
    const wav = new Uint8Array(wavHeader.byteLength + int16Data.byteLength);
    wav.set(new Uint8Array(wavHeader), 0);
    wav.set(new Uint8Array(int16Data.buffer), wavHeader.byteLength);

    return new Blob([wav], { type: 'audio/wav' });
  }

  private static createWAVHeader(
    channels: number,
    sampleRate: number,
    bitDepth: number,
    dataLength: number
  ): ArrayBuffer {
    const headerLength = 44;
    const header = new ArrayBuffer(headerLength);
    const view = new DataView(header);

    const write = (offset: number, value: number, isLittleEndian: boolean, byteCount: number) => {
      if (byteCount === 4) view.setUint32(offset, value, isLittleEndian);
      else if (byteCount === 2) view.setUint16(offset, value, isLittleEndian);
      else view.setUint8(offset, value);
    };

    const bytesPerSample = bitDepth / 8;
    const blockAlign = channels * bytesPerSample;
    const byteRate = sampleRate * blockAlign;

    // RIFF header
    write(0, 0x46464952, true, 4); // "RIFF"
    write(4, headerLength + dataLength - 8, true, 4);
    write(8, 0x45564157, true, 4); // "WAVE"

    // fmt sub-chunk
    write(12, 0x20746d66, true, 4); // "fmt "
    write(16, 16, true, 4); // Subchunk1Size (16 for PCM)
    write(20, 1, true, 2); // AudioFormat (1 for PCM)
    write(22, channels, true, 2);
    write(24, sampleRate, true, 4);
    write(28, byteRate, true, 4);
    write(32, blockAlign, true, 2);
    write(34, bitDepth, true, 2);

    // data sub-chunk
    write(36, 0x61746164, true, 4); // "data"
    write(40, dataLength, true, 4);

    return header;
  }

  private static downloadBlob(blob: Blob, fileName: string) {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  static async exportAsMP3(audioBuffer: AudioBuffer, fileName: string = 'export.mp3') {
    // Note: MP3 encoding requires a library like lamejs
    // For now, we'll provide WAV export as default
    console.warn('MP3 export requires additional library. Using WAV instead.');
    throw new Error('MP3 export not yet implemented. Use WAV export instead.');
  }
}
