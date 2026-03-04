class activityMessagesClass {
    private name;
    constructor ( name : string) {
        this.name = name;
    }

    CREATED = () => {
        return `${this.name} created.`
    }

    FETCHED = () => {
        return `${this.name} fetched.`
    }

    FETCHEDALL = () => {
         return `All ${this.name}s fetched.`
    }

    UPDATED = () => {
        return `${this.name} updated.`
    }

    DELETED = () => {
         return `${this.name} deleted.`
    }
}

export { activityMessagesClass }