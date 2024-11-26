"use client";
import { createClient } from '../../utils/supabase/client';
import { useState, useEffect } from "react"
import Weekview from '../ui/weekview';


export default async function Dashboard() {
    const supabase = createClient();
    const { data: notes } = await supabase.from("notes").select();

    const [mysession, setMySession] = useState();
    const [subprofiles, setSubprofiles] = useState([]);
    const [medications, setMedications] = useState([]);

    // Fetching primary and sub user profile data
    useEffect(() => {
        const fetchSession_Subprofiles_Medications = async () => {
            const { data: session } = await supabase.auth.getUser();
            setMySession(session);
            
            if (session) {
                const { data: subprofileData, error } = await supabase
                    .from('subprofiles') 
                    .select('id, first_name, last_name')
                    .eq('uuid', session.user.id);

                if (error) {
                    console.error("Error fetching subprofiles:", error);
                } else {
                    setSubprofiles(subprofileData);
                }
            }
        };

        fetchSession_Subprofiles_Medications();
    }, []);


    return <div><Weekview
    /*subusers_fname={subprofiles.first_name}
    subusers_lname={subprofiles.last_name}*/
    /></div>
}