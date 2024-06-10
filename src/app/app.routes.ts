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
import { HomeComponent } from './home/home.component';
import { SignupComponent } from './signup/signup.component';
import { NewsfeedComponent } from './newsfeed/newsfeed.component';
import { ViewportComponent } from './viewport/viewport.component';
import { FacultyComponent } from './faculty/faculty.component';
import { CreateportfolioComponent } from './portfolio/createportfolio/createportfolio.component';
import { DesignComponent } from './design/design.component';
import { CreateskillComponent } from './skills/createskill/createskill.component';
import { CreateaccomplishmentComponent } from './accomplishments/createaccomplishment/createaccomplishment.component';
import { AddcontactComponent } from './contact/addcontact/addcontact.component';

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
    { title: "Unfold | CreatPortfolio", path: 'createportfolio', component: CreateportfolioComponent },
    { title: "Unfold | Design", path: 'design', component: DesignComponent },
    { title: "Unfold | CreateTechnology", path: 'createskill', component: CreateskillComponent },
    { title: "Unfold | CreateCompetition", path: 'createaccomplishment', component: CreateaccomplishmentComponent },
    { title: "Unfold | AddContact", path: 'addcontact', component: AddcontactComponent },


];
