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

const handleSubmitAmmo = (event: any) => {
  event.preventDefault();

  const data = new FormData(event.target);
  const newAmmunition = Object.fromEntries(data.entries());

  console.log(newAmmunition);

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

  console.log("Fired ammuntion postf");
};

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

export { GetAmmunition, handleSubmitAmmo };
