import { Branch } from "./branch";

export interface Bank{
    id : number,
    name : string,
    code : string, 
    branchList : Branch[]
}