class responseMessages {
    public name;

    constructor (name : string) {
        this.name = name;
    }

    CREATED = () => {
        return `${this.name} created successfully`
    }
    FETCHED = () => {
        return `${this.name} fetched successfully`
    }
    UPDATED = () => {
        return `${this.name} updated successfully`
    }
    DELETED = () => {
        return `${this.name} deleted successfully`
    }
}

export { responseMessages };