import {
    IonContent,
    IonItem,
    IonLabel,
    IonList,
    IonPage,
} from '@ionic/react';
import Header from '../components/Header/Header';

const MyPosts: React.FC = () => {
    return (
        <IonPage>
            <Header title="منشوراتي" />
            <IonContent className="ion-padding">
                <IonList inset>
                    <IonItem routerLink="/tabs/posts/1">
                        <IonLabel>
                            <h2>منشور تجريبي 1</h2>
                            <p>وصف مختصر للمنشور.</p>
                        </IonLabel>
                    </IonItem>
                    <IonItem routerLink="/tabs/posts/2">
                        <IonLabel>
                            <h2>منشور تجريبي 2</h2>
                            <p>وصف مختصر للمنشور.</p>
                        </IonLabel>
                    </IonItem>
                </IonList>
            </IonContent>
        </IonPage>
    );
};

export default MyPosts;
