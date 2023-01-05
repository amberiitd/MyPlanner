import { isEmpty } from "lodash";
import { useState } from "react"

export const useQuery = <T>(callback: (paload: T)=> Promise<any>) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(undefined);
    const trigger = (args: T) => {
        setLoading(true);
        return callback(args)
        .then(res => {
            const body = JSON.parse(res.body);
            setLoading(false);
            if (isEmpty(res.errorMessage) && isEmpty(body.errorMessage)){
                return body.data
            }else{
                console.log(res)
                throw Error('Error in query');
            }
        })
        .catch(error => {
            setLoading(false);
            setError(error)
            console.log(error)
        })
    }

    return {loading, error, trigger}
}