import { useCallback, useEffect, useState } from "react";
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

export async function addPersonnel(newPersonnel: Partial<Personnel>) {
  const { data, error } = await supabase.from("personnel").insert([newPersonnel]).select();
  if (error) throw error;
  return data as Personnel[];
}

export async function deletePersonnel(id: number) {
  const { error } = await supabase.from("personnel").delete().eq("personnel_id", id);
  if (error) throw error;
}

export function usePersonnel() {
  const [data, setData] = useState<Personnel[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setIsError(false);
    try {
      const { data, error } = await supabase
        .from("personnel")
        .select(`*, unit:unit_id ( unit_name )`)
        .order("last_name");

      if (error) throw error;

      setData((data || []) as Personnel[]);
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

export async function getPersonnelList() {
  const { data, error } = await supabase
    .from("personnel")
    .select("personnel_id, first_name, last_name, badge_number")
    .order("last_name");

  if (error) throw error;
  return (data || []) as Personnel[];
}

export function usePersonnelById(id: string | undefined) {
  const [data, setData] = useState<Personnel | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  const fetchData = useCallback(async () => {
    if (!id) return;
    setIsLoading(true);
    setIsError(false);
    try {
      const { data, error } = await supabase
        .from("personnel")
        .select(`*, unit:unit_id ( unit_name )`)
        .eq("personnel_id", id)
        .single();

      if (error) throw error;
      setData(data as Personnel);
    } catch (error) {
      console.error("Error fetching personnel details:", error);
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, isLoading, isError, refetch: fetchData };
}

export function usePersonnelTraining(personnelId: number) {
  const [data, setData] = useState<PersonnelTraining[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  const fetchData = useCallback(async () => {
    if (!personnelId) return;
    setIsLoading(true);
    setIsError(false);
    try {
      const { data: trainingData, error: trainingError } = await supabase
        .from("personnel_training")
        .select(`*, course:training_course ( * )`)
        .eq("personnel_id", personnelId)
        .order("date_completed", { ascending: false });

      if (trainingError) throw trainingError;

      const records = (trainingData || []) as PersonnelTraining[];
      const instructorIds = [...new Set(records.filter((t) => t.instructor_id).map((t) => t.instructor_id))];

      if (instructorIds.length > 0) {
        const { data: instructors, error: instructorError } = await supabase
          .from("personnel")
          .select("personnel_id, first_name, last_name, badge_number")
          .in("personnel_id", instructorIds);

        if (instructorError) {
          console.warn("Could not fetch instructors", instructorError);
        } else {
          const instructorMap = new Map((instructors || []).map((i) => [i.personnel_id, i]));
          records.forEach((t) => {
            if (t.instructor_id && instructorMap.has(t.instructor_id)) {
              t.instructor = instructorMap.get(t.instructor_id) as Personnel;
            }
          });
        }
      }

      setData(records);
    } catch (error) {
      console.error("Error fetching personnel training:", error);
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  }, [personnelId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, isLoading, isError, refetch: fetchData };
}

export async function getExpiringPersonnelIds(): Promise<number[]> {
  const today = new Date();
  const thirtyDaysFromNow = new Date();
  thirtyDaysFromNow.setDate(today.getDate() + 30);

  const { data, error } = await supabase
    .from("personnel_training")
    .select("personnel_id")
    .lte("date_expires", thirtyDaysFromNow.toISOString())
    .gte("date_expires", today.toISOString());

  if (error) {
    console.error("Error fetching expiring personnel:", error);
    return [];
  }

  return [...new Set((data || []).map((d) => d.personnel_id))];
}

export async function getTrainingCourses() {
  const { data, error } = await supabase
    .from("training_course")
    .select("*")
    .order("course_name");

  if (error) throw error;
  return (data || []) as TrainingCourse[];
}

export async function addPersonnelTraining(training: Partial<PersonnelTraining>) {
  const { data, error } = await supabase.from("personnel_training").insert([training]).select();
  if (error) throw error;
  return data as PersonnelTraining[];
}
