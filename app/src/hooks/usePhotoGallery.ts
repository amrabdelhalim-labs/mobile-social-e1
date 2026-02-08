import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { useState } from 'react';

/**
 * هوك مخصص للتعامل مع الكاميرا ومعرض الصور
 * يستخدم Camera API من Capacitor لالتقاط أو اختيار صورة
 * ويرجع blob URL للصورة المختارة
 */
export function usePhotoGallery() {
    const [blobUrl, setBlobUrl] = useState<string | undefined>();

    const takePhoto = async (): Promise<void> => {
        try {
            const cameraPhoto = await Camera.getPhoto({
                resultType: CameraResultType.Uri,
                source: CameraSource.Prompt,
                quality: 70,
                promptLabelHeader: 'صورة',
                promptLabelPhoto: 'من ملفات الصور',
                promptLabelPicture: 'التقط صورة',
            });
            setBlobUrl(cameraPhoto.webPath);
        } catch {
            console.log('تم إغلاق الكاميرا');
        }
    };

    /** مسح blob URL الحالي */
    const clearPhoto = () => setBlobUrl(undefined);

    return {
        takePhoto,
        blobUrl,
        clearPhoto,
    };
}
