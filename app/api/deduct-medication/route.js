import { convertLength } from '@mui/material/styles/cssUtils';
import { createClient } from '../../../utils/supabase/client';
import { NextResponse } from 'next/server';
//import twilio from 'twilio';

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = require('twilio')(accountSid, authToken);
const supabase = createClient();

// Helper function to determine if medication should be deducted
const shouldDeduct = (frequency, medTime, now) => {
    const diffInHours = Math.abs(now - medTime) / (1000 * 60 * 60);
    const diffInMinutes = Math.abs(now - medTime) / (1000 * 60);

    switch (frequency) {
        case 0: // Once Daily
            return diffInHours >= 24;
        case 1: // Twice Daily
            return diffInHours >= 12;
        case 2: // Three Times Daily
            return diffInHours >= 8;
        case 3: // Four Times Daily
            return diffInHours >= 6;
        case 4:
            return diffInMinutes >= 5;
        case 8:
            return diffInHours >= 168;
        case 9:
            return diffInHours >= 720;
        default:
            return false;
    }
};

// Function to update medication time after a dose
const updateMedicationTime = (frequency, medTime) => {
    const newMedTime = new Date(medTime);
    
    switch (frequency) {
        case 0: // Once Daily
            newMedTime.setHours(newMedTime.getHours() + 24); // Add 24 hours
            break;
        case 1: // Twice Daily
            newMedTime.setHours(newMedTime.getHours() + 12); // Add 12 hours
            break;
        case 2: // Three Times Daily
            newMedTime.setHours(newMedTime.getHours() + 8); // Add 8 hours
            break;
        case 3: // Four Times Daily
            newMedTime.setHours(newMedTime.getHours() + 6); // Add 6 hours
            break;
        case 4:
            newMedTime.setMinutes(newMedTime.getMinutes() + 5);
            break;
        case 8:
            newMedTime.setHours(newMedTime.getHours() + 168); // Add 168 hours
            break;
        case 9:
            newMedTime.setHours(newMedTime.getHours() + 720); // Add 720 hours
            break;
        default:
            break;
    }
    
    return newMedTime;
}

export async function POST(req, res) {
    try {
        const now = new Date();
        const medicationsProcessed = [];

        const { data: userMeta} = await supabase.from('user_data').select('*');

        const { data: medications, error } = await supabase.from('medications').select('*');
        if (error) throw error;

        // Process each medication for possible quantity deduction
        const updates = medications.map(async (med) => {
            const { frequency, medication_time, quantity, uuid, dose, isNotified } = med;
            const medTime = new Date(medication_time);

            // Check if it's time to deduct the medication quantity
            const shouldDeductFlag = shouldDeduct(frequency, medTime, now);

            const user = userMeta.find((u) => u.uuid === uuid);

            if (user == undefined) {
                return;
            }

            if (shouldDeductFlag) {
                let newQuantity = quantity - dose;
                if (newQuantity < 0) {
                    newQuantity = 0;
                }

                const newMedTime = updateMedicationTime(frequency, medTime);
                await supabase
                        .from('medications')
                        .update({ quantity: newQuantity, medication_time: newMedTime.toISOString()})
                        .eq('id', med.id)

                if(newQuantity != null) {
                    client.messages
                        .create({
                        body: `Hey! It's time to take ${med.name}.`,
                        from: '+17753209715',
                        to: '+1' + user.phone 
                    })
                }

                
                if (newQuantity === null) {
                        medicationsProcessed.push({
                            uuid,
                            name: med.name,
                            dose,
                            frequency,
                            newQuantity,
                           medicationTime: newMedTime.toISOString(),
                           status: 'Skipped due to null quantity',
                       });
                   }
                else if (newQuantity > 5) {
                    medicationsProcessed.push({
                        uuid,
                        name: med.name,
                        dose,
                        frequency,
                        newQuantity,
                        medicationTime: newMedTime.toISOString(),
                        status: 'Updated successfully',
                    });
                } else if (newQuantity <= 5 && isNotified == 0) {
                    medicationsProcessed.push({
                        uuid,
                        name: med.name,
                        dose,
                        frequency,
                        newQuantity,
                        medicationTime: newMedTime.toISOString(),
                        status: 'Quantity low',
                    });

                    client.messages
                        .create({
                        body: `Hey! Only ${newQuantity} pills of ${med.name} left. Keep your health on track by restocking soon!`,
                        from: '+17753209715',
                        to: '+1' + user.phone 
                    })

                    await supabase
                        .from('medications')
                        .update({ isNotified: 1})
                        .eq('id', med.id)
                }
            } else {
                medicationsProcessed.push({
                    uuid,
                    name: med.name,
                    dose,
                    frequency,
                    quantity,
                    medicationTime: medTime.toISOString(),
                    status: 'No update needed',
                });
            }
        });

        // Wait for all updates to finish
        await Promise.all(updates);

        // Return structured response with the processed medication details
        return NextResponse.json({
            message: 'Medication quantities updated successfully!',
            medicationsProcessed, }, { status: 200}
        );
    } catch (err) {
        console.error('Error updating medications:', err);
        return NextResponse.json({
            error: 'Error updating medications',
            debug: err.message,
        }, { status: 500 });
    }
}
