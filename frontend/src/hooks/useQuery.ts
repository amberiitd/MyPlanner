import { isEmpty } from "lodash";
import { useCallback, useMemo, useState } from "react"

export const useQuery = <T>(callback: (paload: T)=> Promise<any>) => {
    const [runningInstanceCount, setRunningInstanceCount] = useState(0);
    const loading = useMemo(()=> runningInstanceCount > 0, [runningInstanceCount]);
    // const [loading, setLoading] = useState(false);
    const [error, setError] = useState(undefined);
    const trigger = useCallback((args: T) => {
        setRunningInstanceCount(runningInstanceCount+1);
        return callback(args)
        .then(res => {
            const body = JSON.parse(res.body);
            setRunningInstanceCount(runningInstanceCount-1);
            if (isEmpty(res.errorMessage) && isEmpty(body.errorMessage)){
                return body.data
            }else{
                console.log(res)
                throw Error('Error in query');
            }
        })
        .catch(error => {
            setRunningInstanceCount(runningInstanceCount-1);
            setError(error)
            console.log(error)
        })
    }, [runningInstanceCount])

    return {loading, error, trigger}
}