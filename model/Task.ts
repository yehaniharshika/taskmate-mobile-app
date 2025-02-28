export default class Task {
    id: string;
    date: string;
    description: string;
    time: string;
    completed: boolean;

    constructor(id: string, date: string,description: string,time:string, completed: boolean) {
        this.id = id;
        this.date = date;
        this.description = description;
        this.time = time;
        this.completed = completed;
    }
}