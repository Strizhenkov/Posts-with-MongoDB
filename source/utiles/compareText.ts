export class StringComparator {
    private escapeHtml(s: string): string {
        return s.replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;');
    }

    private tokenize(s: string): string[] {
        return s
            .split(/(\s+|[.,!?;:()"\u00AB\u00BB“”«»]+)/)
            .filter(t => t.length > 0);
    }

    private findAhead(arr: string[], start: number, target: string, maxAhead: number): number {
        const end = Math.min(arr.length, start + maxAhead);
        for (let i = start; i < end; i++) {
            if (arr[i] === target) {
                return i;
            }
        }
        return -1;
    }

    public execute(a: string, b: string): string {
        const A = this.tokenize(a);
        const B = this.tokenize(b);

        let i = 0;
        let j = 0;
        const out: string[] = [];

        const pushIns = (t: string) => out.push(`<span class="ins">${this.escapeHtml(t)}</span>`);
        const pushDel = (t: string) => out.push(`<span class="del">${this.escapeHtml(t)}</span>`);
        const pushEql = (t: string) => out.push(this.escapeHtml(t));

        while (i < A.length || j < B.length) {
            if (i >= A.length) { pushIns(B[j++]); continue; }
            if (j >= B.length) { pushDel(A[i++]); continue; }

            const wordA = A[i];
            const wordB = B[j];

            if (wordA === wordB) {
                pushEql(wordA);
                i++; j++;
                continue;
            }

            const closeA = this.findAhead(A, i + 1, wordB, 12);
            const closeB = this.findAhead(B, j + 1, wordA, 12);

            if (closeA !== -1 || closeB !== -1) {
                const deleteCost = closeA === -1 ? Infinity : closeA - i;
                const insertCost = closeB === -1 ? Infinity : closeB - j;

                if (deleteCost <= insertCost) {
                    while (i < closeA) {
                        pushDel(A[i++]);
                    }
                    pushEql(A[i]); i++; j++;
                } else {
                    while (j < closeB) {
                        pushIns(B[j++]);
                    }
                    pushEql(B[j]); i++; j++;
                }
                continue;
            }

            pushDel(wordA);
            pushIns(wordB);
            i++; j++;
        }

        return out.join('');
    }
}