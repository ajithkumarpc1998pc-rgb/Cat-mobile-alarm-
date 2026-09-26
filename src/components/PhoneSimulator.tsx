import React, { useState, useEffect, useRef } from 'react';
import {
  ShieldAlert,
  Unlock,
  Lock,
  Volume2,
  VolumeX,
  Vibrate,
  RotateCcw,
  Camera,
  History,
  Settings,
  Sparkles,
  Wifi,
  Signal,
  Battery,
  Delete,
  CheckCircle2,
  AlertTriangle,
  Upload,
  Eye,
  EyeOff
} from 'lucide-react';
import { soundEngine } from '../utils/audio';
import { CAT_MASCOTS, CatMascot, AngryGuardCat, ScreamingShockedCat, CyberLaserCat, DetectiveCat, HappyVictoryCat } from '../utils/catAssets';

export interface IntruderRecord {
  id: string;
  timestamp: string;
  attemptedPin: string;
  catMascotName: string;
  imageUrl?: string;
}

interface PhoneSimulatorProps {
  currentPin: string;
  onPinChange: (newPin: string) => void;
  selectedMascotId: string;
  onMascotChange: (id: string) => void;
  alarmSoundType: 'police' | 'cat_scream' | 'klaxon';
  onAlarmSoundChange: (sound: 'police' | 'cat_scream' | 'klaxon') => void;
  vibrationDurationMs: number;
  onVibrationDurationChange: (ms: number) => void;
}

export const PhoneSimulator: React.FC<PhoneSimulatorProps> = ({
  currentPin,
  onPinChange,
  selectedMascotId,
  onMascotChange,
  alarmSoundType,
  onAlarmSoundChange,
  vibrationDurationMs,
  onVibrationDurationChange,
}) => {
  // Device State
  const [pinInput, setPinInput] = useState<string>('');
  const [appState, setAppState] = useState<'locked' | 'alarm' | 'unlocked'>('locked');
  const [activeTabInUnlocked, setActiveTabInUnlocked] = useState<'vault' | 'logs' | 'settings'>('vault');
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [isShaking, setIsShaking] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<string>('12:00');
  const [failedAttempts, setFailedAttempts] = useState<number>(0);
  const [intruderLogs, setIntruderLogs] = useState<IntruderRecord[]>([]);
  const [customCatImg, setCustomCatImg] = useState<string | null>(null);
  const [isWebcamActive, setIsWebcamActive] = useState<boolean>(false);
  const [webcamStream, setWebcamStream] = useState<MediaStream | null>(null);
  const [lastIntruderSnapshot, setLastIntruderSnapshot] = useState<string | null>(null);
  const [showPinHelp, setShowPinHelp] = useState<boolean>(false);

  // Settings State
  const [newPinCandidate, setNewPinCandidate] = useState<string>('');
  const [pinChangeSuccess, setPinChangeSuccess] = useState<string | null>(null);

  const videoRef = useRef<HTMLVideoElement | null>(null);

  // Active Mascot
  const activeMascot = CAT_MASCOTS.find((m) => m.id === selectedMascotId) || CAT_MASCOTS[0];

  // Live status bar time
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 10000);
    return () => clearInterval(interval);
  }, []);

  // Stop alarm sound and webcam on unmount
  useEffect(() => {
    return () => {
      soundEngine.stopAlarm();
      if (webcamStream) {
        webcamStream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [webcamStream]);

  // Handle Keypad input
  const handleDigitPress = (digit: string) => {
    if (pinInput.length >= 8) return;
    soundEngine.playKeyClick();
    const updated = pinInput + digit;
    setPinInput(updated);
  };

  const handleBackspace = () => {
    soundEngine.playKeyClick();
    setPinInput((prev) => prev.slice(0, -1));
  };

  const handleClear = () => {
    soundEngine.playKeyClick();
    setPinInput('');
  };

  // Attempt unlock check
  const handleUnlockAttempt = () => {
    if (pinInput.trim() === '') return;

    if (pinInput === currentPin) {
      // SUCCESS: Unlock app
      soundEngine.stopAlarm();
      soundEngine.playUnlockSuccess();
      setAppState('unlocked');
      setIsShaking(false);
      setFailedAttempts(0);
      setPinInput('');
    } else {
      // FAILURE: Wrong PIN -> Trigger Cat Alarm!
      const attemptNum = failedAttempts + 1;
      setFailedAttempts(attemptNum);
      setAppState('alarm');
      setIsShaking(true);

      // Trigger Web Audio Alarm
      if (!isMuted) {
        soundEngine.startAlarm(alarmSoundType, 0.45);
      }

      // Trigger Web Haptic Vibration
      soundEngine.triggerVibrate([250, 100, 250, 100, 500]);

      // Shake animation effect for 2.5s
      setTimeout(() => {
        setIsShaking(false);
      }, Math.min(vibrationDurationMs, 4000));

      // Capture Intruder snapshot if webcam is enabled, or generate styled record
      captureIntruderSnapshot(pinInput);
    }
  };

  const captureIntruderSnapshot = (attempted: string) => {
    let capturedDataUrl: string | undefined = undefined;

    if (videoRef.current && isWebcamActive) {
      try {
        const canvas = document.createElement('canvas');
        canvas.width = 320;
        canvas.height = 240;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
          capturedDataUrl = canvas.toDataURL('image/jpeg', 0.8);
          setLastIntruderSnapshot(capturedDataUrl);
        }
      } catch (err) {
        console.warn('Could not capture webcam snapshot:', err);
      }
    }

    const newRecord: IntruderRecord = {
      id: Math.random().toString(36).substring(2, 9),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      attemptedPin: attempted,
      catMascotName: activeMascot.name,
      imageUrl: capturedDataUrl,
    };

    setIntruderLogs((prev) => [newRecord, ...prev.slice(0, 19)]);
  };

  // Silence Alarm and reset to Lock Screen
  const handleSilenceAlarm = () => {
    soundEngine.stopAlarm();
    setAppState('locked');
    setIsShaking(false);
    setPinInput('');
  };

  // Lock Device again
  const handleLockAgain = () => {
    soundEngine.stopAlarm();
    setAppState('locked');
    setPinInput('');
  };

  // Toggle Web Camera for Intruder Selfie simulation
  const toggleWebcam = async () => {
    if (isWebcamActive) {
      if (webcamStream) {
        webcamStream.getTracks().forEach((track) => track.stop());
      }
      setWebcamStream(null);
      setIsWebcamActive(false);
    } else {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user', width: 320, height: 240 } });
        setWebcamStream(stream);
        setIsWebcamActive(true);
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (err) {
        console.warn('Webcam permission denied or unavailable:', err);
      }
    }
  };

  // Custom Image Upload handler
  const handleCustomImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setCustomCatImg(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Save new PIN
  const handleSavePin = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPinCandidate.trim().length >= 4) {
      onPinChange(newPinCandidate.trim());
      setPinChangeSuccess(`PIN successfully changed to ${newPinCandidate.trim()}!`);
      setNewPinCandidate('');
      setTimeout(() => setPinChangeSuccess(null), 3500);
    }
  };

  return (
    <div className="flex flex-col items-center">
      {/* Device Frame */}
      <div
        className={`relative w-[340px] sm:w-[380px] h-[730px] sm:h-[760px] bg-slate-950 rounded-[48px] p-3 shadow-2xl shadow-slate-950/80 border-[8px] border-slate-800 transition-transform ${
          isShaking ? 'animate-[shake_0.15s_infinite]' : ''
        }`}
      >
        {/* Phone Speaker & Front Camera Punch Hole */}
        <div className="absolute top-5 left-1/2 -translate-x-1/2 w-28 h-5 bg-slate-900 rounded-full flex items-center justify-between px-3 z-30">
          <div className="w-12 h-1 bg-slate-800 rounded-full" />
          <div className="w-3 h-3 bg-slate-950 rounded-full border border-slate-700 relative overflow-hidden">
            {/* Tiny camera lens reflection */}
            <div className="w-1 h-1 bg-sky-500 rounded-full absolute top-0.5 right-0.5" />
          </div>
        </div>

        {/* Screen Bezel Container */}
        <div className="relative w-full h-full bg-slate-900 rounded-[38px] overflow-hidden flex flex-col select-none text-slate-100">
          {/* Hidden video element for optional webcam intruder selfies */}
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className={`absolute top-0 left-0 w-full h-full object-cover z-0 pointer-events-none opacity-0 ${
              isWebcamActive ? 'block' : 'hidden'
            }`}
          />

          {/* Android Status Bar */}
          <div className="relative z-20 flex items-center justify-between px-6 pt-3 pb-1 text-xs font-mono text-slate-300">
            <span className="font-semibold">{currentTime}</span>
            <div className="flex items-center gap-2">
              {isWebcamActive && <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" title="Front camera active" />}
              <Wifi className="w-3.5 h-3.5 text-slate-300" />
              <Signal className="w-3.5 h-3.5 text-slate-300" />
              <div className="flex items-center gap-0.5">
                <span className="text-[10px]">98%</span>
                <Battery className="w-3.5 h-3.5 text-slate-300" />
              </div>
            </div>
          </div>

          {/* ============================================================== */}
          {/* VIEW A: LOCKED STATE */}
          {/* ============================================================== */}
          {appState === 'locked' && (
            <div className="relative z-10 flex-1 flex flex-col justify-between px-5 py-3">
              {/* Top Lock Header */}
              <div className="flex flex-col items-center text-center mt-2">
                <div className="relative mb-2">
                  {customCatImg ? (
                    <img
                      src={customCatImg}
                      alt="Custom Cat"
                      referrerPolicy="no-referrer"
                      className="w-24 h-24 rounded-full object-cover border-2 border-amber-500/50 shadow-md"
                    />
                  ) : (
                    <activeMascot.Component className="w-24 h-24" />
                  )}
                  <div className="absolute -bottom-1 -right-1 bg-amber-500 text-slate-950 p-1 rounded-full shadow">
                    <Lock className="w-3.5 h-3.5" />
                  </div>
                </div>

                <h2 className="text-xl font-bold tracking-tight text-white">Cat Lock Guard</h2>
                <p className="text-xs text-slate-400 mt-0.5">Enter PIN to access protected apps</p>

                {/* PIN Dots Display */}
                <div className="flex items-center gap-3 my-4">
                  {[0, 1, 2, 3].map((idx) => {
                    const isFilled = pinInput.length > idx;
                    return (
                      <div
                        key={idx}
                        className={`w-3.5 h-3.5 rounded-full border-2 transition-all duration-150 ${
                          isFilled
                            ? 'bg-amber-400 border-amber-400 scale-125 shadow-sm shadow-amber-400/50'
                            : 'border-slate-600 bg-slate-800/60'
                        }`}
                      />
                    );
                  })}
                  {pinInput.length > 4 && (
                    <span className="text-xs text-amber-400 font-mono">+{pinInput.length - 4}</span>
                  )}
                </div>

                {/* Incorrect Attempts Counter if any */}
                {failedAttempts > 0 && (
                  <div className="text-[11px] text-rose-400 bg-rose-950/60 border border-rose-900/60 px-2.5 py-0.5 rounded-md">
                    {failedAttempts} failed attempt{failedAttempts > 1 ? 's' : ''} logged
                  </div>
                )}
              </div>

              {/* Keypad */}
              <div className="w-full max-w-[280px] mx-auto grid grid-cols-3 gap-2.5 mb-2">
                {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((digit) => (
                  <button
                    key={digit}
                    onClick={() => handleDigitPress(digit)}
                    className="h-13 rounded-2xl bg-slate-800/70 hover:bg-slate-700/80 active:bg-amber-500 active:text-slate-950 text-xl font-semibold text-slate-100 transition-colors flex items-center justify-center border border-slate-750 focus:outline-none"
                  >
                    {digit}
                  </button>
                ))}

                {/* Bottom Row */}
                <button
                  onClick={handleClear}
                  className="h-13 rounded-2xl bg-slate-850 hover:bg-slate-800 active:bg-slate-700 text-xs font-medium text-slate-400 transition-colors flex items-center justify-center border border-slate-800"
                >
                  Clear
                </button>

                <button
                  onClick={() => handleDigitPress('0')}
                  className="h-13 rounded-2xl bg-slate-800/70 hover:bg-slate-700/80 active:bg-amber-500 active:text-slate-950 text-xl font-semibold text-slate-100 transition-colors flex items-center justify-center border border-slate-750"
                >
                  0
                </button>

                <button
                  onClick={handleBackspace}
                  className="h-13 rounded-2xl bg-slate-850 hover:bg-slate-800 active:bg-slate-700 text-slate-300 transition-colors flex items-center justify-center border border-slate-800"
                >
                  <Delete className="w-5 h-5" />
                </button>
              </div>

              {/* Unlock Action Button */}
              <div className="space-y-1.5 mb-2">
                <button
                  onClick={handleUnlockAttempt}
                  disabled={pinInput.length === 0}
                  className={`w-full h-11 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 transition-all ${
                    pinInput.length > 0
                      ? 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-lg shadow-amber-500/25 active:scale-[0.98]'
                      : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                  }`}
                >
                  <Unlock className="w-4 h-4" />
                  Unlock
                </button>

                {/* Hint Bar */}
                <div className="flex items-center justify-between text-[11px] text-slate-400 px-1 pt-1">
                  <button
                    onClick={() => setShowPinHelp(!showPinHelp)}
                    className="hover:text-slate-200 transition-colors flex items-center gap-1"
                  >
                    {showPinHelp ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                    <span>{showPinHelp ? `Correct PIN: ${currentPin}` : 'Forgot PIN?'}</span>
                  </button>
                  <button
                    onClick={() => {
                      setPinInput('9999');
                    }}
                    className="text-rose-400 hover:text-rose-300 transition-colors"
                  >
                    Test Wrong PIN (9999)
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ============================================================== */}
          {/* VIEW B: FULL-SCREEN CAT INTRUDER ALARM */}
          {/* ============================================================== */}
          {appState === 'alarm' && (
            <div className="relative z-10 flex-1 flex flex-col justify-between bg-gradient-to-b from-rose-950 via-red-900 to-rose-950 px-5 py-6 text-center animate-pulse">
              {/* Alarm Siren Flasher */}
              <div className="flex flex-col items-center">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-red-600/80 border border-red-400 text-white rounded-full text-xs font-bold tracking-wider mb-2 uppercase animate-bounce">
                  <AlertTriangle className="w-4 h-4" />
                  Intruder Detected!
                </div>
                <h1 className="text-2xl font-extrabold text-white tracking-tight">
                  CAT ALARM ACTIVE!
                </h1>
                <p className="text-xs text-rose-200 mt-1">
                  Wrong PIN entered · Loud siren & vibration active
                </p>
              </div>

              {/* Cat Image Hero (Full screen vibe) */}
              <div className="my-auto flex flex-col items-center justify-center">
                <div className="relative scale-110 sm:scale-125 transition-transform">
                  {customCatImg ? (
                    <div className="relative">
                      <img
                        src={customCatImg}
                        alt="Intruder Guard Cat"
                        referrerPolicy="no-referrer"
                        className="w-44 h-44 rounded-2xl object-cover border-4 border-red-500 shadow-2xl"
                      />
                      <div className="absolute top-2 right-2 bg-red-600 text-white text-[10px] font-bold px-2 py-0.5 rounded">
                        ANGRY
                      </div>
                    </div>
                  ) : (
                    <activeMascot.Component className="w-48 h-48 drop-shadow-2xl" isAlarming={true} />
                  )}
                </div>

                <div className="mt-4 px-3 py-1.5 rounded-lg bg-black/40 border border-red-500/40 text-rose-200 text-xs font-mono">
                  🚨 Siren: <span className="font-semibold text-white uppercase">{alarmSoundType}</span> · Vibrate: <span className="font-semibold text-white">{vibrationDurationMs / 1000}s</span>
                </div>
              </div>

              {/* Action Controls */}
              <div className="space-y-2">
                <button
                  onClick={handleSilenceAlarm}
                  className="w-full h-12 rounded-xl bg-white text-rose-900 font-bold text-sm hover:bg-rose-50 active:scale-[0.98] transition-all shadow-xl shadow-red-950/50 flex items-center justify-center gap-2"
                >
                  <VolumeX className="w-4 h-4" />
                  Silence Alarm & Retry
                </button>
                <p className="text-[10px] text-rose-300">
                  Incident logged in Intruder History
                </p>
              </div>
            </div>
          )}

          {/* ============================================================== */}
          {/* VIEW C: UNLOCKED STATE (Cat Vault & Dashboard) */}
          {/* ============================================================== */}
          {appState === 'unlocked' && (
            <div className="relative z-10 flex-1 flex flex-col justify-between overflow-y-auto px-4 py-3">
              {/* Unlocked Header */}
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
                      <CheckCircle2 className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-white">Unlocked Vault</h3>
                      <p className="text-[10px] text-slate-400">Correct PIN Accepted</p>
                    </div>
                  </div>
                  <button
                    onClick={handleLockAgain}
                    className="px-2.5 py-1 text-xs font-medium text-slate-300 bg-slate-800 hover:bg-slate-700 rounded-lg flex items-center gap-1 transition-colors"
                  >
                    <Lock className="w-3 h-3" />
                    Lock Now
                  </button>
                </div>

                {/* Sub Navigation */}
                <div className="flex items-center gap-1 p-1 bg-slate-850 rounded-xl my-3">
                  <button
                    onClick={() => setActiveTabInUnlocked('vault')}
                    className={`flex-1 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                      activeTabInUnlocked === 'vault'
                        ? 'bg-amber-500 text-slate-950 shadow-sm font-semibold'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Cat Vault
                  </button>
                  <button
                    onClick={() => setActiveTabInUnlocked('logs')}
                    className={`flex-1 py-1.5 text-xs font-medium rounded-lg transition-colors relative ${
                      activeTabInUnlocked === 'logs'
                        ? 'bg-amber-500 text-slate-950 shadow-sm font-semibold'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Logs ({intruderLogs.length})
                  </button>
                  <button
                    onClick={() => setActiveTabInUnlocked('settings')}
                    className={`flex-1 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                      activeTabInUnlocked === 'settings'
                        ? 'bg-amber-500 text-slate-950 shadow-sm font-semibold'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Settings
                  </button>
                </div>
              </div>

              {/* Tab Contents */}
              <div className="flex-1 overflow-y-auto pr-0.5 space-y-3">
                {activeTabInUnlocked === 'vault' && (
                  <div className="space-y-3">
                    {/* Mascot Showcase */}
                    <div className="p-3 rounded-2xl bg-slate-800/60 border border-slate-750 flex items-center gap-3">
                      <HappyVictoryCat className="w-16 h-16 shrink-0" />
                      <div>
                        <h4 className="text-xs font-bold text-white">Device Protected</h4>
                        <p className="text-[11px] text-slate-400 leading-relaxed mt-0.5">
                          {activeMascot.name} is guarding your phone. Any wrong PIN immediately sounds the siren!
                        </p>
                      </div>
                    </div>

                    {/* Protected Apps List */}
                    <div className="space-y-1.5">
                      <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider px-1">
                        Protected Apps
                      </div>
                      {[
                        { title: 'WhatsApp Messages', icon: '💬', status: 'Locked with Cat Guard' },
                        { title: 'Secret Photos Vault', icon: '🔒', status: '8 Private Cat Photos' },
                        { title: 'Bank & Wallet Apps', icon: '💳', status: 'Biometric + Cat Alarm' },
                      ].map((app, idx) => (
                        <div
                          key={idx}
                          className="flex items-center justify-between p-2.5 rounded-xl bg-slate-800/40 border border-slate-750/70"
                        >
                          <div className="flex items-center gap-2.5">
                            <span className="text-lg">{app.icon}</span>
                            <div>
                              <div className="text-xs font-medium text-white">{app.title}</div>
                              <div className="text-[10px] text-slate-400">{app.status}</div>
                            </div>
                          </div>
                          <span className="text-[10px] text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded">
                            Active
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {activeTabInUnlocked === 'logs' && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between px-1">
                      <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                        Intruder Incidents
                      </span>
                      {intruderLogs.length > 0 && (
                        <button
                          onClick={() => setIntruderLogs([])}
                          className="text-[10px] text-slate-400 hover:text-rose-400 transition-colors"
                        >
                          Clear History
                        </button>
                      )}
                    </div>

                    {intruderLogs.length === 0 ? (
                      <div className="p-6 text-center text-slate-500 rounded-xl bg-slate-800/30 border border-dashed border-slate-800">
                        <ShieldAlert className="w-8 h-8 mx-auto mb-1.5 text-slate-600" />
                        <p className="text-xs font-medium text-slate-400">No intruder alerts yet</p>
                        <p className="text-[10px] text-slate-500 mt-0.5">
                          Try locking and typing a wrong PIN to test the alarm and log capture!
                        </p>
                      </div>
                    ) : (
                      intruderLogs.map((log) => (
                        <div
                          key={log.id}
                          className="p-2.5 rounded-xl bg-rose-950/30 border border-rose-900/40 flex items-center justify-between"
                        >
                          <div className="flex items-center gap-2.5">
                            {log.imageUrl ? (
                              <img
                                src={log.imageUrl}
                                alt="Intruder Snapshot"
                                referrerPolicy="no-referrer"
                                className="w-10 h-10 rounded-lg object-cover border border-rose-600/50"
                              />
                            ) : (
                              <div className="w-10 h-10 rounded-lg bg-rose-900/60 flex items-center justify-center text-rose-300 font-bold text-xs">
                                403
                              </div>
                            )}
                            <div>
                              <div className="text-xs font-semibold text-rose-200">
                                Wrong PIN: <span className="font-mono">{log.attemptedPin}</span>
                              </div>
                              <div className="text-[10px] text-slate-400">
                                {log.timestamp} · Guard: {log.catMascotName}
                              </div>
                            </div>
                          </div>
                          <span className="text-[10px] text-rose-400 font-medium">Alarm Fired</span>
                        </div>
                      ))
                    )}
                  </div>
                )}

                {activeTabInUnlocked === 'settings' && (
                  <div className="space-y-3 text-xs">
                    {/* Change PIN Form */}
                    <form onSubmit={handleSavePin} className="p-3 rounded-xl bg-slate-800/50 border border-slate-750">
                      <div className="font-semibold text-white mb-1.5">Change PIN Password</div>
                      <div className="flex items-center gap-2">
                        <input
                          type="password"
                          maxLength={8}
                          placeholder="New PIN (min 4 digits)"
                          value={newPinCandidate}
                          onChange={(e) => setNewPinCandidate(e.target.value.replace(/\D/g, ''))}
                          className="flex-1 bg-slate-900 border border-slate-700 px-3 py-1.5 rounded-lg text-white font-mono text-xs focus:outline-none focus:border-amber-500"
                        />
                        <button
                          type="submit"
                          disabled={newPinCandidate.length < 4}
                          className="px-3 py-1.5 bg-amber-500 text-slate-950 font-semibold rounded-lg hover:bg-amber-400 disabled:opacity-50"
                        >
                          Save
                        </button>
                      </div>
                      {pinChangeSuccess && (
                        <div className="text-[10px] text-emerald-400 mt-1.5">{pinChangeSuccess}</div>
                      )}
                      <div className="text-[10px] text-slate-400 mt-1">Current PIN: {currentPin}</div>
                    </form>

                    {/* Alarm Sound Picker */}
                    <div className="p-3 rounded-xl bg-slate-800/50 border border-slate-750 space-y-1.5">
                      <div className="font-semibold text-white">Alarm Sound Effect</div>
                      <div className="grid grid-cols-3 gap-1.5">
                        {[
                          { id: 'police', label: 'Police Siren' },
                          { id: 'cat_scream', label: 'Cat Meow Scream' },
                          { id: 'klaxon', label: 'Klaxon Alert' },
                        ].map((snd) => (
                          <button
                            key={snd.id}
                            type="button"
                            onClick={() => {
                              onAlarmSoundChange(snd.id as 'police' | 'cat_scream' | 'klaxon');
                              soundEngine.startAlarm(snd.id as 'police' | 'cat_scream' | 'klaxon', 0.2);
                              setTimeout(() => soundEngine.stopAlarm(), 600);
                            }}
                            className={`p-1.5 rounded-lg text-[10px] font-medium transition-colors ${
                              alarmSoundType === snd.id
                                ? 'bg-amber-500 text-slate-950 font-bold'
                                : 'bg-slate-900 text-slate-300 hover:text-white'
                            }`}
                          >
                            {snd.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Vibration Duration */}
                    <div className="p-3 rounded-xl bg-slate-800/50 border border-slate-750">
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="font-semibold text-white">Vibration Length</span>
                        <span className="text-amber-400 font-mono">{vibrationDurationMs / 1000}s</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        {[1000, 2000, 3000, 5000].map((ms) => (
                          <button
                            key={ms}
                            type="button"
                            onClick={() => onVibrationDurationChange(ms)}
                            className={`flex-1 py-1 rounded text-[10px] ${
                              vibrationDurationMs === ms
                                ? 'bg-amber-500 text-slate-950 font-bold'
                                : 'bg-slate-900 text-slate-400 hover:text-white'
                            }`}
                          >
                            {ms / 1000}s
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Bottom Quick Lock Button */}
              <div className="pt-2 border-t border-slate-800">
                <button
                  onClick={handleLockAgain}
                  className="w-full h-10 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
                >
                  <Lock className="w-3.5 h-3.5 text-amber-400" />
                  Lock Phone & Test Again
                </button>
              </div>
            </div>
          )}

          {/* Android Bottom Home Navigation Pill */}
          <div className="relative z-20 py-2 flex items-center justify-center">
            <div className="w-24 h-1 bg-slate-600 rounded-full" />
          </div>
        </div>
      </div>

      {/* Quick External Simulator Controls */}
      <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
        <button
          onClick={() => setIsMuted(!isMuted)}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium border flex items-center gap-1.5 transition-colors ${
            isMuted
              ? 'bg-rose-950/50 border-rose-800 text-rose-300'
              : 'bg-slate-800/80 border-slate-700 text-slate-300 hover:text-white'
          }`}
        >
          {isMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5 text-amber-400" />}
          {isMuted ? 'Alarm Muted' : 'Alarm Sound On'}
        </button>

        <button
          onClick={toggleWebcam}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium border flex items-center gap-1.5 transition-colors ${
            isWebcamActive
              ? 'bg-emerald-950/60 border-emerald-800 text-emerald-300'
              : 'bg-slate-800/80 border-slate-700 text-slate-300 hover:text-white'
          }`}
        >
          <Camera className="w-3.5 h-3.5" />
          {isWebcamActive ? 'Intruder Camera Active' : 'Enable Intruder Selfie Camera'}
        </button>

        <label className="px-3 py-1.5 rounded-lg text-xs font-medium border border-slate-700 bg-slate-800/80 text-slate-300 hover:text-white cursor-pointer flex items-center gap-1.5 transition-colors">
          <Upload className="w-3.5 h-3.5" />
          <span>Upload Custom Cat</span>
          <input type="file" accept="image/*" onChange={handleCustomImageUpload} className="hidden" />
        </label>
      </div>
    </div>
  );
};
