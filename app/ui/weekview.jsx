
'use client';
import React, { useMemo } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

export default function Weekview({ parentInfo = [], subProfileInfo = [], medicationInfo = [] }) {
    console.log("Med info:", medicationInfo);

    // Map medication info to calendar events
    const events = useMemo(
        () =>
            medicationInfo.map(med => {
                const formatMedTime = dayjs(med.medication_time).format('HH:mm');
                return {
                title: `${formatMedTime} ${med.fullName}: ${med.name}`,
                start: med.medication_time,
            }}),
        [medicationInfo]
    );

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