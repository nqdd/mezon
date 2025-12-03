package com.mezon.mobile

import android.os.Build
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import android.util.Log

class CallConnectionModule(reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {

    companion object {
        private const val TAG = "CallConnectionModule"
    }

    override fun getName(): String {
        return "CallConnectionModule"
    }

    @ReactMethod
    fun answerCall() {
        Log.d(TAG, "answerCall called from React Native")
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
            val connection = MezonConnection.getActiveConnection()
            if (connection != null) {
                connection.answerCall()
                Log.d(TAG, "Call answered successfully")
            } else {
                Log.w(TAG, "No active connection to answer")
            }
        }
    }

    @ReactMethod
    fun rejectCall() {
        Log.d(TAG, "rejectCall called from React Native")
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
            val connection = MezonConnection.getActiveConnection()
            if (connection != null) {
                connection.rejectCall()
                Log.d(TAG, "Call rejected successfully")
            } else {
                Log.w(TAG, "No active connection to reject")
            }
        }
    }

    @ReactMethod
    fun endCall() {
        Log.d(TAG, "endCall called from React Native")
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
            val connection = MezonConnection.getActiveConnection()
            if (connection != null) {
                connection.onDisconnect()
                Log.d(TAG, "Call ended successfully")
            } else {
                Log.w(TAG, "No active connection to end")
            }
        }
    }

    @ReactMethod
    fun hasActiveConnection(callback: com.facebook.react.bridge.Callback) {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
            val hasConnection = MezonConnection.getActiveConnection() != null
            callback.invoke(hasConnection)
        } else {
            callback.invoke(false)
        }
    }
}
