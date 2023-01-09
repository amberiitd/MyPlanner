import { isEmpty } from "lodash";
import { useCallback, useEffect, useState } from "react"

export const useApiSearch = (fetchData: (searchText: string, cancelTokeCallback?: (promise: Promise<any>)=> void)=> Promise<any[]>, cancelFetch?: (promise: Promise<any>)=> any, allowEmpty?: boolean) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<{status: number, message?: string} | undefined>(undefined);
    const [search, setSearch] = useState('');
    const [timer, setTimer] = useState<NodeJS.Timeout | undefined>(undefined);
    const [fetchPromise, setFetchPromise] = useState<Promise<any> | undefined>(undefined);
    const [data, setData]= useState<any[]>([]);
    const process = useCallback((search: string)=>{
        if (timer){
            clearTimeout(timer);
        }
        if(isEmpty(search) && !allowEmpty){
            setData([]);
            setLoading(false);
        }
        else {
            setLoading(true);
            setTimer(setTimeout(()=>{
                if(fetchPromise && cancelFetch){
                    cancelFetch(fetchPromise);
                }
                fetchData(search, (promise)=>{
                    setFetchPromise(promise);
                })
                .then(res => {
                    setData(res || []);
                    setLoading(false);
                })
                .catch(error => {
                    console.log('useApiSearch hooks error', error);
                    setError({
                        status: 400,
                        message: 'Error occured'
                    })
                    setLoading(false);
                })
            }, 500))
        }
    }, [fetchPromise, timer])
    const trigger = (text: string) => {setSearch(text); process(text)};

    return {
        data,
        loading,
        trigger,
        error
    }
}