import { useEffect, useState } from "react";

export interface Repository {
  id: BigInt;
  manufacturer: string;
  brand: string;
  purchase_date: string;
  caliber: string;
  lot_number: string;
  qty: string;
}

function AddAmmunition(newAmmunition) {
  fetch("http://localhost:3000/api/v1/ammunition", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(newAmmunition),
  })
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
  const [data, setData] = useState<Repository[]>([]);

  const fetchAmmoData = () => {
    fetch("http://localhost:3000/api/v1/ammunition")
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
