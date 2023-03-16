import { SharedModule } from './shared.module';

describe('ShareModule', () => {
    let shareModule: SharedModule;

    beforeEach(() => {
        shareModule = new SharedModule();
    });

    it('should create an instance', () => {
        expect(shareModule).toBeTruthy();
    });
});
