import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { SpacesBaseService } from '../../services/spaces_base.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'spaces-landing-page',
  templateUrl: './spaces-landing-page.component.html',
  styleUrls: ['./spaces-landing-page.component.css']
})
export class SpacesLandingPageComponent implements OnInit {

  missingParams: any[] = [];
  done = false;
  constructor(private http: HttpClient, private spacesBaseService: SpacesBaseService, private router: Router) { }

  public ngOnInit() {
    this.spacesBaseService.initialized.then(() => {
      const params = this.spacesBaseService.params;

      if (params.develop === 'true') {
        this.done = true;
        this.router.navigate(['app']);
        return;
      }
      this.http.get('install.json', {responseType: 'json'}).subscribe(
        installJson => {

          this.missingParams =
            installJson['params']
              .filter(param => param.required)
              .filter(param => !params[param.name]);

          this.done = true;

          if (this.missingParams.length === 0) {
            this.router.navigate(['app']);
          }
        },
        err => {
          console.log(err);
        });
    });
  }

}
