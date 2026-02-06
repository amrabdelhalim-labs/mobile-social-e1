import {
	IonButton,
	IonContent,
	IonInput,
	IonItem,
	IonLabel,
	IonPage,
	IonText,
} from '@ionic/react';
import Header from '../components/Header/Header';

const Login: React.FC = () => {
	return (
		<IonPage>
			<Header title="تسجيل الدخول" showMenuButton={false} showBackButton={false} />
			<IonContent className="ion-padding">
				<IonText>
					<p>واجهة مؤقتة لتجربة تدفق تسجيل الدخول.</p>
				</IonText>
				<IonItem>
					<IonLabel position="stacked">البريد الإلكتروني</IonLabel>
					<IonInput placeholder="example@mail.com" type="email" />
				</IonItem>
				<IonItem>
					<IonLabel position="stacked">كلمة المرور</IonLabel>
					<IonInput placeholder="********" type="password" />
				</IonItem>
				<IonButton expand="block" className="ion-margin-top">
					دخول (مؤقت)
				</IonButton>
			</IonContent>
		</IonPage>
	);
};

export default Login;
