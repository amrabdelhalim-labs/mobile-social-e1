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
import { useState, useEffect, useContext } from 'react';
import { useHistory } from 'react-router';
import { AuthContext } from '../../context/AuthContext';
import { LOGIN_URL } from '../../config/urls';
import './Menu.css';

const Menu: React.FC = () => {
    const [side, setSide] = useState<'start' | 'end'>('end');

    const { logout, user, getProfileImageUrl } = useContext(AuthContext);
    const history = useHistory();

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

        return () => {
            mediaQuery.removeEventListener('change', handleMediaChange);
        };
    }, []);

    const handleLogout = async () => {
        await logout();
        history.push(`/${LOGIN_URL}`);
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
                    <IonImg
                        src={getProfileImageUrl(user?.ImageUrl)}
                        alt="صورة المستخدم"
                    />
                </IonAvatar>
                <div className="ion-text-center ion-margin-top">
                    <IonText color="primary">
                        <h3>{user?.name ?? 'مستخدم'}</h3>
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
