package com.mezon.mobile
import android.app.Activity
import android.app.PictureInPictureParams
import android.content.Intent
import android.os.Build
import android.util.Rational
import com.facebook.react.bridge.*
import android.util.Log
import android.content.pm.PackageManager

class PipModule(private val reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {
    override fun getName(): String = "PipModule"
    private val TAG = "PipModule"

 @ReactMethod
 fun enterPipMode() {
     val activity: Activity? = currentActivity
     Log.w(TAG, "enterPipMode called 123")

     if (activity == null) {
         Log.w(TAG, "E_NO_ACTIVITY No active Activity to enter PiP")
         return
     }

     if (Build.VERSION.SDK_INT < Build.VERSION_CODES.O) {
         Log.w(TAG, "enterPipMode aborted: API level too low (${Build.VERSION.SDK_INT})")
         return
     }

     activity.runOnUiThread {
         try {
             val ratio = Rational(21, 12)
             val builder = PictureInPictureParams.Builder()
                 .setAspectRatio(ratio)

             if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.S) {
                 val autoEnter = true
                 builder.setAutoEnterEnabled(autoEnter)
             }
             val params = builder.build()
             activity.setPictureInPictureParams(params)

             val entered = activity.enterPictureInPictureMode(params)
             Log.d(TAG, "PiP mode enter result: $entered")
         } catch (t: Throwable) {
             Log.e(TAG, "E_ENTER_PIP: ${t.message}", t)
         }
     }
 }

    @ReactMethod
    fun exitPipMode(promise: Promise) {
        Log.w(TAG, "exitPipMode called")
        val activity = currentActivity

        if (activity == null) {
            promise.reject("E_NO_ACTIVITY", "No active Activity to exit PiP.")
            return
        }

        activity.runOnUiThread {
            try {
                if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.N && activity.isInPictureInPictureMode) {
                    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
                        val builder = PictureInPictureParams.Builder()
                            .setAutoEnterEnabled(false)
                        activity.setPictureInPictureParams(builder.build())
                    }
                }
                promise.resolve(true)
            } catch (t: Throwable) {
                promise.reject("E_EXIT_PIP", t.message, t)
            }
        }
    }
}
