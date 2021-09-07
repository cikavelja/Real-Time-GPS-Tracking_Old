export class User {
    userName: string;
    connections?: any;
    rooms: any[];
}

export class Group {
    users: User[];
    roomName: string;
}

