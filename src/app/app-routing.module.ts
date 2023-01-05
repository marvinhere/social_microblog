import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then( m => m.HomePageModule)
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'post',
    loadChildren: () => import('./post/post.module').then( m => m.PostPageModule)
  },
  {
    path: 'create-post',
    loadChildren: () => import('./create-post/create-post.module').then( m => m.CreatePostPageModule)
  },
  {
    path: 'create-comment',
    loadChildren: () => import('./create-comment/create-comment.module').then( m => m.CreateCommentPageModule)
  },
  {
    path: 'profile/:id',
    loadChildren: () => import('./profile/profile.module').then( m => m.ProfilePageModule)
  },
  {
    path: 'login',
    loadChildren: () => import('./login/login.module').then( m => m.LoginPageModule)
  },
  {
    path: 'register-data',
    loadChildren: () => import('./register-data/register-data.module').then( m => m.RegisterDataPageModule)
  },
  {
    path: 'edit-username',
    loadChildren: () => import('./edit-username/edit-username.module').then( m => m.EditUsernamePageModule)
  },
  {
    path: 'reactions',
    loadChildren: () => import('./reactions/reactions.module').then( m => m.ReactionsPageModule)
  },
  {
    path: 'room-posts/:id',
    loadChildren: () => import('./room-posts/room-posts.module').then( m => m.RoomPostsPageModule)
  },
  {
    path: 'register',
    loadChildren: () => import('./register/register.module').then( m => m.RegisterPageModule)
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
