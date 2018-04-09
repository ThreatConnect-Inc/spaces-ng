import { SpacesLoggingService } from './spaces_logging.service';
export declare class SpacesUtilityService {
    private logging;
    constructor(logging: SpacesLoggingService);
    isEmpty(obj: any): boolean;
    findIndex(hay: any[], needle: string): number;
}
