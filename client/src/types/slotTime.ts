interface User {
    _id: string
    name: string;
    lastname: string;
}

interface Candidate {
    name: string
    lastname: string;
    mail: string;
}

interface SlotGroup {
    date: Date;
    slots?: SlotTime[];
    slot?: SlotTime
}

interface SlotTime {
    _id: string;
    date: Date;
    candidate?: Candidate;
    user?: User;
}
