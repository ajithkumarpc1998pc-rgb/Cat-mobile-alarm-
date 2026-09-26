/**
 * Web Audio API Sound Synthesizer for Cat Lock App
 * Provides reliable, zero-network-dependency sound effects for:
 * - Alarm sirens (Police / Warble siren)
 * - Cat meow scream alarm
 * - Tactical buzzer / klaxon
 * - Soft haptic keypad click
 * - Success unlock chime
 */

class SoundEngine {
  private ctx: AudioContext | null = null;
  private activeAlarmNodes: { osc1: OscillatorNode; osc2: OscillatorNode; gain: GainNode; lfo: OscillatorNode } | null = null;
  private isAlarmPlaying = false;

  private initCtx() {
    if (!this.ctx) {
      const AudioCtxClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtxClass) {
        this.ctx = new AudioCtxClass();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  /**
   * Plays soft keypad tap feedback
   */
  public playKeyClick() {
    try {
      this.initCtx();
      if (!this.ctx) return;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(600, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(120, this.ctx.currentTime + 0.04);

      gain.gain.setValueAtTime(0.12, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.04);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + 0.04);
    } catch (err) {
      console.warn('Audio click error:', err);
    }
  }

  /**
   * Plays positive unlock chime
   */
  public playUnlockSuccess() {
    try {
      this.initCtx();
      if (!this.ctx) return;

      const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
      notes.forEach((freq, idx) => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        const startTime = this.ctx.currentTime + idx * 0.07;
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, startTime);

        gain.gain.setValueAtTime(0, startTime);
        gain.gain.linearRampToValueAtTime(0.15, startTime + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.35);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(startTime);
        osc.stop(startTime + 0.36);
      });
    } catch (err) {
      console.warn('Unlock chime error:', err);
    }
  }

  /**
   * Starts high-intensity alarm siren
   * @param soundType 'police' | 'cat_scream' | 'klaxon'
   */
  public startAlarm(soundType: 'police' | 'cat_scream' | 'klaxon' = 'police', volume = 0.4) {
    if (this.isAlarmPlaying) {
      this.stopAlarm();
    }

    try {
      this.initCtx();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      const masterGain = this.ctx.createGain();
      masterGain.gain.setValueAtTime(volume, now);
      masterGain.connect(this.ctx.destination);

      if (soundType === 'cat_scream') {
        // Synthesizes a loud, oscillating cat distress scream / warble
        const osc1 = this.ctx.createOscillator();
        const osc2 = this.ctx.createOscillator();
        const lfo = this.ctx.createOscillator();
        const lfoGain = this.ctx.createGain();

        osc1.type = 'sawtooth';
        osc2.type = 'triangle';

        // LFO warbles between high and low screech
        lfo.type = 'sine';
        lfo.frequency.setValueAtTime(3.8, now);

        lfoGain.gain.setValueAtTime(380, now);
        lfo.connect(osc1.frequency);
        lfo.connect(osc2.frequency);

        osc1.frequency.setValueAtTime(850, now);
        osc2.frequency.setValueAtTime(1100, now);

        osc1.connect(masterGain);
        osc2.connect(masterGain);

        lfo.start();
        osc1.start();
        osc2.start();

        this.activeAlarmNodes = { osc1, osc2, gain: masterGain, lfo };
      } else if (soundType === 'klaxon') {
        // Rapid pulsing dual-tone hazard alert
        const osc1 = this.ctx.createOscillator();
        const osc2 = this.ctx.createOscillator();
        const lfo = this.ctx.createOscillator();
        const lfoGain = this.ctx.createGain();

        osc1.type = 'square';
        osc2.type = 'sawtooth';

        lfo.type = 'square';
        lfo.frequency.setValueAtTime(4, now); // 4Hz pulse
        lfoGain.gain.setValueAtTime(180, now);
        lfo.connect(osc1.frequency);

        osc1.frequency.setValueAtTime(440, now);
        osc2.frequency.setValueAtTime(587, now);

        osc1.connect(masterGain);
        osc2.connect(masterGain);

        lfo.start();
        osc1.start();
        osc2.start();

        this.activeAlarmNodes = { osc1, osc2, gain: masterGain, lfo };
      } else {
        // Classic Police Emergency Siren (continuous rising and falling frequency)
        const osc1 = this.ctx.createOscillator();
        const osc2 = this.ctx.createOscillator();
        const lfo = this.ctx.createOscillator();
        const lfoGain = this.ctx.createGain();

        osc1.type = 'sawtooth';
        osc2.type = 'sine';

        // LFO sweeps the pitch up and down smoothly
        lfo.type = 'triangle';
        lfo.frequency.setValueAtTime(1.2, now); // ~1.2 cycles per second
        lfoGain.gain.setValueAtTime(450, now); // Sweep range +/- 450Hz
        lfo.connect(osc1.frequency);
        lfo.connect(osc2.frequency);

        osc1.frequency.setValueAtTime(950, now);
        osc2.frequency.setValueAtTime(955, now); // slightly detuned for thickness

        osc1.connect(masterGain);
        osc2.connect(masterGain);

        lfo.start();
        osc1.start();
        osc2.start();

        this.activeAlarmNodes = { osc1, osc2, gain: masterGain, lfo };
      }

      this.isAlarmPlaying = true;
    } catch (err) {
      console.warn('Alarm start error:', err);
    }
  }

  /**
   * Stops currently active alarm
   */
  public stopAlarm() {
    if (this.activeAlarmNodes) {
      try {
        const { osc1, osc2, gain, lfo } = this.activeAlarmNodes;
        if (this.ctx) {
          gain.gain.linearRampToValueAtTime(0.001, this.ctx.currentTime + 0.1);
          setTimeout(() => {
            try {
              osc1.stop();
              osc2.stop();
              lfo.stop();
              osc1.disconnect();
              osc2.disconnect();
              lfo.disconnect();
              gain.disconnect();
            } catch {
              // Ignore cleanup glitches
            }
          }, 120);
        }
      } catch {
        // Fallback
      }
      this.activeAlarmNodes = null;
    }
    this.isAlarmPlaying = false;
  }

  /**
   * Trigger device vibration if available
   */
  public triggerVibrate(pattern: number[] = [300, 100, 300, 100, 600]) {
    try {
      if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
        navigator.vibrate(pattern);
      }
    } catch {
      // Ignore vibration error on unsupported desktop browsers
    }
  }
}

export const soundEngine = new SoundEngine();
