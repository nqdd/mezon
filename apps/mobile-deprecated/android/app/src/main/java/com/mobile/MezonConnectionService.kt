package com.mezon.mobile

import android.net.Uri
import android.os.Build
import android.telecom.Connection
import android.telecom.ConnectionRequest
import android.telecom.ConnectionService
import android.telecom.PhoneAccountHandle
import android.telecom.TelecomManager
import android.util.Log
import androidx.annotation.RequiresApi

@RequiresApi(Build.VERSION_CODES.M)
class MezonConnectionService : ConnectionService() {

    companion object {
        private const val TAG = "MezonConnectionService"
    }

    override fun onCreateIncomingConnection(
        connectionManagerPhoneAccount: PhoneAccountHandle?,
        request: ConnectionRequest?
    ): Connection {
        val connection = MezonConnection(applicationContext)

        request?.extras?.let { extras ->
            val callerName = extras.getString("caller_name", "Unknown")
            val callerId = extras.getString("caller_id", "")
            connection.setCallerDisplayName(callerName, TelecomManager.PRESENTATION_ALLOWED)
            connection.setAddress(Uri.parse("tel:$callerId"), TelecomManager.PRESENTATION_ALLOWED)
        }

        // For Android O+ (self-managed), we need different capabilities
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            connection.setConnectionProperties(Connection.PROPERTY_SELF_MANAGED)
            connection.setConnectionCapabilities(
                Connection.CAPABILITY_SUPPORT_HOLD or
                Connection.CAPABILITY_HOLD or
                Connection.CAPABILITY_MUTE or
                Connection.CAPABILITY_SUPPORTS_VT_LOCAL_BIDIRECTIONAL or
                Connection.CAPABILITY_SUPPORTS_VT_REMOTE_BIDIRECTIONAL
            )
        } else {
            connection.setConnectionCapabilities(
                Connection.CAPABILITY_SUPPORT_HOLD or
                Connection.CAPABILITY_HOLD or
                Connection.CAPABILITY_MUTE
            )
        }

        connection.setAudioModeIsVoip(true)
        connection.setRinging()
        return connection
    }

    override fun onCreateOutgoingConnection(
        connectionManagerPhoneAccount: PhoneAccountHandle?,
        request: ConnectionRequest?
    ): Connection? {
        Log.d(TAG, "onCreateOutgoingConnection - not implemented")
        return null
    }
}
