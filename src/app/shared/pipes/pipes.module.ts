import { NgModule } from '@angular/core';
import { BuildAppsPipe } from './build-apps.pipe';
import { ReduceTextPipe } from './reduce-text.pipe';

@NgModule({
    declarations: [
        BuildAppsPipe,
        ReduceTextPipe,
    ],
    imports: [
    ],
    exports: [
        BuildAppsPipe,
        ReduceTextPipe,
    ]
})
export class PipesModule { }
