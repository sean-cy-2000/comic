
class comic {
    constructor(name, type, author, cover, description) {
        this.name = name;
        this.type = type;
        this.author = author;
        this.cover = cover;
        this.description = description;
    }
}

class chapter {
    constructor(chapterNumber, price = 3) {
        this.chapterNumber = chapterNumber;
        this.price = price
    }
}

