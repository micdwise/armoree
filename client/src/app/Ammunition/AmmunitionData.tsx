import { useEffect, useState } from "react";

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
  fetch(
    `http://${process.env.API_URL}:${process.env.API_PORT}/api/v1/ammunition`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newAmmunition),
    }
  )
    .then((response) => {
      if (response.ok) {
        console.log("It works");
      }
    })
    .catch((error) => {
      console.log(error);
    });
}

const GetAmmunition = () => {
  const [data, setData] = useState<Ammunition[]>([]);

  const fetchAmmoData = () => {
    fetch(
      `http://${process.env.API_URL}:${process.env.API_PORT}/api/v1/ammunition`
    )
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        console.log(data);
        setData(data);
      });
  };

  useEffect(() => {
    fetchAmmoData();
  }, []);

  return { data };
};

export { GetAmmunition, AddAmmunition };
