// Web Audio API Synthesizer & Speech Synthesis for Qless Audio Chimes

class SoundService {
  private ctx: AudioContext | null = null;

  private getAudioContext(): AudioContext | null {
    try {
      if (!this.ctx && typeof window !== 'undefined') {
        const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        if (AudioCtx) {
          this.ctx = new AudioCtx();
        }
      }
      if (this.ctx && this.ctx.state === 'suspended') {
        this.ctx.resume();
      }
      return this.ctx;
    } catch (e) {
      console.warn('Web Audio not supported or blocked:', e);
      return null;
    }
  }

  // Play a pleasant two-tone airport/hospital queue chime (Ding-Dong)
  playChime() {
    const ctx = this.getAudioContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;

      // Note 1: E5 (659 Hz)
      const osc1 = ctx.createOscillator();
      const gain1 = ctx.createGain();
      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(659.25, now);
      gain1.gain.setValueAtTime(0.2, now);
      gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.6);
      osc1.connect(gain1);
      gain1.connect(ctx.destination);
      osc1.start(now);
      osc1.stop(now + 0.6);

      // Note 2: C5 (523 Hz)
      const osc2 = ctx.createOscillator();
      const gain2 = ctx.createGain();
      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(523.25, now + 0.25);
      gain2.gain.setValueAtTime(0.22, now + 0.25);
      gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.9);
      osc2.connect(gain2);
      gain2.connect(ctx.destination);
      osc2.start(now + 0.25);
      osc2.stop(now + 0.9);
    } catch (e) {
      console.warn('Audio chime playback failed:', e);
    }
  }

  // Success chime for token creation or completion
  playSuccess() {
    const ctx = this.getAudioContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      [523.25, 659.25, 783.99].forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now + idx * 0.1);
        gain.gain.setValueAtTime(0.15, now + idx * 0.1);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.1 + 0.3);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + idx * 0.1);
        osc.stop(now + idx * 0.1 + 0.3);
      });
    } catch (e) {
      console.warn('Success sound failed:', e);
    }
  }

  // Voice announcement: Reads "Token [number] please proceed to Counter [number]"
  speakAnnouncement(tokenNumber: string, counterNumber: number | string, language: 'en' | 'kn' | 'hi' = 'en') {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;

    try {
      // Play chime first
      this.playChime();

      setTimeout(() => {
        let text = `Token ${tokenNumber.split('').join(' ')}, please proceed to Counter ${counterNumber}.`;

        if (language === 'hi') {
          text = `टोकन ${tokenNumber}, कृपया काउंटर ${counterNumber} पर जाएं।`;
        } else if (language === 'kn') {
          text = `ಟೋಕನ್ ${tokenNumber}, ದಯವಿಟ್ಟು ಕೌಂಟರ್ ${counterNumber} ಗೆ ತೆರಳಿ.`;
        }

        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = 0.9;
        utterance.pitch = 1.0;

        // Try to pick language-appropriate voice
        const voices = window.speechSynthesis.getVoices();
        if (language === 'hi') {
          const hiVoice = voices.find(v => v.lang.startsWith('hi'));
          if (hiVoice) utterance.voice = hiVoice;
        } else if (language === 'kn') {
          const knVoice = voices.find(v => v.lang.startsWith('kn'));
          if (knVoice) utterance.voice = knVoice;
        }

        window.speechSynthesis.cancel(); // Cancel any lingering speech
        window.speechSynthesis.speak(utterance);
      }, 700);
    } catch (e) {
      console.warn('Speech synthesis failed:', e);
    }
  }
}

export const SoundEffects = new SoundService();
