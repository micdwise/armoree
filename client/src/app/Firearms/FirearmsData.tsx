import { useEffect, useState } from "react";
import { api } from "@app/api/client";

export interface Firearm {
  id: number;
  manufacturer: string;
  model: string;
  purchase_date: string;
  caliber: string;
  serial_number: string;
}

function AddFirearms(newFirearm: any) {
  api
    .post("/firearms", newFirearm)
    .then(() => {
      console.log("It works");
    })
    .catch((error) => {
      console.log(error);
    });

  console.log("Fired firearm POST");
}

const GetFirearms = () => {
  const [data, setData] = useState<Firearm[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isError, setIsError] = useState<boolean>(false);

  const fetchFirearmData = () => {
    setIsLoading(true);
    setIsError(false);
    api
      .get<Firearm[]>("/firearms")
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
    fetchFirearmData();
  }, []);

  return { data, isLoading, isError };
};

export { GetFirearms, AddFirearms };
