import { divide } from "lodash";

class ModalService{

    private showModel: boolean = false;
    private subscription: {func: ()=> void;}[] = [];
    constructor(){

    }

    public subscribe(callback: () => void){
        this.subscription.push({func: callback});
    }

    public setShowModel(val: boolean){
        this.showModel = val;
        this.subscription.forEach(subs => {
            subs.func();
        })
    }

    public getShowModel(){
        return this.showModel;
    }
}

const defaultModalService = new ModalService();
export default defaultModalService;