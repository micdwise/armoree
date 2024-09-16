import { useEffect, useState } from "react";

export interface Repository {
  id: BigInt
  manufacturer: string;
  model: string;
  prchsdate: string;
  caliber: string;
  serial_number: string
};

const useFirearms = () => {
  const [data, setData] = useState<Repository[]>([]);
  
  const fetchFirearmsData =  () => {
    fetch('http://localhost:3000/api/v1/firearms')
      .then(res => {
        return res.json();
      }) 
      .then(data => {
          console.log(data);
          setData(data);
      });
    };

  useEffect(() => {
    fetchFirearmsData()
  }, []);

  return { data };
};

const addFirearms = () => {
  
}
export { useFirearms };