'use client';
import { useEffect, useRef } from 'react';
import { Calendar } from '@fullcalendar/core'
import dayGridPlugin from '@fullcalendar/daygrid'
import dayjs from 'dayjs';
//import '@fullcalendar/core/main.css';
//import '@fullcalendar/daygrid/main.css';

export default function Weekview({ profileInfo = [], medicationInfo = []}) {

    console.log("Med info1:", medicationInfo);
    const calendarRef = useRef(null);

    /*useEffect(() => {

        console.log("Med info2: ", medicationInfo);
        if (calendarRef.current) {
            const events = medicationInfo.map((med) => ({
                title: med.name,//`${med.name} (${med.dose})`,
                startDate: med_medication_time,//dayjs(med.medication_time).toISOString(),
                //title: "Test",
            }));

            console.log(events);

            console.log("Med info3:", medicationInfo);
            // const events = [
            //     {
            //         title: "Testing outputs",
            //         date: "2024-11-28T10:00",

            //     },
            // ];


            const calendar = new Calendar(calendarRef.current, {
                plugins: [dayGridPlugin],
                initialView: 'dayGridWeek',
                headerToolbar: {
                    left: 'prev,next',
                    center: 'title',
                    right: 'dayGridWeek',
                },
                events,
            });

            calendar.render();
        }
    }, []);*/
    useEffect(() => {
        if (calendarRef.current) {
            const calendar = new Calendar(calendarRef.current, {
                plugins: [dayGridPlugin],
                initialView: 'dayGridWeek',
                headerToolbar: {
                    left: 'prev,next',
                    center: 'title',
                    right: 'dayGridWeek'
                },

                events: medicationInfo.map(med => ({
                    title: med.name, 
                    start: med.medication_time,
                })),

            });
    
            calendar.render();
        }
    }, [medicationInfo]);

    console.log("Med info4:", medicationInfo);
    
    return (
        <div ref={calendarRef}></div>
    );

}