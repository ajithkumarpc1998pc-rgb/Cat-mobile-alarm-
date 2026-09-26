/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  Smartphone,
  Code2,
  MessageSquare,
  ShieldAlert,
  Sparkles,
  Download,
  Settings,
  Volume2,
  Vibrate,
  Lock,
  Flame,
  Check,
} from 'lucide-react';
import { PhoneSimulator } from './components/PhoneSimulator';
import { AndroidProjectHub } from './components/AndroidProjectHub';
import { WhatsAppForwarderGuide } from './components/WhatsAppForwarderGuide';
import { CAT_MASCOTS } from './utils/catAssets';
import { downloadAndroidProjectZip } from './utils/androidCodeTemplates';

export default function App() {
  const [activeTab, setActiveTab] = useState<'simulator' | 'code' | 'whatsapp'>('simulator');
  const [currentPin, setCurrentPin] = useState<string>('1234');
  const [selectedMascotId, setSelectedMascotId] = useState<string>('angry_guard');
  const [alarmSoundType, setAlarmSoundType] = useState<'police' | 'cat_scream' | 'klaxon'>('police');
  const [vibrationDurationMs, setVibrationDurationMs] = useState<number>(2000);
  const [isExporting, setIsExporting] = useState<boolean>(false);

  const activeMascot = CAT_MASCOTS.find((m) => m.id === selectedMascotId) || CAT_MASCOTS[0];

  const handleQuickDownload = async () => {
    try {
      setIsExporting(true);
      await downloadAndroidProjectZip({
        pin: currentPin,
        enableCamera: true,
        enableWhatsAppForwarder: true,
        alarmDurationMs: vibrationDurationMs,
      });
    } catch (e) {
      console.error(e);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* Top Bar Contract: Zone 1 (Brand) — Zone 2 (Nav) — Zone 3 (Action) */}
      <header className="sticky top-0 z-50 bg-slate-950/85 backdrop-blur-md border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          {/* Zone 1: Brand Title */}
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center text-slate-950 shadow-md shadow-amber-500/20 font-bold">
              🐾
            </div>
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                setActiveTab('simulator');
              }}
              className="text-base font-bold tracking-tight text-white hover:text-amber-400 transition-colors"
            >
              CatLock Studio
            </a>
          </div>

          {/* Zone 2: Navigation Links */}
          <nav className="flex items-center gap-1 sm:gap-2 bg-slate-900/80 p-1 rounded-xl border border-slate-800">
            <button
              onClick={() => setActiveTab('simulator')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer ${
                activeTab === 'simulator'
                  ? 'bg-amber-500 text-slate-950 font-bold shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>Phone Simulator</span>
            </button>

            <button
              onClick={() => setActiveTab('code')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer ${
                activeTab === 'code'
                  ? 'bg-amber-500 text-slate-950 font-bold shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Code2 className="w-3.5 h-3.5" />
              <span>Android Studio Code</span>
            </button>

            <button
              onClick={() => setActiveTab('whatsapp')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer ${
                activeTab === 'whatsapp'
                  ? 'bg-emerald-500 text-slate-950 font-bold shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">WhatsApp</span>
              <span>Forwarder</span>
            </button>
          </nav>

          {/* Zone 3: Primary Action */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleQuickDownload}
              disabled={isExporting}
              className="px-3.5 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 active:scale-[0.98] text-slate-950 font-bold text-xs flex items-center gap-1.5 transition-all shadow-md shadow-amber-500/20 disabled:opacity-50 cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Download</span>
              <span>APK Zip</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Body */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 py-6">
        {/* ============================================================== */}
        {/* TAB 1: PHONE SIMULATOR & GUARD CAT CONTROLS */}
        {/* ============================================================== */}
        {activeTab === 'simulator' && (
          <div className="space-y-6">
            {/* Context Headline */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-800/80">
              <div>
                <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
                  Android Cat Lock Simulator
                </h1>
                <p className="text-xs text-slate-400 mt-0.5">
                  Test wrong PIN intruder alarm, loud sirens, full-screen cat popup, and device vibration in real-time.
                </p>
              </div>

              <div className="flex items-center gap-2 text-xs text-slate-400">
                <span className="inline-flex items-center gap-1">
                  Current PIN: <code className="px-1.5 py-0.5 bg-slate-900 border border-slate-800 rounded font-mono text-amber-300 font-bold">{currentPin}</code>
                </span>
                <span aria-hidden="true">·</span>
                <span>Alarm: <strong className="text-slate-200 capitalize">{alarmSoundType}</strong></span>
              </div>
            </div>

            {/* Two Column Layout: Phone Simulator + Live Customization Studio */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Left Column: Phone Simulator Canvas */}
              <div className="lg:col-span-5 flex justify-center py-2">
                <PhoneSimulator
                  currentPin={currentPin}
                  onPinChange={setCurrentPin}
                  selectedMascotId={selectedMascotId}
                  onMascotChange={setSelectedMascotId}
                  alarmSoundType={alarmSoundType}
                  onAlarmSoundChange={setAlarmSoundType}
                  vibrationDurationMs={vibrationDurationMs}
                  onVibrationDurationChange={setVibrationDurationMs}
                />
              </div>

              {/* Right Column: Guard Cat Studio Controls & Specifications */}
              <div className="lg:col-span-7 space-y-5">
                {/* 1. Mascot Guard Selector */}
                <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-bold text-white">Choose Your Guard Cat Mascot</h3>
                      <p className="text-xs text-slate-400">
                        Select which fierce cat appears full-screen when the wrong PIN is entered.
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {CAT_MASCOTS.map((mascot) => {
                      const isSelected = selectedMascotId === mascot.id;
                      return (
                        <button
                          key={mascot.id}
                          onClick={() => setSelectedMascotId(mascot.id)}
                          className={`p-3 rounded-xl border text-left flex items-center gap-3 transition-all cursor-pointer ${
                            isSelected
                              ? 'bg-amber-500/10 border-amber-500 shadow-sm'
                              : 'bg-slate-950 border-slate-800 hover:border-slate-700'
                          }`}
                        >
                          <mascot.Component className="w-12 h-12 shrink-0" />
                          <div className="min-w-0">
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-bold text-white truncate">{mascot.name}</span>
                              {isSelected && <Check className="w-3.5 h-3.5 text-amber-400" />}
                            </div>
                            <div className="text-[11px] text-amber-400/90 font-medium truncate">{mascot.subtitle}</div>
                            <div className="text-[10px] text-slate-400 line-clamp-1 mt-0.5">{mascot.vibe}</div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* 2. Security Configuration: PIN & Alarm Parameters */}
                <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
                  <h3 className="text-sm font-bold text-white">Security & Hardware Parameters</h3>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {/* PIN Card */}
                    <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800">
                      <div className="flex items-center gap-1.5 text-xs text-slate-400 font-semibold mb-1">
                        <Lock className="w-3.5 h-3.5 text-amber-400" />
                        Active Lock PIN
                      </div>
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-xl font-mono font-bold text-amber-300 tracking-widest">{currentPin}</span>
                        <button
                          onClick={() => {
                            const newPin = prompt('Enter new 4-8 digit numeric PIN:', currentPin);
                            if (newPin && newPin.trim().length >= 4) {
                              setCurrentPin(newPin.trim().replace(/\D/g, ''));
                            }
                          }}
                          className="px-2.5 py-1 text-[11px] font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-md transition-colors"
                        >
                          Edit
                        </button>
                      </div>
                    </div>

                    {/* Alarm Sound Card */}
                    <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800">
                      <div className="flex items-center gap-1.5 text-xs text-slate-400 font-semibold mb-1">
                        <Volume2 className="w-3.5 h-3.5 text-amber-400" />
                        Alarm Sound
                      </div>
                      <select
                        value={alarmSoundType}
                        onChange={(e) => setAlarmSoundType(e.target.value as 'police' | 'cat_scream' | 'klaxon')}
                        className="w-full mt-2 bg-slate-900 border border-slate-700 text-xs text-white rounded-md px-2 py-1.5 focus:outline-none focus:border-amber-400 font-medium"
                      >
                        <option value="police">Police Siren</option>
                        <option value="cat_scream">Cat Scream Meow</option>
                        <option value="klaxon">Klaxon Warning</option>
                      </select>
                    </div>

                    {/* Vibration Card */}
                    <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800">
                      <div className="flex items-center gap-1.5 text-xs text-slate-400 font-semibold mb-1">
                        <Vibrate className="w-3.5 h-3.5 text-amber-400" />
                        Vibration Length
                      </div>
                      <select
                        value={vibrationDurationMs}
                        onChange={(e) => setVibrationDurationMs(Number(e.target.value))}
                        className="w-full mt-2 bg-slate-900 border border-slate-700 text-xs text-white rounded-md px-2 py-1.5 focus:outline-none focus:border-amber-400 font-medium"
                      >
                        <option value={1000}>1.0 Second</option>
                        <option value={2000}>2.0 Seconds (Default)</option>
                        <option value={3000}>3.0 Seconds</option>
                        <option value={5000}>5.0 Seconds</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* 3. How the Features Work Under the Hood */}
                <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                    Feature Specifications (Android Match)
                  </h3>

                  <div className="space-y-2 text-xs">
                    <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-850 flex items-start gap-3">
                      <div className="w-6 h-6 rounded-md bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0 font-bold">
                        1
                      </div>
                      <div>
                        <div className="font-semibold text-white">Wrong PIN Detection & Siren Sound</div>
                        <p className="text-slate-400 mt-0.5 leading-relaxed">
                          When an incorrect PIN is entered, Android triggers <code className="text-amber-300">MediaPlayer.create(this, R.raw.alarm).start()</code>. In this web simulator, we synthesize an oscillating dual-frequency siren via Web Audio API.
                        </p>
                      </div>
                    </div>

                    <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-850 flex items-start gap-3">
                      <div className="w-6 h-6 rounded-md bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0 font-bold">
                        2
                      </div>
                      <div>
                        <div className="font-semibold text-white">Full-Screen Cat Image Popup</div>
                        <p className="text-slate-400 mt-0.5 leading-relaxed">
                          The XML layout hides the cat image with <code className="text-amber-300">android:visibility="gone"</code> and flips it to <code className="text-amber-300">View.VISIBLE</code> on wrong PIN, displaying the cat full-screen with alert styling.
                        </p>
                      </div>
                    </div>

                    <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-850 flex items-start gap-3">
                      <div className="w-6 h-6 rounded-md bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0 font-bold">
                        3
                      </div>
                      <div>
                        <div className="font-semibold text-white">Phone Vibration & Intruder Logging</div>
                        <p className="text-slate-400 mt-0.5 leading-relaxed">
                          Uses Android <code className="text-amber-300">Vibrator.vibrate(2000)</code> with modern <code className="text-amber-300">VibrationEffect</code> waveform support, plus browser <code className="text-amber-300">navigator.vibrate()</code> and visual screen shake.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* TAB 2: ANDROID STUDIO KOTLIN CODE HUB */}
        {/* ============================================================== */}
        {activeTab === 'code' && (
          <AndroidProjectHub
            currentPin={currentPin}
            vibrationDurationMs={vibrationDurationMs}
          />
        )}

        {/* ============================================================== */}
        {/* TAB 3: WHATSAPP NOTIFICATION FORWARDER GUIDE */}
        {/* ============================================================== */}
        {activeTab === 'whatsapp' && <WhatsAppForwarderGuide />}
      </main>

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-800/80 bg-slate-950 py-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span>🐾 Android Cat Lock App & Intruder Alarm</span>
            <span aria-hidden="true">·</span>
            <span>Kotlin & Android Studio Ready</span>
          </div>
          <div className="flex items-center gap-4 text-slate-400">
            <button
              onClick={() => setActiveTab('simulator')}
              className="hover:text-slate-200 transition-colors"
            >
              Simulator
            </button>
            <button
              onClick={() => setActiveTab('code')}
              className="hover:text-slate-200 transition-colors"
            >
              Kotlin Code
            </button>
            <button
              onClick={() => setActiveTab('whatsapp')}
              className="hover:text-slate-200 transition-colors"
            >
              WhatsApp Forwarder
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
