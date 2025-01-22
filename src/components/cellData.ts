type Alignment = 'left' | 'center' | 'right';

class CellData {
    content: string;
    alignment?: Alignment;

    constructor(content: string, alignment?: Alignment) {
        this.content = content;
        this.alignment = alignment;
    }
}