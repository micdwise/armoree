import { useEffect, useState } from "react";

export interface Repository {
  id: BigInt
  manufacturer: string;
  brand: string;
  purchase_date: string;
  caliber: string;
  lot_number: string;
  qty: string
};

const getAmmunition = () => {
  const [data, setData] = useState<Repository[]>([]);
  
  const fetchAmmoData =  () => {
    fetch('http://localhost:3001/api/v1/ammunition')
      .then(res => {
        return res.json();
      }) 
      .then(data => {
          console.log(data);
          setData(data);
      });
    };

  useEffect(() => {
    fetchAmmoData()
  }, []);

  return { data };
};

const addAmmunition = (newAmmunition: any) => {
  fetch('http://localhost:3001/api/v1/ammunition'), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(newAmmunition)
  }
}
export { getAmmunition, addAmmunition };