/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * Converts Float32Array audio data to 16-bit signed linear PCM in little-endian,
 * and encodes it as a base64 string.
 */
export function floatTo16BitPCMBase64(floatBuffer: Float32Array): string {
  const buffer = new ArrayBuffer(floatBuffer.length * 2);
  const view = new DataView(buffer);
  for (let i = 0; i < floatBuffer.length; i++) {
    // Clamp sample amplitude to [-1.0, 1.0]
    const s = Math.max(-1, Math.min(1, floatBuffer[i]));
    // Convert to 16-bit signed integer
    const val = s < 0 ? s * 0x8000 : s * 0x7FFF;
    view.setInt16(i * 2, val, true); // true = little-endian
  }

  // Convert binary buffer to base64 string
  let binary = '';
  const bytes = new Uint8Array(buffer);
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return window.btoa(binary);
}

/**
 * Converts a base64 string of 16-bit signed linear PCM (little-endian)
 * into a Float32Array for browser audio playback.
 */
export function base64ToFloat32Array(base64: string): Float32Array {
  const binaryString = window.atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }

  const buffer = bytes.buffer;
  const view = new DataView(buffer);
  const numSamples = len / 2;
  const floatBuffer = new Float32Array(numSamples);
  for (let i = 0; i < numSamples; i++) {
    const val = view.getInt16(i * 2, true); // true = little-endian
    floatBuffer[i] = val / 32768.0;
  }
  return floatBuffer;
}

/**
 * AudioPlaybackQueue handles scheduled playback of real-time audio chunks (PCM)
 * to prevent overlaps and gaps due to network jitter, as mandated by Gemini Live API rules.
 */
export class AudioPlaybackQueue {
  private ctx: AudioContext | null = null;
  private nextStartTime: number = 0;
  private sampleRate: number;
  private sources: AudioBufferSourceNode[] = [];

  constructor(sampleRate: number = 24000) {
    this.sampleRate = sampleRate;
  }

  private initCtx() {
    if (!this.ctx) {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      this.ctx = new AudioContextClass({ sampleRate: this.sampleRate });
      this.nextStartTime = this.ctx.currentTime;
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public playChunk(base64PCM: string) {
    try {
      this.initCtx();
      if (!this.ctx) return;

      const float32Data = base64ToFloat32Array(base64PCM);
      const audioBuffer = this.ctx.createBuffer(1, float32Data.length, this.sampleRate);
      audioBuffer.getChannelData(0).set(float32Data);

      const source = this.ctx.createBufferSource();
      source.buffer = audioBuffer;
      source.connect(this.ctx.destination);

      const now = this.ctx.currentTime;
      // If the schedule pointer is in the past, reset it with a 50ms buffer to prevent stuttering
      if (this.nextStartTime < now) {
        this.nextStartTime = now + 0.05;
      }

      source.start(this.nextStartTime);
      this.nextStartTime += audioBuffer.duration;
      this.sources.push(source);
    } catch (e) {
      console.error("Failed to play audio chunk:", e);
    }
  }

  public stop() {
    this.sources.forEach(src => {
      try { src.stop(); } catch (e) {}
    });
    this.sources = [];
    if (this.ctx) {
      this.nextStartTime = this.ctx.currentTime;
    }
  }

  public close() {
    this.stop();
    if (this.ctx) {
      this.ctx.close();
      this.ctx = null;
    }
  }
}
