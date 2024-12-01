
'use client';
import React, { useMemo } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

export default function Weekview({ parentInfo = [], subProfileInfo = [], medicationInfo = [] }) {
    const Frequency = useMemo(() => ({
        ONCE_DAILY: 0,
        TWICE_DAILY: 1,
        THREE_DAILY: 2,
        FOUR_DAILY: 3,
        FIVE_MINUTES: 4,
        WEEKLY: 8,
        MONTHLY: 9,
        AS_NEEDED: 10,
    }), []);

    const frequencyToHourDifference = (frequency) => {
        const frequencyMap = {
            [Frequency.ONCE_DAILY]: 24,
            [Frequency.TWICE_DAILY]: 12,
            [Frequency.THREE_DAILY]: 8,
            [Frequency.FOUR_DAILY]: 6,
            [Frequency.FIVE_MINUTES]: (1/(5*60)), // Convert 5 minutes to hours
            [Frequency.WEEKLY]: 24 * 7, // 1 week in hours
            [Frequency.MONTHLY]: 24 * 30, // Approximation: 30 days in a month
            [Frequency.AS_NEEDED]: null, // No fixed interval
        };
    
        return frequencyMap[frequency] ?? null; // Return null for undefined frequencies
    };

    const events = useMemo(() => {
        const allEvents = [];

        medicationInfo.forEach(med => {
            const hoursToAdd = frequencyToHourDifference(med.frequency);
            for (let i = 0; i < med.quantity; i++) {
                const newTime = dayjs(med.medication_time).add(i * hoursToAdd, 'hour');
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
                </div>
            )}
        />
    );
}