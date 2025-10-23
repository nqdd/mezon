package com.mezon.mobile

import android.content.ClipData
import android.content.ClipboardManager
import android.content.Context
import android.graphics.Bitmap
import android.graphics.BitmapFactory
import android.net.Uri
import android.util.Base64
import androidx.core.content.FileProvider
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.bridge.Arguments
import java.io.File
import java.io.FileOutputStream
import android.content.Intent
import android.media.MediaScannerConnection
import android.os.Build
import android.provider.MediaStore
import android.content.ContentValues
import android.os.Environment

class ImageClipboardModule(reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {

    override fun getName(): String {
        return "ImageClipboardModule"
    }

    @ReactMethod
    fun setImage(base64String: String, promise: Promise) {
        try {
            val decodedBytes = Base64.decode(base64String, Base64.DEFAULT)

            val contentUri: Uri? = if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q) {
                // Insert into MediaStore (scoped storage)
                val resolver = reactApplicationContext.contentResolver
                val values = ContentValues().apply {
                    put(MediaStore.Images.Media.DISPLAY_NAME, "clipboard_${System.currentTimeMillis()}.png")
                    put(MediaStore.Images.Media.MIME_TYPE, "image/png")
                    // optional folder inside Pictures
                    put(MediaStore.Images.Media.RELATIVE_PATH, Environment.DIRECTORY_PICTURES + "/MezonClipboard")
                    put(MediaStore.Images.Media.IS_PENDING, 1)
                }
                val uri = resolver.insert(MediaStore.Images.Media.EXTERNAL_CONTENT_URI, values)
                if (uri != null) {
                    resolver.openOutputStream(uri).use { out ->
                        out?.write(decodedBytes)
                    }
                    // mark as not pending
                    values.clear()
                    values.put(MediaStore.Images.Media.IS_PENDING, 0)
                    resolver.update(uri, values, null, null)
                }
                uri
            } else {
                // Fallback for older devices - write to public Pictures and scan
                val picturesDir = Environment.getExternalStoragePublicDirectory(Environment.DIRECTORY_PICTURES)
                val dir = java.io.File(picturesDir, "MezonClipboard")
                if (!dir.exists()) dir.mkdirs()
                val imageFile = java.io.File(dir, "clipboard_${System.currentTimeMillis()}.png")
                FileOutputStream(imageFile).use { fos ->
                    fos.write(decodedBytes)
                }
                // scan to make available in MediaStore
                MediaScannerConnection.scanFile(reactApplicationContext, arrayOf(imageFile.absolutePath), arrayOf("image/png"), null)
                Uri.fromFile(imageFile)
            }

            if (contentUri == null) {
                promise.reject("ERROR", "Failed to create media uri")
                return
            }

            // Put URI into clipboard
            val clipboard = reactApplicationContext.getSystemService(Context.CLIPBOARD_SERVICE) as ClipboardManager
            val item = ClipData.Item(contentUri)
            val mimeTypes = arrayOf("image/png")
            val clip = ClipData("Image", mimeTypes, item)

            // grant temporary read permission for the uri
            reactApplicationContext.grantUriPermission(
                reactApplicationContext.packageName,
                contentUri,
                Intent.FLAG_GRANT_READ_URI_PERMISSION
            )
            clipboard.setPrimaryClip(clip)

            promise.resolve("Success")
        } catch (e: Exception) {
            promise.reject("ERROR", e.message)
        }
    }

    @ReactMethod
    fun getImage(promise: Promise) {
        try {
            val clipboard = reactApplicationContext.getSystemService(Context.CLIPBOARD_SERVICE) as ClipboardManager

            if (clipboard.hasPrimaryClip()) {
                val clipData = clipboard.primaryClip
                if (clipData != null && clipData.itemCount > 0) {
                    val item = clipData.getItemAt(0)
                    val uri = item.uri
                    promise.resolve(uri?.toString())
                } else {
                    promise.resolve(null)
                }
            } else {
                promise.resolve(null)
            }
        } catch (e: Exception) {
            promise.reject("ERROR", e.message)
        }
    }
}