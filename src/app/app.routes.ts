import { Routes } from '@angular/router';
import { SidenavComponent } from './sidenav/sidenav.component';
import { TopnavComponent } from './topnav/topnav.component';
import { PortfolioComponent } from './portfolio/portfolio.component';
import { AboutmeComponent } from './aboutme/aboutme.component';
import { AccomplishmentsComponent } from './accomplishments/accomplishments.component';
import { SkillsComponent } from './skills/skills.component';
import { ServicesComponent } from './services/services.component';
import { ContactComponent } from './contact/contact.component';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { NewsfeedComponent } from './newsfeed/newsfeed.component';
import { ViewportComponent } from './viewport/viewport.component';
import { FacultyComponent } from './faculty/faculty.component';
import { CreateportfolioComponent } from './portfolio/createportfolio/createportfolio.component';
import { DesignComponent } from './design/design.component';
import { CreateskillComponent } from './skills/createskill/createskill.component';
import { CreateaccomplishmentComponent } from './accomplishments/createaccomplishment/createaccomplishment.component';
import { EditportfolioComponent } from './portfolio/editportfolio/editportfolio.component';
import { EditskillsComponent } from './skills/editskills/editskills.component';
import { EditaccomplishmentsComponent } from './accomplishments/editaccomplishments/editaccomplishments.component';
import { EditaboutmeComponent } from './aboutme/editaboutme/editaboutme.component';
import { CreatecontactComponent } from './contact/createcontact/createcontact.component';
import { EditcontactComponent } from './contact/editcontact/editcontact.component';
import { CreatefacultyComponent } from './faculty/createfaculty/createfaculty.component';
import { LeaderboardComponent } from './leaderboard/leaderboard.component';
import { LeaderboardapproveComponent } from './leaderboardapprove/leaderboardapprove.component';
import { EditprofileComponent } from './editprofile/editprofile.component';
import { UploadprofileComponent } from './uploadprofile/uploadprofile.component';
import { CvComponent } from './cv/cv.component';
import { HomeComponent } from './home/home.component';
import { SecurityComponent } from './security/security.component';
import { FacSecurityComponent } from './fac-security/fac-security.component';
import { FeedComponent } from './feed/feed.component';


export const routes: Routes = [

    { title: "Unfold | Login", path: '', component: LoginComponent }, // Default to login
    { title: "Unfold | Home", path: 'Home', component: HomeComponent },
    { title: "Unfold | Portfolio", path: 'portfolio', component: PortfolioComponent },
    { title: "Unfold | About Me", path: 'aboutme', component: AboutmeComponent },
    { title: "Unfold | Accomplishments", path: 'accomplishments', component: AccomplishmentsComponent },
    { title: "Unfold | Skills", path: 'skills', component: SkillsComponent },
    { title: "Unfold | Services", path: 'services', component: ServicesComponent },
    { title: "Unfold | Contact", path: 'contact', component: ContactComponent },
    { title: "Unfold | Login", path: 'login', component: LoginComponent },
    { title: "Unfold | Signup", path: 'signup', component: SignupComponent },
    { title: "Unfold | Newsfeed", path: 'newsfeed', component: NewsfeedComponent },
    { title: "Unfold | ViewPortfolio", path: 'viewport/:studentID', component: ViewportComponent },
    { title: "Unfold | Faculty", path: 'faculty', component: FacultyComponent },
    { title: "Unfold | CreatePortfolio", path: 'createportfolio', component: CreateportfolioComponent },
    { title: "Unfold | EditPortfolio", path: 'editportfolio/:projectID', component: EditportfolioComponent },
    { title: "Unfold | Design", path: 'design', component: DesignComponent },
    { title: "Unfold | CreateTechnology", path: 'createskill', component: CreateskillComponent },
    { title: "Unfold | CreateCompetion", path: 'createaccomplishment', component: CreateaccomplishmentComponent },
    { title: "Unfold | EditSkills", path: 'editskill/:skillID', component: EditskillsComponent },
    { title: "Unfold | EditCompetition", path: 'editaccomplishment/:accomID', component: EditaccomplishmentsComponent },
    { title: "Unfold | EditAboutme", path: 'editaboutme/:aboutID', component: EditaboutmeComponent },
    { title: "Unfold | CreateContact", path: 'createcontact', component: CreatecontactComponent },
    { title: "Unfold | EditContact", path: 'editcontact/:contID', component: EditcontactComponent },
    { title: "Unfold | CreateFaculty", path: 'createfaculty', component: CreatefacultyComponent },
    { title: "Unfold | Portfolio Spotlight", path: 'leaderboard', component: LeaderboardComponent },
    { title: "Unfold | Portfolio Approve", path: 'leaderboardapprove', component: LeaderboardapproveComponent },
    { title: "Unfold | Edit Profile", path: 'editprofile/:studentID', component: EditprofileComponent },
    { title: "Unfold | Edit Profile", path: 'editprofile', component: EditprofileComponent },
    { title: "Unfold | Upload Profile", path: 'uploadprofile/:studentID', component: UploadprofileComponent },
    { title: "Unfold | CV", path: 'cv/:studentID', component: CvComponent },
    { title: "Unfold | Security", path: 'security', component: SecurityComponent },
    { title: "Unfold | Security", path: 'security/:studentID', component: SecurityComponent },
    { title: "Unfold | Security", path: 'facSecurity/:facID', component: FacSecurityComponent },
    { title: "Unfold | Leaderboard", path: 'leaderboard/', component: LeaderboardComponent },
    { title: "Unfold | Leaderboard", path: 'leaderboardAppr/', component: LeaderboardapproveComponent },
    { title: "Unfold | Feed", path: 'feed', component: FeedComponent }
    

];

