package com.mezon.mobile

import android.content.Context
import android.content.Intent
import android.os.Build
import android.telecom.Connection
import android.telecom.DisconnectCause
import android.util.Log
import androidx.annotation.RequiresApi

@RequiresApi(Build.VERSION_CODES.M)
class MezonConnection(private val context: Context) : Connection() {

    companion object {
        private const val TAG = "MezonConnection"

        // Keep a reference to the current active connection
        @Volatile
        private var activeConnection: MezonConnection? = null

        fun getActiveConnection(): MezonConnection? = activeConnection

        fun clearActiveConnection() {
            Log.d(TAG, "Clearing active connection reference")
            activeConnection = null
        }
    }

    private var isCallUiShown = false

    init {
        Log.d(TAG, "MezonConnection initialized")

        // Store reference to this connection
        activeConnection = this

        // For self-managed calls, we need to show the UI immediately
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            showCallUi()
        }
    }

    private fun showCallUi() {
        if (isCallUiShown) {
            Log.d(TAG, "Call UI already shown, skipping")
            return
        }

        Log.d(TAG, "Showing call UI")
        isCallUiShown = true

        val intent = Intent(context, CallActivity::class.java).apply {
            addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
            addFlags(Intent.FLAG_ACTIVITY_SINGLE_TOP)
            addFlags(Intent.FLAG_ACTIVITY_CLEAR_TOP)
            putExtra("is_incoming_call", true)
        }

        try {
            context.startActivity(intent)
            Log.d(TAG, "CallActivity launched successfully")
        } catch (e: Exception) {
            Log.e(TAG, "Failed to launch CallActivity: ${e.message}", e)
        }
    }

    override fun onShowIncomingCallUi() {
        Log.d(TAG, "onShowIncomingCallUi - System requested to show incoming call UI")

        // This is called by the system when it wants us to display the incoming call
        // For self-managed calls, this should be called automatically
        showCallUi()
    }

    override fun onAnswer() {
        Log.d(TAG, "onAnswer - Call answered")

        // Update call state
        CallStateModule.setIsInCallFromNative(true)

        // Set the connection to active state
        setActive()

        // Ensure the UI is shown
        showCallUi()
    }

    // Method to be called from React Native when user answers the call
    fun answerCall() {
        Log.d(TAG, "answerCall - Called from React Native")
        onAnswer()
    }

    // Method to be called from React Native when user rejects the call
    fun rejectCall() {
        Log.d(TAG, "rejectCall - Called from React Native")
        onReject()
    }

    override fun onReject() {
        Log.d(TAG, "onReject - Call rejected")

        // Update call state
        CallStateModule.setIsInCallFromNative(false)

        // Clear the connection reference
        clearActiveConnection()

        // Set the connection to disconnected with reject cause
        setDisconnected(DisconnectCause(DisconnectCause.REJECTED))
        destroy()
    }

    override fun onDisconnect() {
        Log.d(TAG, "onDisconnect - Call disconnected")

        // Update call state
        CallStateModule.setIsInCallFromNative(false)

        // Clear the connection reference
        clearActiveConnection()

        // Set the connection to disconnected
        setDisconnected(DisconnectCause(DisconnectCause.LOCAL))
        destroy()
    }

    override fun onAbort() {
        Log.d(TAG, "onAbort - Call aborted")

        // Update call state
        CallStateModule.setIsInCallFromNative(false)

        // Clear the connection reference
        clearActiveConnection()

        setDisconnected(DisconnectCause(DisconnectCause.CANCELED))
        destroy()
    }

    override fun onHold() {
        Log.d(TAG, "onHold - Call on hold")
        setOnHold()
    }

    override fun onUnhold() {
        Log.d(TAG, "onUnhold - Call unhold")
        setActive()
    }

    override fun onStateChanged(state: Int) {
        Log.d(TAG, "onStateChanged: $state")
        super.onStateChanged(state)
    }
}
