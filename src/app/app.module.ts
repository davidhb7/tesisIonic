import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { getAnalytics, provideAnalytics, ScreenTrackingService, UserTrackingService } from '@angular/fire/analytics';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { getDatabase, provideDatabase } from '@angular/fire/database';
import { getFunctions, provideFunctions } from '@angular/fire/functions';
import { getMessaging, provideMessaging } from '@angular/fire/messaging';
import { getPerformance, providePerformance } from '@angular/fire/performance';
import { getStorage, provideStorage } from '@angular/fire/storage';
import { getRemoteConfig, provideRemoteConfig } from '@angular/fire/remote-config';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AngularFireModule } from '@angular/fire/compat';

@NgModule({
  declarations: [
    AppComponent
  ],

  imports: [
    BrowserModule,
    IonicModule.forRoot(),
    ReactiveFormsModule,
    //FormsModule,
    AppRoutingModule,
    //ERRORE??
    AngularFireModule.initializeApp({
      "projectId":"ionic-gest-rep-all",
      "appId":"1:1053661105256:web:66d9999b5cdd683631ffdd",
      "storageBucket":"ionic-gest-rep-all.appspot.com",
      "apiKey":"AIzaSyAEg4LYp3RqblvzMTvJZNPIGIAPGzbYnaw",
      "authDomain":"ionic-gest-rep-all.firebaseapp.com",
      "messagingSenderId":"1053661105256"}),
    //AngularFireModule,

    provideFirebaseApp(() => initializeApp({
      "projectId":"ionic-gest-rep-all",
      "appId":"1:1053661105256:web:66d9999b5cdd683631ffdd",
      "storageBucket":"ionic-gest-rep-all.appspot.com",
      "apiKey":"AIzaSyAEg4LYp3RqblvzMTvJZNPIGIAPGzbYnaw",
      "authDomain":"ionic-gest-rep-all.firebaseapp.com",
      "messagingSenderId":"1053661105256"}
    )),

    provideAuth(() => getAuth()),

    provideAnalytics(() => getAnalytics()),
    //provideAppCheck(() => {
      // TODO get a reCAPTCHA Enterprise here https://console.cloud.google.com/security/recaptcha?project=_
      //const provider = new ReCaptchaEnterpriseProvider(/* reCAPTCHA Enterprise site key */);
      //return initializeAppCheck(undefined, { provider, isTokenAutoRefreshEnabled: true });
      //}),
    provideFirestore(() => getFirestore()),
    provideDatabase(() => getDatabase()),
    provideFunctions(() => getFunctions()),
    provideMessaging(() => getMessaging()),
    providePerformance(() => getPerformance()),
    provideStorage(() => getStorage()),
    provideRemoteConfig(() => getRemoteConfig())],

  providers: [{
    provide: RouteReuseStrategy,
    useClass: IonicRouteStrategy
  },
  ScreenTrackingService,
  UserTrackingService
  ],

  bootstrap: [
    AppComponent
  ],

})
export class AppModule {}
