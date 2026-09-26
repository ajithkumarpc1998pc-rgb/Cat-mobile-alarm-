import React, { useState } from 'react';
import {
  MessageSquare,
  Send,
  Bell,
  CheckCircle,
  Copy,
  Check,
  ExternalLink,
  ArrowRight,
  Shield,
  Smartphone,
  Sliders,
  Sparkles,
  Zap,
} from 'lucide-react';

export const WhatsAppForwarderGuide: React.FC = () => {
  // Simulator State
  const [selectedApp, setSelectedApp] = useState<string>('cat_lock');
  const [targetNumber, setTargetNumber] = useState<string>('15550192834');
  const [customTitle, setCustomTitle] = useState<string>('Cat Lock Alert: Intruder Detected');
  const [customBody, setCustomBody] = useState<string>('Wrong PIN 9999 was entered. Alarm siren triggered!');
  const [isSimulating, setIsSimulating] = useState<boolean>(false);
  const [simulatedResult, setSimulatedResult] = useState<{
    rawApp: string;
    formattedMessage: string;
    whatsappUrl: string;
  } | null>(null);

  const [copiedCodeKey, setCopiedCodeKey] = useState<string | null>(null);
  const [activeApproach, setActiveApproach] = useState<'kotlin' | 'macrodroid' | 'cloud_api'>('kotlin');

  const appPresets: Record<string, { name: string; package: string; defaultTitle: string; defaultBody: string }> = {
    cat_lock: {
      name: 'Cat Lock Guard (This App)',
      package: 'com.example.catlock',
      defaultTitle: 'Cat Lock Alert: Intruder Detected!',
      defaultBody: 'Unauthorized person attempted PIN 9999 at 10:30 PM. Cat alarm active!',
    },
    bank: {
      name: 'Bank / Payment App',
      package: 'com.bank.mobile',
      defaultTitle: 'Debit Alert: $50.00 spent',
      defaultBody: 'Your card was charged $50.00 at Grocery Mart.',
    },
    camera: {
      name: 'Smart Security Camera',
      package: 'com.smartcam.security',
      defaultTitle: 'Motion Detected at Front Porch',
      defaultBody: 'A person was detected by Front Door Cam at 10:32 PM.',
    },
    custom: {
      name: 'Custom Application',
      package: 'com.mycustom.app',
      defaultTitle: 'System Notification',
      defaultBody: 'Important status update from your app.',
    },
  };

  const handleSelectAppPreset = (key: string) => {
    setSelectedApp(key);
    const preset = appPresets[key];
    setCustomTitle(preset.defaultTitle);
    setCustomBody(preset.defaultBody);
    setSimulatedResult(null);
  };

  const handleSimulateForward = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSimulating(true);

    setTimeout(() => {
      const preset = appPresets[selectedApp];
      const formatted = `🚨 *Automated App Notification*\n📱 *Source:* ${preset.name} (${preset.package})\n📌 *Title:* ${customTitle}\n💬 *Message:* ${customBody}\n⏰ *Time:* ${new Date().toLocaleTimeString()}`;
      const url = `https://api.whatsapp.com/send?phone=${targetNumber.replace(/\D/g, '')}&text=${encodeURIComponent(formatted)}`;

      setSimulatedResult({
        rawApp: preset.name,
        formattedMessage: formatted,
        whatsappUrl: url,
      });
      setIsSimulating(false);
    }, 400);
  };

  const handleCopyCode = (code: string, key: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCodeKey(key);
    setTimeout(() => setCopiedCodeKey(null), 2500);
  };

  const kotlinServiceCode = `package com.example.catlock

import android.app.Notification
import android.content.Intent
import android.net.Uri
import android.os.Bundle
import android.service.notification.NotificationListenerService
import android.service.notification.StatusBarNotification
import android.util.Log
import java.net.URLEncoder

/**
 * Android NotificationListenerService
 * Listens for notifications from any specified application
 * and forwards them automatically to WhatsApp.
 */
class NotificationToWhatsAppService : NotificationListenerService() {

    private val targetWhatsAppNumber = "${targetNumber.replace(/\D/g, '')}" // with country code
    
    // Package names to intercept (e.g., Cat Lock, Bank, Camera)
    private val targetPackages = setOf(
        "com.example.catlock",
        "com.smartcam.security"
    )

    override fun onNotificationPosted(sbn: StatusBarNotification?) {
        super.onNotificationPosted(sbn)
        if (sbn == null) return

        val packageName = sbn.packageName

        // 1. Avoid infinite loop (do NOT forward WhatsApp's own notifications!)
        if (packageName == "com.whatsapp" || packageName == "com.whatsapp.w4b") {
            return
        }

        // 2. Filter target package
        if (targetPackages.isNotEmpty() && !targetPackages.contains(packageName)) {
            return
        }

        // 3. Extract Notification Content
        val extras: Bundle = sbn.notification.extras
        val title = extras.getString(Notification.EXTRA_TITLE) ?: "Alert"
        val text = extras.getCharSequence(Notification.EXTRA_TEXT)?.toString() ?: ""

        if (text.isEmpty()) return

        Log.d("NotifForwarder", "Notification caught from $packageName: $title - $text")

        // 4. Format WhatsApp Message
        val message = "🚨 *Notification Forwarded*\\n" +
                "📱 *App:* $packageName\\n" +
                "👤 *Title:* $title\\n" +
                "💬 *Message:* $text"

        sendToWhatsApp(message)
    }

    private fun sendToWhatsApp(message: String) {
        try {
            // Opens WhatsApp with target phone and prefilled text
            val url = "https://api.whatsapp.com/send?phone=$targetWhatsAppNumber&text=" +
                    URLEncoder.encode(message, "UTF-8")
            val intent = Intent(Intent.ACTION_VIEW).apply {
                data = Uri.parse(url)
                setPackage("com.whatsapp")
                flags = Intent.FLAG_ACTIVITY_NEW_TASK
            }
            startActivity(intent)
        } catch (e: Exception) {
            Log.e("NotifForwarder", "Error forwarding to WhatsApp: \${e.message}")
        }
    }
}`;

  return (
    <div className="space-y-6">
      {/* Header Overview */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-emerald-950/40 via-slate-900 to-slate-900 border border-emerald-800/40 shadow-xl">
        <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400 tracking-wider uppercase mb-1">
          <MessageSquare className="w-4 h-4" />
          Android Automation Guide
        </div>
        <h2 className="text-xl font-bold text-white tracking-tight">
          How to Automatically Forward App Notifications to WhatsApp
        </h2>
        <p className="text-sm text-slate-400 mt-1 max-w-2xl leading-relaxed">
          On Android, third-party apps cannot directly read another app's notifications without the system's{' '}
          <span className="text-white font-semibold">NotificationListenerService</span> or accessibility automations. Here is the exact technical architecture and 3 working solutions.
        </p>
      </div>

      {/* Visual Pipeline Flow */}
      <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">
          How The Notification Intercept Pipeline Works
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-center">
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex flex-col items-center">
            <div className="w-10 h-10 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center mb-2">
              <Bell className="w-5 h-5" />
            </div>
            <div className="text-xs font-bold text-white">1. App Posts Alert</div>
            <div className="text-[11px] text-slate-400 mt-1">
              Cat Lock, Bank, or Security App posts a status bar notification
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex flex-col items-center">
            <div className="w-10 h-10 rounded-full bg-sky-500/20 text-sky-400 flex items-center justify-center mb-2">
              <Shield className="w-5 h-5" />
            </div>
            <div className="text-xs font-bold text-white">2. Intercept Event</div>
            <div className="text-[11px] text-slate-400 mt-1">
              <code className="text-[10px] text-sky-300">NotificationListenerService</code> receives callback
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex flex-col items-center">
            <div className="w-10 h-10 rounded-full bg-purple-500/20 text-purple-400 flex items-center justify-center mb-2">
              <Sliders className="w-5 h-5" />
            </div>
            <div className="text-xs font-bold text-white">3. Filter & Parse</div>
            <div className="text-[11px] text-slate-400 mt-1">
              Extracts title, text, app package name, and formats Markdown
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-950 border border-emerald-800/50 flex flex-col items-center">
            <div className="w-10 h-10 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mb-2">
              <Send className="w-5 h-5" />
            </div>
            <div className="text-xs font-bold text-white">4. Forward to WhatsApp</div>
            <div className="text-[11px] text-slate-400 mt-1">
              Dispatched via WhatsApp Intent or WhatsApp Cloud Webhook
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Simulator: Test Notification -> WhatsApp Forwarder */}
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800">
        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="text-xs font-semibold text-emerald-400 flex items-center gap-1.5 uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              Interactive Forwarder Tester
            </div>
            <h3 className="text-base font-bold text-white mt-0.5">
              Simulate Incoming Notification & WhatsApp Message
            </h3>
          </div>
        </div>

        <form onSubmit={handleSimulateForward} className="space-y-4">
          {/* Preset Buttons */}
          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-2">
              Select Sample Notification Source:
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {Object.keys(appPresets).map((key) => {
                const item = appPresets[key];
                const isSelected = selectedApp === key;
                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => handleSelectAppPreset(key)}
                    className={`p-2.5 rounded-xl text-left border transition-all text-xs ${
                      isSelected
                        ? 'bg-emerald-950/60 border-emerald-500 text-white font-semibold shadow-sm'
                        : 'bg-slate-950/70 border-slate-800 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <div className="truncate">{item.name}</div>
                    <div className="text-[10px] text-slate-500 font-mono truncate">{item.package}</div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Target WhatsApp Number & Input Fields */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">
                Recipient WhatsApp Number:
              </label>
              <input
                type="text"
                value={targetNumber}
                onChange={(e) => setTargetNumber(e.target.value)}
                placeholder="15551234567 (with country code)"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white font-mono focus:border-emerald-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">
                Notification Title:
              </label>
              <input
                type="text"
                value={customTitle}
                onChange={(e) => setCustomTitle(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:border-emerald-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">
                Notification Body Text:
              </label>
              <input
                type="text"
                value={customBody}
                onChange={(e) => setCustomBody(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:border-emerald-500 focus:outline-none"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isSimulating}
            className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 active:scale-[0.98] text-white font-bold text-xs flex items-center gap-2 transition-all cursor-pointer"
          >
            <Zap className="w-4 h-4" />
            {isSimulating ? 'Processing Interception...' : 'Simulate Notification Intercept'}
          </button>
        </form>

        {/* Live Simulation Output */}
        {simulatedResult && (
          <div className="mt-5 p-4 rounded-xl bg-slate-950 border border-emerald-900/60 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="space-y-1.5 flex-1">
              <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400">
                <CheckCircle className="w-4 h-4" />
                Notification Successfully Intercepted & Formatted!
              </div>

              {/* WhatsApp Chat Bubble Mockup */}
              <div className="p-3 rounded-2xl bg-emerald-950/40 border border-emerald-800/40 text-xs text-slate-200 font-sans max-w-lg leading-relaxed whitespace-pre-line shadow-inner">
                {simulatedResult.formattedMessage}
              </div>
            </div>

            <a
              href={simulatedResult.whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center gap-2 shrink-0 transition-colors shadow-lg shadow-emerald-500/20"
            >
              <Send className="w-3.5 h-3.5" />
              Test Send in WhatsApp
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        )}
      </div>

      {/* 3 Approaches to Implement This */}
      <div className="space-y-4">
        {/* Method Switcher */}
        <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
          {[
            { id: 'kotlin', label: '1. Native Kotlin Service (In Cat Lock App)' },
            { id: 'macrodroid', label: '2. No-Code Mobile App (MacroDroid / Tasker)' },
            { id: 'cloud_api', label: '3. Cloud API / Webhook (24/7 Silent Dispatch)' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveApproach(tab.id as 'kotlin' | 'macrodroid' | 'cloud_api')}
              className={`px-3 py-2 text-xs font-semibold rounded-lg transition-colors ${
                activeApproach === tab.id
                  ? 'bg-emerald-600 text-white'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab 1: Native Kotlin */}
        {activeApproach === 'kotlin' && (
          <div className="space-y-3">
            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-300 leading-relaxed space-y-2">
              <div className="font-bold text-white text-sm">
                Android NotificationListenerService Implementation
              </div>
              <p>
                To allow your Cat Lock app to read other app notifications and dispatch them to WhatsApp, follow these 3 steps:
              </p>
              <ol className="list-decimal list-inside space-y-1 text-slate-400">
                <li>Add the service declaration and permission in <code className="text-amber-300 font-mono">AndroidManifest.xml</code>.</li>
                <li>Create <code className="text-amber-300 font-mono">NotificationToWhatsAppService.kt</code> with the code below.</li>
                <li>
                  <span className="text-white font-semibold">Crucial User Step:</span> On the Android device, go to{' '}
                  <code className="text-amber-300 font-mono">Settings &gt; Apps &gt; Special App Access &gt; Notification Access</code> and toggle your app ON.
                </li>
              </ol>
            </div>

            <div className="rounded-xl bg-slate-950 border border-slate-800 overflow-hidden">
              <div className="flex items-center justify-between px-4 py-2 bg-slate-900 border-b border-slate-800">
                <span className="text-xs font-mono text-slate-400">
                  NotificationToWhatsAppService.kt
                </span>
                <button
                  onClick={() => handleCopyCode(kotlinServiceCode, 'kotlin_service')}
                  className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-xs text-slate-200 flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  {copiedCodeKey === 'kotlin_service' ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-emerald-400">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy Kotlin</span>
                    </>
                  )}
                </button>
              </div>
              <pre className="p-4 text-xs font-mono text-slate-300 overflow-x-auto max-h-96">
                <code>{kotlinServiceCode}</code>
              </pre>
            </div>
          </div>
        )}

        {/* Tab 2: MacroDroid / Tasker (No-Code) */}
        {activeApproach === 'macrodroid' && (
          <div className="p-5 rounded-xl bg-slate-900 border border-slate-800 space-y-4">
            <div>
              <h4 className="text-sm font-bold text-white">
                Zero-Code Setup with MacroDroid or Tasker (Takes 3 Minutes)
              </h4>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                If you don't want to compile an Android Studio project, you can install the free app{' '}
                <span className="text-white font-semibold">MacroDroid</span> from Google Play Store:
              </p>
            </div>

            <div className="space-y-3">
              {[
                {
                  num: 'Step 1',
                  title: 'Install MacroDroid',
                  desc: 'Download "MacroDroid - Device Automation" from Google Play Store.',
                },
                {
                  num: 'Step 2',
                  title: 'Add Trigger: Notification Received',
                  desc: 'Tap Add Macro > Trigger > Device Events > Notification > Notification Received. Select "Select Applications" and check the target app (e.g., Cat Lock, Bank App, or Camera).',
                },
                {
                  num: 'Step 3',
                  title: 'Add Action: Send WhatsApp Message',
                  desc: 'Tap Add Action > Applications > Open Website / HTTP GET or Send Intent. Use the URL: https://api.whatsapp.com/send?phone=[PHONE]&text=[notif_title]: [notif_message]',
                },
                {
                  num: 'Step 4',
                  title: 'Enable Notification Access',
                  desc: 'MacroDroid will ask for Notification Access permission. Allow it, name your macro "Notif to WhatsApp", and turn it ON!',
                },
              ].map((step) => (
                <div key={step.num} className="p-3 rounded-lg bg-slate-950 border border-slate-800 flex items-start gap-3">
                  <div className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-mono font-bold text-xs shrink-0">
                    {step.num}
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-white">{step.title}</div>
                    <div className="text-[11px] text-slate-400 mt-0.5 leading-relaxed">{step.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 3: Cloud API / Webhook */}
        {activeApproach === 'cloud_api' && (
          <div className="p-5 rounded-xl bg-slate-900 border border-slate-800 space-y-3">
            <div>
              <h4 className="text-sm font-bold text-white">
                Silent Background Forwarding via WhatsApp Business Cloud API / Twilio
              </h4>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                Using an Intent opens the WhatsApp app on the phone's screen. If you want the notification to be sent{' '}
                <span className="text-white font-semibold">silently in the background</span> without opening WhatsApp:
              </p>
            </div>

            <div className="rounded-xl bg-slate-950 border border-slate-800 p-4 font-mono text-xs text-slate-300">
              <div className="text-slate-500 mb-2">// In NotificationToWhatsAppService.kt:</div>
              <pre className="overflow-x-auto text-[11px] text-emerald-300">
{`val client = OkHttpClient()
val json = JSONObject().apply {
    put("messaging_product", "whatsapp")
    put("to", targetWhatsAppNumber)
    put("type", "text")
    put("text", JSONObject().put("body", message))
}

val request = Request.Builder()
    .url("https://graph.facebook.com/v19.0/{PHONE_NUMBER_ID}/messages")
    .addHeader("Authorization", "Bearer {META_WHATSAPP_TOKEN}")
    .post(json.toString().toRequestBody("application/json".toMediaType()))
    .build()

client.newCall(request).enqueue(...) // Sent in 200ms in background!`}
              </pre>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
