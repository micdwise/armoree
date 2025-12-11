import { useEffect, useState, useCallback } from "react";
import { supabase } from "../../lib/supabase";

export interface Personnel {
    personnel_id: number;
    first_name: string;
    last_name: string;
    badge_number: string;

    unit_id?: number;
    unit?: {
        unit_name: string;
    };
    status: string;
    qualification_expiry?: string;
}

export interface TrainingCourse {
    course_id: number;
    course_name: string;
    required_recurrence: string;
    expiration_period_days: number;
}

export interface PersonnelTraining {
    training_id: number;
    personnel_id: number;
    course_id: number;
    date_completed: string;
    date_expires?: string;
    score_achieved?: number;
    instructor_id?: number;
    course?: TrainingCourse;
    instructor?: {
        first_name: string;
        last_name: string;
        badge_number: string;
    };
}

export function GetPersonnel() {
    const [data, setData] = useState<Personnel[] | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isError, setIsError] = useState(false);

    const fetchData = useCallback(async () => {
        setIsLoading(true);
        setIsError(false);
        try {
            const { data, error } = await supabase
                .from("personnel")
                .select(`
          *,
          unit:unit_id (unit_name)
        `);

            if (error) throw error;

            // We might need to fetch qualification expiry separately or join logic
            // For now, let's just return the basic data. 
            // To get qualification expiry, we'd need to join with 'qualifications' which isn't in my immediate view of schema but I recall 'personnel_qualifications'
            // Let's assume for the list view we just show basic info first.

            setData(data as unknown as Personnel[]);
        } catch (error) {
            console.error("Error fetching personnel:", error);
            setIsError(true);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    return { data, isLoading, isError, refetch: fetchData };
}

export async function AddPersonnel(newPersonnel: Partial<Personnel>) {
    const { data, error } = await supabase
        .from("personnel")
        .insert([newPersonnel])
        .select();

    if (error) throw error;
    return data;
}

export async function DeletePersonnel(id: number) {
    const { error } = await supabase
        .from("personnel")
        .delete()
        .eq("personnel_id", id);


    if (error) throw error;
}

export async function GetPersonnelTraining(personnelId: number) {
    const { data, error } = await supabase
        .from("personnel_training")
        .select(`
            *,
            course:course_id (*),
            instructor:instructor_id (first_name, last_name, badge_number)
        `)
        .eq("personnel_id", personnelId)
        .order("date_completed", { ascending: false });

    if (error) throw error;
    return data as PersonnelTraining[];
}

export async function GetTrainingCourses() {
    const { data, error } = await supabase
        .from("training_course")
        .select("*")
        .order("course_name");

    if (error) throw error;
    return data as TrainingCourse[];
}

export async function AddPersonnelTraining(training: Partial<PersonnelTraining>) {
    const { data, error } = await supabase
        .from("personnel_training")
        .insert([training])
        .select();

    if (error) throw error;
    return data;
}
