"use client";
import { createClient } from '../../utils/supabase/client';
import { useState, useEffect } from "react"
import Weekview from '../ui/weekview';
//import { MedicalInformation } from '@mui/icons-material';


export default function Dashboard() {
    const supabase = createClient();
    //const { data: notes } = await supabase.from("notes").select();

    const [mysession, setMySession] = useState();
    const [subprofileData, setSubprofileData] = useState([]);
    const [medicationData, setMedicationData] = useState([]);
    const [parentData, setParentData] = useState([]);

    // Fetching user and medication data
    useEffect(() => {
        const fetchSessionUserandMedData = async () => {
            const { data: session, error: sessionError } = await supabase.auth.getUser();

            if (sessionError) {
                console.error("Error fetching session:", sessionError);
            }
            setMySession(session);
            
            if (session?.user) {
                // pulling user data from 'subprofiles' table in database
                const { data: subprofileData, error: errorProf } = await supabase
                    .from('subprofiles') 
                    //.select('id, first_name, last_name')
                    .select()
                    .eq('uuid', session.user.id);

                if (errorProf) {
                    console.error("Error fetching subprofiles:", errorProf);
                } else {
                    setSubprofileData(subprofileData || []);
                }

                // pulling parent user data
                const { data: parentData, error: parentError } = await supabase
                    .from('user_data')
                    .select()
                    .eq('uuid', session.user.id);
                
                if (parentError) {
                    console.error("Error fetching parent data:", parentError);
                } else {
                    setParentData(parentData);
                }

                // pulling medication data form 'medications' table in database
                const { data: medicationData, error: errorMed } = await supabase
                    .from('medications')
                    //.select('id, name, dose, medication_time')
                    .select()
                    .eq('uuid', session.user.id);

                if (errorMed) {
                    console.error("Error fetching medications:", errorMed);
                } else {

                    const formattedMedications = medicationData.map(med => {

                        const subprofile = subprofileData.find(profile => profile.id === med.subprofile_id);
                        console.log("subprofile:", subprofile);
                        const fullName = subprofile
                            ? `${subprofile.first_name} ${subprofile.last_name}`
                            : `${parentData[0].first_name} ${parentData[0].last_name}`;
                            console.log("fullname:", fullName);
                        return {
                            ...med,
                            fullName,
                            medication_time: new Date(med.medication_time)//.toISOString().slice(0, -5), 
                        };
                    });
    
                    setMedicationData(formattedMedications);
                }

            }
        };

        fetchSessionUserandMedData();
    }, []);

    //console.log("Medication info: ", medications);
    //console.log("User info: ", subprofiles);

    return (
        <div>
            <Weekview
                // passing profile and medication data to weekview
                parentInfo={parentData}
                subProfileInfo={subprofileData}
                medicationInfo={medicationData}
            />
        </div>
    );
}