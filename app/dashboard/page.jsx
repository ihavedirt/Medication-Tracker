import { createClient } from '../../utils/supabase/server';
import Weekview from '../ui/weekview';


export default async function Notes() {
    const supabase = createClient();
    const { data: notes } = await supabase.from("notes").select();

    return <div><Weekview/></div>
}