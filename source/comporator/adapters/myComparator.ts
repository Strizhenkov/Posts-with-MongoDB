import {StringComparator} from '@your-scope/string-comparator';
import type {IHtmlComparator} from '../iHtmlComparator';

export class MyComparatorAdapter implements IHtmlComparator {
    private readonly comporator = new StringComparator();
    public execute(a: string, b: string): string {
        return this.comporator.execute(a, b);
    }
}