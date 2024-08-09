import { Routes } from '@angular/router';
import {HomeComponent} from "./pages/home/home.component";
import {PlayComponent} from "./pages/play/play.component";

export const routes: Routes = [
  {
    path: '',
    component: HomeComponent
  },
  {
    path: 'play',
    component: PlayComponent
  }
];
