// src/lib/cloudinary.ts

export interface CloudinaryResponse {
  secure_url: string;
  public_id: string;
  format: string;
  width: number;
  height: number;
  bytes: number;
}

export const uploadToCloudinary = async (file: File): Promise<CloudinaryResponse> => {
  const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
  const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

  if (!cloudName || !uploadPreset) {
    throw new Error("Cloudinary credentials are missing in .env file");
  }

  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", uploadPreset);
  // Optional: Organize into a specific folder
  formData.append("folder", "lucknow_ascent_uploads"); 

  try {
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
      {
        method: "POST",
        body: formData,
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || "Upload failed");
    }

    const data = await response.json();
    return data as CloudinaryResponse;
  } catch (error) {
    console.error("Cloudinary upload error:", error);
    throw error;
  }
};

/**
 * Generates an optimized URL for a specific width/height
 * This allows you to store one high-res image and serve resized versions
 */
export const getOptimizedUrl = (url: string, width: number = 800) => {
  if (!url || !url.includes("cloudinary.com")) return url;
  
  // Insert transformation parameters before "upload/"
  const parts = url.split("/upload/");
  return `${parts[0]}/upload/w_${width},f_auto,q_auto/${parts[1]}`;
};
/**
 * Deletes an image from Cloudinary using the public_id
 * Note: This requires a server-side implementation with API credentials
 */
export const deleteFromCloudinary = async (publicId: string): Promise<boolean> => {
  const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
  
  if (!cloudName || !publicId) {
    console.error("Missing cloudName or publicId for deletion");
    return false;
  }

  try {
    // Note: Cloudinary's delete API requires authentication with API secret
    // This is a placeholder - in production, implement a backend endpoint
    console.warn(`Image deletion requested for public_id: ${publicId}`);
    console.warn("Cloudinary deletion requires server-side implementation");
    
    // TODO: Call your backend endpoint to delete the image by publicId.
    
    return true; // Temporary - assumes deletion succeeded
  } catch (error) {
    console.error("Error deleting from Cloudinary:", error);
    return false;
  }
};

