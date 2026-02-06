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

const Register: React.FC = () => {
	return (
		<IonPage>
			<Header title="إنشاء حساب" showMenuButton={false} defaultHref="/account/login" />
			<IonContent className="ion-padding">
				<IonText>
					<p>واجهة مؤقتة لإنشاء حساب مستخدم.</p>
				</IonText>
				<IonItem>
					<IonLabel position="stacked">الاسم</IonLabel>
					<IonInput placeholder="اسم المستخدم" />
				</IonItem>
				<IonItem>
					<IonLabel position="stacked">البريد الإلكتروني</IonLabel>
					<IonInput placeholder="example@mail.com" type="email" />
				</IonItem>
				<IonItem>
					<IonLabel position="stacked">كلمة المرور</IonLabel>
					<IonInput placeholder="********" type="password" />
				</IonItem>
				<IonButton expand="block" className="ion-margin-top">
					إنشاء (مؤقت)
				</IonButton>
			</IonContent>
		</IonPage>
	);
};

export default Register;
