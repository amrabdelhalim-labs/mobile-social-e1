import {
    IonContent,
    IonPage,
    IonCard,
    IonCardContent,
    IonCardHeader,
    IonCardSubtitle,
    IonCardTitle,
    IonAvatar,
    IonImg,
    IonText,
    IonGrid,
    IonRow,
    IonCol,
    IonRefresher,
    IonRefresherContent,
} from '@ionic/react';
import Header from '../components/Header/Header';
import './AllPosts.css';

const AllPosts: React.FC = () => {
    const handleRefresh = (event: CustomEvent) => {
        setTimeout(() => {
            // TODO: Fetch posts from API
            event.detail.complete();
        }, 1000);
    };

    return (
        <IonPage>
            <Header title="المنشورات" showBackButton={false} />
            <IonContent className="ion-padding">
                <IonRefresher slot="fixed" onIonRefresh={handleRefresh}>
                    <IonRefresherContent />
                </IonRefresher>

                <IonGrid>
                    <IonRow>
                        <IonCol size="12" sizeMd="6">
                            <IonCard routerLink="/tabs/posts/1">
                                <IonImg
                                    src="https://picsum.photos/400/300?random=1"
                                    alt="منشور تجريبي"
                                />
                                <IonCardHeader>
                                    <div className="post-author">
                                        <IonAvatar>
                                            <IonImg src="https://i.pravatar.cc/100?img=1" />
                                        </IonAvatar>
                                        <div className="author-info">
                                            <IonText>
                                                <p className="author-name">أحمد محمد</p>
                                            </IonText>
                                            <IonText color="medium">
                                                <p className="post-time">منذ ساعتين</p>
                                            </IonText>
                                        </div>
                                    </div>
                                    <IonCardTitle>منشور تجريبي رقم 1</IonCardTitle>
                                    <IonCardSubtitle>وصف مختصر للمنشور</IonCardSubtitle>
                                </IonCardHeader>
                                <IonCardContent>
                                    هذا نص تجريبي لمحتوى المنشور. سيتم استبداله بمحتوى حقيقي من
                                    API.
                                </IonCardContent>
                            </IonCard>
                        </IonCol>

                        <IonCol size="12" sizeMd="6">
                            <IonCard routerLink="/tabs/posts/2">
                                <IonImg
                                    src="https://picsum.photos/400/300?random=2"
                                    alt="منشور تجريبي"
                                />
                                <IonCardHeader>
                                    <div className="post-author">
                                        <IonAvatar>
                                            <IonImg src="https://i.pravatar.cc/100?img=2" />
                                        </IonAvatar>
                                        <div className="author-info">
                                            <IonText>
                                                <p className="author-name">فاطمة علي</p>
                                            </IonText>
                                            <IonText color="medium">
                                                <p className="post-time">منذ 5 ساعات</p>
                                            </IonText>
                                        </div>
                                    </div>
                                    <IonCardTitle>منشور تجريبي رقم 2</IonCardTitle>
                                    <IonCardSubtitle>وصف مختصر للمنشور</IonCardSubtitle>
                                </IonCardHeader>
                                <IonCardContent>
                                    هذا نص تجريبي لمحتوى المنشور. سيتم استبداله بمحتوى حقيقي من
                                    API.
                                </IonCardContent>
                            </IonCard>
                        </IonCol>
                    </IonRow>
                </IonGrid>
            </IonContent>
        </IonPage>
    );
};

export default AllPosts;
