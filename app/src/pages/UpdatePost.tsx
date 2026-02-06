import {
	IonButton,
	IonContent,
	IonInput,
	IonItem,
	IonLabel,
	IonPage,
	IonTextarea,
	IonText,
} from '@ionic/react';
import { useParams } from 'react-router-dom';
import Header from '../components/Header/Header';

type RouteParams = {
	id: string;
};

const UpdatePost: React.FC = () => {
	const { id } = useParams<RouteParams>();

	return (
		<IonPage>
			<Header title="تعديل منشور" />
			<IonContent className="ion-padding">
				<IonText>
					<p>تعديل منشور رقم {id} (واجهة مؤقتة)</p>
				</IonText>
				<IonItem>
					<IonLabel position="stacked">العنوان</IonLabel>
					<IonInput placeholder="عنوان المنشور" />
				</IonItem>
				<IonItem>
					<IonLabel position="stacked">المحتوى</IonLabel>
					<IonTextarea placeholder="نص المنشور" autoGrow />
				</IonItem>
				<IonButton expand="block" className="ion-margin-top">
					حفظ التعديلات (مؤقت)
				</IonButton>
			</IonContent>
		</IonPage>
	);
};

export default UpdatePost;
