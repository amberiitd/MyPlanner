export const distinct = (list: any[], key: (obj: any) => string) => {
    let dict: {[key: string]: boolean}= {};
    return list.filter(obj => {
        const ispresent = dict[key(obj)] === true;
        if (ispresent) return false;
        dict[key(obj)] = true;
        return true;
    })
}