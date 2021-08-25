import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PreloadAllModules } from '@angular/router';
import { WelcomeComponent } from './common/welcome/welcome.component';

const routes: Routes = [
  {
    path: '',
    loadChildren: () =>
      import('./common/game/game.module').then(({ GameModule }) => GameModule),
  },
  {
    path: 'about',
    loadChildren: () =>
      import('./common/about/about.module').then(
        ({ AboutModule }) => AboutModule
      ),
  },
  {
    path: 'welcome',
    component: WelcomeComponent,
  },
  {
    path: 'leaderboards',
    loadChildren: () =>
      import('./common/leaderboards/leaderboards.module').then(
        ({ LeaderboardsModule }) => LeaderboardsModule
      ),
  },
  {
    path: '**',
    redirectTo: 'welcome',
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      preloadingStrategy: PreloadAllModules,
    }),
  ],
  exports: [RouterModule],
  providers: [],
})
export class AppRoutingModule {}
