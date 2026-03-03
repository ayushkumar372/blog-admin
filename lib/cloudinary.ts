const CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
const UPLOAD_PRESET = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

export function openCloudinaryWidget(onSuccess: (url: string) => void) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const cloudinary = (window as any).cloudinary;
  if (!cloudinary) {
    alert("Cloudinary widget not loaded yet. Please try again.");
    return;
  }

  cloudinary.openUploadWidget(
    {
      cloudName: CLOUD_NAME,
      uploadPreset: UPLOAD_PRESET,
      sources: ["local", "url", "camera"],
      multiple: false,
      maxFileSize: 10_000_000, // 10MB
      folder: "blog",
      clientAllowedFormats: ["jpg", "jpeg", "png", "webp", "gif"],
      showAdvancedOptions: false,
      cropping: false,
      theme: "minimal",
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (error: any, result: any) => {
      if (!error && result?.event === "success") {
        onSuccess(result.info.secure_url);
      }
    }
  );
}
