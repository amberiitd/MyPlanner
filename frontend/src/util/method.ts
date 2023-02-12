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

export function generateUID(): string {
    // I generate the UID from two parts here 
    // to ensure the random number provide enough bits.
    var firstPart: any = (Math.random() * 46656) | 0;
    var secondPart: any = (Math.random() * 46656) | 0;
    firstPart = ("000" + firstPart.toString(36)).slice(-3);
    secondPart = ("000" + secondPart.toString(36)).slice(-3);
    return firstPart + secondPart;
}