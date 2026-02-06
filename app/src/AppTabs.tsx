import { Route, Redirect } from 'react-router-dom';
import {
    IonIcon,
    IonLabel,
    IonRouterOutlet,
    IonTabBar,
    IonTabButton,
    IonTabs,
} from '@ionic/react';
import { addCircle, home, person, list } from 'ionicons/icons';
import AllPosts from './pages/AllPosts';
import MyPosts from './pages/MyPosts';
import CreatePost from './pages/CreatePost';
import GetPost from './pages/GetPost';
import UpdatePost from './pages/UpdatePost';
import Profile from './pages/Profile';
import NotFound from './pages/NotFound';

const AppTabs: React.FC = () => {
    return (
        <IonTabs>
            <IonRouterOutlet>
                <Route exact path="/tabs/home">
                    <AllPosts />
                </Route>
                <Route exact path="/tabs/posts/create">
                    <CreatePost />
                </Route>
                <Route exact path="/tabs/posts/me">
                    <MyPosts />
                </Route>
                <Route exact path="/tabs/profile">
                    <Profile />
                </Route>
                <Route exact path="/tabs/posts/:id([0-9a-f-]+)/edit">
                    <UpdatePost />
                </Route>
                <Route exact path="/tabs/posts/:id([0-9a-f-]+)">
                    <GetPost />
                </Route>
                <Route exact path="/tabs">
                    <Redirect to="/tabs/home" />
                </Route>
                <Route>
                    <NotFound />
                </Route>
            </IonRouterOutlet>

            <IonTabBar slot="bottom">
                <IonTabButton tab="home" href="/tabs/home">
                    <IonIcon icon={home} />
                    <IonLabel>الرئيسية</IonLabel>
                </IonTabButton>
                <IonTabButton tab="create" href="/tabs/posts/create">
                    <IonIcon icon={addCircle} />
                    <IonLabel>إنشاء</IonLabel>
                </IonTabButton>
                <IonTabButton tab="my-posts" href="/tabs/posts/me">
                    <IonIcon icon={list} />
                    <IonLabel>منشوراتي</IonLabel>
                </IonTabButton>
                <IonTabButton tab="profile" href="/tabs/profile">
                    <IonIcon icon={person} />
                    <IonLabel>حسابي</IonLabel>
                </IonTabButton>
            </IonTabBar>
        </IonTabs>
    );
};

export default AppTabs;
