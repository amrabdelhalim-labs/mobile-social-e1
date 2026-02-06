import {
  IonAvatar,
  IonContent,
  IonItem,
  IonLabel,
  IonList,
  IonPage,
  IonText,
} from '@ionic/react';
import Header from '../components/Header/Header';

const Profile: React.FC = () => {
  return (
    <IonPage>
      <Header title="الملف الشخصي" />
      <IonContent className="ion-padding">
        <IonText>
          <p>عرض مؤقت لبيانات المستخدم.</p>
        </IonText>
        <IonItem lines="none">
          <IonAvatar slot="start">
            <img alt="User avatar" src="https://i.pravatar.cc/100?img=12" />
          </IonAvatar>
          <IonLabel>
            <h2>مستخدم تجريبي</h2>
            <p>user@example.com</p>
          </IonLabel>
        </IonItem>
        <IonList inset>
          <IonItem>
            <IonLabel>عدد المنشورات</IonLabel>
            <IonLabel slot="end">3</IonLabel>
          </IonItem>
          <IonItem>
            <IonLabel>الإعجابات</IonLabel>
            <IonLabel slot="end">12</IonLabel>
          </IonItem>
        </IonList>
      </IonContent>
    </IonPage>
  );
};

export default Profile;
