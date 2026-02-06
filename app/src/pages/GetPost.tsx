import {
	IonButton,
	IonContent,
	IonPage,
	IonText,
} from '@ionic/react';
import { useParams } from 'react-router-dom';
import Header from '../components/Header/Header';

type RouteParams = {
	id: string;
};

const GetPost: React.FC = () => {
	const { id } = useParams<RouteParams>();

	return (
		<IonPage>
			<Header title="عرض منشور" />
			<IonContent className="ion-padding">
				<IonText>
					<h2>منشور رقم {id}</h2>
					<p>هذا محتوى تجريبي لصفحة عرض منشور واحد.</p>
				</IonText>
				<IonButton routerLink={`/tabs/posts/${id}/edit`} className="ion-margin-top">
					تعديل المنشور
				</IonButton>
			</IonContent>
		</IonPage>
	);
};

export default GetPost;
