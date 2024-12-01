'use client';
import React, { useMemo } from 'react';
import dayjs from 'dayjs';
import {List, ListItem, ListItemText, Typography} from '@mui/material';

export default function ListRefills({ parentInfo = [], subProfileInfo = [], medicationInfo = [] }) {
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
            const newTime = dayjs(med.medication_time).add(med.quantity * hoursToAdd, 'hour');
            const formatMedTime = newTime.format('HH:mm');
            allEvents.push ({
                title: `${med.fullName}: ${med.name}`,
                start: newTime.format('dddd, MMMM D, YYYY'),
            });
        });
        return allEvents;
    }, [medicationInfo]);

    return (
        <div>
            <Typography variant="h5" component="h2" gutterBottom>
                Upcoming Refill Dates
            </Typography>
            <List>
                {events.map((event, index) => (
                    <ListItem key={index}>
                        <ListItemText primary={event.title} secondary={event.start} />
                    </ListItem>))}
            </List>
        </div>
    );
}