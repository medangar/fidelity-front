import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Inscription } from 'src/app/entity/inscription';
import { AuthenticateService } from 'src/app/service/authenticate.service';

@Component({
  selector: 'app-inscription',
  templateUrl: './inscription.component.html',
  styleUrls: ['./inscription.component.scss']
})
export class InscriptionComponent {

  form: FormGroup;
  emailExists: boolean = false;
 inscription:Inscription=new Inscription();
 constructor(private authService: AuthenticateService,
  private formBuilder: FormBuilder,
 public router: Router) {
this.createForm();
}

createForm() {
this.form = this.formBuilder.group({
nom: [this.inscription.nom, Validators.required],
prenom: [this.inscription.prenom, Validators.required],
email: [this.inscription.email, [Validators.required, Validators.email]],
password: [this.inscription.password, [Validators.required, Validators.minLength(8)]],
passwordConfirm: [this.inscription.passwordConfirm, [Validators.required, Validators.minLength(8)]],
codepostal: [this.inscription.codePostal, Validators.required],
identifiant: [this.inscription.identifiant, Validators.required],
tel: [this.inscription.tel, Validators.required],
address: [this.inscription.address, Validators.required]
}, { validator: this.checkPasswords });
}

checkPasswords(group: FormGroup) {
let password = group.get('password')?.value;
let confirmPassword = group.get('passwordConfirm')?.value;
return password === confirmPassword ? null : { notSame: true }
}

register(): void {
this.emailExists = false;
console.log("component",this.inscription);
this.inscription=this.form.value;
this.authService.inscription(this.inscription).subscribe({
next: () => {
console.log('register successfuly');
this.router.navigate(['/login']);
},
error: (err: any) => {
if(err.message == "mail existe deja"){
this.emailExists = true;

}
console.log(err,'connexion failed');
}
});;
console.log("inscription");

}

}
