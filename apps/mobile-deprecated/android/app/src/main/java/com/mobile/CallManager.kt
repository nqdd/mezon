package com.mezon.mobile

import android.content.ComponentName
import android.content.Context
import android.net.Uri
import android.os.Build
import android.os.Bundle
import android.telecom.PhoneAccount
import android.telecom.PhoneAccountHandle
import android.telecom.TelecomManager
import android.util.Log
import androidx.annotation.RequiresApi

class CallManager(private val context: Context) {

    companion object {
        private const val TAG = "CallManager"
        private const val PHONE_ACCOUNT_ID = "MezonCallAccount"
        private const val PHONE_ACCOUNT_LABEL = "Mezon"

        @Volatile
        private var instance: CallManager? = null

        fun getInstance(context: Context): CallManager {
            return instance ?: synchronized(this) {
                instance ?: CallManager(context.applicationContext).also { instance = it }
            }
        }
    }

    private val telecomManager: TelecomManager? =
        context.getSystemService(Context.TELECOM_SERVICE) as? TelecomManager

    private val phoneAccountHandle: PhoneAccountHandle by lazy {
        PhoneAccountHandle(
            ComponentName(context, MezonConnectionService::class.java),
            PHONE_ACCOUNT_ID
        )
    }

    init {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
            registerPhoneAccount()
        }
    }

    @RequiresApi(Build.VERSION_CODES.M)
    private fun registerPhoneAccount() {
        try {
            val capabilities = if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
                PhoneAccount.CAPABILITY_SELF_MANAGED
            } else {
                PhoneAccount.CAPABILITY_CALL_PROVIDER
            }

            val phoneAccount = PhoneAccount.builder(phoneAccountHandle, PHONE_ACCOUNT_LABEL)
                .setCapabilities(capabilities)
                .build()

            telecomManager?.registerPhoneAccount(phoneAccount)
            Log.d(TAG, "Phone account registered successfully with capabilities: $capabilities")
        } catch (e: Exception) {
            Log.e(TAG, "Failed to register phone account: ${e.message}", e)
        }
    }

    @RequiresApi(Build.VERSION_CODES.M)
    fun showIncomingCall(callerName: String, callerId: String): Boolean {
        if (telecomManager == null) {
            Log.e(TAG, "TelecomManager is null")
            return false
        }

        try {
            val extras = Bundle().apply {
                putString("caller_name", callerName)
                putString("caller_id", callerId)
                if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
                    putBoolean(TelecomManager.EXTRA_INCOMING_CALL_EXTRAS, true)
                }
            }

            telecomManager?.addNewIncomingCall(phoneAccountHandle, extras)
            Log.d(TAG, "Incoming call added for: $callerName")
            return true
        } catch (e: SecurityException) {
            Log.e(TAG, "SecurityException: ${e.message}", e)
            Log.e(TAG, "Make sure the app has MANAGE_OWN_CALLS permission and the account is enabled")
            return false
        } catch (e: Exception) {
            Log.e(TAG, "Failed to show incoming call: ${e.message}", e)
            return false
        }
    }

    @RequiresApi(Build.VERSION_CODES.M)
    fun endCall() {
        try {
            // The connection will handle the disconnection
            Log.d(TAG, "Ending call")
        } catch (e: Exception) {
            Log.e(TAG, "Failed to end call: ${e.message}")
        }
    }
}
