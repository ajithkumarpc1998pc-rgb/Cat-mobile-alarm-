import JSZip from 'jszip';

export interface AndroidProjectCode {
  pin: string;
  enableCamera: boolean;
  enableWhatsAppForwarder: boolean;
  alarmDurationMs: number;
}

export function getMainActivityKotlin(config: AndroidProjectCode): string {
  return `package com.example.catlock

import android.content.Context
import android.media.MediaPlayer
import android.os.Build
import android.os.Bundle
import android.os.VibrationEffect
import android.os.Vibrator
import android.os.VibratorManager
import android.view.View
import android.view.animation.AnimationUtils
import android.widget.Button
import android.widget.EditText
import android.widget.ImageView
import android.widget.LinearLayout
import android.widget.TextView
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity

/**
 * Cat Lock App - Main Activity
 * Security PIN lock that triggers a loud cat alarm, full-screen cat image,
 * and phone vibration when an incorrect PIN is entered.
 */
class MainActivity : AppCompatActivity() {

    // Configured PIN password
    private val correctPin = "${config.pin}"
    private var mediaPlayer: MediaPlayer? = null
    private var failedAttempts = 0

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)

        val pinInput = findViewById<EditText>(R.id.pinInput)
        val unlockBtn = findViewById<Button>(R.id.unlockBtn)
        val catAlarmContainer = findViewById<LinearLayout>(R.id.catAlarmContainer)
        val catImage = findViewById<ImageView>(R.id.catImage)
        val statusText = findViewById<TextView>(R.id.statusText)
        val dismissBtn = findViewById<Button>(R.id.dismissAlarmBtn)

        unlockBtn.setOnClickListener {
            val enteredPin = pinInput.text.toString().trim()

            if (enteredPin == correctPin) {
                // Correct PIN: Unlock successfully
                stopAlarmSound()
                catAlarmContainer.visibility = View.GONE
                statusText.text = "Status: Device Unlocked 🐾"
                Toast.makeText(this, "Access Granted! Welcome back!", Toast.LENGTH_SHORT).show()
                failedAttempts = 0

                // Clear input
                pinInput.text.clear()
            } else {
                // Incorrect PIN: Trigger full-screen Cat Alarm & Vibration
                failedAttempts++
                statusText.text = "Intruder Alert! Attempt: $failedAttempts"
                triggerCatAlarm(catAlarmContainer, catImage)
                vibrateDevice(${config.alarmDurationMs})
                playAlarmSound()
                Toast.makeText(this, "INCORRECT PIN! CAT ALARM TRIGGERED!", Toast.LENGTH_SHORT).show()
            }
        }

        dismissBtn.setOnClickListener {
            stopAlarmSound()
            catAlarmContainer.visibility = View.GONE
            pinInput.text.clear()
        }
    }

    private fun triggerCatAlarm(container: LinearLayout, catImageView: ImageView) {
        container.visibility = View.VISIBLE
        catImageView.visibility = View.VISIBLE

        // Visual alert shake animation
        catImageView.animate()
            .scaleX(1.15f).scaleY(1.15f)
            .setDuration(120)
            .withEndAction {
                catImageView.animate().scaleX(1.0f).scaleY(1.0f).setDuration(120).start()
            }.start()
    }

    private fun playAlarmSound() {
        try {
            stopAlarmSound()
            // alarm.mp3 placed in res/raw/alarm.mp3
            mediaPlayer = MediaPlayer.create(this, R.raw.alarm)
            mediaPlayer?.isLooping = true
            mediaPlayer?.start()
        } catch (e: Exception) {
            e.printStackTrace()
        }
    }

    private fun stopAlarmSound() {
        mediaPlayer?.let {
            if (it.isPlaying) {
                it.stop()
            }
            it.release()
        }
        mediaPlayer = null
    }

    private fun vibrateDevice(durationMs: Long = ${config.alarmDurationMs}L) {
        try {
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.S) {
                val vibratorManager = getSystemService(Context.VIBRATOR_MANAGER_SERVICE) as VibratorManager
                val vibrator = vibratorManager.defaultVibrator
                val pattern = longArrayOf(0, 300, 150, 300, 150, 500)
                vibrator.vibrate(VibrationEffect.createWaveform(pattern, -1))
            } else {
                @Suppress("DEPRECATION")
                val vibrator = getSystemService(Context.VIBRATOR_SERVICE) as Vibrator
                if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
                    vibrator.vibrate(VibrationEffect.createOneShot(durationMs, VibrationEffect.DEFAULT_AMPLITUDE))
                } else {
                    @Suppress("DEPRECATION")
                    vibrator.vibrate(durationMs)
                }
            }
        } catch (e: Exception) {
            e.printStackTrace()
        }
    }

    override fun onDestroy() {
        super.onDestroy()
        stopAlarmSound()
    }
}
`;
}

export function getActivityMainXml(): string {
  return `<?xml version="1.0" encoding="utf-8"?>
<RelativeLayout
    xmlns:android="http://schemas.android.com/apk/res/android"
    android:layout_width="match_parent"
    android:layout_height="match_parent"
    android:background="#0F172A">

    <!-- Normal Lock Screen UI -->
    <LinearLayout
        android:id="@+id/lockContainer"
        android:orientation="vertical"
        android:gravity="center"
        android:padding="24dp"
        android:layout_width="match_parent"
        android:layout_height="match_parent">

        <!-- App Mascot Lock Icon -->
        <ImageView
            android:layout_width="96dp"
            android:layout_height="96dp"
            android:layout_marginBottom="16dp"
            android:src="@drawable/cat"
            android:contentDescription="Cat Lock Shield" />

        <TextView
            android:id="@+id/titleText"
            android:layout_width="wrap_content"
            android:layout_height="wrap_content"
            android:text="Cat Lock Guard"
            android:textColor="#FFFFFF"
            android:textSize="26sp"
            android:textStyle="bold"
            android:layout_marginBottom="8dp" />

        <TextView
            android:id="@+id/statusText"
            android:layout_width="wrap_content"
            android:layout_height="wrap_content"
            android:text="Enter your PIN to unlock"
            android:textColor="#94A3B8"
            android:textSize="14sp"
            android:layout_marginBottom="24dp" />

        <EditText
            android:id="@+id/pinInput"
            android:hint="Enter 4-digit PIN"
            android:textColorHint="#64748B"
            android:textColor="#FFFFFF"
            android:inputType="numberPassword"
            android:maxLength="8"
            android:gravity="center"
            android:background="#1E293B"
            android:padding="14dp"
            android:textSize="22sp"
            android:layout_width="260dp"
            android:layout_height="wrap_content"
            android:layout_marginBottom="20dp"/>

        <Button
            android:id="@+id/unlockBtn"
            android:text="Unlock Device"
            android:textColor="#FFFFFF"
            android:backgroundTint="#F59E0B"
            android:textSize="16sp"
            android:paddingStart="36dp"
            android:paddingEnd="36dp"
            android:paddingTop="12dp"
            android:paddingBottom="12dp"
            android:layout_width="wrap_content"
            android:layout_height="wrap_content"/>
    </LinearLayout>

    <!-- Full Screen Cat Intruder Alert Overlay -->
    <LinearLayout
        android:id="@+id/catAlarmContainer"
        android:orientation="vertical"
        android:gravity="center"
        android:background="#DC2626"
        android:visibility="gone"
        android:clickable="true"
        android:focusable="true"
        android:padding="20dp"
        android:layout_width="match_parent"
        android:layout_height="match_parent">

        <TextView
            android:text="⚠️ INTRUDER DETECTED! ⚠️"
            android:textColor="#FFFFFF"
            android:textSize="28sp"
            android:textStyle="bold"
            android:gravity="center"
            android:layout_marginBottom="12dp"
            android:layout_width="wrap_content"
            android:layout_height="wrap_content"/>

        <TextView
            android:text="UNAUTHORIZED ACCESS ATTEMPT"
            android:textColor="#FEE2E2"
            android:textSize="14sp"
            android:letterSpacing="0.1"
            android:layout_marginBottom="24dp"
            android:layout_width="wrap_content"
            android:layout_height="wrap_content"/>

        <!-- Full-screen / Hero Guard Cat Image -->
        <ImageView
            android:id="@+id/catImage"
            android:layout_width="280dp"
            android:layout_height="280dp"
            android:scaleType="fitCenter"
            android:src="@drawable/cat"
            android:contentDescription="Angry Guard Cat"
            android:layout_marginBottom="32dp"/>

        <Button
            android:id="@+id/dismissAlarmBtn"
            android:text="Silence Alarm & Retry"
            android:textColor="#991B1B"
            android:backgroundTint="#FFFFFF"
            android:textSize="16sp"
            android:textStyle="bold"
            android:layout_width="wrap_content"
            android:layout_height="wrap_content"/>
    </LinearLayout>
</RelativeLayout>
`;
}

export function getAndroidManifestXml(): string {
  return `<?xml version="1.0" encoding="utf-8"?>
<manifest xmlns:android="http://schemas.android.com/apk/res/android"
    package="com.example.catlock">

    <!-- Permissions required for vibration, sounds, and camera lock -->
    <uses-permission android:name="android.permission.VIBRATE" />
    <uses-permission android:name="android.permission.WAKE_LOCK" />
    <uses-permission android:name="android.permission.CAMERA" />

    <application
        android:allowBackup="true"
        android:icon="@drawable/cat"
        android:label="Cat Lock"
        android:roundIcon="@drawable/cat"
        android:supportsRtl="true"
        android:theme="@style/Theme.AppCompat.NoActionBar">

        <activity
            android:name=".MainActivity"
            android:exported="true"
            android:screenOrientation="portrait">
            <intent-filter>
                <action android:name="android.intent.action.MAIN" />
                <category android:name="android.intent.category.LAUNCHER" />
            </intent-filter>
        </activity>

        <!-- Notification Listener Service (for WhatsApp Auto Forwarding) -->
        <service
            android:name=".NotificationToWhatsAppService"
            android:label="Cat Lock Notification Forwarder"
            android:permission="android.permission.BIND_NOTIFICATION_LISTENER_SERVICE"
            android:exported="true">
            <intent-filter>
                <action android:name="android.service.notification.NotificationListenerService" />
            </intent-filter>
        </service>

    </application>
</manifest>
`;
}

export function getBuildGradleKts(): string {
  return `plugins {
    alias(libs.plugins.android.application)
    alias(libs.plugins.kotlin.android)
}

android {
    namespace = "com.example.catlock"
    compileSdk = 34

    defaultConfig {
        applicationId = "com.example.catlock"
        minSdk = 26
        targetSdk = 34
        versionCode = 1
        versionName = "1.0"

        testInstrumentationRunner = "androidx.test.runner.AndroidJUnitRunner"
    }

    buildTypes {
        release {
            isMinifyEnabled = false
            proguardFiles(
                getDefaultProguardFile("proguard-android-optimize.txt"),
                "proguard-rules.pro"
            )
        }
    }
    compileOptions {
        sourceCompatibility = JavaVersion.VERSION_1_8
        targetCompatibility = JavaVersion.VERSION_1_8
    }
    kotlinOptions {
        jvmTarget = "1.8"
    }
}

dependencies {
    implementation("androidx.core:core-ktx:1.12.0")
    implementation("androidx.appcompat:appcompat:1.6.1")
    implementation("com.google.android.material:material:1.11.0")
    implementation("androidx.constraintlayout:constraintlayout:2.1.4")
}
`;
}

export function getNotificationToWhatsAppServiceKotlin(): string {
  return `package com.example.catlock

import android.app.Notification
import android.content.Intent
import android.net.Uri
import android.os.Bundle
import android.service.notification.NotificationListenerService
import android.service.notification.StatusBarNotification
import android.util.Log
import java.net.URLEncoder

/**
 * Automatically intercepts incoming notifications from any target app
 * and forwards them to WhatsApp!
 *
 * How it works:
 * 1. User grants "Notification Access" permission in Android Settings.
 * 2. onNotificationPosted() intercepts every notification from other apps.
 * 3. Filters target package (e.g. Cat Lock alerts, Banks, Security apps).
 * 4. Dispatches the notification text to WhatsApp via Intent or Webhook.
 */
class NotificationToWhatsAppService : NotificationListenerService() {

    companion object {
        private const val TAG = "NotifForwarder"
        // Target phone number with country code (e.g., "15551234567")
        private const val TARGET_WHATSAPP_NUMBER = "15551234567"
        // Target apps to monitor (leave empty to monitor all, or specify package names)
        private val MONITORED_PACKAGES = setOf(
            "com.example.catlock",       // This Cat Lock App intruder alerts
            "com.google.android.gm",     // Gmail
            "org.telegram.messenger"    // Telegram
        )
    }

    override fun onNotificationPosted(sbn: StatusBarNotification?) {
        super.onNotificationPosted(sbn)
        if (sbn == null) return

        val packageName = sbn.packageName
        // Prevent infinite loops if WhatsApp itself notifies
        if (packageName == "com.whatsapp" || packageName == "com.whatsapp.w4b") {
            return
        }

        // Check if package is monitored
        if (MONITORED_PACKAGES.isNotEmpty() && !MONITORED_PACKAGES.contains(packageName)) {
            return
        }

        val extras: Bundle = sbn.notification.extras
        val title = extras.getString(Notification.EXTRA_TITLE) ?: "Alert"
        val text = extras.getCharSequence(Notification.EXTRA_TEXT)?.toString() ?: ""

        if (text.isEmpty()) return

        Log.d(TAG, "Intercepted notification from $packageName: $title - $text")

        val alertMessage = "🚨 *Notification Forwarded*\\n" +
                "📱 *App:* $packageName\\n" +
                "👤 *Title:* $title\\n" +
                "💬 *Message:* $text"

        forwardToWhatsAppViaApiOrIntent(alertMessage)
    }

    private fun forwardToWhatsAppViaApiOrIntent(messageText: String) {
        // Method A: Direct WhatsApp Chat Intent (opens WhatsApp chat with prefilled text)
        try {
            val url = "https://api.whatsapp.com/send?phone=$TARGET_WHATSAPP_NUMBER&text=" +
                    URLEncoder.encode(messageText, "UTF-8")
            val intent = Intent(Intent.ACTION_VIEW).apply {
                data = Uri.parse(url)
                setPackage("com.whatsapp")
                flags = Intent.FLAG_ACTIVITY_NEW_TASK
            }
            startActivity(intent)
        } catch (e: Exception) {
            Log.e(TAG, "Failed to launch WhatsApp Intent: \${e.message}")
        }

        // Method B: Silent Background Dispatch via Meta Cloud API / Twilio Webhook
        // You can make an HTTP POST request in the background to send WhatsApp messages
        // without waking the screen or opening the WhatsApp UI!
    }
}
`;
}

export function getProjectReadme(pin: string): string {
  return `# Android Cat Lock App - Setup & Build Guide

## Overview
This is a native Android project written in Kotlin.
- **PIN Lock:** Default is \`${pin}\`
- **Intruder Trigger:** Wrong PIN triggers a full-screen Cat alert, MediaPlayer alarm siren, and device vibration.
- **Notification Forwarder:** Includes \`NotificationToWhatsAppService\` to automatically forward alerts to WhatsApp!

---

## Quick Start Steps:
1. Open **Android Studio**.
2. Click **Open** and select this unzipped project folder.
3. Wait for Gradle sync to complete.
4. Prepare your assets:
   - Place your cat picture in \`app/src/main/res/drawable/cat.png\`
   - Place your alarm sound in \`app/src/main/res/raw/alarm.mp3\`
5. Connect your Android phone via USB (with USB Debugging enabled) or start an Emulator.
6. Click **Run** (\`Shift + F10\`) or select **Build > Build Bundle(s) / APK(s) > Build APK(s)**.
7. Install the generated APK on your Android phone!

---

## Enabling WhatsApp Notification Forwarder:
1. On your Android phone, go to:
   \`Settings > Apps & Notifications > Special App Access > Notification Access\`
2. Toggle ON **Cat Lock Notification Forwarder**.
3. Now any monitored notification will automatically dispatch alerts to WhatsApp!
`;
}

/**
 * Bundles all Android project files into a single zip download!
 */
export async function downloadAndroidProjectZip(config: AndroidProjectCode) {
  const zip = new JSZip();

  // Root files
  zip.file("README.md", getProjectReadme(config.pin));
  zip.file("build.gradle.kts", `// Top-level build file
plugins {
    alias(libs.plugins.android.application) apply false
    alias(libs.plugins.kotlin.android) apply false
}
`);
  zip.file("settings.gradle.kts", `pluginManagement {
    repositories {
        google()
        mavenCentral()
        gradlePluginPortal()
    }
}
dependencyResolutionManagement {
    repositoriesMode.set(RepositoriesMode.FAIL_ON_PROJECT_REPOS)
    repositories {
        google()
        mavenCentral()
    }
}
rootProject.name = "CatLockApp"
include(":app")
`);

  // App module
  const appFolder = zip.folder("app")!;
  appFolder.file("build.gradle.kts", getBuildGradleKts());

  // Source folder
  const javaFolder = appFolder.folder("src/main/java/com/example/catlock")!;
  javaFolder.file("MainActivity.kt", getMainActivityKotlin(config));
  javaFolder.file("NotificationToWhatsAppService.kt", getNotificationToWhatsAppServiceKotlin());

  // Res folder
  const resFolder = appFolder.folder("src/main/res")!;
  const layoutFolder = resFolder.folder("layout")!;
  layoutFolder.file("activity_main.xml", getActivityMainXml());

  const valuesFolder = resFolder.folder("values")!;
  valuesFolder.file("strings.xml", `<?xml version="1.0" encoding="utf-8"?>
<resources>
    <string name="app_name">Cat Lock</string>
</resources>
`);
  valuesFolder.file("colors.xml", `<?xml version="1.0" encoding="utf-8"?>
<resources>
    <color name="primary">#F59E0B</color>
    <color name="danger">#DC2626</color>
    <color name="background">#0F172A</color>
</resources>
`);

  // Manifest
  appFolder.file("src/main/AndroidManifest.xml", getAndroidManifestXml());

  // Raw folder info
  const rawFolder = resFolder.folder("raw")!;
  rawFolder.file("PLACE_ALARM_MP3_HERE.txt", "Add your alarm.mp3 sound file in this folder.");

  const drawableFolder = resFolder.folder("drawable")!;
  drawableFolder.file("PLACE_CAT_PNG_HERE.txt", "Add your cat.png image file in this folder.");

  const blob = await zip.generateAsync({ type: "blob" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `Android_Cat_Lock_Project_PIN_${config.pin}.zip`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
