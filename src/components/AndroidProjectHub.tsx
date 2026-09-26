import React, { useState } from 'react';
import {
  Code,
  Download,
  Copy,
  Check,
  FileCode,
  Terminal,
  Cpu,
  Layers,
  Smartphone,
  ExternalLink,
  ChevronRight,
  ShieldCheck,
} from 'lucide-react';
import {
  getMainActivityKotlin,
  getActivityMainXml,
  getAndroidManifestXml,
  getBuildGradleKts,
  getNotificationToWhatsAppServiceKotlin,
  downloadAndroidProjectZip,
} from '../utils/androidCodeTemplates';

interface AndroidProjectHubProps {
  currentPin: string;
  vibrationDurationMs: number;
}

export const AndroidProjectHub: React.FC<AndroidProjectHubProps> = ({
  currentPin,
  vibrationDurationMs,
}) => {
  const [activeFile, setActiveFile] = useState<
    'mainActivity' | 'activityXml' | 'manifest' | 'gradle' | 'forwarderService'
  >('mainActivity');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [isDownloading, setIsDownloading] = useState<boolean>(false);

  const config = {
    pin: currentPin,
    enableCamera: true,
    enableWhatsAppForwarder: true,
    alarmDurationMs: vibrationDurationMs,
  };

  const fileMap = {
    mainActivity: {
      name: 'MainActivity.kt',
      path: 'app/src/main/java/com/example/catlock/MainActivity.kt',
      language: 'kotlin',
      code: getMainActivityKotlin(config),
    },
    activityXml: {
      name: 'activity_main.xml',
      path: 'app/src/main/res/layout/activity_main.xml',
      language: 'xml',
      code: getActivityMainXml(),
    },
    manifest: {
      name: 'AndroidManifest.xml',
      path: 'app/src/main/AndroidManifest.xml',
      language: 'xml',
      code: getAndroidManifestXml(),
    },
    gradle: {
      name: 'build.gradle.kts',
      path: 'app/build.gradle.kts',
      language: 'kotlin',
      code: getBuildGradleKts(),
    },
    forwarderService: {
      name: 'NotificationToWhatsAppService.kt',
      path: 'app/src/main/java/com/example/catlock/NotificationToWhatsAppService.kt',
      language: 'kotlin',
      code: getNotificationToWhatsAppServiceKotlin(),
    },
  };

  const handleCopy = (code: string, key: string) => {
    navigator.clipboard.writeText(code);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2500);
  };

  const handleDownloadZip = async () => {
    try {
      setIsDownloading(true);
      await downloadAndroidProjectZip(config);
    } catch (err) {
      console.error('Error generating Android zip:', err);
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & Quick Download Action */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-850 to-slate-900 border border-slate-800 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-amber-400 tracking-wider uppercase mb-1">
            <Cpu className="w-4 h-4" />
            Native Android Studio Source Code
          </div>
          <h2 className="text-xl font-bold text-white tracking-tight">
            Kotlin Project Files & APK Generation
          </h2>
          <p className="text-sm text-slate-400 mt-1 max-w-xl">
            Pre-configured with PIN <span className="font-mono text-amber-300 font-bold">"{currentPin}"</span>, alarm siren player, device vibrator, and full-screen cat alert layout.
          </p>
        </div>

        <button
          onClick={handleDownloadZip}
          disabled={isDownloading}
          className="px-5 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 active:scale-[0.98] text-slate-950 font-bold text-sm flex items-center gap-2 shadow-lg shadow-amber-500/20 transition-all shrink-0 cursor-pointer disabled:opacity-50"
        >
          <Download className="w-4 h-4" />
          {isDownloading ? 'Generating ZIP...' : 'Download Project (.zip)'}
        </button>
      </div>

      {/* Step by Step Android Studio Workflow */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
        {[
          {
            step: '01',
            title: 'Create Project',
            desc: 'Install Android Studio. Choose "Empty Views Activity", Language: Kotlin, Min SDK: 26+.',
          },
          {
            step: '02',
            title: 'Paste Layout',
            desc: 'Replace activity_main.xml with our responsive LinearLayout & RelativeLayout.',
          },
          {
            step: '03',
            title: 'Paste Kotlin',
            desc: 'Copy MainActivity.kt with PIN verification, MediaPlayer siren, and Vibrator.',
          },
          {
            step: '04',
            title: 'Add Assets',
            desc: 'Put cat.png in res/drawable/ and your alarm.mp3 sound in res/raw/.',
          },
          {
            step: '05',
            title: 'Build APK',
            desc: 'Go to Build > Build Bundle(s) / APK(s) > Build APK(s) and install on phone.',
          },
        ].map((item) => (
          <div
            key={item.step}
            className="p-4 rounded-xl bg-slate-900/70 border border-slate-800 hover:border-slate-700 transition-colors"
          >
            <div className="text-xs font-mono font-bold text-amber-400 mb-1">{item.step}</div>
            <h4 className="text-sm font-semibold text-white">{item.title}</h4>
            <p className="text-xs text-slate-400 mt-1 leading-relaxed">{item.desc}</p>
          </div>
        ))}
      </div>

      {/* Code Editor / Viewer */}
      <div className="rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden shadow-2xl">
        {/* File Tabs Header */}
        <div className="flex items-center justify-between px-4 py-2.5 bg-slate-950 border-b border-slate-800 flex-wrap gap-2">
          {/* File Selectors */}
          <div className="flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0">
            {(Object.keys(fileMap) as Array<keyof typeof fileMap>).map((key) => {
              const file = fileMap[key];
              const isActive = activeFile === key;
              return (
                <button
                  key={key}
                  onClick={() => setActiveFile(key)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors whitespace-nowrap ${
                    isActive
                      ? 'bg-slate-800 text-amber-400 font-semibold'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                  }`}
                >
                  <FileCode className="w-3.5 h-3.5" />
                  <span>{file.name}</span>
                </button>
              );
            })}
          </div>

          {/* Copy Button */}
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-mono text-slate-500 hidden sm:inline">
              {fileMap[activeFile].path}
            </span>
            <button
              onClick={() => handleCopy(fileMap[activeFile].code, activeFile)}
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 active:bg-slate-650 text-xs font-medium text-slate-200 flex items-center gap-1.5 transition-colors border border-slate-700 cursor-pointer"
            >
              {copiedKey === activeFile ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400 font-semibold">Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy Code</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Code Content */}
        <div className="relative max-h-[500px] overflow-auto bg-slate-950/80 p-4 font-mono text-xs text-slate-300 leading-relaxed">
          <pre className="overflow-x-auto whitespace-pre font-mono">
            <code>{fileMap[activeFile].code}</code>
          </pre>
        </div>
      </div>

      {/* Asset Placement Tips */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
          <div className="flex items-center gap-2 text-sm font-semibold text-white mb-2">
            <Smartphone className="w-4 h-4 text-amber-400" />
            Where to place cat.png
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            In your Android Studio Project view, navigate to{' '}
            <code className="px-1.5 py-0.5 rounded bg-slate-800 text-amber-300">
              app/src/main/res/drawable/
            </code>
            . Save your angry cat image as <span className="font-semibold text-white">cat.png</span> (lowercase, no spaces).
          </p>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
          <div className="flex items-center gap-2 text-sm font-semibold text-white mb-2">
            <Terminal className="w-4 h-4 text-amber-400" />
            Where to place alarm.mp3
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            Right-click on <code className="px-1.5 py-0.5 rounded bg-slate-800 text-amber-300">res</code>, choose{' '}
            <span className="font-semibold text-white">New &gt; Android Resource Directory</span>, select{' '}
            <span className="font-semibold text-white">raw</span> as Resource type, then paste{' '}
            <span className="font-semibold text-white">alarm.mp3</span> into{' '}
            <code className="px-1.5 py-0.5 rounded bg-slate-800 text-amber-300">res/raw/</code>.
          </p>
        </div>
      </div>
    </div>
  );
};
