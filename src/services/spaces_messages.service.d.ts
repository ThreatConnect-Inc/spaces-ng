import { Message } from 'primeng/primeng';
import { SpacesLoggingService } from './spaces_logging.service';
export declare class SpacesMessagesService {
    private logging;
    msgs: Message[];
    constructor(logging: SpacesLoggingService);
    showSuccess(summary: string, detail: string): void;
    showInfo(summary: string, detail: string): void;
    showWarning(summary: string, detail: string): void;
    showError(summary: string, detail: string): void;
    private showMessage(severity, summary, detail);
    private clearMessages();
}
