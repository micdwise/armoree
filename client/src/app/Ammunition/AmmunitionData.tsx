import { useEffect, useState, useCallback } from "react";
import { api } from "@app/api/client";

export interface Ammunition {
  id: number;
  manufacturer: string;
  brand: string;
  purchase_date: string;
  caliber: string;
  lot_number: string;
  qty: string;
}

function AddAmmunition(newAmmunition: any) {
  return api.post("/ammunition", newAmmunition);
}

function DeleteAmmunition(id: number) {
  return api.delete(`/ammunition/${id}`);
}

const GetAmmunition = () => {
  const [data, setData] = useState<Ammunition[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isError, setIsError] = useState<boolean>(false);
  const fetchAmmoData = useCallback(() => {
    setIsLoading(true);
    setIsError(false);
    api
      .get<Ammunition[]>("/ammunition")
      .then((data) => {
        setData(data);
      })
      .catch((error) => {
        setIsError(true);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  useEffect(() => {
    fetchAmmoData();
  }, []);

  return { data, isLoading, isError, refetch: fetchAmmoData };
};

export { GetAmmunition, AddAmmunition, DeleteAmmunition };
