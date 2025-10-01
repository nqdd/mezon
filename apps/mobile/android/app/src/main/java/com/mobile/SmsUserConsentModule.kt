package com.mezon.mobile

import android.app.Activity
import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent
import android.content.IntentFilter
import android.util.Log
import com.facebook.react.bridge.*
import com.facebook.react.modules.core.DeviceEventManagerModule
import com.google.android.gms.auth.api.phone.SmsRetriever
import com.google.android.gms.auth.api.phone.SmsRetrieverClient
import com.google.android.gms.common.api.CommonStatusCodes
import com.google.android.gms.common.api.Status

class SmsUserConsentModule(reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {

    private val smsRetrieverClient: SmsRetrieverClient = SmsRetriever.getClient(reactContext)
    private var smsReceiver: BroadcastReceiver? = null
    private val TAG = "SmsUserConsentModule"
    companion object {
        private const val SMS_CONSENT_REQUEST = 2
    }

    override fun getName(): String = "SmsUserConsent"

    @ReactMethod
    fun startSmsUserConsent(phoneNumber: String?, promise: Promise) {
        if (smsReceiver != null) cleanupReceiver() 

        try {
            val normalized = phoneNumber?.takeIf { it.isNotBlank() }
            val task = smsRetrieverClient.startSmsUserConsent(normalized)

            task.addOnSuccessListener {
                registerSmsReceiver()
                promise.resolve(true) 
            }.addOnFailureListener { exception ->
                promise.reject("SMS_ERROR", exception.message, exception)
            }
        } catch (e: Exception) {
            promise.reject("SMS_ERROR", e.message, e)
        }
    }

    @ReactMethod
    fun stopSmsUserConsent() {
        cleanupReceiver()
    }

    @ReactMethod
    fun extractOtpFromMessage(message: String, otpLength: Int, promise: Promise) {
        try {
            val otp = "\\d{$otpLength}".toRegex().find(message)?.value
            if (otp != null) {
                promise.resolve(otp)
            } else {
                promise.reject("OTP_NOT_FOUND", "OTP not found")
            }
        } catch (e: Exception) {
            promise.reject("OTP_ERROR", e.message, e)
        }
    }

    private fun registerSmsReceiver() {
        smsReceiver = object : BroadcastReceiver() {
            override fun onReceive(context: Context, intent: Intent) {
                if (SmsRetriever.SMS_RETRIEVED_ACTION == intent.action) {
                    val extras = intent.extras
                    val smsRetrieverStatus = extras?.get(SmsRetriever.EXTRA_STATUS) as Status

                    when (smsRetrieverStatus.statusCode) {
                        CommonStatusCodes.SUCCESS -> {
                            val consentIntent = extras.getParcelable<Intent>(SmsRetriever.EXTRA_CONSENT_INTENT)
                            try {
                                currentActivity?.startActivityForResult(consentIntent, SMS_CONSENT_REQUEST)
                            } catch (e: Exception) {
                                sendError("SMS_CONSENT_ERROR", e.message ?: "Consent start error")
                            }
                        }
                        CommonStatusCodes.TIMEOUT -> {
                            sendError("SMS_TIMEOUT", "SMS timeout")
                            cleanupReceiver()
                        }
                        else -> {
                            sendError("SMS_ERROR", "SMS error: ${smsRetrieverStatus.statusCode}")
                            cleanupReceiver()
                        }
                    }
                }
            }
        }
        val intentFilter = IntentFilter(SmsRetriever.SMS_RETRIEVED_ACTION)
        reactApplicationContext.registerReceiver(smsReceiver, intentFilter)
    }

    private val activityEventListener = object : BaseActivityEventListener() {
        override fun onActivityResult(activity: Activity?, requestCode: Int, resultCode: Int, intent: Intent?) {
            if (requestCode == SMS_CONSENT_REQUEST) {
                if (resultCode == Activity.RESULT_OK && intent != null) {
                    val message = intent.getStringExtra(SmsRetriever.EXTRA_SMS_MESSAGE)
                    if (message != null) {
                        val params = Arguments.createMap()
                        params.putString("message", message)
                        sendEvent("onSmsReceived", params)
                    } else {
                        sendError("SMS_MESSAGE_NULL", "SMS message is null")
                    }
                } else {
                    sendError("SMS_CONSENT_DENIED", "User denied SMS consent")
                }
                cleanupReceiver()
            }
        }
    }

    private fun sendEvent(eventName: String, params: WritableMap?) {
        if (!reactApplicationContext.hasActiveCatalystInstance()) return

        try {
            reactApplicationContext
                .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter::class.java)
                .emit(eventName, params)
        } catch (e: Exception) {
            Log.e(TAG, "Error sending event '$eventName': $e")
        }
    }
    
    private fun sendError(code: String, message: String) {
        val params = Arguments.createMap().apply {
            putString("code", code)
            putString("message", message)
        }
        sendEvent("onSmsError", params)
    }

    private fun cleanupReceiver() {
        smsReceiver?.let {
            try {
                reactApplicationContext.unregisterReceiver(it)
            } catch (e: Exception) {
                Log.e(TAG, "Error unregistering SMS receiver: ${e.message}")
            }
            smsReceiver = null
        }
    }

    override fun initialize() {
        super.initialize()
        reactApplicationContext.addActivityEventListener(activityEventListener)
    }

    override fun onCatalystInstanceDestroy() {
        super.onCatalystInstanceDestroy()
        reactApplicationContext.removeActivityEventListener(activityEventListener)
        cleanupReceiver()
    }
}