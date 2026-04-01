package com.mezon.mobile;

import android.app.PendingIntent
import android.content.Context
import android.content.Intent
import android.media.AudioAttributes
import android.net.Uri
import android.os.Build
import android.util.Log
import com.google.firebase.messaging.RemoteMessage
import io.invertase.firebase.messaging.ReactNativeFirebaseMessagingService
import org.json.JSONObject
import android.graphics.Color
import androidx.core.graphics.drawable.IconCompat
import android.widget.RemoteViews
import android.app.Notification
import android.view.View
import org.json.JSONArray
import android.app.ActivityManager
import android.content.BroadcastReceiver
import android.content.IntentFilter

class CustomFirebaseMessagingService : ReactNativeFirebaseMessagingService() {

    companion object {
        private const val TAG = "CustomFCMService"
        private const val PREF_NAME = "NotificationPrefs"
        private const val CHANNEL_ID = "calling_channel"
    }

    override fun onMessageReceived(remoteMessage: RemoteMessage) {
        super.onMessageReceived(remoteMessage)
        val data = remoteMessage.data
       if (data.isNotEmpty()) {
            val activityManager = applicationContext.getSystemService(Context.ACTIVITY_SERVICE) as ActivityManager
            var appInForeground = false
            val runningProcs = activityManager.runningAppProcesses ?: emptyList<ActivityManager.RunningAppProcessInfo>()
            for (proc in runningProcs) {
                if (proc.processName == applicationContext.packageName && proc.importance == ActivityManager.RunningAppProcessInfo.IMPORTANCE_FOREGROUND) {
                    appInForeground = true
                    break
                }
            }
            if (appInForeground) {
                Log.d(TAG, "App is in foreground, ignoring incoming notification")
                return
            }

            val offer = data["offer"]
            if (offer != null) {
                val jsonObject = JSONObject(offer)
                val offerType = jsonObject.getString("offer")
                if (offerType == "CANCEL_CALL") {
                    cancelCallNotification()
                } else {
                    handleIncomingCall(data)
                    saveNotificationData(data)
                }
            } else {
                saveMessagesNotificationData(data)
            }
        }
    }

    private fun handleIncomingCall(data: Map<String, String>) {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
            try {
                val offerString = data["offer"] ?: ""
                val offerJson = JSONObject(offerString)
                val callerName = offerJson.optString("callerName", "Unknown Caller")
                val callerId = offerJson.optString("callerId", "")

                val callManager = CallManager.getInstance(applicationContext)
                val success = callManager.showIncomingCall(callerName, callerId)

                if (success) {
                    Log.d(TAG, "Successfully displayed incoming call")
                } else {
                    Log.e(TAG, "Failed to display incoming call, falling back to notification")
                }
            } catch (e: Exception) {
                Log.e(TAG, "Error handling incoming call: ${e.message}", e)
            }
        } else {
            Log.d(TAG, "ConnectionService not supported on this Android version")
        }
    }


    private fun saveNotificationData(data: Map<String, String>) {
        try {
            val sharedPreferences = applicationContext.getSharedPreferences(PREF_NAME, Context.MODE_PRIVATE)
            val editor = sharedPreferences.edit()
            editor.putString("notificationDataCalling", JSONObject(data).toString())
            editor.apply()
        } catch (e: Exception) {
            Log.e(TAG, "Error saving notification data: ${e.message}")
        }
    }

    private fun saveMessagesNotificationData(data: Map<String, String>) {
        try {
            val sharedPreferences = applicationContext.getSharedPreferences(PREF_NAME, Context.MODE_PRIVATE)
            val editor = sharedPreferences.edit()
            val existingData = sharedPreferences.getString("notificationDataPushed", "[]")
            val dataArray = JSONArray(existingData)
            dataArray.put(JSONObject(data))
            editor.putString("notificationDataPushed", dataArray.toString())
            editor.apply()
        } catch (e: Exception) {
            Log.e(TAG, "Error saving notification data: ${e.message}")
        }
    }

    private fun removeNotificationData() {
        try {
            val sharedPreferences = applicationContext.getSharedPreferences(PREF_NAME, Context.MODE_PRIVATE)
            val editor = sharedPreferences.edit()
            editor.remove("notificationDataCalling")
            editor.apply()
        } catch (e: Exception) {
            Log.e(TAG, "Error removing notification data: ${e.message}")
        }
    }

    private fun cancelCallNotification() {
        val isInCall = CallStateModule.getIsInCall()
        if (isInCall) {
            Log.d(TAG, "User is in call, skipping cancelCallNotification")
            return // Do nothing if user is currently in a call
        }
        removeNotificationData()
    }
}
