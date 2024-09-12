import { useEffect, useState } from "react";

export interface Repository {
  id: BigInt
  manufacturer: string;
  brand: string;
  prchsdate: string;
  caliber: string;
  lot_number: string;
  qty: string
};

const useAmmunition = () => {
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

export { useAmmunition };