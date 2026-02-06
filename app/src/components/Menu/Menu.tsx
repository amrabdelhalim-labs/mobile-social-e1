import {
    IonContent,
    IonHeader,
    IonMenu,
    IonTitle,
    IonList,
    IonItem,
    IonToolbar,
    IonLabel,
    IonIcon,
    IonAvatar,
    IonImg,
    IonText,
    IonMenuToggle,
} from '@ionic/react';
import {
    personCircleOutline,
    clipboardOutline,
    logOutOutline,
} from 'ionicons/icons';
import { useState, useEffect } from 'react';
import './Menu.css';

const Menu: React.FC = () => {
    const [side, setSide] = useState<'start' | 'end'>('end');
    const [name, setName] = useState('مستخدم تجريبي');
    const [profileImg, setProfileImg] = useState('https://i.pravatar.cc/100?img=12');

    useEffect(() => {
        const mediaQuery = window.matchMedia('(max-width: 992px)');

        const handleMediaChange = (e: MediaQueryListEvent | MediaQueryList) => {
            if (e.matches) {
                setSide('end');
            } else {
                setSide('start');
            }
        };

        handleMediaChange(mediaQuery);
        mediaQuery.addEventListener('change', handleMediaChange);

        // TODO: Fetch user profile from API
        // getProfile();

        return () => {
            mediaQuery.removeEventListener('change', handleMediaChange);
        };
    }, []);

    const handleLogout = () => {
        // TODO: Implement logout logic
        console.log('Logout clicked');
        // await Storage.remove({key: 'accessToken'})
        // setLoggedIn(false)
        // history.push('/account/login')
    };

    return (
        <IonMenu side={side} contentId="menu">
            <IonHeader>
                <IonToolbar>
                    <IonTitle>القائمة</IonTitle>
                </IonToolbar>
            </IonHeader>
            <IonContent>
                <IonAvatar className="menu-avatar">
                    <IonImg src={profileImg} alt="صورة المستخدم" />
                </IonAvatar>
                <div className="ion-text-center ion-margin-top">
                    <IonText color="primary">
                        <h3>{name}</h3>
                    </IonText>
                </div>
                <IonList>
                    <IonMenuToggle autoHide={true}>
                        <IonItem routerLink="/tabs/profile" routerDirection="root" button>
                            <IonIcon color="primary" icon={personCircleOutline} slot="start" />
                            <IonLabel>الصفحة الشخصية</IonLabel>
                        </IonItem>
                    </IonMenuToggle>
                    <IonMenuToggle autoHide={true}>
                        <IonItem routerLink="/tabs/posts/me" routerDirection="root" button>
                            <IonIcon color="primary" icon={clipboardOutline} slot="start" />
                            <IonLabel>منشوراتي</IonLabel>
                        </IonItem>
                    </IonMenuToggle>
                    <IonMenuToggle autoHide={true}>
                        <IonItem onClick={handleLogout} button>
                            <IonIcon color="primary" icon={logOutOutline} slot="start" />
                            <IonLabel>تسجيل الخروج</IonLabel>
                        </IonItem>
                    </IonMenuToggle>
                </IonList>
            </IonContent>
        </IonMenu>
    );
};

export default Menu;
