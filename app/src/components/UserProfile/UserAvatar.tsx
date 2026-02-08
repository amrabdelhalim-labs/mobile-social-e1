import { useContext, useEffect } from 'react';
import {
    IonAvatar,
    IonImg,
    IonIcon,
    IonSpinner,
} from '@ionic/react';
import { cameraOutline } from 'ionicons/icons';
import { useState } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { PROFILE_UPDATE_IMAGE_URL } from '../../config/urls';
import api from '../../config/axios';
import { usePhotoGallery } from '../../hooks/usePhotoGallery';
import './UserAvatar.css';

const UserAvatar: React.FC = () => {
    const { user, getProfileImageUrl, fetchProfile } = useContext(AuthContext);
    const { takePhoto, blobUrl, clearPhoto } = usePhotoGallery();
    const [uploading, setUploading] = useState(false);

    /**
     * عند التقاط/اختيار صورة جديدة:
     * 1. تحويل blob URL لـ Blob فعلي
     * 2. رفعه للسيرفر كـ FormData (field: profileImage)
     * 3. تحديث بيانات المستخدم في AuthContext
     */
    useEffect(() => {
        if (!blobUrl) return;

        const uploadPhoto = async () => {
            setUploading(true);
            try {
                // تحويل blob URL إلى Blob حقيقي
                const response = await fetch(blobUrl);
                const blob = await response.blob();

                // إعداد FormData بـ field name مطابق للسيرفر: 'profileImage'
                const formData = new FormData();
                formData.append('profileImage', blob, 'profile.jpg');

                // رفع الصورة — axios interceptor سيضيف Authorization تلقائيًا
                await api.put(PROFILE_UPDATE_IMAGE_URL, formData, {
                    headers: { 'Content-Type': 'multipart/form-data' },
                });

                // تحديث بيانات المستخدم (يتضمن ImageUrl الجديد)
                await fetchProfile();
            } catch (error) {
                console.error('فشل رفع الصورة:', error);
            } finally {
                setUploading(false);
                clearPhoto();
            }
        };

        uploadPhoto();
    }, [blobUrl]); // eslint-disable-line react-hooks/exhaustive-deps

    // بناء رابط الصورة الحالي (من السيرفر أو الافتراضي)
    const imageUrl = getProfileImageUrl(user?.ImageUrl);

    return (
        <div className="user-avatar-container">
            <IonAvatar className="user-avatar" onClick={takePhoto}>
                {imageUrl ? (
                    <IonImg src={imageUrl} alt="صورة المستخدم" />
                ) : (
                    <div className="user-avatar-placeholder" />
                )}
            </IonAvatar>

            {/* أيقونة الكاميرا أو مؤشر التحميل */}
            <div className="user-avatar-badge" onClick={takePhoto}>
                {uploading ? (
                    <IonSpinner name="crescent" className="user-avatar-spinner" />
                ) : (
                    <IonIcon icon={cameraOutline} className="user-avatar-icon" />
                )}
            </div>
        </div>
    );
};

export default UserAvatar;
