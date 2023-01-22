import { Fixture } from "./fixture";
import { Team } from "./team";

export interface League {
    id:string;
    table:Team[];
    fixtures:Fixture[];
}
