
'use client';
import React, { useMemo } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

export default function Weekview({ parentInfo = [], subProfileInfo = [], medicationInfo = [] }) {
    console.log("parent info:", parentInfo);
    console.log("med info:", medicationInfo);
    console.log("sub info:", subProfileInfo);
    // Map medication info to calendar events
    /*const events = useMemo(
        () =>
            medicationInfo.map(med => {
                //const name = med.suprofile_id == 0 ? (parentInfo[0].first_name + ' ' + parentInfo[0].last_name) : med.fullName;
                const formatMedTime = dayjs(med.medication_time).format('HH:mm');
                return {
                title: `${formatMedTime} ${med.fullName}: ${med.name}`,
                start: med.medication_time,
            }}),
        [medicationInfo]
    );*/
    const events = useMemo(() => {
        const allEvents = [];

        medicationInfo.forEach(med => {
            const numTimesPerDay = med.frequency || 1;
            const numIntervals = 24 / numTimesPerDay;
            for (let i = 0; i < numTimesPerDay; i++) {
                const newTime = dayjs(med.medication_time).add(i * numIntervals, 'hour');
                const formatMedTime = newTime.format('HH:mm');
                allEvents.push ({
                    title: `${formatMedTime} ${med.fullName}: ${med.name}`,
                    start: newTime.toISOString(),
                });
            }
        });
        console.log("all events:", allEvents);
        return allEvents;
    }, [medicationInfo]);

    return (
        <FullCalendar
            plugins={[dayGridPlugin]}
            initialView="dayGridWeek"
            headerToolbar={{
                left: 'prev,next',
                center: 'title',
                right: 'dayGridWeek,dayGridDay',
            }}
            events={events}
            eventContent={(eventInfo) => (
                <div
                    style={{
                        whiteSpace: 'normal',
                        wordWrap: 'break-word',
                        overflowWrap: 'break-word',
                        fontSize: '12px',
                        lineHeight: '1.2',
                    }}
                >
                    {eventInfo.event.title}
                    {/* <div>{eventInfo.event.start}</div> */}
                </div>
            )}
            //height="auto"
        />
    );
}