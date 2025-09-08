import {ComparatorType, type AppConfig} from '../appBuilder/config/appConfig';
import {importedComparatorAdapter} from './adapters/importedComparator';
import {MyComparatorAdapter} from './adapters/myComparator';
import type {IHtmlComparator} from './iHtmlComparator';

export class ComparatorAdapterFactory {
    constructor(private _cfg: AppConfig) {}

    public createComparator(): IHtmlComparator {
        switch (this._cfg.comparator) {
        case ComparatorType.ImportedComparator:
            return new importedComparatorAdapter();
        default:
            return new MyComparatorAdapter();
        }
    }
}