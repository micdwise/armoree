import { useEffect, useState } from "react";
import { api } from "@app/api/client";
import { error } from "console";

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
  api
    .post("/ammunition", newAmmunition)
    .then(() => {
      console.log("It works");
    })
    .catch((error) => {
      console.log(error);
    });
}

const GetAmmunition = () => {
  const [data, setData] = useState<Ammunition[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isError, setIsError] = useState<boolean>(false);

  const fetchAmmoData = () => {
    setIsLoading(true);
    setIsError(false);
    api
      .get<Ammunition[]>("/ammunition")
      .then((data) => {
        console.log(data);
        setData(data);
      })
      .catch((error) => {
        console.log(error);
        setIsError(true);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  useEffect(() => {
    fetchAmmoData();
  }, []);

  return { data, isLoading, isError };
};

export { GetAmmunition, AddAmmunition };
