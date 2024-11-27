"use client";
import { createClient } from '../../utils/supabase/client';
import { useState, useEffect } from "react"
import Weekview from '../ui/weekview';
//import { MedicalInformation } from '@mui/icons-material';


export default async function Dashboard() {
    const supabase = createClient();
    const { data: notes } = await supabase.from("notes").select();

    const [mysession, setMySession] = useState();
    const [subprofiles, setSubprofiles] = useState([]);
    const [medications, setMedications] = useState([]);

    // Fetching primary and sub user profile data
    useEffect(() => {
        const fetchSessionSubprofilesMedications = async () => {
            const { data: session } = await supabase.auth.getUser();
            setMySession(session);
            
            if (session) {
                // pulling user data from 'subprofiles' table in database
                const { data: subprofileData, errorProf } = await supabase
                    .from('subprofiles') 
                    .select('id, first_name, last_name')
                    .eq('uuid', session.user.id);

                if (errorProf) {
                    console.error("Error fetching subprofiles:", errorProf);
                } else {
                    setSubprofiles(subprofileData);
                }

                // pulling medication data form 'medications' table in database
                const { data: medicationData, errorMed } = await supabase
                    .from('medications')
                    .select('id, name, dose')
                    .eq('uuid', session.user.id);

                if (errorMed) {
                    console.error("Error fetching medications:", errorMed);
                } else {
                    setMedications(medicationData);
                }
            }
        };

        fetchSessionSubprofilesMedications();
    }, []);


    return (
        <div>
            <Weekview
                profileInfo={subprofiles}
                medicationInfo={medications}
            />
        </div>
    );
}