interface MyObj{
    value: string;
}


const handler = () =>{
    const myObject: MyObj = {
        value: 'sample-value'
    }
    
    console.log("hello");
    return myObject;
}

module.exports = {
    handler
}
