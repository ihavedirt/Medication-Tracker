'use client';

import { useEffect, useRef } from 'react';
import { Calendar } from '@fullcalendar/core'
import dayGridPlugin from '@fullcalendar/daygrid'

export default function Weekview() {

    const calendarRef = useRef(null);

    useEffect(() => {

        if (calendarRef.current) {

            const calendar = new Calendar(calendarRef.current, {
                plugins: [dayGridPlugin],
                initialView: 'dayGridWeek',
                headerToolbar: {
                    left: 'prev,next',
                    center: 'title',
                    right: 'dayGridWeek'
                }
            });

            calendar.render();
        }
    }, []);

    return (
        <div ref={calendarRef}></div>
    );

}