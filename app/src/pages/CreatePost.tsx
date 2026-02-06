import {
    IonButton,
    IonContent,
    IonInput,
    IonItem,
    IonLabel,
    IonPage,
    IonTextarea,
} from '@ionic/react';
import Header from '../components/Header/Header';

const CreatePost: React.FC = () => {
    return (
        <IonPage>
            <Header title="إنشاء منشور" />
            <IonContent className="ion-padding">
                <IonItem>
                    <IonLabel position="stacked">العنوان</IonLabel>
                    <IonInput placeholder="عنوان المنشور" />
                </IonItem>
                <IonItem>
                    <IonLabel position="stacked">المحتوى</IonLabel>
                    <IonTextarea placeholder="نص المنشور" autoGrow />
                </IonItem>
                <IonButton expand="block" className="ion-margin-top">
                    حفظ (مؤقت)
                </IonButton>
            </IonContent>
        </IonPage>
    );
};

export default CreatePost;
