import {htmlDiff} from '@benedicte/html-diff';
import type {IHtmlComparator} from '../iHtmlComparator';

export class importedComparatorAdapter implements IHtmlComparator {
    public execute(a: string, b: string): string {
        return htmlDiff(a, b);
    }
}