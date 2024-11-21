'use client';

import { Calendar } from '@fullcalendar/core'
import dayGridPlugin from '@fullcalendar/daygrid'

export default function Weekview() {
    const calendar = new Calendar(calendar, {
    plugins: [dayGridPlugin],
    initialView: 'dayGridWeek',
    headerToolbar: {
        left: 'prev,next',
        center: 'title',
        right: 'dayGridWeek'
    }
    })
    return calendar;
}