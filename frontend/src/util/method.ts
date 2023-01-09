export const distinct = (list: any[], key: (obj: any) => string) => {
    let dict: {[key: string]: boolean}= {};
    return list.filter(obj => {
        const ispresent = dict[key(obj)] === true;
        if (ispresent) return false;
        dict[key(obj)] = true;
        return true;
    })
}

export function getRandomColor() {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}