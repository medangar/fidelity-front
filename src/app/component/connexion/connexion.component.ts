import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Connexion } from 'src/app/entity/connexion';
import { AuthenticateService } from 'src/app/service/authenticate.service';

@Component({
  selector: 'app-connexion',
  templateUrl: './connexion.component.html',
  styleUrls: ['./connexion.component.scss']
})
export class ConnexionComponent {

  form: FormGroup;
  badCredentials:boolean = false;
  connexion:Connexion=new Connexion();

  constructor(private authService: AuthenticateService,
    private formBuilder: FormBuilder,
  public router: Router) {
this.createForm();
}
  
createForm() {
this.form = this.formBuilder.group({
email: [this.connexion.email, [Validators.required, Validators.email]],
password: [this.connexion.password, [Validators.required]]
});
}

authentication() {
this.connexion.email = this.form.value.email;
this.connexion.password = this.form.value.password;
console.log("connection compo",this.connexion);
this.authService.connexion(this.connexion).subscribe({
next: (res) => {
console.log('connxion successfuly',res.token);
localStorage.setItem("id_token",res.token);
localStorage.setItem("first_name",res.firstName);
localStorage.setItem("last_name",res.lastName);
localStorage.setItem("identifiant",res.identifiant);
localStorage.setItem("isAdmin",res.admin);
console.log("rolle",res.admin);
if(res.admin){
  this.router.navigate(['/dashboardAdmin']);
}else{
  this.router.navigate(['/dashboardClient']);
}

},
error: (err: any) => {
if(err.message == "Bad credentials"){
this.badCredentials = true;
}
console.log('connexion failed');
}
});
}

}
