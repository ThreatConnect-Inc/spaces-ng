import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { SpacesBaseService } from './spaces_base.service';
export declare class SpacesParamsResolve implements Resolve<any> {
    private spacesBase;
    constructor(spacesBase: SpacesBaseService);
    resolve(route: ActivatedRouteSnapshot): {
        [key: string]: any;
    };
}
