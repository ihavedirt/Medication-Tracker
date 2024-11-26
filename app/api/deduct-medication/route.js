import { createClient } from '../../../utils/supabase/client';
import { NextRequest, NextResponse } from 'next/server';

const supabase = createClient();

export async function GET(request) {
    // Process GET request to update medications
    try {
        const now = new Date();

        // Fetch medications from the database
        const { data: medications, error } = await supabase.from('medications').select('*');
        if (error) throw error;

        // Process each medication for possible quantity deduction
        const updates = medications.map(async (med) => {
            const { frequency, medication_time, quantity, id } = med;
            const medTime = new Date(medication_time);

            // Check if it's time to deduct the medication quantity
            if (shouldDeduct(frequency, medTime, now)) {
                const newQuantity = quantity - 1;
                if (newQuantity >= 0) {
                    // Update the medication quantity in the database
                    await supabase
                        .from('medications')
                        .update({ quantity: newQuantity })
                        .eq('id', id);
                }
            }
        });

        // Wait for all updates to finish
        await Promise.all(updates);

        // Return success message as JSON response
        return NextResponse.json({ message: 'Medication quantities updated successfully!' });
    } catch (err) {
        console.error(err);
        return NextResponse.json({ error: 'Error updating medications' }, { status: 500 });
    }
}

// Helper function to determine if medication should be deducted
const shouldDeduct = (frequency, medTime, now) => {
    const diffInHours = Math.abs(now - medTime) / (1000 * 60 * 60);

    switch (frequency) {
        case 0: // Once Daily
            return diffInHours >= 24;
        case 1: // Twice Daily
            return diffInHours >= 12;
        case 2: // Three Times Daily
            return diffInHours >= 8;
        case 3: // Four Times Daily
            return diffInHours >= 6;
        default:
            return false;
    }
};
