import { useEffect, useState } from "react";

export interface Repository {
  id: BigInt;
  manufacturer: string;
  model: string;
  purchase_date: string;
  caliber: string;
  serial_number: string;
}

const handleSubmitFirearm = (event: any) => {
  event.preventDefault();
  const data = new FormData(event.target);
  const newFirearm = Object.fromEntries(data.entries());

  console.log(newFirearm);

  fetch("http://localhost:3000/api/v1/firearms", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(newFirearm),
  });
  console.log("Fired firearm POST");
};

const GetFirearms = () => {
  const [data, setData] = useState<Repository[]>([]);

  const fetchFirearmData = () => {
    fetch("http://localhost:3000/api/v1/firearms")
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        console.log(data);
        setData(data);
      });
  };

  useEffect(() => {
    fetchFirearmData();
  }, []);

  return { data };
};

export { GetFirearms, handleSubmitFirearm };
