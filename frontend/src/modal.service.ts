import { divide } from "lodash";

class ModalService{

    private showModel: boolean = false;
    private props: any = {};
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

    public getProps(){
        return this.props;
    }

    public setProps(props: any){
        this.props = props;
    }

    public getShowModal(){
        return this.showModel;
    }
}

const projectModalService = new ModalService();
export default projectModalService;

export const projectCreateModalService = new ModalService();

export const sprintModalService = new ModalService();