import { SpacesLoggingService } from './spaces_logging.service';
export declare class SpacesStorageService {
    private logging;
    storage: any;
    constructor(logging: SpacesLoggingService);
    ngOnInit(): void;
    create(key: any, value: any): void;
    read(key: any): any;
    delete(key: any): void;
    update(key: any, value: any): void;
}
